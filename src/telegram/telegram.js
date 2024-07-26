import {DATABASE, ENV} from '../config/env.js';
import { escape } from "../utils/md2tgmd.js";
import { fetchWithRetry } from "../utils/utils.js";
import "../types/context.js"

/**
 * @param {string} message
 * @param {string} token
 * @param {object} context
 * @return {Promise<Response>}
 */
async function sendMessage(message, token, context) {
    const body = {
        text: message,
    };
    for (const key of Object.keys(context)) {
        if (context[key] !== undefined && context[key] !== null) {
            body[key] = context[key];
        }
    }
    let method = 'sendMessage';
    if (context?.message_id) {
        method = 'editMessageText';
    }
    return await fetchWithRetry(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/${method}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    );
}


/**
 * @param {string} message
 * @param {string} token
 * @param {CurrentChatContextType} context
 * @return {Promise<Response>}
 */
export async function sendMessageToTelegram(message, token, context) {
    const chatContext = {
      ...context,
      message_id: Array.isArray(context.message_id) ? 0 : context.message_id,
    };
    const limit = 4096;
    let origin_msg = message;
    let info = '';
    const escapeContent = (parse_mode = chatContext?.parse_mode) => {
      info = ENV._MIDDLEINFO.message_title;
      if (!ENV._MIDDLEINFO.isLastStep()) {
        chatContext.parse_mode = null;
        message = info ? info + '\n\n' + origin_msg : origin_msg;
        chatContext.entities = [
          { type: 'code', offset: 0, length: message.length },
          { type: 'blockquote', offset: 0, length: message.length },
        ]
      } else if (parse_mode === 'MarkdownV2') {
        info = info ? '>`' + info + '`\n\n' : '';
        message = info + escape(origin_msg);
      } else {
        message = info ? (info + '\n' + origin_msg) : origin_msg;
      }
      if (parse_mode !== 'MarkdownV2' /*&& message.length > limit*/) {
        info = info ? info + '\n' : '';
        chatContext.entities = [
          { type: 'code', offset: 0, length: info.length },
          { type: 'blockquote', offset: 0, length: info.length },
        ]
      }
    }
    if (message.length <= limit) {
      escapeContent();
      let resp = await sendMessage(message, token, chatContext);
      if (resp.status === 200) {
        return resp;
      } else {
        // console.log(await resp.text())
        // console.log('message send error:\n', message);
        // console.log('original message:\n', origin_msg);
        chatContext.parse_mode = null;
        context.parse_mode = null;
        message = origin_msg;
        resp = await sendMessage(message, token, chatContext)
        if (resp.status !== 200) {
          chatContext.entities = []
          return await sendMessage(message, token, chatContext);
        }
        console.log('sec request ok')
        return resp;
      }
    }
    chatContext.parse_mode = null;
    if (!chatContext.entities) {
      chatContext.entities = [
        { type: 'code', offset: 0, length: info.length },
        { type: 'blockquote', offset: 0, length: info.length },
      ]
    }
    escapeContent();
    if (!Array.isArray(context.message_id)){
      context.message_id = [context.message_id];
    }
    let msgIndex = 0;
  
    for (let i = 0; i < message.length; i += limit) {
      chatContext.message_id = context.message_id[msgIndex];
      msgIndex += 1;
  
      // 跳过二次发送中间消息，防止bad request
      if (msgIndex > 1 && context.message_id[msgIndex] && (i + limit < message.length)) {
        // msgIndex < (Math.ceil(message.length / limit) - 1)
        continue;
      }
      // 当隐藏INFO与TOKEN信息，跳过二次发送头部消息
      if ((msgIndex == 1 && context.message_id.length > 1 && !ENV.ENABLE_SHOWINFO && !ENV.ENABLE_SHOWTOKENINFO)) {
        continue;
      }
  
      const msg = message.slice(i, Math.min(i + limit, message.length));
      chatContext.entities[0].length = msg.length;
      chatContext.entities[1].length = msg.length;
  
      let resp = await sendMessage(msg, token, chatContext);
      if (resp.status == 429) {
        return resp;
      } else if (resp.status !== 200) {
        console.log(`[ERROR] ${await resp.text()}`)
      }
      if (msgIndex == 1) { 
        continue; 
      }
      if (!chatContext.message_id && resp.status == 200) {
        const message_id = (await resp.json()).result?.message_id;
        context.message_id.push(message_id);
      }
    }
    return new Response('Message batch send', {status: 200});
  }

/**
 * @param {ContextType} context
 * @return {function(string): Promise<Response>}
 */
export function sendMessageToTelegramWithContext(context) {
    return async (message) => {
        return sendMessageToTelegram(message, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT);
    };
}

/**
 * @param {ContextType} context
 * @return {function(string): Promise<Response>}
 */
export function deleteMessageFromTelegramWithContext(context) {
    return async (messageId) => {
        return await fetch(
            `${ENV.TELEGRAM_API_DOMAIN}/bot${context.SHARE_CONTEXT.currentBotToken}/deleteMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: context.CURRENT_CHAT_CONTEXT.chat_id,
                    message_id: messageId,
                }),
            },
        );
    };
}


/**
 * 发送图片消息到Telegram
 *
 * @param {string | Blob} photo
 * @param {string} token
 * @param {CurrentChatContextType} context
 * @return {Promise<Response>}
 */
export async function sendPhotoToTelegram(photo, token, context) {
  const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
  let body;
  const headers = {};
  if (typeof photo === 'string') {
    body = {
      photo: photo,
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== undefined && context[key] !== null) {
        body[key] = context[key];
      }
    }
    body.parse_mode = 'MarkdownV2';
    let info = '>`' + ENV._MIDDLEINFO.message_title + '`\n';
    body.caption = escape(info) + `[原始图片](${photo})`;
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  } else {
    body = new FormData();
    body.append('photo', photo, 'photo.png');
    for (const key of Object.keys(context)) {
      if (context[key] !== undefined && context[key] !== null) {
        body.append(key, `${context[key]}`);
      }
    }
  }
  const resp = await fetchWithRetry(url, {
    method: 'POST',
    headers,
    body,
  });
  if (resp.status === 400) {
    console.log(await resp.text());
    body = JSON.parse(body);
    delete body.parse_mode;
    option.body = JSON.stringify(body);
    return fetchWithRetry(url, option);
  }
  return resp;
}


/**
 * @param {ContextType} context
 * @return {function(string): Promise<Response>}
 */
export function sendPhotoToTelegramWithContext(context) {
    return (url) => {
        return sendPhotoToTelegram(url, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT);
    };
}


/**
 * 发送聊天动作到TG
 *
 * @param {string} action
 * @param {string} token
 * @param {string | number} chatId
 *
 * @return {Promise<Response>}
 */
export async function sendChatActionToTelegram(action, token, chatId) {
    return await fetchWithRetry(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendChatAction`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                action: action,
            }),
        },
    ).then((res) => res.json());
}

/**
 * @param {ContextType} context
 * @return {function(string): Promise<Response>}
 */
export function sendChatActionToTelegramWithContext(context) {
    return (action) => {
        return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id);
    };
}

/**
 * @param {string} token
 * @param {string} url
 * @return {Promise<Response>}
 */
export async function bindTelegramWebHook(token, url) {
    return await fetchWithRetry(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
            }),
        },
    ).then((res) => res.json());
}

/**
 * 判断是否为群组管理员
 *
 * @param {string | number} id
 * @param {string} groupAdminKey
 * @param {string | number} chatId
 * @param {string} token
 * @return {Promise<string>}
 */
export async function getChatRole(id, groupAdminKey, chatId, token) {
    let groupAdmin;
    try {
        groupAdmin = JSON.parse(await DATABASE.get(groupAdminKey) || '[]');
    } catch (e) {
        console.error(e);
        return e.message;
    }
    if (!groupAdmin || !Array.isArray(groupAdmin) || groupAdmin.length === 0) {
        const administers = await getChatAdminister(chatId, token);
        if (administers == null) {
            return null;
        }
        groupAdmin = administers;
        // 缓存120s
        await DATABASE.put(
            groupAdminKey,
            JSON.stringify(groupAdmin),
            {expiration: (Date.now() / 1000) + 120},
        );
    }
    for (let i = 0; i < groupAdmin.length; i++) {
        const user = groupAdmin[i];
        if (user.user.id === id) {
            return user.status;
        }
    }
    return 'member';
}

/**
 * 判断是否为群组管理员
 *
 * @param {ContextType} context
 * @return {function(*): Promise<string>}
 */
export function getChatRoleWithContext(context) {
    return (id) => {
        return getChatRole(id, context.SHARE_CONTEXT.groupAdminKey, context.CURRENT_CHAT_CONTEXT.chat_id, context.SHARE_CONTEXT.currentBotToken);
    };
}

/**
 * 获取群组管理员信息
 *
 * @param {string | number} chatId
 * @param {string} token
 * @return {Promise<object>}
 */
export async function getChatAdminister(chatId, token) {
    try {
        const resp = await fetch(
            `${ENV.TELEGRAM_API_DOMAIN}/bot${
                token
            }/getChatAdministrators`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({chat_id: chatId}),
            },
        ).then((res) => res.json());
        if (resp.ok) {
            return resp.result;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

// 获取机器人信息
/**
 * @typedef {object} BotInfo
 * @property {boolean} ok
 * @property {object} info
 * @property {string} info.name
 * @property {string} info.bot_name
 * @property {boolean} info.can_join_groups
 * @property {boolean} info.can_read_all_group_messages
 */
/**
 *
 * @param {string} token
 * @return {Promise<BotInfo>}
 */
export async function getBot(token) {
    const resp = await fetch(
        `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getMe`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    ).then((res) => res.json());
    if (resp.ok) {
        return {
            ok: true,
            info: {
                name: resp.result.first_name,
                bot_name: resp.result.username,
                can_join_groups: resp.result.can_join_groups,
                can_read_all_group_messages: resp.result.can_read_all_group_messages,
            },
        };
    } else {
        return resp;
    }
}

/**
 *  获取TG文件信息
 * @param {string} file_id
 * @param {string} token
 * @return {Promise<Response}
 */
export async function getFileInfo(file_id, token) {
    const resp = await fetchWithRetry(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(r => r.json());
    if (resp.ok) {
      return {
        ok: true,
        file_path: resp.result.file_path
      };
    }
    return resp;
  }
  
  /**
   * 直链获取文件
   * @param {string} filePath
   * @return {Promise<Response>}
   */
  export async function getFile(fullPath) {
    return fetch(fullPath);
  }
  