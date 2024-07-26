import {
    deleteMessageFromTelegramWithContext,
    sendChatActionToTelegramWithContext,
    sendMessageToTelegramWithContext,
    sendPhotoToTelegramWithContext,
} from '../telegram/telegram.js';
import {DATABASE, ENV} from '../config/env.js';
import {loadAudioLLM, loadChatLLM} from "./agents.js";

/**
 * @return {(function(string): number)}
 */
function tokensCounter() {
    return (text) => {
        return text.length;
    };
}

/**
 * 加载历史TG消息
 *
 * @param {string} key
 * @return {Promise<Object>}
 */
async function loadHistory(context, key) {
    // 文件消息不关联历史记录
    const historyDisable = !!ENV._MIDDLEINFO.file_uri || ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
    // 判断是否禁用历史记录
    if (historyDisable) {
        return {real: [], original: []};
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

    const counter = tokensCounter();

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
        history = trimHistory(history, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
        original = trimHistory(original, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    }

    return {real: history, original: original};
}


/**
 *
 * @param {string} text
 * @param {string | null} prompt
 * @param {ContextType} context
 * @param {function} llm
 * @param {function} modifier
 * @param {function} onStream
 * @return {Promise<string>}
 */
async function requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream) {
    const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
    const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
    const readStartTime = performance.now();
    let history = await loadHistory(context, historyKey);

    const readTime = ((performance.now() - readStartTime) / 1000).toFixed(2);
    console.log(`readHistoryTime: ${readTime}s`);

    if (modifier) {
        const modifierData = modifier(history, text);
        history = modifierData.history;
        text = modifierData.text;
    }
    const {real: realHistory, original: originalHistory} = history;
    const answer = await llm(text, prompt, realHistory, context, onStream);
    if (ENV._MIDDLEINFO.file_uri) {
        text = '[A FILE] ' + text;
    }
    if (!historyDisable) {
        originalHistory.push({ role: 'user', content: text || '' });
        originalHistory.push({ role: 'assistant', content: answer });
        await DATABASE.put(historyKey, JSON.stringify(originalHistory)).catch(console.error);
    }
    return answer;
}




/**
 * 与LLM聊天
 *
 * @param {string|null} text
 * @param {ContextType} context
 * @param {function} modifier
 * @return {Promise<Response>}
 */
export async function chatWithLLM(text, context, modifier, pointerLLM = loadChatLLM) {
    try {
        text = ENV._MIDDLEINFO.prestep_text || text;
        const parseMode = context.CURRENT_CHAT_CONTEXT.parse_mode;
        try {
            if (!context.CURRENT_CHAT_CONTEXT.message_id) {
                context.CURRENT_CHAT_CONTEXT.parse_mode = null;
                const msg = await sendMessageToTelegramWithContext(context)('...').then((r) => r.json());
                context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
            }
            context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
            context.CURRENT_CHAT_CONTEXT.reply_markup = null;
        } catch (e) {
            console.error(e);
        }
        setTimeout(() => sendChatActionToTelegramWithContext(context)('typing').catch(console.error), 0);
        let onStream = null;
        let nextEnableTime = null;
        if (ENV.STREAM_MODE) {
            onStream = async (text) => {
                if (ENV.HIDE_MIDDLE_MESSAGE && !ENV._MIDDLEINFO.isLastStep()) return;
                try {
                    // 判断是否需要等待
                    if (nextEnableTime && nextEnableTime > Date.now()) {
                        return;
                    }
                    const resp = await sendMessageToTelegramWithContext(context)(text);
                    // 判断429
                    if (resp.status === 429) {
                        // 获取重试时间
                        const retryAfter = parseInt(resp.headers.get('Retry-After'));
                        if (retryAfter) {
                            nextEnableTime = Date.now() + retryAfter * 1000;
                            return
                        }
                    }
                    nextEnableTime = null;
                    // if (resp.ok) {
                        // context.CURRENT_CHAT_CONTEXT.message_id = (await resp.json()).result.message_id;
                    // }
                } catch (e) {
                    console.error(e);
                }
            };
        }
        
        const llm = pointerLLM(context)?.request;
        if (llm === null) {
            return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
        }
        const prompt = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
        console.log(`[START] Chat via ${llm.name}`);
        const answer = await requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream);
        if (!answer) {
            return sendMessageToTelegramWithContext(context)('None response');
        }
        context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
        if (ENV.SHOW_REPLY_BUTTON && context.CURRENT_CHAT_CONTEXT.message_id) {
            try {
                await deleteMessageFromTelegramWithContext(context)(context.CURRENT_CHAT_CONTEXT.message_id);
                context.CURRENT_CHAT_CONTEXT.message_id = null;
                context.CURRENT_CHAT_CONTEXT.reply_markup = {
                    keyboard: [[{text: '/new'}, {text: '/redo'}]],
                    selective: true,
                    resize_keyboard: true,
                    one_time_keyboard: true,
                };
            } catch (e) {
                console.error(e);
            }
        }
        if (nextEnableTime && nextEnableTime > Date.now()) {
            console.log(`The last message need wait:${((nextEnableTime - Date.now())/1000).toFixed(1)}s`);
            await new Promise((resolve) => setTimeout(resolve, nextEnableTime - Date.now()));
        }
        // 缓存LLM回答结果给后续步骤使用
        if (!ENV.HIDE_MIDDLE_MESSAGE || ENV._MIDDLEINFO.isLastStep()) {
            await sendMessageToTelegramWithContext(context)(answer);

        }
        if (!ENV._MIDDLEINFO.isLastStep()) {
            ENV._MIDDLEINFO.prestep_text = answer;
        }
        console.log(`[DONE] Chat via ${llm.name}`);
        return null;
    } catch (e) {
        let errMsg = `Error: ${e.message}`;
        if (errMsg.length > 2048) {
            // 裁剪错误信息 最长2048
            errMsg = errMsg.substring(0, 2048);
        }
        context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
        return sendMessageToTelegramWithContext(context)(errMsg);
    }
}

export async function chatViaFileWithLLM(file, fileName, context) {
  try {
    const llm = loadAudioLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    const startTime = performance.now();
    const answer = await llm(file, fileName, context);
    if (!answer.ok) {
      console.error(answer.message);
      return sendMessageToTelegramWithContext(context)('Chat via file failed.');
    }
    console.log(`[FILE DONE] ${llm.name}: ${((performance.now() - startTime) / 1000).toFixed(1)}s`);
    if (!ENV._MIDDLEINFO.isLastStep()) {
      if (answer.type === 'text') {
        ENV._MIDDLEINFO.prestep_text = answer.content;
      } else if (typeof answer.content === 'string') {
        ENV._MIDDLEINFO.prestep_uri = answer.content;
      } else ENV._MIDDLEINFO.prestep_raw = answer.content;
    }

    if (!ENV.HIDE_MIDDLE_MESSAGE || ENV._MIDDLEINFO.isLastStep()) {
      let resp = null;
      const sendHandler = { 'text': sendMessageToTelegramWithContext, 'image': sendPhotoToTelegramWithContext };
      resp = (await sendHandler[answer.type]?.(context)(answer.content).then((r) => r.json())) || {
        ok: false,
        message: 'cannot find handler',
      };
      if (!resp.ok) {
        console.error(`[FILE FAILED] Send data failed: ${resp.message}`);
      }
    }
    return null;
  } catch (e) {
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(e.message.substring(2048));
  }
}

