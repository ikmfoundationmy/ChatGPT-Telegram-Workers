import {CONST, DATABASE, ENV} from '../config/env.js';
import {Context} from '../config/context.js';
import { getBot, sendMessageToTelegramWithContext, sendPhotoToTelegramWithContext, sendChatActionToTelegramWithContext } from './telegram.js';
import {handleCommandMessage} from './command.js';
import {errorToString} from '../utils/utils.js';
import { chatViaFileWithLLM, chatWithLLM } from '../agent/llm.js';
import { loadImageGen, loadVisionLLM } from "../agent/agents.js";
import { MiddleInfo } from "../config/middle.js";
// import tasks from "../tools/scheduleTask.js";

import '../types/telegram.js';


/**
 * 初始化聊天上下文
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgInitChatContext(message, context) {
    await context.initContext(message);
    return null;
}


/**
 * 保存最后一条消息
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgSaveLastMessage(message, context) {
    if (ENV.DEBUG_MODE) {
        const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
        await DATABASE.put(lastMessageKey, JSON.stringify(message), {expirationTtl: 3600});
    }
    return null;
}

/**
 * 忽略旧的消息
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgIgnoreOldMessage(message, context) {
    if (ENV.SAFE_MODE) {
        let idList = [];
        try {
          idList = JSON.parse((await DATABASE.get(context.SHARE_CONTEXT.chatLastMessageIdKey)) || '[]');
        } catch (e) {
            console.error(e);
        }
        // 保存最近的100条消息，如果存在则忽略，如果不存在则保存
        if (idList.includes(message.message_id)) {
          return new Response('Ignore old message', { status: 200 });
          
        } else {
            idList.push(message.message_id);
            if (idList.length > 100) {
                idList.shift();
            }
            await DATABASE.put(context.SHARE_CONTEXT.chatLastMessageIdKey, JSON.stringify(idList));
        }
    }
    return null;
}

/**
 * 检查环境变量是否设置
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgCheckEnvIsReady(message, context) {
    if (!DATABASE) {
        return sendMessageToTelegramWithContext(context)('DATABASE Not Set', 'command');
    }
    return null;
}

/**
 * 过滤非白名单用户
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgFilterWhiteList(message, context) {
    if (ENV.I_AM_A_GENEROUS_PERSON) {
        return null;
    }
    // 判断私聊消息
    if (context.SHARE_CONTEXT.chatType === 'private') {
        // 白名单判断
        if (!ENV.CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
            return sendMessageToTelegramWithContext(context)(
                `You are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`,
            );
        }
        return null;
    }

    // 判断群组消息
    if (CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
        // 未打开群组机器人开关,直接忽略
        if (!ENV.GROUP_CHAT_BOT_ENABLE) {
            throw new Error('Not support');
        }
        // 白名单判断
        if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
            return sendMessageToTelegramWithContext(context)(
                `Your group are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`,
            );
        }
        return null;
    }
    return sendMessageToTelegramWithContext(context)(
        `Not support chat type: ${context.SHARE_CONTEXT.chatType}`,
    );
}


/**
 * 过滤不支持的消息
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
// eslint-disable-next-line no-unused-vars
async function msgFilterUnsupportedMessage(message, context) {
  if (message.text || (ENV.EXTRA_MESSAGE_CONTEXT && message.reply_to_message?.text)) {
    return null;
  }
  if (ENV.ENABLE_FILE && (message.voice || message.audio || message.photo || message.image || message.document)) {
    return null;
  }
  throw new Error("Unsupported message");
}

/** 
 * 处理私聊消息
 *  
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandlePrivateMessage(message, context) {
  if ('private' !== context.SHARE_CONTEXT.chatType) {
    return null;
  }
  // 非文本 和 非标题图片
  if (!message.text && !message.caption) {
    return null;
  }
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response('Non text message', { 'status': 200 });
  }
  // 聊天中简化命令
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) =>
    (message?.text || message?.caption || '').startsWith(key),
  );
  if (chatMsgKey) {
    if (message.text) {
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
    } else message.caption = message.caption.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }
  return null;
}

/**
 * 处理群消息
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgHandleGroupMessage(message, context) {

  // 非群组消息不作处理
  if (!CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    return null;
  }

  // 处理群组消息，过滤掉AT部分
  let botName = context.SHARE_CONTEXT.currentBotName;

  // 检查替换词
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) =>
    (message?.text || message?.caption || '').startsWith(key),
  );
  if (chatMsgKey) {
    if (message?.text) {
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
    } else message.caption = message.caption.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }

  // 存在被回复对象 被回复对象是机器人时直接返回 否则处理共享上下文
  if (message.reply_to_message) {
    if (`${message.reply_to_message.from.id}` === context.SHARE_CONTEXT.currentBotId) {
      return null;
    } else if (ENV.EXTRA_MESSAGE_CONTEXT) {
      context.SHARE_CONTEXT.extraMessageContext = message.reply_to_message;
    }
  }
  
  if (!botName) {
    const res = await getBot(context.SHARE_CONTEXT.currentBotToken);
    context.SHARE_CONTEXT.currentBotName = res.info.bot_name;
    botName = res.info.bot_name;
  }
  if (botName) {
    let mentioned = false;
    // Reply消息
    if (message.entities) {
      let content = '';
      let offset = 0;
      message.entities.forEach((entity) => {
        switch (entity.type) {
          case 'bot_command':
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
              if (mention.endsWith(botName)) {
                mentioned = true;
              }
              const cmd = mention
                .replaceAll('@' + botName, '')
                .replaceAll(botName, '')
                .trim();
              content += cmd;
              offset = entity.offset + entity.length;
            }
            break;
          case 'mention':
          case 'text_mention':
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
              if (mention === botName || mention === '@' + botName) {
                mentioned = true;
              }
            }
            content += message.text.substring(offset, entity.offset);
            offset = entity.offset + entity.length;
            break;
        }
      });
      content += message.text.substring(offset, message.text.length);
      message.text = content.trim();
    }
    if (!mentioned && chatMsgKey) {
      // 触发关键词时调整为true
      mentioned = true;
    }
    // 未AT机器人的消息不作处理
    if (!mentioned) {
      return new Response('No mentioned');
    } else {
      return null;
    }
  }
  throw new Error('Not set bot name');
}

/**
 * 初始化用户配置 
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgInitUserConfig(message, context) {
    try {
      // console.log('init user config');
      await context._initUserConfig(context.SHARE_CONTEXT.configStoreKey);
      const telegraphAccessTokenKey = context.SHARE_CONTEXT.telegraphAccessTokenKey;
      context.SHARE_CONTEXT.telegraphAccessToken = await DATABASE.get(telegraphAccessTokenKey);
      return null;
    } catch (e) {
      return sendMessageToTelegramWithContext(context)(e.message, 'command');
    }
  }

/**
 * 忽略特定文本
 * 
 * @param {TelegramMessage} message 
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgIgnoreSpecificMessage(message) {
    if (
      ENV.IGNORE_TEXT && message?.text?.startsWith(ENV.IGNORE_TEXT)
    ) {
      return new Response('ignore specific text', { status: 200 });
    }
    return null;
}
  

/**
 * 初始化中间信息
 * 
 * @param {TelegramMessage} message 
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgInitMiddleInfo(message, context) {
  try {
    context._info = await MiddleInfo.initInfo(message, context);
    if (!message.text && !message.reply_to_message?.text) {
      const msg = await sendMessageToTelegramWithContext(context)('file info get successful.').then(r => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    }
    return null;
  } catch (e) {
    console.log(e.message);
    return sendMessageToTelegramWithContext(context)(e.message, 'command');
  }
}


/**
 * 响应命令消息
 *
 * @param {TelegramMessage} message
 * @param {ContextType} context
 * @return {Promise<Response>}
 */
async function msgHandleCommand(message, context) {
    return await handleCommandMessage(message, context);
}


/**
 * 与llm聊天
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgChatWithLLM(message, context) {
  let content = (message.text || message.caption || '').trim();
  if (
    ENV.EXTRA_MESSAGE_CONTEXT &&
    (context.SHARE_CONTEXT.extraMessageContext?.text || context.SHARE_CONTEXT.extraMessageContext?.caption)
  ) {
    content =
      '> ' +
      (context.SHARE_CONTEXT.extraMessageContext?.text || '') +
      (context.SHARE_CONTEXT.extraMessageContext?.caption || '') +
      '\n' +
      content;
  }

  const params = { message: content };

  // 与LLM交互
  try {
    let result = null;

    for (let i = 0; i < context._info.process_count; i++) {
      if (result && result instanceof Response) {
        return result;
      }
      context._info.initProcess(context.USER_CONFIG);
      if (context._info.file[i].type === 'image') {
        params.images = [context._info.file[i].url];
      }
      switch (context._info.process_type) {
        case 'text:text':
          result = await chatWithLLM(params, context, null);
          break;
        case 'text:image':
          {
            const gen = loadImageGen(context)?.request;
            if (!gen) {
              return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`, 'command');
            }
            setTimeout(() => sendChatActionToTelegramWithContext(context)('upload_photo').catch(console.error), 0);
            result = await gen(context._info.lastStep.text || text, context);
            if (!context._info.isLastStep) {
              context._info.setFile(typeof result === 'string' ? { url: result } : { raw: result });
            }
            const response = await sendPhotoToTelegramWithContext(context)(result);
            if (response.status != 200) {
              console.error(await response.text());
            }
          }
          break;
        case 'audio:text':
          result = await chatViaFileWithLLM(context);
          break;
        case 'image:text':
          result = await chatWithLLM(params, context, null, loadVisionLLM);
          break;
        case 'audio:audio':
        case 'text:audio':
        default:
          return sendMessageToTelegramWithContext(context)('unsupported type', 'command');
      }

      // 每个流程独立消息
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }
      delete params.images;

    }
  } catch (e) {
    console.error(e);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`, 'command');
  }

  return new Response('success', { status: 200 });
}


/**
 * 加载真实TG消息
 * @param {TelegramWebhookRequest} body
 * @returns {TelegramMessage}
 */
function loadMessage(body) {
  if (body?.edited_message) {
      throw new Error('Ignore edited message');
  }
  if (body?.message) {
      return body?.message;
  } else {
      throw new Error('Invalid message');
  }
}

async function scheduledDeleteMessage(request, context) {
  // 未发出消息
  const { sentMessageIds } = context.SHARE_CONTEXT;
  if (!sentMessageIds || sentMessageIds.size === 0)
    return new Response('success', { status: 200 });

  const chatId = context.SHARE_CONTEXT.chatId;
  const botName = context.SHARE_CONTEXT.currentBotName;
  const scheduledData = JSON.parse((await DATABASE.get(context.SHARE_CONTEXT.scheduleDeteleKey)) || '{}');
  if (!scheduledData[botName]) {
    scheduledData[botName] = {};
  }
  if (!scheduledData[botName][chatId]) {
    scheduledData[botName][chatId] = [];
  }
  const offsetInMillisenconds = ENV.SCHEDULE_TIME * 60 * 1000;
  scheduledData[botName][chatId].push({
    id: [...sentMessageIds],
    ttl: Date.now() + offsetInMillisenconds,
  });
  
  await DATABASE.put(context.SHARE_CONTEXT.scheduleDeteleKey, JSON.stringify(scheduledData));
  console.log(`message need delete: ${chatId} - ${[...sentMessageIds]}`);

  // await tasks.schedule_detele_message();
  return new Response('success', { status: 200 });
}

async function msgTagNeedDelete(request, context) {
  return await scheduledDeleteMessage(request, context);
}

/**
 * 处理消息
 * @param {string} token
 * @param {TelegramWebhookRequest} body
 * @returns {Promise<Response|null>}
 */
export async function handleMessage(token, body) {
  const context = new Context();
  context.initTelegramContext(token);
  const message = loadMessage(body);

    // 中间件定义 function (message: TelegramMessage, context: Context): Promise<Response|null>
    // 1. 当函数抛出异常时，结束消息处理，返回异常信息
    // 2. 当函数返回 Response 对象时，结束消息处理，返回 Response 对象
    // 3. 当函数返回 null 时，继续下一个中间件处理

    // 消息处理中间件
    const handlers = [
      // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
      msgInitChatContext,
      // 忽略特定文本
      msgIgnoreSpecificMessage,
      // 检查环境是否准备好: DATABASE
      msgCheckEnvIsReady,
      // 过滤非白名单用户
      msgFilterWhiteList,
      // DEBUG: 保存最后一条消息
      msgSaveLastMessage,
      // 过滤不支持的消息(抛出异常结束消息处理)
      msgFilterUnsupportedMessage,
      // 处理私人消息
      msgHandlePrivateMessage,
      // 处理群消息，判断是否需要响应此条消息
      msgHandleGroupMessage,
      // 忽略旧消息
      msgIgnoreOldMessage,
      // 初始化用户配置
      msgInitUserConfig,
      // 初始化基础中间信息
      msgInitMiddleInfo,
      // 处理命令消息
      msgHandleCommand,
      // 与llm聊天
      msgChatWithLLM,
    ];
  
    const exitHanders = [msgTagNeedDelete];

    for (const handler of handlers) {
        try {
          const result = await handler(message, context);
          if (result && result instanceof Response) {
              // return result;
              break;
            }
        } catch (e) {
            console.error(e);
            return new Response(errorToString(e), {status: 500});
        }
    }

    for (const handler of exitHanders) {
      try {
        const result = await handler(message, context);
          if (result && result instanceof Response) {
            return result;
          }
      } catch (e) {
          console.error(e);
          return new Response(errorToString(e), {status: 500});
      }
    }
    return null;
}
