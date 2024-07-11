/* eslint-disable no-unused-vars */
import {Context} from './context.js';
import {CONST, CUSTOM_COMMAND, DATABASE, ENV} from './env.js';
import {mergeConfig, fetchWithRetry, CUSTOM_TINFO} from './utils.js';
import {
  getChatRoleWithContext,
  sendChatActionToTelegramWithContext,
  sendLoadingMessageToTelegramWithContext,
  sendMessageToTelegramWithContext,
  sendPhotoToTelegramWithContext,
} from './telegram.js';
import { chatWithLLM, loadImageGen } from './llm.js';
import { requestReverseChatListOrHistory } from "./openai.js";


const commandAuthCheck = {
  default: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      return ['administrator', 'creator'];
    }
    return false;
  },
  shareModeGroup: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      // 每个人在群里有上下文的时候，不限制
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE) {
        return false;
      }
      return ['administrator', 'creator'];
    }
    return false;
  },
};


const commandSortList = [
  '/new',
  '/redo',
  '/img',
  '/role',
  '/setenv',
  '/delenv',
  '/version',
  '/usage',
  '/system',
  '/help',
  '/mode',
];

const commandSortListNew = [
  '/new',
  '/setenv',
  '/delenv',
  '/chatlist',
  '/history',
  '/setid',
  '/setalias',
  '/refreshchatlist',
  '/system',
  '/help',
]

// 命令绑定
const commandHandlers = {
  '/help': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandGetHelp,
  },
  '/new': {
    scopes: ['all_private_chats', 'all_group_chats', 'all_chat_administrators'],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/start': {
    scopes: [],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.default,
  },
  '/img': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandGenerateImg,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/version': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandFetchUpdate,
    needAuth: commandAuthCheck.default,
  },
  '/setenv': {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/setenvs': {
    scopes: [],
    fn: commandUpdateUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/delenv': {
    scopes: [],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/clearenv': {
    scopes: [],
    fn: commandClearUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/usage': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandUsage,
    needAuth: commandAuthCheck.default,
  },
  '/system': {
    scopes: ['all_private_chats', 'all_chat_administrators'],
    fn: commandSystem,
    needAuth: commandAuthCheck.default,
  },
  '/role': {
    scopes: ['all_private_chats'],
    fn: commandUpdateRole,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/redo': {
    scopes: ['all_private_chats', 'all_group_chats', 'all_chat_administrators'],
    fn: commandRegenerate,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/mode': {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
};

const commandHandlersNew = {
  '/new': {
    scopes: ['all_private_chats'],
    fn: commandReverseNewChat,
    needAuth: commandAuthCheck.default,
  },
  '/setenv': {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/setenvs': {
    scopes: [],
    fn: commandUpdateUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/delenv': {
    scopes: [],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup,
  },
  '/chatlist': {
    scopes: ['all_private_chats'],
    fn: commandGetChatList,
    needAuth: commandAuthCheck.default,
  },
  '/history': {
    scopes: ['all_private_chats'],
    fn: commandReverseHistory,
    needAuth: commandAuthCheck.default,
  },
  '/system': {
    scopes: ['all_private_chats'],
    fn: commandSystemNew,
    needAuth: commandAuthCheck.default,
  },
  '/setid': {
    scopes: ['all_private_chats'],
    fn: commandSetId,
    needAuth: commandAuthCheck.default,
  },
  '/help': {
    scopes: ['all_private_chats'],
    fn: commandGetHelp,
  },
  '/setalias': {
    scopes: ['all_private_chats'],
    needAuth: commandAuthCheck.default,
    fn: commandSetChatAlias,
  },
  '/refreshchatlist': {
    scopes: ['all_private_chats'],
    fn: commandRefreshChatList,
    needAuth: commandAuthCheck.default,
  },
};

/**
 * /role 命令
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandUpdateRole(message, command, subcommand, context) {
  // 显示
  if (subcommand==='show') {
    const size = Object.getOwnPropertyNames(context.USER_DEFINE.ROLE).length;
    if (size===0) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.not_defined_any_role);
    }
    let showMsg = ENV.I18N.command.role.current_defined_role(size);
    for (const role in context.USER_DEFINE.ROLE) {
      if (Object.prototype.hasOwnProperty.call(context.USER_DEFINE.ROLE, role)) {
        showMsg+=`~${role}:\n<pre>`;
        showMsg+=JSON.stringify(context.USER_DEFINE.ROLE[role])+'\n';
        showMsg+='</pre>';
      }
    }
    context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML';
    return sendMessageToTelegramWithContext(context)(showMsg);
  }
  const kv = subcommand.indexOf(' ');
  if (kv === -1) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.help);
  }
  const role = subcommand.slice(0, kv);
  const settings = subcommand.slice(kv + 1).trim();
  const skv = settings.indexOf('=');
  if (skv === -1) {
    if (settings === 'del') { // 删除
      try {
        if (context.USER_DEFINE.ROLE[role]) {
          delete context.USER_DEFINE.ROLE[role];
          await DATABASE.put(
              context.SHARE_CONTEXT.configStoreKey,
              JSON.stringify(Object.assign(context.USER_CONFIG, {USER_DEFINE: context.USER_DEFINE})),
          );
          return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.delete_role_success);
        }
      } catch (e) {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.delete_role_error(e));
      }
    }
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.help);
  }
  const key = settings.slice(0, skv);
  const value = settings.slice(skv + 1);

  // ROLE结构定义
  if (!context.USER_DEFINE.ROLE[role]) {
    context.USER_DEFINE.ROLE[role] = {
      // 系统初始化消息
      SYSTEM_INIT_MESSAGE: ENV.SYSTEM_INIT_MESSAGE,
      // OpenAI API 额外参数
      OPENAI_API_EXTRA_PARAMS: {},
    };
  }
  try {
    mergeConfig(context.USER_DEFINE.ROLE[role], key, value);
    await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(Object.assign(context.USER_CONFIG, {USER_DEFINE: context.USER_DEFINE})),
    );
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.update_role_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.role.update_role_error(e));
  }
}

/**
 * /img 命令
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandGenerateImg(message, command, subcommand, context) {
  if (subcommand==='') {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.img.help);
  }
  try {
    setTimeout(() => sendChatActionToTelegramWithContext(context)('upload_photo').catch(console.error), 0);
    const gen = loadImageGen(context);
    if (!gen) {
      return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`);
    }
    const startTime = performance.now();
    const img = await gen(subcommand, context);
    if (typeof img === 'string') {
      const provider = (context.USER_CONFIG.AI_PROVIDER == 'auto' ? 'openai' : context.USER_CONFIG.AI_PROVIDER).toUpperCase();
      let model = 'dall-e-2';
      if (provider == 'OPENAI') {
        model = context.USER_CONFIG.DALL_E_MODEL
          + ' ' + context.USER_CONFIG.DALL_E_IMAGE_QUALITY
          + ' ' + context.USER_CONFIG.DALL_E_IMAGE_STYLE
          + ' ' + context.USER_CONFIG.DALL_E_IMAGE_SIZE;
      } else if (provider == 'WORKERS') {
        model = ENV.WORKERS_IMAGE_MODEL;
      }
      const time = ((performance.now() - startTime) / 1000).toFixed(2);
      if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO) {
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {}
      }
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = (CURRENT_CHAT_CONTEXT.MIDDLE_INFO || '') + `${model} ${time}s`;
    }
    
    return sendPhotoToTelegramWithContext(context)(img);
  } catch (e) {
    console.error(e.message);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}

/**
 * /help 获取帮助信息
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandGetHelp(message, command, subcommand, context) {
  const helpMsg =
    ENV.I18N.command.help.summary +
    '```markdown\n' +
    Object.keys(ENV.REVERSE_MODE ? commandHandlersNew : commandHandlers)
      .map((key) => `${key}：${ENV.I18N.command.help[key.substring(1)]}`)
      .join('\n') + '\n```';
  context.CURRENT_CHAT_CONTEXT.parse_mode = 'MarkdownV2';
  return sendMessageToTelegramWithContext(context)(helpMsg);
}

/**
 * /new /start 新的会话
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandCreateNewChatContext(message, command, subcommand, context) {
  try {
    await DATABASE.delete(context.SHARE_CONTEXT.chatHistoryKey);
    context.CURRENT_CHAT_CONTEXT.reply_markup=JSON.stringify({
      remove_keyboard: true,
      selective: true,
    });
    if (command === '/new') {
      if (message?.text || message.text.replace(command).trim() === '') {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.new.new_chat_start);
      }
      return null;
      
    } else {
      if (context.SHARE_CONTEXT.chatType === 'private') {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.new.new_chat_start_private(context.CURRENT_CHAT_CONTEXT.chat_id));
      } else {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.new.new_chat_start_group(context.CURRENT_CHAT_CONTEXT.chat_id));
      }
    }
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}


/**
 * /setenv 用户配置修改
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandUpdateUserConfig(message, command, subcommand, context) {
  if (command == '/mode') {
    if (subcommand == 'all') {
      const msg = `<pre>mode清单:   \n- ${Object.keys(context.USER_CONFIG.MODES).join('\n- ')}</pre>`;
      context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML';
      return sendMessageToTelegramWithContext(context)(msg);
    } else if (!subcommand) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.mode.help); 
    }
    if (!context.USER_CONFIG.MODES?.[subcommand]) {
      const msg = ENV.I18N.command.setenv.update_config_error(new Error(`mode \`${subcommand}\` not exist`));
      return sendMessageToTelegramWithContext(context)(msg);
    }
    subcommand = `CURRENT_MODE=${subcommand}`
  }
  const kv = subcommand.indexOf('=');
  if (kv === -1) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.help);
  }
  const key = subcommand.slice(0, kv).trim();
  const value = subcommand.slice(kv + 1).trim();
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
    const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${key} is locked`));
    return sendMessageToTelegramWithContext(context)(msg);
  }
  try {
    context.USER_CONFIG.DEFINE_KEYS.push(key);
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    mergeConfig(context.USER_CONFIG, key, value);
    await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(context.USER_CONFIG),
    );
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}

/**
 * /setenvs 批量用户配置修改
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandUpdateUserConfigs(message, command, subcommand, context) {
  try {
    const values = JSON.parse(subcommand);
    for (const ent of Object.entries(values)) {
      const [key, value] = ent;
      if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
        const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${key} is locked`));
        return sendMessageToTelegramWithContext(context)(msg);
      }
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      mergeConfig(context.USER_CONFIG, key, value);
      console.log(JSON.stringify(context.USER_CONFIG));
    }
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(context.USER_CONFIG),
    );
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}

/**
 * /delenv 用户配置修改
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandDeleteUserConfig(message, command, subcommand, context) {
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
    const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${subcommand} is locked`));
    return sendMessageToTelegramWithContext(context)(msg);
  }
  try {
    if (subcommand === 'all') {
      context.USER_CONFIG = new Context().USER_CONFIG;
    } else context.USER_CONFIG[subcommand] = null;
    context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
    await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(context.USER_CONFIG),
    );
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}


/**
 * /clearenv 清空用户配置
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandClearUserConfig(message, command, subcommand, context) {
  try {
    context.USER_CONFIG.DEFINE_KEYS = [];
    context.USER_CONFIG = {};
    await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify({}),
    );
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}


/**
 * /version 获得更新信息
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandFetchUpdate(message, command, subcommand, context) {
  const config = {
    headers: {
      'User-Agent': CONST.USER_AGENT,
    },
  };
  const current = {
    ts: ENV.BUILD_TIMESTAMP,
    sha: ENV.BUILD_VERSION,
  };

  const repo = `https://raw.githubusercontent.com/TBXark/ChatGPT-Telegram-Workers/${ENV.UPDATE_BRANCH}`;
  const ts = `${repo}/dist/timestamp`;
  const info = `${repo}/dist/buildinfo.json`;

  let online = await fetchWithRetry(info, config)
      .then((r) => r.json())
      .catch(() => null);
  if (!online) {
    online = await fetchWithRetry(ts, config).then((r) => r.text())
        .then((ts) => ({ts: Number(ts.trim()), sha: 'unknown'}))
        .catch(() => ({ts: 0, sha: 'unknown'}));
  }

  if (current.ts < online.ts) {
    const msg = ENV.I18N.command.version.new_version_found(current, online);
    return sendMessageToTelegramWithContext(context)(msg);
  } else {
    const msg = ENV.I18N.command.version.current_is_latest_version(current);
    return sendMessageToTelegramWithContext(context)(msg);
  }
}


/**
 * /usage 获得使用统计
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandUsage(message, command, subcommand, context) {
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.usage.usage_not_open);
  }
  const usage = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.usageKey));
  let text = ENV.I18N.command.usage.current_usage;
  if (usage?.tokens) {
    const {tokens} = usage;
    const sortedChats = Object.keys(tokens.chats || {}).sort((a, b) => tokens.chats[b] - tokens.chats[a]);

    text += ENV.I18N.command.usage.total_usage(tokens.total);
    for (let i = 0; i < Math.min(sortedChats.length, 30); i++) {
      text += `\n  - ${sortedChats[i]}: ${tokens.chats[sortedChats[i]]} tokens`;
    }
    if (sortedChats.length === 0) {
      text += '0 tokens';
    } else if (sortedChats.length > 30) {
      text += '\n  ...';
    }
  } else {
    text += ENV.I18N.command.usage.no_usage;
  }
  return sendMessageToTelegramWithContext(context)(text);
}


/**
 * /system 获得系统信息
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandSystem(message, command, subcommand, context) {
  let msg = '<pre>CHAT_MODEL: ' + context.USER_CONFIG.CHAT_MODEL + '\n';
  if (!ENV.DEV_MODE) {
  msg +=
    'AI_PROVIDER: ' +
    context.USER_CONFIG.AI_PROVIDER +
    '\n' +
    'VISION_MODEL: ' +
    context.USER_CONFIG.OPENAI_VISION_MODEL +
    '\n' +
    'STT_MODEL: ' +
    context.USER_CONFIG.OPENAI_STT_MODEL +
    '\n' +
    'DALL_E_MODEL: ' +
    context.USER_CONFIG.DALL_E_MODEL +
    ' ' +
    context.USER_CONFIG.DALL_E_IMAGE_SIZE +
    ' ' +
    context.USER_CONFIG.DALL_E_IMAGE_QUALITY +
    ' ' +
    context.USER_CONFIG.DALL_E_IMAGE_STYLE +
    '\n' +
    '---\n' +
    CUSTOM_TINFO(context.USER_CONFIG) +
    '\n';
  } else {
    const shareCtx = { ...context.SHARE_CONTEXT };
    shareCtx.currentBotToken = "******";
    context.USER_CONFIG.OPENAI_API_KEY = "******";
    context.USER_CONFIG.AZURE_API_KEY = "******";
    context.USER_CONFIG.AZURE_API_BASE = "******";
    context.USER_CONFIG.AZURE_DALLE_API = "******";
    context.USER_CONFIG.GOOGLE_API_KEY = "******";
    context.USER_CONFIG.MISTRAL_API_KEY = "******";
    delete context.USER_CONFIG.REVERSE_PERFIX;
    delete context.USER_CONFIG.REVERSE_TOKEN;
    Object.values(context.USER_CONFIG.PROVIDER_SOURCES).map((source) => {
      Object.keys(source).map((k) => (source[k] = '******'));
      return null;
    });  
    msg = `<pre>\nUSER_CONFIG: ${JSON.stringify(context.USER_CONFIG, null, 2)}
`;
    msg += `CHAT_CONTEXT: ${JSON.stringify(context.CURRENT_CHAT_CONTEXT, null, 2)}
`;
    msg += `SHARE_CONTEXT: ${JSON.stringify(shareCtx, null, 2)}
`;
  }
  msg += '</pre>';
  context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML';
  return sendMessageToTelegramWithContext(context)(msg);
}
/**
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandRegenerate(message, command, subcommand, context) {
  const mf = (history, text) => {
    const {real, original} = history;
    let nextText = text;
    if (!real || !original || real.length === 0 || original.length === 0) {
      throw new Error(ENV.I18N.message.history_empty);
    }
    while (true) {
      const data = real.pop();
      original.pop();
      if (data === undefined || data === null) {
        break;
      } else if (data.role === 'user') {
        if (text === '' || text === undefined || text === null) {
          nextText = data.content;
        }
        break;
      }
    }
    if (subcommand) {
      nextText = subcommand;
    }
    return {history: {real, original}, text: nextText};
  };
  return chatWithLLM(null, context, mf);
}

/**
 * /echo 回显消息
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandEcho(message, command, subcommand, context) {
  let msg = '<pre>';
  msg += JSON.stringify({message}, null, 2);
  msg += '</pre>';
  context.CURRENT_CHAT_CONTEXT.parse_mode = 'HTML';
  return sendMessageToTelegramWithContext(context)(msg);
}

/**
 * 处理命令消息
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function handleCommandMessage(message, context) {
  if (!message.text) {
    return null;
  }
  if (ENV.DEV_MODE) {
    commandHandlers['/echo'] = {
      help: '[DEBUG ONLY] echo message',
      scopes: ['all_private_chats', 'all_chat_administrators'],
      fn: commandEcho,
      needAuth: commandAuthCheck.default,
    };
  }
  // if (CUSTOM_COMMAND[message.text]) {
  //   message.text = CUSTOM_COMMAND[message.text];
  // }

  if (context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL) {
    return null;
  }

  const customKey = Object.keys(CUSTOM_COMMAND).find(k => message.text.startsWith(k));
  if (customKey) {
    message.text = message.text.replace(customKey, CUSTOM_COMMAND[customKey]);
  }
  const commandSelect = ENV.REVERSE_MODE ? commandHandlersNew : commandHandlers;
  const msgRegExp = /^.*?[!！]/;
  const commandMsg = msgRegExp.exec(message.text)?.[0].slice(0,-1) || message.text;
  const otherMsg = message.text.substring(commandMsg.length + 1);
  
  for (const key in commandSelect) {
    if (commandMsg === key || commandMsg.startsWith(key + ' ') || commandMsg.startsWith(key + `@${context.SHARE_CONTEXT.currentBotName}`)) {
      const command = commandSelect[key];
      try {
        // 如果存在权限条件
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType);
          if (roleList) {
            // 获取身份并判断
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId);
            if (chatRole === null) {
              return sendMessageToTelegramWithContext(context)(ENV.I18N.command.permission.not_authorized);
            }
            if (!roleList.includes(chatRole)) {
              const msg = ENV.I18N.command.permission.not_enough_permission(roleList, chatRole);
              return sendMessageToTelegramWithContext(context)(msg);
            }
          }
        }
      } catch (e) {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.permission.role_error(e));
      }
      const subcommand = commandMsg.substring(key.length).trim();
      try {
        const result = await command.fn(message, key, subcommand, context);
        console.log('[DONE] Command: ' + key + ' ' + subcommand);
        if (!otherMsg) {
          return result;
        }
        message.text = otherMsg;
        break;
      } catch (e) {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.command.permission.command_error(e));
      }
    }
  }
  // 除命令外, 以 / 开头 的文本不再处理
  if (message.text.startsWith('/')) {
    return sendMessageToTelegramWithContext(context)(`Oops! It's not a command.`);
  }
  return null;
}

/**
 *
 * @param {string} token
 * @return {Promise<{result: {}, ok: boolean}>}
 */
export async function bindCommandForTelegram(token) {
  const scopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: [],
  };
  const commands = ENV.REVERSE_MODE ? commandSortListNew: commandSortList;
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    commands.splice(commands.indexOf('/usage'), 1);
  }
  const commandHandlersSelect =  ENV.REVERSE_MODE ? commandHandlersNew: commandHandlers;
  for (const key of commands) {
    if (ENV.HIDE_COMMAND_BUTTONS.includes(key)) {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(commandHandlersSelect, key) && commandHandlersSelect[key].scopes) {
      for (const scope of commandHandlersSelect[key].scopes) {
        if (!scopeCommandMap[scope]) {
          scopeCommandMap[scope] = [];
        }
        scopeCommandMap[scope].push(key);
      }
    }
  }

  const result = {};
  for (const scope in scopeCommandMap) {  
    result[scope] = await fetch(
        `https://api.telegram.org/bot${token}/setMyCommands`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commands: scopeCommandMap[scope].map((command) => ({
              command,
              description: ENV.I18N.command.help[command.substring(1)] || '',
            })),
            scope: {
              type: scope,
            },
          }),
        },
    ).then((res) => res.json());
    
  }
  // console.log('--------')
  // console.log(`${JSON.stringify(result,null, 2)}`)
  return {ok: true, result: result};
}

/**
 * 获取所有命令的描述
 * @return {{description: *, command: *}[]}
 */
export function commandsDocument() {
  return Object.keys(commandHandlers).map((key) => {
    return {
      command: key,
      description: ENV.I18N.command.help[key.substring(1)],
    };
  });
}

/**
 * /chatList 查询缓存中已有对话
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandGetChatList(message, command, subcommand, context) {
  const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
  try {
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || '{}');
    if (Object.keys(reverseChatInfo).length === 0) {
      await loadingPromise;
      return sendMessageToTelegramWithContext(context)(ENV.I18N.message.refreshchatlist); 
    }
    let conversation_id = context.REVERSE_CONTEXT.conversation_id;
    context.CURRENT_CHAT_CONTEXT.parse_mode = 'MarkdownV2';
    let formatData = Object.entries(reverseChatInfo).map(
      ([k, { title, update_time, alias }], i) => `${i}. ${title || '-'}\n`
        + (update_time ? `update time: ${update_time.substring(0, 19)}\n` : '')
        + (alias ? `- alias: ${alias}\n` : '')
        // + `\n${k}`,
    );
    
    const { alias , title = '-', update_time } = reverseChatInfo?.[conversation_id] ?? {};
    formatData = '```\n'
      + '当前对话:\n'
      + (title ? `title: ${title} ` : '- ')
      + (update_time ? `\nupdate time: ${update_time.substring(0, 19)}\n` : '\n')
      + `id: ${conversation_id || null}\n`
      + (alias? `alias: ${alias}\n\n`: '\n')
      + formatData.join('\n') + '\n```'
    await loadingPromise;
    return sendMessageToTelegramWithContext(context)(formatData);
  } catch (e) {
    await loadingPromise;
    return sendMessageToTelegramWithContext(context)(e.message);
  }
}

/**
 * /refreshchatlist 刷新对话列表
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandRefreshChatList(message, command, subcommand, context) {
  try {
    const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || '{}');
    const chatListData = await requestReverseChatListOrHistory(context, 'list', 25);
    if (!chatListData.items || chatListData?.items?.length === 0) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.message.chatlist_not_found);
    }
    chatListData?.items?.forEach(({ id, title, update_time, create_time }) => {
      reverseChatInfo[id] = {
        ...(reverseChatInfo[id] || {}),
        title,
        // parent_message_id: '',
        // id: i.id,
        // alias: '',
        update_time,
        create_time,
        // is_archived: i.is_archived,
      };
    });
    reverseChatInfo = Object.fromEntries(
      Object.entries(reverseChatInfo)
        .sort(([, a], [, b]) => new Date(b.update_time) - new Date(a.update_time))
        .slice(0, 25),
    );
    
    await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(reverseChatInfo));
    await loadingPromise;
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.refreshchatlist.refresh_success(chatListData.items.length));
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(e.message);
  }
}


/**
 * /history 查询当前对话历史记录并重置最新parent_id
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandReverseHistory(message, command, subcommand, context) {
  const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
  try {
    const conversation_id = context.REVERSE_CONTEXT.conversation_id;
    if (!conversation_id || conversation_id === ':new:') {
      await loadingPromise;
      return sendMessageToTelegramWithContext(context)(ENV.I18N.message.new_chat_or_id_is_empty);
    }

    const detail = await requestReverseChatListOrHistory(context, 'detail');
    const parent_message_id = detail?.current_node || '';
    const reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || '{}');
    if (parent_message_id && parent_message_id !== context.REVERSE_CONTEXT.parent_message_id) {
      reverseChatInfo[conversation_id].parent_message_id = parent_message_id;
      context.REVERSE_CONTEXT.parent_message_id = parent_message_id;
      await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
      await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(reverseChatInfo));
    } else if (!parent_message_id) {
      await loadingPromise;
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.history.query_error);
    }
    function toDateTime(timestamp) {
      const date = new Date(timestamp);
      const options = { timeZone: 'Asia/Shanghai', hour12: false };
      return date.toLocaleString('zh-CN', options) // + ' (UTC+8)'
    }
    
    let filterData = Object.values(detail.mapping)
      .filter(({ message }) => (
        message?.author?.name !== 'browser') && 
        ('text' === message?.content?.content_type) &&
        message.content.parts.join(''))
      .sort((a,b) => a.message.create_time - b.message.create_time)
      .slice(-10)
      .map(({ message: { author: { role }, content:{parts}, create_time } }) => {
        role = role === 'user' ? 'you' : 'gpt';
        return `${role} [${toDateTime(create_time * 1e3)}]:\n` + `${parts.join('\n')}\n`;
      })
      .join('-'.repeat(36) + '\n');
    
    filterData = '```markdown\nLatest 10 messages:\n\n' + filterData + '```\n';
    await loadingPromise;
    return sendMessageToTelegramWithContext(context)(filterData);
  } catch (e) {
    await loadingPromise;
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}


/**
 * /new 开启新的聊天
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandReverseNewChat(message, command, subcommand, context) {
  try {
    context.REVERSE_CONTEXT = { conversation_id: ':new:', parent_message_id: '' }
    await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}


/**
 * /setid 设置对话ID
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandSetId(message, command, subcommand, context) {
  try {
    subcommand = subcommand.trim();
    const idIndexreg = /^\d+$/;
    const idAliasReg = /^\S+$/;
    const idReg = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || '{}');
    let message = '';
    if (idIndexreg.test(subcommand)) {
      if (Object.keys(reverseChatInfo).length === 0) {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.message.history_empty);
      }
      if (subcommand > Object.keys(reverseChatInfo).length - 1 || subcommand < 0) {
        message = ENV.I18N.command.setid.out_of_range(Object.keys(reverseChatInfo).length);
      }
      const dataList = Object.entries(reverseChatInfo);
      context.REVERSE_CONTEXT = {
        conversation_id: dataList[subcommand][0],
        parent_message_id: dataList[subcommand][1].parent_message_id,
      };
    } else if (idReg.test(subcommand)) {
      context.REVERSE_CONTEXT = {
        conversation_id: subcommand,
        parent_id: reverseChatInfo[subcommand].parent_message_id,
      };
    } else if (idAliasReg.test(subcommand)) {
      const conversation_id = Object.keys(reverseChatInfo).find((key) => reverseChatInfo[key].alias === subcommand);
      if (conversation_id) {
        context.REVERSE_CONTEXT = {
          conversation_id,
          parent_message_id: reverseChatInfo[conversation_id].parent_message_id,
        };
      } else message = ENV.I18N.commond.setid.alias_not_found(subcommand);
    } else message = ENV.I18N.command.setid.help;
    if (message) {
      return sendMessageToTelegramWithContext(context)(message);
    } else {
      await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
    }
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}

/**
 * /setChatAlias 设置对话Alias
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandSetChatAlias(message, command, subcommand, context) {
  try {
    const idAndAliasregex = /^\s*(\d+)\s*(\S+)$/;
    const result = subcommand.match(idAndAliasregex);
    if (result?.[1] && result?.[2]) {
      let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || '{}');
      if (Object.keys(reverseChatInfo).length === 0) {
        return sendMessageToTelegramWithContext(context)(ENV.I18N.message.refreshchatlist); 
      }
      if (result[1] > Object.keys(reverseChatInfo).length) {
        throw new Error(`Error: index need smaller than ${Object.keys(reverseChatInfo).length}`);
      }
      const dataList = Object.entries(reverseChatInfo);
      dataList[result[1]][1].alias = result[2];
      await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(Object.fromEntries(dataList)));
    } else return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setalias.help);
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}


/**
 * /system REVERSE_MODE 下查询当前信息
 *
 * @param {TelegramMessage} message
 * @param {string} command
 * @param {string} subcommand
 * @param {Context} context
 * @return {Promise<Response>}
 */
async function commandSystemNew(message, command, subcommand, context) {
  try {
    let msg =
      `\`\`\`markdown\nREVERSE_PERFIX: ${context.USER_CONFIG.REVERSE_PERFIX}` +
      `\nREVERSE_TOKEN: ${context.USER_CONFIG.REVERSE_TOKEN ? '******' : 'null'}` +
      `\nCHAT_MODEL: ${context.USER_CONFIG.CHAT_MODEL}` +
      `\n\nREVERSE_CHAT: ${JSON.stringify(context.REVERSE_CONTEXT, null, 2)}` +
      '\n\`\`\`';
    context.CURRENT_CHAT_CONTEXT.parse_mode = 'MarkdownV2';
    return sendMessageToTelegramWithContext(context)(msg);
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}