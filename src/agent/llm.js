import {
    deleteMessageFromTelegramWithContext,
    sendMessageToTelegramWithContext,
} from '../telegram/telegram.js';
import {DATABASE, ENV, CONST} from '../config/env.js';
import { loadAudioLLM, loadChatLLM } from "./agents.js";
import { handleFile } from '../config/middle.js';
import { sendTelegraphWithContext } from '../telegram/telegraph.js';
import "../types/agent.js";

/**
 * @returns {(function(string): number)}
 */
function tokensCounter() {
    return (text) => {
        return text.length;
    };
}
/**
 * 加载历史TG消息
 * @param {string} key
 * @returns {Promise<HistoryItem[]>}
 */
async function loadHistory(key, MAX_HISTORY_LENGTH = ENV.MAX_HISTORY_LENGTH) {

    // 加载历史记录
    let history = [];
    try {
        history = JSON.parse((await DATABASE.get(key)) || '[]');
    } catch (e) {
        console.error(e);
    }
    if (!history || !Array.isArray(history)) {
        history = [];
    }

    const counter = tokensCounter();

    const trimHistory = (list, initLength, maxLength, maxToken) => {
        // 历史记录超出长度需要裁剪, 小于0不裁剪
        if (maxLength >= 0 && list.length > maxLength) {
            list = list.splice(list.length - maxLength);
        }
        // 处理token长度问题, 小于0不裁剪
        if (maxToken > 0) {
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
        }
        return list;
    };

    // 裁剪
    if (ENV.AUTO_TRIM_HISTORY && MAX_HISTORY_LENGTH > 0) {
        history = trimHistory(history, 0, MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    }

    return history;
}

/**
 * @typedef {object} LlmModifierResult
 * @property {HistoryItem[]} history
 * @property {string} message
 * @typedef {function(HistoryItem[], string): LlmModifierResult} LlmModifier
 */

/**
 * @typedef {function (string): Promise<any>} StreamResultHandler
 */

/**
 *
 * @param {LlmRequestParams} params
 * @param {ContextType} context
 * @param {ChatAgentRequest} llm
 * @param {LlmModifier} modifier
 * @param {StreamResultHandler} onStream
 * @returns {Promise<string>}
 */
async function requestCompletionsFromLLM(params, context, llm, modifier, onStream) {
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = [];
  if (!params?.images) {
    history = await loadHistory(historyKey, context._info.step.history || ENV.MAX_HISTORY_LENGTH);
  }
  const readTime = ((performance.now() - readStartTime) / 1000).toFixed(2);
  console.log(`readHistoryTime: ${readTime}s`);
  if (modifier) {
    const modifierData = modifier(history, params?.message);
    history = modifierData.history;
    params.message = modifierData.message;
  }
  const llmParams = {
    ...params,
    history: history,
    prompt: context._info.step.prompt,
  };
  let answer = await llm(llmParams, context, onStream);
  if (params.images) {
    params.message = '[A IMAGE] ' + params.message;
  }

  if (typeof answer === 'object') {
    params.message = answer.q;
    answer = answer.a;
  }

  if (!historyDisable && answer) {
    history.push({ role: 'user', content: params.message || '' });
    history.push({ role: 'assistant', content: answer });
    await DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
  }
  return answer;
}


/**
 * 与LLM聊天
 * @param {LlmRequestParams} params
 * @param {ContextType} context
 * @param {LlmModifier} modifier
 * @returns {Promise<Response>}
 */
export async function chatWithLLM(params, context, modifier) {
  try {
    const llm = loadChatLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }

    const parseMode = context.CURRENT_CHAT_CONTEXT.parse_mode;
    let onStream = null;
    let nextEnableTime = null;
    const sendMessage = sendTextMessageHandler(context);
    if (ENV.STREAM_MODE) {
      // let nextUpdateTime = Date.now();
      onStream = async (text) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !context._info.isLastStep) return;
        try {
          // 判断是否需要等待
          if (nextEnableTime && nextEnableTime > Date.now()) {
            return;
          }

          if (ENV.TELEGRAM_MIN_STREAM_INTERVAL > 0) {
            nextEnableTime = Date.now() + ENV.TELEGRAM_MIN_STREAM_INTERVAL;
          }

          // if (ENV.TELEGRAM_MIN_STREAM_INTERVAL > 0) {
          //   if (nextUpdateTime > Date.now()) return;
          //   nextUpdateTime = Date.now() + ENV.TELEGRAM_MIN_STREAM_INTERVAL;
          // }

          let send_content = text;
          if (context._info.is_concurrent) {
            context._info.steps[params.index ?? 0].concurrent_content = text;
            send_content = context._info.concurrent_content;
          }

          const resp = await sendMessage(send_content);
          
          // 判断429
          if (resp.status === 429) {
            // 获取重试时间
            const retryAfter = parseInt(resp.headers.get('Retry-After'));
            if (retryAfter) {
              nextEnableTime = Date.now() + retryAfter * 1000;
              return;
            }
          }
          nextEnableTime = null;
        } catch (e) {
          console.error(e);
        }
      };
    }

    if (context._info.is_concurrent && !context._info.concurrent_stream) {
      context._info.concurrent_stream = onStream;
    }

    const onStreamSelect = context._info.concurrent_stream || onStream;

    console.log(`[START] Chat via ${llm.name}`);
    const answer = await requestCompletionsFromLLM(params, context, llm, modifier, onStreamSelect);
    if (!answer) {
      return sendMessageToTelegramWithContext(context)('None response', 'tip');
    }

    context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
    if (ENV.SHOW_REPLY_BUTTON && context.CURRENT_CHAT_CONTEXT.message_id) {
      try {
        await deleteMessageFromTelegramWithContext(context)(context.CURRENT_CHAT_CONTEXT.message_id);
        context.CURRENT_CHAT_CONTEXT.message_id = null;
        context.CURRENT_CHAT_CONTEXT.reply_markup = {
          keyboard: [[{ text: '/new' }, { text: '/redo' }]],
          selective: true,
          resize_keyboard: true,
          one_time_keyboard: true,
        };
      } catch (e) {
        console.error(e);
      }
    }
    if (nextEnableTime && nextEnableTime > Date.now()) {
      console.log(`The last message need wait:${((nextEnableTime - Date.now()) / 1000).toFixed(1)}s`);
      await new Promise((resolve) => setTimeout(resolve, nextEnableTime - Date.now()));
    }

    console.log(`[DONE] Chat via ${llm.name}`);
    return { type: 'text', text: answer };
  } catch (e) {
    let errMsg = `Error: ${e.message}`;
    console.error(errMsg);
    if (errMsg.length > 2048) {
      // 裁剪错误信息 最长2048
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(errMsg, 'tip');
  }
}


/**
 * @description: 发送消息的方式
 * @param {*} context
 * @return {*}
 */
export function sendTextMessageHandler(context){
    const question = context._info.step?.file.text || 'Redo';
    const prefix = `#Question\n\`\`\`\n${question?.length > 400 ? question.slice(0, 200) + '...' + question.slice(-200) : question}\n\`\`\`\n---`;
    const author = {
      short_name: context.SHARE_CONTEXT.currentBotName,
      author_name: context.SHARE_CONTEXT.currentBotName,
      author_url: ENV.TELEGRAPH_AUTHOR_URL,
    };
    return async (text) => {
      if (
        ENV.TELEGRAPH_NUM_LIMIT > 0 &&
        text.length > ENV.TELEGRAPH_NUM_LIMIT &&
        CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)
      ) {
        const telegraph_prefix = prefix + `\n#Answer\n🤖 _${context._info.step.model}_\n`;
        const debug_info = `debug info:${ENV.CALL_INFO ? '' : '\n' + context._info.step.call_info.replace('$$f_t$$', '') + '\n'}`;
        const telegraph_suffix = `\n---\n\`\`\`\n${debug_info}\n${context._info.step.message_title}\n\`\`\``;
        if (!context.SHARE_CONTEXT.telegraphPath) {
          const resp = await sendTelegraphWithContext(context)(
            null,
            telegraph_prefix + text + telegraph_suffix,
            author,
          );
          const url = `https://telegra.ph/${context.SHARE_CONTEXT.telegraphPath}`;
          const msg = `回答已经转换成完整文章~\n[🔗点击进行查看](${url})`;
          const show_info_tag = context.USER_CONFIG.ENABLE_SHOWINFO;
          context._info.step.config('show_info', false);
          await sendMessageToTelegramWithContext(context)(msg);
          context._info.step.config('show_info', show_info_tag);
          return resp;
        }
        return sendTelegraphWithContext(context)(null, telegraph_prefix + text + telegraph_suffix, author);
      } else return sendMessageToTelegramWithContext(context)(text);
    };
};



export async function chatViaFileWithLLM(context, params) {
  try {
    const { raw, file_name } = await handleFile(params.files);
    const llm = loadAudioLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    const startTime = performance.now();
    context._info.step.updateStartTime();
    const answer = await llm(raw, file_name, context);
    if (!answer.ok) {
      console.error(answer.message);
      return sendMessageToTelegramWithContext(context)('Chat via file failed.', 'tip');
    }
    console.log(`[FILE DONE] ${llm.name}: ${((performance.now() - startTime) / 1000).toFixed(1)}s`);

    const file_result = { type: answer.type };
    if (answer.type === 'text') {
      file_result.text = answer.content;
    } else if (typeof answer.content === 'string') {
      file_result.url = [answer.content];
    } else file_result.raw = [answer.content];

    return file_result;
  } catch (e) {
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(e.substring(2048), 'tip');
  }
}

