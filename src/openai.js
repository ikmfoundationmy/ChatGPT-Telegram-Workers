/* eslint-disable no-unused-vars */
import {Context} from './context.js';
import {DATABASE, ENV} from './env.js';
import {fetchWithRetry, isEventStreamResponse, isJsonResponse, UUIDv4} from './utils.js';
import {Stream} from './vendors/stream.js';


/**
 * @param {Context} context
 * @return {string|null}
 */
function openAIKeyFromContext(context) {
  const API_KEY = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.['API_KEY'] || context.USER_CONFIG.OPENAI_API_KEY;

  if (API_KEY) {
    return API_KEY;
  }
  if (ENV.API_KEY.length === 0) {
    return null;
  }
  return ENV.API_KEY[Math.floor(Math.random() * ENV.API_KEY.length)];
}

/**
 * @param {Context} context
 * @return {string|null}
 */
function azureKeyFromContext(context) {
  return context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['API_KEY'] || ENV.AZURE_API_KEY;
}


/**
 * @param {Context} context
 * @return {boolean}
 */
export function isOpenAIEnable(context) {
  return context.USER_CONFIG.OPENAI_API_KEY || ENV.API_KEY.length > 0;
}

/**
 * @param {Context} context
 * @return {boolean}
 */
export function isAzureEnable(context) {
  // const api = context.USER_CONFIG.AZURE_API_BASE || ENV.AZURE_API_BASE;
  const key = context.USER_CONFIG.AZURE_API_KEY || ENV.AZURE_API_KEY;
  return key !== null;
}


/**
 * 发送消息到ChatGPT
 *
 * @param {string} message
 * @param {Array} history
 * @param {Context} context
 * @param {function} onStream
 * @return {Promise<string>}
 */
export async function requestCompletionsFromOpenAI(message, history, context, onStream) {
  const url = `${context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['PROXY_URL']}/chat/completions`;
  let model = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['MODEL'];
  let messages = [{ role: 'user', content: message }];
  if (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL) {
    model = context.USER_CONFIG.OPENAI_VISION_MODEL;
    messages[0].content = [{
      "type": "text",
      "text": message || 'what is this?'  // cluade-3-haiku model 图像识别必须带文本
    }, {
      "type": "image_url", "image_url": {
        "url": ENV.LOAD_IMAGE_FILE? `${context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE}`: context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL
      }
    }];
  } else {
    messages.unshift(...(history || []));
  }
  const body = {
    model: model,
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: messages,
    stream: onStream != null,
    ...(!!onStream && { stream_options: { include_usage: true } }),
  }

  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAIKeyFromContext(context)}`,
  };

  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream, (result) => {
    setTimeout(() => updateBotUsage(result?.usage, context).catch(console.error), 0);
  });
}

/**
 * @description: 
 * @param {*} message
 * @param {*} reverseContext
 * @param {*} context
 * @param {*} onStream
 * @return {*}
 */
export async function requestCompletionsFromReverseOpenAI(message, reverseContext, context, onStream) {
  const url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversation`;
  let model = context.USER_CONFIG.CHAT_MODEL;
  let content = { parts: [`${message}`], content_type: 'text' };
  const body = {
    conversation_mode: { kind: 'primary_assistant' },
    force_paragen: false,
    messages: [{ metadata: {}, id: reverseContext.id, author: { role: 'user' }, content }],
    timezone_offset_min: '-480',
    ...(reverseContext.conversation_id !==':new:' && { conversation_id: reverseContext.conversation_id }),
    parent_message_id: reverseContext.parent_message_id,
    action: 'next',
    force_rate_limit: false,
    suggestions: [],
    history_and_training_disabled: false,
    model,
    arkose_token: null,
  };

  const header = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1',
    'Authorization': `Bearer ${context.USER_CONFIG.REVERSE_TOKEN}`,
  };

  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream);
}

/**
 * 
 * @param {Context} context
 * @param {enum} type
 * @param {number} num
 * @return {object} listOrHistory
 */
export async function requestReverseChatListOrHistory(context, type = 'list', num = 30) {
  let url = '';
  if (!context.USER_CONFIG.REVERSE_PERFIX || !context.USER_CONFIG.REVERSE_TOKEN) {
    throw new Error('REVERSE 关键变量未设置');
  }
  if (type === 'list') {
    url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversations?offset=0&limit=${num}&order=updated`;
  } else url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversation/${context.REVERSE_CONTEXT.conversation_id}`;

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1',
    Authorization: `Bearer ${context.USER_CONFIG.REVERSE_TOKEN}`,
    'Accept-Language': 'en-US',
  };
  
  const result = await fetchWithRetry(url, { headers });
  if (result.status !== 200) {
    throw new Error(await result.text());
  }
  return result.json();
}

/**
 * 发送消息到Azure ChatGPT
 *
 * @param {string} message
 * @param {Array} history
 * @param {Context} context
 * @param {function} onStream
 * @return {Promise<string>}
 */
export async function requestCompletionsFromAzureOpenAI(message, history, context, onStream) {
  const url = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['PROXY_URL'];

  const body = {
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...(history || []), {role: 'user', content: message}],
    stream: onStream != null,
    ...(!!onStream && { stream_options: { include_usage: true } }),
  };

  const header = {
    'Content-Type': 'application/json',
    'api-key': azureKeyFromContext(context),
  };

  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream);
}


/**
* 发送请求到兼容OpenAI的API
*
* @param {string | null} url
* @param {object} header
* @param {object} body
* @param {Context} context
* @param {function} onStream
* @param {function} onResult
* @return {Promise<string>}
*/
export async function requestCompletionsFromOpenAICompatible(url, header, body, context, onStream, onResult = null) {
  const controller = new AbortController();
  const { signal } = controller;
  const timeout = 1000 * 60 * 5;
  setTimeout(() => controller.abort(), timeout);

  // 超指定时间无响应中断请求
  let firstTimeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    firstTimeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`No response in ${ENV.OPENAI_CHAT_TIMEOUT}s`));
    }, ENV.OPENAI_CHAT_TIMEOUT * 1000);
  });
  
  let startTime = performance.now();
  console.log('[START] Chat via OpenAILike');
  const resp = await Promise.race([timeoutPromise, fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body),
    signal,
  })]);

  clearTimeout(firstTimeoutId); 
  
  const immediatePromise = Promise.resolve('immediate'); 

  if (onStream && resp.ok && isEventStreamResponse(resp) && !ENV.REVERSE_MODE) {
    const stream = new Stream(resp, controller);
    let contentFull = '';
    let lengthDelta = 0;
    let updateStep = 20;
    let msgPromise = null;
    let lastChunk = null;
    let usage = null;
    try {
      for await (const data of stream) {
        const c = data?.choices?.[0]?.delta?.content || '';
        usage = data?.usage;
        lengthDelta += c.length;
        if (lastChunk) contentFull = contentFull + lastChunk;
        if (lastChunk && lengthDelta > updateStep) {
          lengthDelta = 0;
          updateStep += 10;
          if (!msgPromise || (await Promise.race([msgPromise, immediatePromise])) !== 'immediate') {
            msgPromise = onStream(`${contentFull}𒊹`);
          }
        }
        lastChunk = c;
      }
    } catch (e) {
      contentFull += `\nERROR: ${e.message}`;
      console.log(`errorEnd`);
    }
    contentFull += lastChunk;
    if (ENV.GPT3_TOKENS_COUNT && usage && !ENV.REVERSE_MODE) {
      onResult?.({ usage });
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.promptToken = usage?.prompt_tokens ?? 0;
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.completionToken = usage?.completion_tokens ?? 0;
    }

    let endTime = performance.now();
    console.log(`[DONE] Chat via OpenAILike: ${((endTime - startTime) / 1000).toFixed(2)}s`);
    await msgPromise;
    console.log(`MiddleMsgTime: ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    return contentFull;
  } else if (ENV.REVERSE_MODE) {

    const stream = new Stream(resp, controller);
    let updateStep = 10;
    let delta = 20;
    // const deltaMax = 1000;
    let content = '';
    let lastChunk = null;
    let msgPromise = null;
    let conversation_id = '';
    let id = '';
    let model = '';
    let title = '';
    try {
      for await (const data of stream) {
        content = data?.message?.content?.parts?.[0] || content;
        if (!conversation_id) conversation_id = data?.conversation_id;
        if (!id) id = data?.message?.id;
        if (!model) model = data?.model || data?.message?.metadata?.model_slug;
        if (!title) title = data?.title;
        if (lastChunk && content.length > updateStep) {
          updateStep += delta;
          delta += 25;
          // delta = delta >= deltaMax ? deltaMax : delta + 25;
          if (!msgPromise || (await Promise.race([msgPromise, immediatePromise])) !== 'immediate') {
            msgPromise = onStream(`${lastChunk}\n\n${ENV.I18N.message.loading}...`);
          }
        }
        lastChunk = content;
      }
      context.REVERSE_CONTEXT.conversation_id = conversation_id;
      context.REVERSE_CONTEXT.parent_message_id = id;
      if(title) context.REVERSE_CONTEXT.title = title;
    } catch (e) {
      console.error(e.message)
      content = `Error: ${e.message}`;
    }
    let endTime = performance.now();
    const LLMTime = `${((endTime - startTime) / 1000).toFixed(2)}s`;
    if (ENV.ENABLE_SHOWINFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = `${model || context.USER_CONFIG.CHAT_MODEL} ${LLMTime} `;
    }
    console.log(`[DONE] Chat via OpenAILike: ${LLMTime}`);
    await msgPromise;
    console.log(`MiddleMsgTime: ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
    return lastChunk;
  }

  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }

  const result = await resp.json();

  if (!result) {
    throw new Error('Empty response');
  }

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  try {
    onResult?.(result);
    return result.choices[0].message.content;
  } catch (e) {
    throw Error(result?.error?.message || JSON.stringify(result));
  }
}


/**
 * 请求Openai生成图片
 * @param {string} prompt
 * @param {Context} context
 * @return {Promise<string>}
 */
export async function requestImageFromOpenAI(prompt, context) {
  let url = `${(context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.['PROXY_URL']) || context.USER_CONFIG.OPENAI_API_BASE}/images/generations`;
  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openAIKeyFromContext(context)}`,
  };
  const body = {
    prompt: prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model: context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.['MODEL'] || context.USER_CONFIG.DALL_E_MODEL,
  };
  if (body.model === 'dall-e-3') {
    body.quality = context.USER_CONFIG.DALL_E_IMAGE_QUALITY;
    body.style = context.USER_CONFIG.DALL_E_IMAGE_STYLE;
  }
  {
    const provider = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.['PROVIDER'] || context.USER_CONFIG.AI_IMAGE_PROVIDER;
    let isAzureModel = false;
    switch (provider) {
      case 'azure':
        isAzureModel = true;
        break;
      case 'openai':
        isAzureModel = false;
        break;
      case 'auto':
        isAzureModel = isAzureEnable(context) && context.USER_CONFIG.AZURE_DALLE_API !== null;
        break;
      default:
        break;
    }
    if (isAzureModel) {
      url = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['PROXY_URL'] || context.USER_CONFIG.AZURE_DALLE_API;
      const validSize = ['1792x1024', '1024x1024', '1024x1792'];
      if (!validSize.includes(body.size)) {
        body.size = '1024x1024';
      }
      header['api-key'] = azureKeyFromContext(context);
      delete header['Authorization'];
      delete body.model;
    }
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body),
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return resp.data[0].url;
}

/** 
 * 请求openai转录语音
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
    'Accept': 'application/json'
  };
  const formData = new FormData();
  formData.append('file', audio, file_name);
  formData.append('model', context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['MODEL']);
  if (context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS) {
    Object.entries(context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  formData.append('response_format', 'json');

  return await fetch(url, {
    method: 'POST',
    headers: header,
    body: formData,
    redirect: 'follow'
  }).catch(error => {
    console.log(error.message)
    return new Response(JSON.stringify({error:error.message}), { status: 503 })
  });
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
    dbValue = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.usageKey));
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
