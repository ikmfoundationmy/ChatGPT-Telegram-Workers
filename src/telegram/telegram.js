import {DATABASE, ENV, CONST} from '../config/env.js';
import { escape } from "../utils/md2tgmd.js";
import { uploadImageToTelegraph } from "../utils/image.js";
import "../types/context.js";

/**
 * @param {string} message
 * @param {string} token
 * @param {object} context
 * @returns {Promise<Response>}
 */
async function sendMessage(message, token, context) {
  try {
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
    return await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error(e);
  }
}


/**
 * @param {string} message
 * @param {string} token
 * @param {CurrentChatContextType} context
 * @returns {Promise<Response>}
 */
export async function sendMessageToTelegram(message, token, context, _info, type) {
  // console.log('send message', message);
  const chatContext = {
    ...context,
    message_id: Array.isArray(context.message_id) ? 0 : context.message_id,
  };
  const limit = 4000;
  let origin_msg = message;
  let info = '';
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    if (!_info || _info?.steps?.length === 0 || type === 'tip') return;
    info = _info.is_concurrent ? '' : _info.step?.message_title || '';
    if (!_info.isLastStep && _info.steps.length !== 0 && parse_mode !== null || _info.is_concurrent || origin_msg.length > limit) {
      chatContext.parse_mode = null;
      message = (info && ( info + '\n\n' )) + origin_msg;
      chatContext.entities = [
        { type: 'code', offset: 0, length: message.length },
        { type: 'blockquote', offset: 0, length: message.length },
      ];
    } else if (parse_mode === 'MarkdownV2') {
      info &&= ( '>`' + info + '`\n\n' );
      message = info + escape(origin_msg);
    } else if (parse_mode === null) {
      message = (info && ( info + '\n' )) + origin_msg;
      chatContext.entities = [
        { type: 'code', offset: 0, length: info.length },
        { type: 'blockquote', offset: 0, length: info.length },
      ];
    }
  };
  if (message.length <= limit) {
    escapeContent();
    let resp = await sendMessage(message, token, chatContext);
    if (resp.status === 200) {
      return resp;
    } else {
      chatContext.parse_mode = null;
      context.parse_mode = null;
      info = _info?.message_title;
      message = info ? info + '\n\n' + origin_msg : origin_msg;
      // chatContext.entities = [
      //   { type: 'code', offset: 0, length: message.length },
      //   { type: 'blockquote', offset: 0, length: message.length },
      // ];
      return await sendMessage(message, token, chatContext);
    }
  }
  chatContext.parse_mode = null;
  info = _info?.message_title;
  message = info && (info + '\n\n' ) + origin_msg;
  if (!Array.isArray(context.message_id)) {
    context.message_id = [context.message_id];
  }
  let msgIndex = 0;
  let last_resp = null;

  for (let i = 0; i < message.length; i += limit) {
    chatContext.message_id = context.message_id[msgIndex];
    msgIndex += 1;

    // 跳过二次发送中间消息，防止bad request
    if (msgIndex > 1 && context.message_id[msgIndex] && i + limit < message.length) {
      // msgIndex < (Math.ceil(message.length / limit) - 1)
      continue;
    }
    // 当隐藏INFO与TOKEN信息，跳过二次发送头部消息
    if (msgIndex == 1 && context.message_id.length > 1 && !context.USER_CONFIG.ENABLE_SHOWINFO && !context.USER_CONFIG.ENABLE_SHOWTOKEN) {
      continue;
    }

    const msg = message.slice(i, Math.min(i + limit, message.length));
    chatContext.entities = [
      { type: 'code', offset: 0, length: msg.length },
      { type: 'blockquote', offset: 0, length: msg.length },
    ];

    let resp = await sendMessage(msg, token, chatContext);
    if (resp.status == 429) {
      return resp;
    } else if (resp.status !== 200) {
      console.log(`[ERROR] ${await resp.text()}`);
    }
    if (msgIndex == 1) {
      continue;
    }
    if (!chatContext.message_id && resp.status == 200) {
      last_resp = resp.clone();
      const message_id = (await resp.json()).result?.message_id;
      context.message_id.push(message_id);
    }
  }
  return last_resp;
}

/**
 * @param {ContextType} context
 * @returns {function(string): Promise<Response>}
 */
export function sendMessageToTelegramWithContext(context) {
  return async (message, msgType = 'chat') => {
    const resp = await sendMessageToTelegram(
      message,
      context.SHARE_CONTEXT.currentBotToken,
      context.CURRENT_CHAT_CONTEXT,
      context._info,
      msgType,
    );
    if (!resp.ok) {
      console.error(await resp.clone().text());
      return resp;
    }
    await checkIsNeedTagIds(context, msgType, resp);
    return resp;
  };
}



/**
 * @param {ContextType} context
 * @returns {function(string): Promise<Response>}
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

export async function deleteMessagesFromTelegram(chat_id, bot_token,  message_ids) {
  return await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${bot_token}/deleteMessages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id,
        message_ids,
      }),
    },
  ).then(r => r.json());

}


/**
 * 发送图片消息到Telegram
 * @param {string | Blob} photo
 * @param {string} token
 * @param {CurrentChatContextType} context
 * @returns {Promise<Response>}
 */
export async function sendPhotoToTelegram(photo, token, context, _info = null) {
  try {
    let photo_url = photo.url[0];
    const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
    let body;
    const headers = {};
    if (typeof photo_url === 'string') {
      if (ENV.TELEGRAPH_IMAGE_ENABLE) {
        try {
          photo_url = await uploadImageToTelegraph(photo_url);
        } catch (e) {
          console.error(e.message);
        }
      }
      body = {
        photo: photo_url,
      };

      for (const key of Object.keys(context)) {
        if (context[key] !== undefined && context[key] !== null) {
          body[key] = context[key];
        }
      }
      body.parse_mode = 'MarkdownV2';
      let info = _info?.step?.message_title || '';

      if (photo.text) {
        info = (info ? info + '\n\n' : '') + photo.text;
      }
      body.caption = '>`' + escape(info) + '`' + `\n[原始图片](${photo.url})`;
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    } else {
      body = new FormData();
      body.append('photo', photo.url, 'photo.png');
      for (const key of Object.keys(context)) {
        if (context[key] !== undefined && context[key] !== null) {
          body.append(key, `${context[key]}`);
        }
      }
    }

    return await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
  } catch (e) {
    console.error(e);
  }
}


/**
 * @param {ContextType} context
 * @returns {function(string): Promise<Response>}
 */
export function sendPhotoToTelegramWithContext(context) {
  return async (img_info, msgType = 'chat') => {
    const resp = await sendPhotoToTelegram(
      img_info,
      context.SHARE_CONTEXT.currentBotToken,
      context.CURRENT_CHAT_CONTEXT,
      context._info,
    );
    if (!resp.ok) {
      console.error(await resp.clone().text());
      return resp;
    }
    await checkIsNeedTagIds(context, msgType, resp);
    return resp;
  };
}

/**
 * 发送包含多个文件链接的消息到Telegram
 * @param {string | Blob} photo
 * @param {string} token
 * @param {CurrentChatContextType} context
 * @returns {Promise<Response>}
 */
export async function sendMediaGroupToTelegram(mediaGroup, token, context, _info) {
  const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendMediaGroup`;
  const supported_type = ['photo', 'audio', 'document', 'video'];
  const media_type = mediaGroup.type;

  if (!supported_type.includes(media_type)) {
    throw new Error(`unsupported media type: ${mediaGroup.type}`);
  }

  const body = {
    media: mediaGroup.url.map((i) => ({ type: media_type, media: i })),
    chat_id: context.chat_id,
  };
  // if (context.reply_to_message_id) {
  //   body.reply_parameters = {
  //     message_id: context.reply_to_message_id,
  //     chat_id: context.chat_id
  //   }
  // }

  let info = _info?.step.message_title;
  if (mediaGroup.text) {
    info += '\n\n' + mediaGroup.text;
  }

  body.media[0].caption = info;
  body.media[0].caption_entities = [
    { type: 'code', offset: 0, length: info.length },
    { type: 'blockquote', offset: 0, length: info.length },
  ];

  const headers = {
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}


/**
 * @param {ContextType} context
 * @returns {function(string): Promise<Response>}
 */
export function sendMediaGroupToTelegramWithContext(context) {
  return async (mediaGroup, msgType = 'chat') => {
    const resp = await sendMediaGroupToTelegram(
      mediaGroup,
      context.SHARE_CONTEXT.currentBotToken,
      context.CURRENT_CHAT_CONTEXT,
      context._info,
    );
    await checkIsNeedTagIds(context, msgType, resp);
    return resp;
  };
}


/**
 * 发送聊天动作到TG
 * @param {string} action
 * @param {string} token
 * @param {string | number} chatId
 * @returns {Promise<Response>}
 */
export async function sendChatActionToTelegram(action, token, chatId) {
    return await fetch(
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
 * @returns {function(string): Promise<Response>}
 */
export function sendChatActionToTelegramWithContext(context) {
    return (action) => {
        return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id);
    };
}

/**
 * @param {string} token
 * @param {string} url
 * @returns {Promise<Response>}
 */
export async function bindTelegramWebHook(token, url) {
    return await fetch(
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
 * @param {string | number} id
 * @param {string} groupAdminKey
 * @param {string | number} chatId
 * @param {string} token
 * @returns {Promise<string>}
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
 * @param {ContextType} context
 * @returns {function(*): Promise<string>}
 */
export function getChatRoleWithContext(context) {
    return (id) => {
        return getChatRole(id, context.SHARE_CONTEXT.groupAdminKey, context.CURRENT_CHAT_CONTEXT.chat_id, context.SHARE_CONTEXT.currentBotToken);
    };
}

/**
 * 获取群组管理员信息
 * @param {string | number} chatId
 * @param {string} token
 * @returns {Promise<object>}
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
 * @returns {Promise<BotInfo>}
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
 * @return {Promise<string>}
 */
export async function getFileUrl(file_id, token) {
  try {
    const resp = await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json());
    if (resp.ok && resp.result.file_path) {
      return `${ENV.TELEGRAM_API_DOMAIN}/file/bot${token}/${resp.result.file_path}`;
    }
    return '';
  } catch (e) {
    console.error(e);
    return '';
  }
}


/**
 * @description: 标记消息id
 * @param {*} context
 * @param {*} msgType
 * @param {*} resp
 * @return {*}
 */
async function checkIsNeedTagIds(context, msgType, resp) {
  const { sentMessageIds, chatType } = context.SHARE_CONTEXT;
  if (sentMessageIds) {
    const clone_resp = await resp.clone().json();
    if (!clone_resp.result?.message_id) {
      console.error(JSON.stringify(clone_resp));
      return
    };
    // 标记消息id
    if (
      !sentMessageIds.has(clone_resp.result.message_id) &&
      ((CONST.GROUP_TYPES.includes(chatType) && ENV.SCHEDULE_GROUP_DELETE_TYPE.includes(msgType)) ||
        (CONST.PRIVATE_TYPES.includes(chatType) && ENV.SCHEDULE_PRIVATE_DELETE_TYPE.includes(msgType)))
    ) {
      sentMessageIds.add(clone_resp.result.message_id);
      if (msgType === 'tip' && !CONST.GROUP_TYPES.includes(chatType)) {
        // 删除发送人的消息
        sentMessageIds.add(context.SHARE_CONTEXT.messageId);
      }
    }
  }
}
  
