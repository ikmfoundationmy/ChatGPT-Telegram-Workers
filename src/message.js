import {CONST, DATABASE, ENV} from './env.js';
import {Context} from './context.js';
import {getBot, sendMessageToTelegramWithContext, sendPhotoToTelegramWithContext, getFileInfo, getFile} from './telegram.js';
import {handleCommandMessage} from './command.js';
import {errorToString, getCurrentProcessInfo} from './utils.js';
import { chatWithLLM, loadImageGen } from './llm.js';
import { requestTranscriptionFromOpenAI } from './openai.js';
// eslint-disable-next-line no-unused-vars
import './type.js';


/**
 * 初始化聊天上下文
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgInitChatContext(message, context) {
  try {
    await context.initContext(message);
  } catch (e) {
    return new Response(errorToString(e), {status: 200});
  }
  return null;
}


/**
 * 保存最后一条消息
 *
 * @param {TelegramMessage} message
 * @param {Context} context
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
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgIgnoreOldMessage(message, context) {
  if (ENV.SAFE_MODE) {
    let idList = [];
    try {
      const rawValue = await DATABASE.get(context.SHARE_CONTEXT.chatLastMessageIDKey).catch(() => '[]');
      idList = (typeof rawValue === 'string' && rawValue) ? JSON.parse(rawValue) : [];
    } catch (e) {
      console.error(e); 
    }
    // 保存最近的100条消息，如果存在则忽略，如果不存在则保存
    if (idList.includes(message.message_id)) {
      return new Response(JSON.stringify({
        ok: true,
      }), {status: 200});
    } else {
      idList.push(message.message_id);
      if (idList.length > 100) {
        idList.shift();
      }
      await DATABASE.put(context.SHARE_CONTEXT.chatLastMessageIDKey, JSON.stringify(idList));
    }
  }
  return null;
}

/**
 * 检查环境变量是否设置
 *
 * @param {TelegramMessage} message
 * @param {Context} context
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
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgFilterWhiteList(message, context) {
  if (ENV.I_AM_A_GENEROUS_PERSON) {
    return null;
  }
  // 判断私聊消息
  if (context.SHARE_CONTEXT.chatType==='private') {
    // 白名单判断
    if (!ENV.CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
          ENV.I18N.message.user_has_no_permission_to_use_the_bot(context.CURRENT_CHAT_CONTEXT.chat_id),
      );
    }
    return null;
  }

  // 判断群组消息
  if (CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    // 未打开群组机器人开关,直接忽略
    if (!ENV.GROUP_CHAT_BOT_ENABLE) {
      return new Response('Not support', {status: 401});
    }
    // 白名单判断
    if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
          ENV.I18N.message.group_has_no_permission_to_use_the_bot(context.CURRENT_CHAT_CONTEXT.chat_id),
      );
    }
    return null;
  }
  return sendMessageToTelegramWithContext(context)(
      ENV.I18N.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType),
  );
}

/**
 * 过滤非文本消息
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgFilterNonTextMessage(message, context) {
  if (!message.text && !context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.message.not_supported_chat_type_message);
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
  if (message.voice || message.audio || message.photo || message.document) {
    return;
  }
  if (!message.text) {
    return new Response('Non text message',{'status':200});
  }
  // 私人聊天中简化命令
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(key => message.text.startsWith(key))
  if (chatMsgKey) {
    message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey] + '!');
  }
  return null;
}

/**
 * 处理群消息
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandleGroupMessage(message, context) {
  // 非文本/语音/图片消息直接忽略, 不考虑以文件形式发送的图片/语音
  if (!message.text && !(message.voice || message.audio || message.photo)) {
    return new Response('Non text message', {status: 200});
  }

  // 处理群组消息，过滤掉AT部分
  let botName = context.SHARE_CONTEXT.currentBotName;
  if (!botName) {
    const res = await getBot(context.SHARE_CONTEXT.currentBotToken);
    context.SHARE_CONTEXT.currentBotName = res.info.bot_name;
    botName = res.info.bot_name;
  }
  if (message.reply_to_message ) {
    if (`${message.reply_to_message.from.id}` === context.SHARE_CONTEXT.currentBotId) {
      return null;
    } else if (ENV.EXTRA_MESSAGE_CONTEXT) {
      context.SHARE_CONTEXT.extraMessageContext = message.reply_to_message;
    }
  }
  if (botName) {
    let mentioned = false;
    // Reply消息
    const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(key => (message?.text || '').startsWith(key));
    if (chatMsgKey) {
      mentioned = true;
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey] + '!');
    } else if (message.entities) {
      let content = '';
      let offset = 0;
      message.entities.forEach((entity) => {
        switch (entity.type) {
          case 'bot_command':
            if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length,
              );
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
            if (!mentioned && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL) {
              mentioned = true;
              break;
            } else if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length,
              );
              if (mention === botName || mention === '@' + botName) {
                mentioned = true;
              }
            }
            content += message?.text.substring(offset, entity.offset) || '';
            offset = entity.offset + entity.length;
            break;
        }
      });
      content += message?.text.substring(offset, message.text.length)|| '';
      message.text = content.trim();
    }
    // 未AT机器人的消息不作处理
    if (!mentioned) {
      return new Response('No mentioned', {status: 200});
    } else {
      return null;
    }
  }
  return new Response('Not set bot name', {status: 200});
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
    ENV.IGNORE_TEXT_ENABLE && message.text &&
    message.text.startsWith(ENV.IGNORE_TEXT)
  ) {
    return new Response('ignore specific text', { status: 200 })
  }
  return null;
}

/**
 * 响应命令消息
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandleCommand(message, context) {
  return await handleCommandMessage(message, context);
}


/**
 * 响应身份角色扮演
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandleRole(message, context) {
  if (!(message.text || '').startsWith('~')) {
    return null;
  }
  message.text = message.text.slice(1);
  const kv = message.text.indexOf(' ');
  if (kv === -1) {
    return null;
  }
  const role = message.text.slice(0, kv);
  const msg = message.text.slice(kv + 1).trim();
  // 存在角色就替换USER_CONFIG
  if (Object.prototype.hasOwnProperty.call(context.USER_DEFINE.ROLE, role)) {
    context.SHARE_CONTEXT.role=role;
    message.text = msg;
    const roleConfig = context.USER_DEFINE.ROLE[role];
    for (const key in roleConfig) {
      if ( Object.prototype.hasOwnProperty.call(context.USER_CONFIG, key) && typeof context.USER_CONFIG[key] === typeof roleConfig[key] ) {
        if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
          continue;
        }
        context.USER_CONFIG[key] = roleConfig[key];
      }
    }
  }
}

/** 
 * 处理TG文件
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function msgHandleFile(message, fileType, context) {
  if (!context.CURRENT_CHAT_CONTEXT.message_id) {
    const msg = await sendMessageToTelegramWithContext(context)(
      ENV.I18N.message.loading
    ).then(r => r.json());
    context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    context.CURRENT_CHAT_CONTEXT.reply_markup = null;
  }
  let file = null, file_name = '', file_url = '';
  let errorMsg = '';
  if (!context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL && !context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILE) {
    let file_id;
    if (fileType == 'photo') {
      const photoLength = message[fileType].length;
      file_id = (message[fileType]?.[photoLength - 1]?.file_id || message[fileType]?.file_id) ?? 0;
      console.log('photo: \n' + JSON.stringify(message[fileType]));
    } else {
      file_id = message[fileType]?.file_id ?? '0';
    }
    if (!message.text) {
      message.text = message.caption ?? '';
    }
  
    const info = await getFileInfo(file_id, context.SHARE_CONTEXT.currentBotToken);
    if (!info.file_path) {
      console.log('[FILE][FAILED]: ' + msgType);
      await sendMessageToTelegramWithContext(context)(`GET FILE_PATH ERROR: ${info.description}`)
      return new Response('Handle file msg error', { status: 200 });
    }
    if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {}
    }
    file_name = info.file_path.split('/').pop();
    file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${context.SHARE_CONTEXT.currentBotToken}/${info.file_path}`;
    console.log('File url:', file_url);
    context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = file_url;
    if (fileType != 'photo' || (fileType == 'photo' && ENV.LOAD_IMAGE_FILE)) {
      const file_resp = await getFile(file_url);
      if (file_resp.status !== 200) {
        errorMsg = `[FILE][FAILED] Get file: ${await file_resp.text()}`;
        console.log(`${errorMsg}`);
      }
      file = await file_resp.blob();
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = file;
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILENAME = file_name;
    }
  } else {
    file = context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE;
    file_name = context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILENAME;
    file_url = context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL;
  }
  const start = performance.now();
  // console.log(JSON.stringify(message.voice,null,2))

  try {
    switch (fileType) {
      case 'photo':
      case 'image':
        if (errorMsg) break;
        if (ENV.LOAD_IMAGE_FILE) {
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = `data:image/jpeg;base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`
        };
        console.log(
          `[FILE][DONE] ${fileType}: ${((performance.now() - start) / 1000).toFixed(2)}s`
        );
        return null;
      case 'voice':
      case 'audio': {
        if (errorMsg) break;
        const stt_data = await requestTranscriptionFromOpenAI(
          file,
          file_name,
          context
        ).then(r => r.json());
        if (stt_data.error) {
          errorMsg = `[FILE][FAILED] Speech to text: ${stt_data.error.message}`;
          console.log(`${errorMsg}`);
          break;
        }
        const time = ((performance.now() - start) / 1000).toFixed(2) + 's   ';
        console.log(`[FILE][DONE] Speech to text: ${time}`);
        console.log('Transcription:\n' + stt_data.text);
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO =
          (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO?.TEMP_INFO || '') +
          getCurrentProcessInfo(context, 'MODEL') +
          ' ' +
          time;
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT = stt_data.text;
        const msgResp = await sendMessageToTelegramWithContext(context)(
          stt_data.text
        ).then(r => r.json());
        if (!msgResp.ok) {
          errorMsg = `[FILE][FAILED] Send transcription failed: ${msgResp.message}`;
          console.log(`${errorMsg}`);
          break;
        }

        context.CURRENT_CHAT_CONTEXT.message_id = msgResp.result.message_id;
        console.log('[FILE][DONE]: ' + fileType);
        return null;
      }
    }
  } catch (e) {
    console.error(e);
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
  const acceptType = ['photo', 'image', 'voice', 'audio', 'text']
  let fileType = acceptType.find((key) => key in message);
  if (!fileType && message?.document) {
    if (message.document.mime_type.match(/image/)) {
      msgType = 'image';
    } else if (message.document.mime_type.match(/audio/)) msgType = 'audio';
  }
  if (!fileType) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.message.not_supported_chat_type_message);
  }
  console.log('[FILE]: ' + fileType);

  // 与LLM交互
  const MODE = context.USER_CONFIG.CURRENT_MODE;

  let msgType = fileType;
  if (msgType == 'voice') {
    msgType = 'audio';
  } else if (msgType == 'photo') {
    msgType = 'image';
  }

  try {
    const HANDLE_PROCESS = context.USER_CONFIG.MODES?.[MODE]?.[msgType] || MODES.default.text;
    let text = (message.text || '').trim();
    if (ENV.EXTRA_MESSAGE_CONTEXT && context.SHARE_CONTEXT?.extraMessageContext?.text) {
      text = context.SHARE_CONTEXT.extraMessageContext.text + '\n' + text;
    }

    let result;

    for (const [i, PROCESS] of HANDLE_PROCESS.entries()) {
      if (result && result instanceof Response) {
        return result;
      }
      context.USER_CONFIG.AI_PROVIDER = PROCESS.AI_PROVIDER;
      // 标记当前使用的模型数据
      context.CURRENT_CHAT_CONTEXT.TAG = [msgType, i];
      if (!PROCESS.TYPE) {
        PROCESS.TYPE = `${msgType}:text`;
      }
      switch (PROCESS.TYPE) {
        case 'text:text':
          result = await chatWithLLM(text, context, null);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO += context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT;
          break;
        case 'text:image':
          const gen = loadImageGen(context);
          if (!gen) {
            return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`);
          }
          result = await gen(subcommand, context);
          await sendPhotoToTelegramWithContext(context)(result);
          break;
        case 'audio:text':
          result = await msgHandleFile(message, fileType, context);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO +=  '\n' + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT + '\n';
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = null;
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = null;
          break;
        case 'image:text':
          await msgHandleFile(message, fileType, context);
          result = await chatWithLLM(message.text, context, null);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO += '\n' + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT + '\n';
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = null;
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = null;
          break;
        case 'audio:audio':
        case 'text:audio':
        default:
          return sendMessageToTelegramWithContext(context)('unsupported trans type');
      }
    }
  } catch (e) {
      console.error(e);
      return new Response(errorToString(e), {status: 500});
    } 

  return new Response('success', { status: 200 });
}

/**
 * 根据类型对消息进一步处理
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function msgProcessByChatType(message, context) {
  const handlerMap = {
    'private': [
      msgFilterWhiteList,
      msgHandlePrivateMessage,
      // msgFilterNonTextMessage,
      msgHandleCommand,
      msgHandleRole,
    ],
    'group': [
      msgFilterWhiteList,
      msgHandleGroupMessage,
      msgHandleCommand,
      msgHandleRole,
    ],
    'supergroup': [
      msgFilterWhiteList,
      msgHandleGroupMessage,
      msgHandleCommand,
      msgHandleRole,
    ],
  };
  if (!Object.prototype.hasOwnProperty.call(handlerMap, context.SHARE_CONTEXT.chatType)) {
    return sendMessageToTelegramWithContext(context)(
        ENV.I18N.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType),
    );
  }
  const handlers = handlerMap[context.SHARE_CONTEXT.chatType];
  for (const handler of handlers) {
    try {
      const result = await handler(message, context);
      if (result && result instanceof Response) {
        return result;
      }
    } catch (e) {
      console.error(e);
      return sendMessageToTelegramWithContext(context)(
          ENV.I18N.message.handle_chat_type_message_error(context.SHARE_CONTEXT.chatType),
      );
    }
  }
  return null;
}

/**
 * 加载真实TG消息
 *
 * @param {Request} request
 * @param {Context} context
 * @return {Promise<Object>}
 */
// eslint-disable-next-line no-unused-vars
async function loadMessage(request, context) {
  /**
 * @type {TelegramWebhookRequest}
 */
  const raw = await request.json();
  if (ENV.DEV_MODE) {
    setTimeout(() => {
      DATABASE.put(`log:${new Date().toISOString()}`, JSON.stringify(raw), {expirationTtl: 600}).catch(console.error);
    });
  }
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
 * @param {Request} request
 * @return {Promise<Response|null>}
 */
export async function handleMessage(request) {
  const context = new Context();
  context.initTelegramContext(request);
  const message = await loadMessage(request, context);

  // 消息处理中间件
  const handlers = [
    msgIgnoreSpecificMessage, // 忽略特定文本
    msgInitChatContext, // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    msgSaveLastMessage, // 保存最后一条消息
    msgCheckEnvIsReady, // 检查环境是否准备好: API_KEY, DATABASE
    msgIgnoreOldMessage, // 忽略旧消息
    msgProcessByChatType, // 根据类型对消息进一步处理
    msgChatWithLLM, // 与llm聊天
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
