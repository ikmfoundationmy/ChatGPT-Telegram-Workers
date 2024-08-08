import "../types/context.js";
import {requestChatCompletions} from "./request.js";
import {ENV} from "../config/env.js";
import { handleOpenaiFunctionCall } from "../agent/toolHander.js";

/**
 * @param {ContextType} context
 * @return {string|null}
 */
function openAIKeyFromContext(context) {
  const length = context.USER_CONFIG.OPENAI_API_KEY.length;
    return context.USER_CONFIG.OPENAI_API_KEY[Math.floor(Math.random() * length)];
}


/**
 * @param {ContextType} context
 * @return {boolean}
 */
export function isOpenAIEnable(context) {
    return context.USER_CONFIG.OPENAI_API_KEY.length > 0;
}


/**
 * 发送消息到ChatGPT
 *
 * @param {string} message
 * @param {string} prompt
 * @param {Array} history
 * @param {ContextType} context
 * @param {function} onStream
 * @return {Promise<string>}
 */
export async function requestCompletionsFromOpenAI(message, prompt, history, context, onStream) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } =
    context._info?.provider || {};
  const url = `${PROXY_URL}/chat/completions`;
  const model = (context._info?.lastStepHasFile)
    ? context.USER_CONFIG.OPENAI_VISION_MODEL
    : context.USER_CONFIG.OPENAI_CHAT_MODEL;
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;
  const messages = [...(history || []), { role: 'user', content: message }];
 
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  // 优先取原始文件兼容claude

  if (context._info?.lastStepHasFile) {
    messages.at(-1).content = [
      {
        'type': 'text',
        'text': message || '解读一下这张图片', // cluade model 图像识别必须带文本
      },
      {
        'type': 'image_url',
        'image_url': {
          'url': context._info.lastStep.raw || context._info.lastStep.url,
        },
      },
    ];
  }

  const body = {
    model,
    ...extra_params,
    messages,
    stream: onStream != null,
    ...(!!onStream && ENV.ENABLE_SHOWTOKENINFO && { stream_options: { include_usage: true } }),
  };

  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };
  const options = {};

  if (message && !context._info?.lastStepHasFile && ENV.TOOLS && context.USER_CONFIG.USE_TOOLS?.length > 0) {
    const result = await handleOpenaiFunctionCall(url, header, body, context);
    if (result.type === 'stop') {
      return result.message;
    } else if (result.type === 'error') {
      throw new Error(result.message);
    }
    const resp_obj = { q: body.messages.at(-1).content }; // 修正问题内容
    resp_obj.a = await requestChatCompletions(url, header, body, context, onStream, null, options);
    return resp_obj;
    
  }

  return requestChatCompletions(url, header, body, context, onStream, null, options);
}






/**
 * 请求Openai生成图片
 *
 * @param {string} prompt
 * @param {ContextType} context
 * @return {Promise<string>}
 */
export async function requestImageFromOpenAI(prompt, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = context._info.provider || {};
  const model = context.USER_CONFIG.OPENAI_IMAGE_MODEL;
  const url = `${PROXY_URL}/images/generations`;
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };
  const body = {
    prompt: prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model: model,
  };
  if (body.model === 'dall-e-3') {
    body.quality = context.USER_CONFIG.DALL_E_IMAGE_QUALITY;
    body.style = context.USER_CONFIG.DALL_E_IMAGE_STYLE;
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body),
  }).then((res) => res.json());

  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return {
    url: resp?.data?.[0]?.url,
    revised_prompt: resp?.data?.[0]?.revised_prompt || ''
  };

}



/** 
 * 请求openai处理音频
 * @param {file} audio
 * @param {string} file_name
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = context._info.provider || {};
  const model = context.USER_CONFIG.OPENAI_STT_MODEL;
  const url = `${PROXY_URL}/audio/transcriptions`;
  const header = {
    // 'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json',
  };
  const formData = new FormData();
  formData.append('file', audio, file_name);
  formData.append('model', model);
  if (context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS) {
    Object.entries(context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  formData.append('response_format', 'json');

  let resp = await fetch(url, {
    method: 'POST',
    headers: header,
    body: formData,
    redirect: 'follow',
  }).catch(e => {
    console.error(e.message);
    return { ok: false, message: e.message };
  });
  if (resp.ok) {
    resp = await resp.json();
    console.log(`Transcription: ${resp.text}`);
    return { ok: !resp.error, type: 'text', content: resp.text, message: resp.error };
  } else {
    return { ok: false, message: await resp.text() };
  }
}
