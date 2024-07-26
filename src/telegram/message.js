import {CONST, DATABASE, ENV} from '../config/env.js';
import {Context} from '../config/context.js';
import {getBot, sendMessageToTelegramWithContext, sendPhotoToTelegramWithContext, getFileInfo, getFile} from './telegram.js';
import {handleCommandMessage} from './command.js';
import {errorToString} from '../utils/utils.js';
import { chatViaFileWithLLM, chatWithLLM } from '../agent/llm.js';
import { loadImageGen, loadVisionLLM } from "../agent/agents.js";
import { MiddleInfo } from "../config/middle.js";

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
            throw new Error('Ignore old message');
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
        return sendMessageToTelegramWithContext(context)('DATABASE Not Set');
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
    if (!message.text && !ENV.ENABLE_FILE && (ENV.EXTRA_MESSAGE_CONTEXT && !message.reply_to_message.text)) {
        throw new Error('Not supported message type');
    }
    return null;
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
  if (message.voice || message.audio || message.photo || message.document) {
    return null;
  }
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response('Non text message', { 'status': 200 });
  }
  // 聊天中简化命令
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) => message.text.startsWith(key));
  if (chatMsgKey) {
    message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey] + '!');
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
    if (!message.text && !ENV.ENABLE_FILE) {
      return new Response('Non text message', {status: 200});
    }
  
    // 非群组消息不作处理
    if (!CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
        return null;
    }
  
    // 处理群组消息，过滤掉AT部分
    let botName = context.SHARE_CONTEXT.currentBotName;
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
        const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(key => (message?.text || '').startsWith(key));
        if (chatMsgKey) {
          mentioned = true;
          message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
        } else if (message.entities) {
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
        // 未AT机器人的消息不作处理
        if (!mentioned) {
            throw new Error('No mentioned')
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
      return null;
    } catch (e) {
      return sendMessageToTelegramWithContext(context)(e.message);
    }
  }

/**
 * 忽略特定文本
 * 
 * @param {TelegramMessage} message 
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgIgnoreSpecificMessage(message, context) {
    if (
      ENV.IGNORE_TEXT && message?.text?.startsWith(ENV.IGNORE_TEXT)
    ) {
      return new Response('ignore specific text', { status: 200 })
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
function msgInitMiddleInfo(message, context) {
  try {
    ENV._MIDDLEINFO = new MiddleInfo(message, context.USER_CONFIG);
    return null;
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(e.message);
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
 * 处理TG文件
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandleFile(message, fileType, context) {
  if (!context.CURRENT_CHAT_CONTEXT.message_id) {
    const msg = await sendMessageToTelegramWithContext(context)('...').then((r) => r.json());
    context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    context.CURRENT_CHAT_CONTEXT.reply_markup = null;
  }
  let file = null,
    file_name = '',
    file_url = '';
  let errorMsg = '';
  if (!ENV._MIDDLEINFO.prestep_file_uri && !ENV._MIDDLEINFO.prestep_file_raw) {
    const info = await getFileInfo(ENV._MIDDLEINFO.orignal_msg_info.file_id, context.SHARE_CONTEXT.currentBotToken);
    if (!info.ok) {
      console.log('[FILE FAILED]: ' + msgType);
      await sendMessageToTelegramWithContext(context)(`GET FILE_PATH ERROR: ${info.description}`);
      return new Response('Handle file msg error', { status: 200 });
    }
    sendMessageToTelegramWithContext(context)('File info done.');
    file_name = info.file_path.split('/').pop();
    file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${context.SHARE_CONTEXT.currentBotToken}/${info.file_path}`;
    console.log('File url:', file_url);

    if (fileType != 'photo' || fileType == 'photo' && (ENV.LOAD_IMAGE_FILE || ENV._MIDDLEINFO.process_info.MODEL.startsWith('claude'))) {
      const file_resp = await getFile(file_url);
      if (file_resp.status !== 200) {
        errorMsg = `[FILE][FAILED] Get file: ${await file_resp.text()}`;
        console.log(`${errorMsg}`);
      }
      file = await file_resp.blob();
    }
  } else {
    file = ENV._MIDDLEINFO.prestep_file_raw;
    file_url = ENV._MIDDLEINFO.prestep_file_uri;
    file_name = ENV._MIDDLEINFO.prestep_file_uri.split('/').pop();
  }

  const start = performance.now();
  // console.log(JSON.stringify(message.voice,null,2))
  if (ENV._MIDDLEINFO.isFirstStep()) {
    ENV._MIDDLEINFO.file_uri = file_url;
    ENV._MIDDLEINFO.file_raw = file;
  } else if (ENV._MIDDLEINFO.isLastStep()) {
    ENV._MIDDLEINFO.prestep_file_uri = file_url;
    ENV._MIDDLEINFO.prestep_file_raw = file;
  }

  try {
    switch (fileType) {
      case 'photo':
      case 'image':
        if (errorMsg) break;
        if (ENV.LOAD_IMAGE_FILE || ENV._MIDDLEINFO.process_info.MODEL.startsWith('claude')) {
          sendMessageToTelegramWithContext(context)('Image load success.');
          file = `data:image/jpeg;base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
          if (ENV._MIDDLEINFO.isFirstStep()) {
            ENV._MIDDLEINFO.file_raw = file;
          } else if (!ENV._MIDDLEINFO.isLastStep()) {
            ENV._MIDDLEINFO.prestep_file_raw = file;
          }
        }
        console.log(`[FILE DONE] ${fileType}: ${((performance.now() - start) / 1000).toFixed(2)}s`);
        return {file, file_name};
      case 'voice':
      case 'audio': {
        if (errorMsg) break;
        return { file, file_name };
      }
    }
  } catch (e) {
    console.error(e);
  }
  if (errorMsg) {
    return sendMessageToTelegramWithContext(context)(errorMsg);
  }
  return new Response('Handle file msg failed', { status: 200 });
}

/**
 * 与llm聊天
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgChatWithLLM(message, context) {

  // 消息类型优先级: 图片-音频-文本
  const { fileType } = ENV._MIDDLEINFO.orignal_msg_info;

  console.log('[FILE]: ' + fileType);

  // 与LLM交互
  try {
    let text = (message.text || message.caption || '').trim();
    if (ENV.EXTRA_MESSAGE_CONTEXT && context.SHARE_CONTEXT?.extraMessageContext?.text) {
      text = context.SHARE_CONTEXT.extraMessageContext.text || context.SHARE_CONTEXT.extraMessageContext.caption + '\n' + text;
    }

    let result = null;
    const HANDLE_PROCESS = ENV._MIDDLEINFO.processes;
    const clearPreStepInfo = (type) => {
      switch (type) {
        case 'text:text':
        case 'text:image':
        case 'text:audio':
          ENV._MIDDLEINFO.prestep_file_uri = '';
          ENV._MIDDLEINFO.prestep_file_raw = '';
          break;
        case 'audio:text':
        case 'image:text':
          ENV._MIDDLEINFO.prestep_text = '';
          break;
        default:
          break;
      }
    };
    for ( const _ of HANDLE_PROCESS) {
      if (result && result instanceof Response) {
        return result;
      }
      ENV._MIDDLEINFO.initProcess(context.USER_CONFIG);
      clearPreStepInfo(ENV._MIDDLEINFO.process_info.TYPE);
      // 每个流程独立消息
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }

      switch (ENV._MIDDLEINFO.process_info.TYPE) {
        case 'text:text':
          result = await chatWithLLM(text, context, null);
          break;
        case 'text:image':
          const gen = loadImageGen(context)?.request;
          if (!gen) {
            return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`);
          }
          result = await gen(ENV._MIDDLEINFO.prestep_text || text, context);
          if (!ENV._MIDDLEINFO.isLastStep()) {
            if (typeof result === 'string') {
              ENV._MIDDLEINFO.prestep_file_uri = result;
            } else ENV._MIDDLEINFO.prestep_file_raw = result;
          }
          const response = await sendPhotoToTelegramWithContext(context)(result);
          if (response.status != 200) {
            console.error(await response.text());
          }
          break;
        case 'audio:text':
          const { file, file_name } = await msgHandleFile(message, fileType, context);
          result = await chatViaFileWithLLM(file, file_name, context);
          break;
        case 'image:text':
          await msgHandleFile(message, fileType, context);
          result = await chatWithLLM(text, context, null, loadVisionLLM);
          break;
        case 'audio:audio':
        case 'text:audio':
        default:
          return sendMessageToTelegramWithContext(context)('unsupported type');
      }
    }
  } catch (e) {
    console.error(e);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }

  return new Response('success', { status: 200 });
}


/**
 * 加载真实TG消息
 *
 * @param {Request} request
 * @param {ContextType} context
 * @return {Promise<TelegramMessage>}
 */
// eslint-disable-next-line no-unused-vars
async function loadMessage(request, context) {
    /**
     * @type {TelegramWebhookRequest}
     */
    const raw = await request.json();
    if (raw.edited_message) {
        throw new Error('Ignore edited message');
    }
    if (raw.message) {
        return raw.message;
    } else {
        throw new Error('Invalid message');
    }
}

/**
 * 处理消息
 *
 * @param {Request} request
 * @return {Promise<Response|null>}
 */
export async function handleMessage(request) {
    const context = new Context();
    context.initTelegramContext(request);
    const message = await loadMessage(request, context);

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
        // DEBUG: 保存最后一条消息
        msgSaveLastMessage,
        // 过滤不支持的消息(抛出异常结束消息处理：支持文本、音频、图片消息)
        msgFilterUnsupportedMessage,
        // 处理私人消息
        // msgHandlePrivateMessage,
        // 处理群消息，判断是否需要响应此条消息
        msgHandleGroupMessage,
        // 过滤非白名单用户
        msgFilterWhiteList,
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

    for (const handler of handlers) {
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
