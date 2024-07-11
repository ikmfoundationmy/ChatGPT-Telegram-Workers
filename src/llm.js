import {
  deleteMessageFromTelegramWithContext,
  sendChatActionToTelegramWithContext,
  sendMessageToTelegramWithContext,
  sendLoadingMessageToTelegramWithContext,
} from './telegram.js';
import {DATABASE, ENV} from './env.js';
// eslint-disable-next-line no-unused-vars
import {Context} from './context.js';
import {
  isAzureEnable,
  isOpenAIEnable,
  requestCompletionsFromAzureOpenAI,
  requestCompletionsFromOpenAI,
  requestImageFromOpenAI,
  requestCompletionsFromReverseOpenAI,
  requestReverseChatListOrHistory
} from './openai.js';
import {tokensCounter, delay, UUIDv4} from './utils.js';
import {isWorkersAIEnable, requestCompletionsFromWorkersAI, requestImageFromWorkersAI} from './workersai.js';
import {isGeminiAIEnable, requestCompletionsFromGeminiAI} from './gemini.js';
import {isMistralAIEnable, requestCompletionsFromMistralAI} from './mistralai.js';


/**
 * 加载历史TG消息
 *
 * @param {string} key
 * @param {Context} context
 * @return {Promise<Object>}
 */
async function loadHistory(key, context) {
  const initMessage = {role: 'system', content: context.USER_CONFIG.SYSTEM_INIT_MESSAGE};
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;

  // 判断是否禁用历史记录
  if (historyDisable) {
    initMessage.role = ENV.SYSTEM_INIT_MESSAGE_ROLE;
    return {real: [initMessage], original: [initMessage]};
  }

  // 加载历史记录
  let history = [];
  try {
    history = JSON.parse((await DATABASE.get(key)) || '{}');
  } catch (e) {
    console.error(e);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }


  let original = JSON.parse(JSON.stringify(history));

  // 按身份过滤
  if (context.SHARE_CONTEXT.role) {
    history = history.filter((chat) => context.SHARE_CONTEXT.role === chat.cosplay);
  }

  history.forEach((item) => {
    delete item.cosplay;
  });

  const counter = await tokensCounter();

  const trimHistory = (list, initLength, maxLength, maxToken) => {
    // 历史记录超出长度需要裁剪
    if (list.length > maxLength) {
      list = list.splice(list.length - maxLength);
    }
    // 处理token长度问题
    let tokenLength = initLength;
    for (let i = list.length - 1; i >= 0; i--) {
      const historyItem = list[i];
      let length = 0;
      if (historyItem.content) {
        length = counter(historyItem.content);
      } else {
        historyItem.content = '';
      }
      // 如果最大长度超过maxToken,裁剪history
      tokenLength += length;
      if (tokenLength > maxToken) {
        list = list.splice(i + 1);
        break;
      }
    }
    return list;
  };

  // 裁剪
  if (ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH > 0) {
    const initLength = counter(initMessage.content);
    const roleCount = Math.max(Object.keys(context.USER_DEFINE.ROLE).length, 1);
    history = trimHistory(history, initLength, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    original = trimHistory(original, initLength, ENV.MAX_HISTORY_LENGTH * roleCount, ENV.MAX_TOKEN_LENGTH * roleCount);
  }

  // 插入init
  switch (history.length > 0 ? history[0].role : '') {
    case 'assistant': // 第一条为机器人，替换成init
    case 'system': // 第一条为system，用新的init替换
      history[0] = initMessage;
      break;
    default:// 默认给第一条插入init
      history.unshift(initMessage);
  }

  // 如果第一条是system,替换role为SYSTEM_INIT_MESSAGE_ROLE
  if (ENV.SYSTEM_INIT_MESSAGE_ROLE !== 'system' && history.length > 0 && history[0].role === 'system') {
    history[0].role = ENV.SYSTEM_INIT_MESSAGE_ROLE;
  }

  return {real: history, original: original};
}


/**
 *
 * @param {Context} context
 * @return {function}
 */
export function loadChatLLM(context) {
  if (ENV.REVERSE_MODE) return requestCompletionsFromReverseOpenAI;
  switch (context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['AI_PROVIDER']) {
    case 'openai':
      return requestCompletionsFromOpenAI;
    case 'azure':
      return requestCompletionsFromAzureOpenAI;
    case 'workers':
      return requestCompletionsFromWorkersAI;
    case 'gemini':
      return requestCompletionsFromGeminiAI;
    case 'mistral':
      return requestCompletionsFromMistralAI;
    default:
      if (isAzureEnable(context)) {
        return requestCompletionsFromAzureOpenAI;
      }
      if (isOpenAIEnable(context)) {
        return requestCompletionsFromOpenAI;
      }
      if (isWorkersAIEnable(context)) {
        return requestCompletionsFromWorkersAI;
      }
      if (isGeminiAIEnable(context)) {
        return requestCompletionsFromGeminiAI;
      }
      if (isMistralAIEnable(context)) {
        return requestCompletionsFromMistralAI;
      }
      return null;
  }
}

/**
 *
 * @param {Context} context
 * @return {function}
 */
export function loadImageGen(context) {
  switch (context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.['PROVIDER'] || context.USER_CONFIG.AI_IMAGE_PROVIDER) {
    case 'openai':
      return requestImageFromOpenAI;
    case 'azure':
      return requestImageFromOpenAI;
    case 'workers':
      return requestImageFromWorkersAI;
    default:
      if (isOpenAIEnable(context) || isAzureEnable(context)) {
        return requestImageFromOpenAI;
      }
      if (isWorkersAIEnable(context)) {
        return requestImageFromWorkersAI;
      }
      return null;
  }
}

/**
 *
 * @param {string} text
 * @param {Context} context
 * @param {function} llm
 * @param {function} modifier
 * @param {function} onStream
 * @return {Promise<string>}
 */
async function requestCompletionsFromLLM(text, context, llm, modifier, onStream) {
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = { real: [], original: [] };
  if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT && !context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL ) {
    history = ENV.MAX_HISTORY_LENGTH > 0 ? (await loadHistory(historyKey, context)) : history;
    const readTime = ((performance.now() - readStartTime) / 1000).toFixed(2);
      console.log(`readHistoryTime: ${readTime}s`);
    if (modifier) {
      const modifierData = modifier(history, text);
      history = modifierData.history;
      text = modifierData.text;
    }
  }
  const { real: realHistory, original: originalHistory } = history;
  const answer = await llm(text, realHistory, context, onStream);
  if (!historyDisable) {
    originalHistory.push({role: 'user', content: text || '', cosplay: context.SHARE_CONTEXT.role || ''});
    originalHistory.push({role: 'assistant', content: answer, cosplay: context.SHARE_CONTEXT.role || ''});
    await DATABASE.put(historyKey, JSON.stringify(originalHistory)).catch(console.error);
  }
  return answer;
}

async function requestCompletionsFromReverseLLM(text, context, llm, modifier, onStream) {
  // const CHAT_ID = await DATABASE.get(context.SHARE_CONTEXT.reverseChatKey) || '';
  const CHAT_ID = context.REVERSE_CONTEXT.conversation_id;
  if (!CHAT_ID) {
    throw new Error('未设置消息ID 如需新建对话 请执行 `/new`命令');
  }
  const reverseContext = { ...context.REVERSE_CONTEXT, id: UUIDv4() };
  // context.REVERSE_CONTEXT = reverseContext;
  
  if (CHAT_ID === ':new:') {
    reverseContext.parent_message_id = UUIDv4();
  } else {
    // reverseContext.parent_message_id = history[CHAT_ID]?.parent_message_id;
    if (CHAT_ID && !reverseContext.parent_message_id) {
      try {
        const detail = await requestReverseChatListOrHistory(context, 'detail');
        reverseContext.parent_message_id = detail?.current_node;
      } catch (e) {
        throw new Error(e.message);
      }
      if (!reverseContext.parent_message_id) {
        console.error(JSON.stringify(detail));
        throw new Error(`Can't get parent message id.`);
      }
    }
  }

  let history = JSON.parse((await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey)) || '{}');
  const answer = await llm(text, reverseContext, context, onStream);
  const { conversation_id, parent_message_id, title } = context.REVERSE_CONTEXT;
  if (!history[conversation_id]) {
    history[conversation_id] = {}
  }

  history[conversation_id] = {
    parent_message_id,
    title: title || history[conversation_id].title || '',
    update_time: new Date(),
  };
  history = Object.fromEntries(
    Object.entries(history)
      .sort(([, a], [, b]) => new Date(b.update_time) - new Date(a.update_time))
      .slice(0, 25),
  );
  
  await DATABASE.put(
    context.SHARE_CONTEXT.reverseChatKey,
    JSON.stringify({
      conversation_id,
      parent_message_id,
    }),
  );
  await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(history));
  return answer;
}

/**
 * 与LLM聊天
 *
 * @param {string} text
 * @param {Context} context
 * @param {function} modifier
 * @return {Promise<Response>}
 */
export async function chatWithLLM(text, context, modifier) {
  text = (context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.TEXT || '') + text;
  const sendFinalMsg = async (msg) => {
    let finalResponse = await sendMessageToTelegramWithContext(context)(msg);
    if (finalResponse.status === 429) {
      let retryTime = 1000 * (finalResponse.headers.get('Retry-After') ?? 10); 
      console.log(`Wait ${retryTime / 1000}s for final msg`);
      await delay(retryTime);
      finalResponse = await sendMessageToTelegramWithContext(context)(msg);
    } 
    if (finalResponse.status !== 200) {
      console.log(`[FAILED] Final Msg: ${await finalResponse.text()}`);
    } else {
      console.log(`[DONE] Final Msg`);
    }
    return finalResponse;
  }
  try {
    if (!context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {}
    }

    if (context.CURRENT_CHAT_CONTEXT.reply_markup) {
      delete context.CURRENT_CHAT_CONTEXT.reply_markup;
    }

    await sendLoadingMessageToTelegramWithContext(context);
    if (ENV.ENABLE_SHOWINFO && !ENV.REVERSE_MODE) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO += context.CURRENT_CHAT_CONTEXT.PROCESS_INFO['MODEL'];
    }
    let originalInfo = context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO?.TEMP_INFO || '';
    const steps = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.STEP?.split('/') || [1, 1];
    const isLastStep = steps[0] == steps[1];
    setTimeout(() => sendChatActionToTelegramWithContext(context)('typing').catch(console.error), 0);
    let onStream = null;
    const generateInfo = async (text) => {
      let extraInfo = '';
      if (ENV.ENABLE_SHOWINFO) {
        const time = ((performance.now() - llmStart) / 1000).toFixed(2);
        extraInfo = ` ${time}s`;
      }
  
      if (ENV.ENABLE_SHOWTOKENINFO && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO.promptToken && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO.completionToken && !ENV.REVERSE_MODE) {
        extraInfo += ' \nToken: ' + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.promptToken + ' | ' + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.completionToken + ' ';
      }
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO =  originalInfo + extraInfo;
      return null;
    }
    if (ENV.STREAM_MODE) {
      onStream = async (text) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !isLastStep) {
          return;
        }
        try {
          await generateInfo();
          const resp = await sendMessageToTelegramWithContext(context)(text);

          if (!context.CURRENT_CHAT_CONTEXT.message_id && resp.ok) {
            context.CURRENT_CHAT_CONTEXT.message_id = (await resp.json()).result.message_id;
          }
          return resp;
        } catch (e) {
          console.error(e);
        }
      };
    }
    
    const llm = loadChatLLM(context);
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    console.log(`[START] Chat via ${llm.name}`);
    const llmStart = performance.now();
    const answer = await (
      ENV.REVERSE_MODE ? requestCompletionsFromReverseLLM : requestCompletionsFromLLM
    )(text, context, llm, modifier, onStream);
    console.log(`[DONE] Chat with LLM: ${((performance.now()- llmStart)/1000).toFixed(2)}s`);

    if (ENV.SHOW_REPLY_BUTTON && context.CURRENT_CHAT_CONTEXT.message_id) {
      try {
        await deleteMessageFromTelegramWithContext(context)(context.CURRENT_CHAT_CONTEXT.message_id);
        context.CURRENT_CHAT_CONTEXT.message_id = null;
        context.CURRENT_CHAT_CONTEXT.reply_markup={
          keyboard: [[{text: '/new'}, {text: '/redo'}]],
          selective: true,
          resize_keyboard: true,
          one_time_keyboard: true,
        };
      } catch (e) {
        console.error(e);
      }
    }
    // 缓存LLM回答结果给后续步骤使用
    if (!ENV.HIDE_MIDDLE_MESSAGE || isLastStep) {
      if (!ENV.REVERSE_MODE) await generateInfo(answer);
      // console.log(answer)
      await sendFinalMsg(answer);
    }
    context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT = answer;
    return null;
  } catch (e) {
    let errMsg = `Error: ${e.message}`;
    console.error(errMsg);
    if (errMsg.length > 2048) { // 裁剪错误信息 最长2048
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendFinalMsg(errMsg);
  }
}
