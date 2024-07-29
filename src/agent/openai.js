import "../types/context.js"
import {requestChatCompletions} from "./request.js";
import {ENV} from "../config/env.js";


/**
 * @param {ContextType} context
 * @return {string|null}
 */
function openAIKeyFromContext(context) {
    const length = context.USER_CONFIG.OPENAI_API_KEY.length
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
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = ENV.INFO.provider || {};
  const url = `${PROXY_URL}/chat/completions`;
  const model = ENV.INFO.config('model', context.USER_CONFIG.OPENAI_CHAT_MODEL);
  const extra_params = ENV.INFO.config('extra_params', context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS);
  const messages = [{ role: 'user', content: message }];
  // 优先取原始文件兼容claude
  if (ENV.INFO.lastStepHasFile) {
        messages[0].content = [{
          "type": "text",
          "text": message || '解读一下这长图片?'  // cluade model 图像识别必须带文本
        }, {
          "type": "image_url", "image_url": {
            "url": ENV.INFO.lastStep.raw || ENV.INFO.lastStep.url
          }
        }];
    }
    messages.unshift(...(history || []));

    if (prompt) {
        messages.unshift({role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt})
    }
    const body = {
        model,
        ...extra_params,
        messages,
        stream: onStream != null,
        ...(!!onStream && ENV.ENABLE_SHOWTOKENINFO &&{ stream_options: { include_usage: true } }),
    };

    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    };

    return requestChatCompletions(url, header, body, context, onStream);
}



/**
 * 请求Openai生成图片
 *
 * @param {string} prompt
 * @param {ContextType} context
 * @return {Promise<string>}
 */
export async function requestImageFromOpenAI(prompt, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = ENV.INFO.provider || {};
  const model = ENV.INFO.config('model', context.USER_CONFIG.DALL_E_MODEL);
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
  return resp?.data?.[0]?.url;
}



/** 
 * 请求openai处理音频
 * @param {file} audio
 * @param {string} file_name
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = ENV.INFO.provider || {};
  const model = ENV.INFO.config('model', context.USER_CONFIG.OPENAI_STT_MODEL);
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
  })
  if (resp.ok) {
    resp = await resp.json();
    console.log(`Transcription: ${resp.text}`);
    return { ok: !resp.error, type: 'text', content: resp.text, message: resp.error };
  } else {
    return { ok: false, message: await resp.text() };
  }
}
