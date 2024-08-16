import "../types/context.js";
import {requestChatCompletions} from "./request.js";
import {ENV} from "../config/env.js";
import { handleOpenaiFunctionCall, renderAfterCallPayload } from "../agent/toolHander.js";
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

export function isLLMEnable(agent) {
  return (context) => {
    switch (agent) {
      // case 'openai':
      //   return isOpenAIEnable(context);
      case 'silicon':
      case 'deepseek':
        return !!context.USER_CONFIG.PROVIDERS[agent];
      default:
        return false;
    }
  };
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
        // if (item.content) {
        //     res.content.push({type: 'text', text: item.content});
      // }
        res.content.push({type: 'text', text: item.content || '请解读这张图'});
        for (const image of item.images) {
          switch (ENV.TELEGRAM_IMAGE_TRANSFER_MODE) {
            case 'base64':
              res.content.push({
                type: 'image_url',
                image_url: { url: renderBase64DataURI(await imageToBase64String(image)) },
              });
              break;
            case 'url':
            default:
              res.content.push({ type: 'image_url', image_url: { url: image } });
              break;
          }
        }
    }
    return res;
}

const openaiLikeSupportType = {
  // openai
  openai: ['text2text', 'text2image', 'image2text', 'audio2text'],
  deepseek: ['text2text'],
  silicon: ['text2text', 'text2image', 'image2image'],
};

/**
 * 
 * @param {UserConfigType} userConfig
 * @param {string[]} images
 * @return {object}
 */
export function openaiLikeAgent(context, type) {
  const userConfig = context.USER_CONFIG;
  const agent = type === 'text2image' ? userConfig.AI_IMAGE_PROVIDER : userConfig.AI_PROVIDER;
  let config = {
    url: userConfig.OPENAI_API_BASE,
    key: openAIKeyFromContext(context),
  };
  let like_model = null;
  let like_url = userConfig.PROVIDERS[agent]?.base_url;
  switch (type) {
    case 'text2image':
      config.model = userConfig.OPENAI_IMAGE_MODEL;
      like_model = userConfig.OPENAILIKE_IMAGE_MODEL;
      break;
    case 'image2text':
      config.model = userConfig.OPENAI_VISION_MODEL;
      like_model = userConfig.OPENAILIKE_VISION_MODEL;
      break;
    case 'audio2text':
      config.model = userConfig.OPENAI_STT_MODEL;
      like_model = userConfig.OPENAILIKE_STT_MODEL;
      break;
    case 'text2text':
      config.model = userConfig.OPENAI_CHAT_MODEL;
      like_model = userConfig.OPENAILIKE_CHAT_MODEL;
      break;
    case 'image2image':
      like_model = userConfig.OPENAILIKE_I2I_MODEL;
      break;
  }

  if (!openaiLikeSupportType[agent]?.includes(type) || !isLLMEnable(agent)(context)) {
    if (openaiLikeSupportType.openai.includes(type)) {
      return renderOpenaiLikeUrl(agent, type, config);
    } else throw new Error(`default agent not support ${type}`);
  }
  if (!like_model) {
    throw new Error(`${agent} ${type} model is not exist`);
  }

  if (context._info?.provider?.url && context._info?.provider?.key) {
    config.url = context._info?.provider?.url;
    config.key = context._info?.provider?.key;
    return renderOpenaiLikeUrl(agent, type, config);
  }
  switch (agent) {
    case 'deepseek':
    case 'silicon':
      if (userConfig.PROVIDERS[agent]?.key && like_url) {
        config = { key: userConfig.PROVIDERS[agent].key, url: like_url, model: like_model };
      }
  }
  return renderOpenaiLikeUrl(agent, type, config);
}

function renderOpenaiLikeUrl(agent, type,  agentDetail) {
  switch (type) {
    case 'text2text':
    case 'image2text':
      agentDetail.url += '/chat/completions';
      break;
    case 'text2image':
      if (agent === 'silicon') {
        agentDetail.url += '/' + agentDetail.model + '/text-to-image';
      } else agentDetail.url += '/images/generations';
      break;
    case 'audio2text':
      agentDetail.url += '/audio/transcriptions';
      break;
    case 'image2image':
      if (agent === 'silicon') {
        agentDetail.url += agentDetail.model + '/image-to-image';
      }
      break;
  }
  return agentDetail;
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
  const { url, key, model } = openaiLikeAgent(context, images && images.length > 0 ? 'image2text' : 'text2text');
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  };
  const messages = [...(history || []), {role: 'user', content: message, images}];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;

  const body = {
    model,
    ...extra_params,
    messages: await Promise.all(messages.map(renderOpenAIMessage)),
    stream: onStream != null,
    ...(context.USER_CONFIG.ENABLE_SHOWTOKEN && { stream_options: { include_usage: true } }),
  };

  if (message && !images && context.USER_CONFIG.USE_TOOLS?.length > 0) {
    const result = await handleOpenaiFunctionCall({ url, header, body, prompt }, context, onStream);
    if (result.llm_content && context.USER_CONFIG.FUNCTION_REPLY_ASAP) {
      // 如果不需要重新生成结果
      return result.llm_content;
    }
    renderAfterCallPayload(context, body, result.func_results, prompt);
    if (result.func_results.length > 0) {
      const resp_obj = { q: body.messages.at(-1).content }; // 修正问题内容 // 没有调用函数时，不需要修正
      resp_obj.a = await requestChatCompletions(url, header, body, context, onStream);
      return resp_obj;
    }
  }

  return requestChatCompletions(url, header, body, context, onStream);
}

function renderPicResult(context, resp) {
  const render = {
    'openai': () => (
      {
        url: resp?.data?.[0]?.url,
        revised_prompt: resp?.data?.[0]?.revised_prompt || ''
      }),
    'silicon': () => ({ url: resp?.images?.[0]?.url })
  };
  return render[context.USER_CONFIG.AI_IMAGE_PROVIDER]();
}



/**
 * 请求Openai生成图片
 * @param {string} prompt
 * @param {ContextType} context
 * @returns {Promise<string>}
 */
export async function requestImageFromOpenAI(prompt, context) {
  const { url, key, model } = openaiLikeAgent(context, 'text2image');
  context._info.config('model', model);
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  };
  const body = {
    prompt: prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model: model,
  };
  if (['silicon'].includes(context.USER_CONFIG.AI_IMAGE_PROVIDER)) {
    delete body.model;
  } else if (body.model === 'dall-e-3') {
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
  return renderPicResult(context, resp);
}


/** 
 * 请求openai处理音频
 * @param {file} audio
 * @param {string} file_name
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const { url, key, model } = openaiLikeAgent(context, 'audio2text');
  context._info.config('model', model);
  const header = {
    // 'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${key}`,
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
    return { ok: false, message: resp.statusText };
  }
}
