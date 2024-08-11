import "../types/context.js";
import {requestChatCompletions} from "./request.js";
import {ENV} from "../config/env.js";
import { handleOpenaiFunctionCall } from "../agent/toolHander.js";
import { renderBase64DataURI, imageToBase64String} from "../utils/image.js";

/**
 * @param {ContextType} context
 * @returns {string|null}
 */
function openAIKeyFromContext(context) {
  const length = context.USER_CONFIG.OPENAI_API_KEY.length;
    return context.USER_CONFIG.OPENAI_API_KEY[Math.floor(Math.random() * length)];
}


/**
 * @param {ContextType} context
 * @returns {boolean}
 */
export function isOpenAIEnable(context) {
    return context.USER_CONFIG.OPENAI_API_KEY.length > 0;
}


/**
 * @param {HistoryItem} item
 * @returns {Promise<object>}
 */
export async function renderOpenAIMessage(item) {
    const res = {
        role: item.role,
        content: item.content,
    };
    if (item.images && item.images.length > 0) {
        res.content = [];
        if (item.content) {
            res.content.push({type: 'text', text: item.content || '请解读这张图'});
        }
        for (const image of item.images) {
            switch (ENV.TELEGRAM_IMAGE_TRANSFER_MODE) {
                case 'base64':
                    res.content.push({type: 'image_url', url: renderBase64DataURI(await imageToBase64String(image))});
                    break;
                case 'url':
                default:
                    res.content.push({type: 'image_url', image_url: {url: image}});
                    break;
            }
        }
    }
    return res;
}


/**
 * 发送消息到ChatGPT
 * @param {LlmParams} params
 * @param {ContextType} context
 * @param {Function} onStream
 * @returns {Promise<string>}
 */
export async function requestCompletionsFromOpenAI(params, context, onStream) {
  const {message, images, prompt, history} = params;
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } =
    context._info?.provider || {};
  const url = `${PROXY_URL}/chat/completions`;
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };
  const messages = [...(history || []), {role: 'user', content: message, images}];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const model = (context._info?.lastStepHasFile)
    ? context.USER_CONFIG.OPENAI_VISION_MODEL
    : context.USER_CONFIG.OPENAI_CHAT_MODEL;
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;

  const body = {
    model,
    ...extra_params,
    messages: await Promise.all(messages.map(renderOpenAIMessage)),
    stream: onStream != null,
    ...(!!onStream && context.USER_CONFIG.ENABLE_SHOWTOKEN && { stream_options: { include_usage: true } }),
  };

  if (message && !context._info?.lastStepHasFile && ENV.TOOLS && context.USER_CONFIG.USE_TOOLS?.length > 0) {
    const result = await handleOpenaiFunctionCall(url, header, body, prompt, context, onStream);
    if (
      ['first_answer', 'next_answer'].indexOf(result.type) > -1 &&
      result.message &&
      context.USER_CONFIG.FUNCTION_REPLY_ASAP
    ) {
      // 如果不需要重新生成结果
      return result.message;
    }
    if (result.type === 'first_answer') {
      // 如果没有调用任何函数
      if (prompt) {
        body.messages[0].content = prompt; // 回复原来的prompt
      } else body.messages.shift(); //去掉多余的prompt
    } else {
      const resp_obj = { q: body.messages.at(-1).content }; // 修正问题内容 // 没有调用函数时，不需要修正
      resp_obj.a = await requestChatCompletions(url, header, body, context, onStream);
      return resp_obj;
    }
  }

  return requestChatCompletions(url, header, body, context, onStream);
}

/**
 * 请求Openai生成图片
 * @param {string} prompt
 * @param {ContextType} context
 * @returns {Promise<string>}
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
