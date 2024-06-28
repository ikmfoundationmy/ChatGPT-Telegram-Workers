// eslint-disable-next-line no-unused-vars
import {Context} from './context.js';
import {DATABASE, ENV} from './env.js';
import { fetchWithRetry } from "./utils.js";
import { escape } from "./md2tgmd.js";

/**
 *
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
    if (context[key] !== undefined && context[key] !== null && ['MIDDLE_INFO', 'PROCESS_INFO'].indexOf(key) < 0) {
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
 *
 * @param {string} message
 * @param {string} token
 * @param {object} context
 * @return {Promise<Response>}
 */
export async function sendMessageToTelegram(message, token, context) {
  const chatContext = {
    ...context,
    message_id: Array.isArray(context.message_id) ? 0 : context.message_id,
  };
  // console.log('message_id: ', context.message_id);

  let origin_msg = message;
  let info = '';
  const step = context.PROCESS_INFO?.STEP.split('/') || [0, 0];
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    info = context.MIDDLE_INFO?.TEMP_INFO.trim() || '';
    if (step[0] < step[1] && !ENV.HIDE_MIDDLE_MESSAGE) {
      chatContext.parse_mode = null;
      message = info + ' \n\n' + escape(origin_msg);
      chatContext.entities = [
        { type: 'code', offset: 0, length: message.length },
        { type: 'blockquote', offset: 0, length: message.length },
      ]
    } else if (parse_mode === 'MarkdownV2' && chatContext?.MIDDLE_INFO?.TEMP_INFO) {
      message = '>`' + info + '` \n\n\n' + escape(origin_msg);
    } else if (parse_mode === 'MarkdownV2') {
      // chatContext.parse_mode = null;
      message = escape(origin_msg);
    } else {
      message = (info) ? (info + ' \n\n' + origin_msg) : origin_msg;
    }
    if (parse_mode !== 'MarkdownV2' && context?.MIDDLE_INFO?.TEMP_INFO) {
      chatContext.entities = [
        { type: 'code', offset: 0, length: info.length },
        { type: 'blockquote', offset: 0, length: info.length },
      ]
    }
  }
  if (message.length <= 4096) {
    escapeContent();
    let resp = await sendMessage(message, token, chatContext);
    if (resp.status === 200) {
      return resp;
    } else {
      chatContext.parse_mode = null;
      context.parse_mode = null;
      escapeContent();
      resp = await sendMessage(message, token, chatContext)
      if (resp.status !== 200) {
        chatContext.entities = []
        return await sendMessage(message, token, chatContext);
      }
      console.log('sec request ok')
      return resp;
    }
  }
  const limit = 4096;
  chatContext.parse_mode = null;
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
    // 当隐藏INFO与TOKEN信息，跳过二次发送头部消息，防止bad request
    if ((msgIndex == 1 && context.message_id.length > 1 && !ENV.ENABLE_SHOWINFO && !ENV.ENABLE_SHOWTOKENINFO)) {
      continue;
    }

    const msg = message.slice(i, Math.min(i + limit, message.length));
    chatContext.entities[1].length = msg.length;
    chatContext.entities[0].length = msgIndex == 1 ? info.length : 0;


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
 *
 * @param {Context} context
 * @return {function(string): Promise<Response>}
 */
export function sendMessageToTelegramWithContext(context) {
  return async (message) => {
    return sendMessageToTelegram(message, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT);
  };
}

/**
 *
 * @param {Context} context
 * @return {function(string): Promise<Response>}
 */
export function deleteMessageFromTelegramWithContext(context) {
  return async (messageId) => {
    return await fetchWithRetry(
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
 * @param {object} context
 * @return {Promise<Response>}
 */
export async function sendPhotoToTelegram(photo, token, context) {
  const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
  let body = null;
  const headers = {};
  if (typeof photo === 'string') {
    body = {
      photo: photo,
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== undefined && context[key] !== null && ['MIDDLE_INFO', 'PROCESS'].indexOf(key) < 0) {
        body[key] = context[key];
      }
    }
    // let info = '>' + (context.MIDDLE_INFO.TEMP_INFO).replace('\n', '\n>');
    // info = escape(info, 'info');
    body.parse_mode = 'MarkdownV2';
    let info = '>' + context?.PROCESS_INFO?.['MODEL'] + '\n' + context.MIDDLE_INFO.TEXT + '\n' ;
    body.caption = escape(info) + `[原始图片](${photo})`;
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  } else {
    body = new FormData();
    body.append('photo', photo, 'photo.png');
    for (const key of Object.keys(context)) {
      if (context[key] !== undefined && context[key] !== null && ['MIDDLE_INFO', 'PROCESS'].indexOf(key) < 0) {
        body.append(key, `${context[key]}`);
      }
    }
  }
  const option = {
    method: 'POST',
    headers,
    body,
  };
  const resp = await fetchWithRetry(url, option);
  if (resp.status === 400) {
    console.log(await resp.text())
    body = JSON.parse(body);
    delete body.parse_mode;
    option.body = JSON.stringify(body);
    return fetchWithRetry(url, option);
  }
  return resp;
}


/**
 *
 * @param {Context} context
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
 *
 * @param {Context} context
 * @return {function(string): Promise<Response>}
 */
export function sendChatActionToTelegramWithContext(context) {
  return (action) => {
    return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id);
  };
}

/**
 *
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

// 判断是否为群组管理员
/**
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
    groupAdmin = JSON.parse(await DATABASE.get(groupAdminKey)||'[]');
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
 * @param {Context} context
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
    const resp = await fetchWithRetry(
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
  const resp = await fetchWithRetry(
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
 *  获取voice信息
 * @param {string} file_id
 * @param {string} token
 * @return {Promise<Response}
 */
export async function getFileInfo(file_id, token) {
  const data = await fetchWithRetry(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());
  if (data.ok) {
    return data.result;
  }
  return data;
}

/**
 * 获取TG文件
 * @param {string} filePath
 * @param {string} token
 * @return {Promise<Response>}
 */
export async function getFile(fullPath) {
  return fetchWithRetry(fullPath);
}