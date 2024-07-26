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
    const url = `${ENV._MIDDLEINFO.process_info.PROXY_URL}/chat/completions`;
  const messages = [{ role: 'user', content: message }];
  const firstStepWithFile = ENV._MIDDLEINFO.current_step_index == 1 && (ENV._MIDDLEINFO.file_raw || ENV._MIDDLEINFO.file_uri);
  const otherStepWithFile = ENV._MIDDLEINFO.current_step_index !== 1 && (ENV._MIDDLEINFO.prestep_file_raw || ENV._MIDDLEINFO.prestep_file_uri);
  // 优先取原始文件兼容claude

  if (firstStepWithFile || otherStepWithFile) {
        messages[0].content = [{
          "type": "text",
          "text": message || 'what is this?'  // cluade-3-haiku model 图像识别必须带文本
        }, {
          "type": "image_url", "image_url": {
            "url": firstStepWithFile || otherStepWithFile
          }
        }];
    }
    messages.unshift(...(history || []));

    if (prompt) {
        messages.unshift({role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt})
    }
    const body = {
        model: ENV._MIDDLEINFO.process_info.MODEL,
        ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
        messages,
        stream: onStream != null,
        ...(!!onStream && ENV.ENABLE_SHOWTOKENINFO &&{ stream_options: { include_usage: true } }),
    };

    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKeyFromContext(context)}`,
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
  // 以命令触发时，无process_info全量信息
    const url = `${ENV._MIDDLEINFO.process_info.PROXY_URL || context.USER_CONFIG.OPENAI_API_BASE}/images/generations`;
    const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKeyFromContext(context)}`,
    };
    const body = {
        prompt: prompt,
        n: 1,
        size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
        model: context.USER_CONFIG.DALL_E_MODEL,
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
  const url = `${context.USER_CONFIG.OPENAI_API_BASE}/audio/transcriptions`;
  const header = {
    // 'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${openAIKeyFromContext(context)}`,
    'Accept': 'application/json',
  };
  const formData = new FormData();
  formData.append('file', audio, file_name);
  formData.append('model', ENV._MIDDLEINFO.process_info.MODEL);
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
  
/**
 * 更新当前机器人的用量统计
 * @param {object} usage
 * @param {Context} context
 * @return {Promise<void>}
 */
async function updateBotUsage(usage, context) {
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    return;
  }

  let dbValue;
  try {
    dbValue = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.usageKey) || '{}');
  } catch {
    dbValue = '';
  }

  if (!dbValue) {
    dbValue = {
      tokens: {
        total: 0,
        chats: {},
      },
    };
  }

  dbValue.tokens.total += usage?.total_tokens ?? 0;
  if (!dbValue.tokens.chats[context.SHARE_CONTEXT.chatId]) {
    dbValue.tokens.chats[context.SHARE_CONTEXT.chatId] = usage?.total_tokens ?? 0;
  } else {
    dbValue.tokens.chats[context.SHARE_CONTEXT.chatId] += usage?.total_tokens ?? 0;
  }

  await DATABASE.put(context.SHARE_CONTEXT.usageKey, JSON.stringify(dbValue));
}