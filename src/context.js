import {CONST, DATABASE, ENV} from './env.js';
 
import './type.js';


/**
 * @param {object} target - The target object.
 * @param {object} source - The source object.
 * @param {Array<string>} keys - The keys to merge.
 */
function mergeObject(target, source, keys) {
  if (Object.keys(target).length === 0) {
    if (Object.keys(source).length === 0) return;
    for (const key of Object.keys(source)) {
      if (typeof source[key] === 'object') {
        target[key] = Object.entries(source[key]).reduce((acc, [k, v]) => {
          if (keys.includes(k)) acc[k] = v;
          return acc;
        }, {});
      } else if (keys.includes(key)) {
        target[key] = source[key];
      }
    }
    return;
  }
  for (const key of Object.keys(target)) {
    if (!source?.[key]) continue;
    if (keys !== null && !keys.includes(key)) continue;
    if (typeof source[key] === typeof target[key]) {
      target[key] = source[key];
    }
  }
}




/**
 * 上下文信息
 */
export class Context {
  // 用户配置
  USER_CONFIG = {
    // 自定义的配置的Key
    DEFINE_KEYS: [],

    // AI提供商
    AI_PROVIDER: ENV.AI_PROVIDER,
    // AI图片提供商
    AI_IMAGE_PROVIDER: ENV.AI_IMAGE_PROVIDER,

    // 聊天模型
    CHAT_MODEL: ENV.CHAT_MODEL,
    // 语音识别模型
    OPENAI_STT_MODEL: ENV.OPENAI_STT_MODEL,
    // 文字生成语音模型
    OPENAI_TTS_MODEL: ENV.OPENAI_TTS_MODEL,
    // 图像识别模型
    OPENAI_VISION_MODEL: ENV.OPENAI_VISION_MODEL,
    // OenAI API Key
    OPENAI_API_KEY: '',
    // OpenAI API BASE
    OPENAI_API_BASE: ENV.OPENAI_API_BASE,
    // OpenAI API 额外参数
    OPENAI_API_EXTRA_PARAMS: {},
    // OpenAI Speech to text额外参数
    OPENAI_STT_EXTRA_PARAMS: {},
    // 系统初始化消息
    SYSTEM_INIT_MESSAGE: ENV.SYSTEM_INIT_MESSAGE,

    // DALL-E的模型名称
    DALL_E_MODEL: ENV.DALL_E_MODEL,
    // DALL-E图片尺寸
    DALL_E_IMAGE_SIZE: ENV.DALL_E_IMAGE_SIZE,
    // DALL-E图片质量
    DALL_E_IMAGE_QUALITY: ENV.DALL_E_IMAGE_QUALITY,
    // DALL-E图片风格
    DALL_E_IMAGE_STYLE: ENV.DALL_E_IMAGE_STYLE,

    // Azure API Key
    AZURE_API_KEY: ENV.AZURE_API_KEY,
    // Azure Completions API
    AZURE_API_BASE: ENV.AZURE_API_BASE,
    // Azure DALL-E API
    AZURE_DALLE_API: ENV.AZURE_DALLE_API,

    // WorkersAI聊天记录模型
    WORKERS_CHAT_MODEL: ENV.WORKERS_CHAT_MODEL,
    // WorkersAI图片模型
    WORKER_IMAGE_MODEL: ENV.WORKERS_IMAGE_MODEL,

    // Google Gemini API Key
    GOOGLE_API_KEY: ENV.GOOGLE_API_KEY,
    // Google Gemini API
    GOOGLE_COMPLETIONS_API: ENV.GOOGLE_API_BASE || ENV.GOOGLE_COMPLETIONS_API,
    // Google Gemini Model
    GOOGLE_CHAT_MODEL: ENV.GOOGLE_CHAT_MODEL,

    EXTRA_TINFO: ENV.EXTRA_TINFO,
    /*
    MODEL_CONCISE: ENV.MODEL_CONCISE || {
      'gpt-4o*': 'gpt-4o',
      'gpt-4-turbo*': 'gpt 4 turbo',
      'gpt-4-32k*': 'gpt 4 32k',
      'gpt-4-vision*': 'gpt vision',
      'gpt-4*': 'gpt 4',
      'gpt-3.5*': 'gpt 3.5',
      'claude-haiku*': 'claude haiku',
      'claude-sonnet*': 'claude sonnet',
      'claude-opus*': 'claude opus',
      'gemini-1.5-pro*': 'gemini 1.5 pro',
      'gemini-1.5-flash*': 'gemini 1.5 flash',
    },
    MODEL_LIGHTLY: MODEL => {
      // TODO
      // let MODEL_CONCISE = this.MODEL_CONCISE
    },
    */
    PROVIDER_SOURCES: {
      ...(ENV.PROVIDER_SOURCES || {}),
      // TEST: { PROXY_URL: 'https://xxxxxx', API_KEY: 'xxxxxx' },
    },

    MODES: ENV.MODES,

    CURRENT_MODE: ENV.CURRENT_MODE || 'default',

    // mistral api key
    MISTRAL_API_KEY: ENV.MISTRAL_API_KEY,
    // mistral api base
    MISTRAL_COMPLETIONS_API: ENV.MISTRAL_COMPLETIONS_API,
    // mistral api model
    MISTRAL_CHAT_MODEL: ENV.MISTRAL_CHAT_MODEL,

    REVERSE_TOKEN: ENV.REVERSE_TOKEN,
    REVERSE_PERFIX: ENV.REVERSE_PERFIX,
  };

  USER_DEFINE = {
    VALID_KEYS: ['OPENAI_API_EXTRA_PARAMS', 'SYSTEM_INIT_MESSAGE'],
    // 自定义角色
    ROLE: {},
  };

  // 当前聊天上下文
  CURRENT_CHAT_CONTEXT = {
    chat_id: null,
    reply_to_message_id: null, // 如果是群组，这个值为消息ID，否则为null
    parse_mode: 'MarkdownV2',
    message_id: null, // 编辑消息的ID
    reply_markup: null, // 回复键盘
  };

  // 共享上下文
  SHARE_CONTEXT = {
    currentBotId: null, // 当前机器人 ID
    currentBotToken: null, // 当前机器人 Token
    currentBotName: null, // 当前机器人名称: xxx_bot
    chatHistoryKey: null, // history:chat_id:bot_id:(from_id)
    chatLastMessageIDKey: null, // last_message_id:(chatHistoryKey)
    configStoreKey: null, // user_config:chat_id:bot_id:(from_id)
    groupAdminKey: null, // group_admin:group_id
    usageKey: null, // usage:bot_id
    chatType: null, // 会话场景, private/group/supergroup 等, 来源 message.chat.type
    chatId: null, // 会话 id, private 场景为发言人 id, group/supergroup 场景为群组 id
    speakerId: null, // 发言人 id
    role: null, // 角色
    extraMessageContext: null, // 额外消息上下文
    reverseHistoryKey: null, // reverse openai hstory conversation and parent id;
    reverseChatKey: null,
  };

  /**
   * @inner
   * @param {string | number} chatId
   * @param {string | number} replyToMessageId
   */
  _initChatContext(chatId, replyToMessageId) {
    this.CURRENT_CHAT_CONTEXT.chat_id = chatId;
    this.CURRENT_CHAT_CONTEXT.reply_to_message_id = replyToMessageId;
    if (replyToMessageId) {
      this.CURRENT_CHAT_CONTEXT.allow_sending_without_reply = true;
    }
  }

  //
  /**
   * 初始化用户配置
   *
   * @inner
   * @param {string} storeKey
   */
  async _initUserConfig(storeKey) {
    try {
      const userConfig = JSON.parse((await DATABASE.get(storeKey)) || '{}');
      let keys = userConfig?.DEFINE_KEYS || [];
      this.USER_CONFIG.DEFINE_KEYS = keys;
      const userDefine = 'USER_DEFINE';
      keys = keys.filter((key) => key !== userDefine);
      mergeObject(this.USER_CONFIG, userConfig, keys);
      if (userConfig?.[userDefine]) {
        mergeObject(this.USER_DEFINE.ROLE, userConfig[userDefine].ROLE, this.USER_DEFINE.VALID_KEYS);
        delete userConfig[userDefine];
      }
    } catch (e) {
      console.error(e);
    }
    {
      const aiProvider = new Set('auto,openai,azure,workers,gemini,mistral'.split(','));
      if (!aiProvider.has(this.USER_CONFIG.AI_PROVIDER)) {
        this.USER_CONFIG.AI_PROVIDER = 'auto';
      }
    }
    {
      const aiImageProvider = new Set('auto,openai,azure,workers'.split(','));
      if (!aiImageProvider.has(this.USER_CONFIG.AI_IMAGE_PROVIDER)) {
        this.USER_CONFIG.AI_IMAGE_PROVIDER = 'auto';
      }
    }
  }




  /**
   * @param {Request} request
   */
  initTelegramContext(request) {
    const { pathname } = new URL(request.url);
    const token = pathname.match(/^\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/)[1];
    const telegramIndex = ENV.TELEGRAM_AVAILABLE_TOKENS.indexOf(token);
    if (telegramIndex === -1) {
      throw new Error('Token not allowed');
    }

    this.SHARE_CONTEXT.currentBotToken = token;
    this.SHARE_CONTEXT.currentBotId = token.split(':')[0];
    if (ENV.TELEGRAM_BOT_NAME.length > telegramIndex) {
      this.SHARE_CONTEXT.currentBotName = ENV.TELEGRAM_BOT_NAME[telegramIndex];
    }
  }

  /**
   *
   * @inner
   * @param {TelegramMessage} message
   */
  async _initShareContext(message) {
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const id = message?.chat?.id;
    if (id === undefined || id === null) {
      throw new Error('Chat id not found');
    }

    /*
  message_id每次都在变的。
  私聊消息中：
    message.chat.id 是发言人id
  群组消息中：
    message.chat.id 是群id
    message.from.id 是发言人id
  没有开启群组共享模式时，要加上发言人id
   chatHistoryKey = history:chat_id:bot_id:(from_id)
   configStoreKey =  user_config:chat_id:bot_id:(from_id)
  * */

    const botId = this.SHARE_CONTEXT.currentBotId;
    let historyKey = `history:${id}`;
    let configStoreKey = `user_config:${id}`;

    // message_thread_id区分不同话题
    if (message?.chat?.is_forum && message?.is_topic_message) {
      historyKey += `:${message.message_thread_id}`;
      configStoreKey += `:${message.message_thread_id}`;
    }
    let groupAdminKey = null;

    if (botId) {
      historyKey += `:${botId}`;
      configStoreKey += `:${botId}`;
    }
    // 标记群组消息
    if (CONST.GROUP_TYPES.includes(message.chat?.type)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE && message.from.id) {
        historyKey += `:${message.from.id}`;
        configStoreKey += `:${message.from.id}`;
      }
      groupAdminKey = `group_admin:${id}`;
    }

    this.SHARE_CONTEXT.chatHistoryKey = historyKey;
    this.SHARE_CONTEXT.chatLastMessageIDKey = `last_message_id:${historyKey}`;
    this.SHARE_CONTEXT.configStoreKey = configStoreKey;
    this.SHARE_CONTEXT.groupAdminKey = groupAdminKey;

    this.SHARE_CONTEXT.chatType = message.chat?.type;
    this.SHARE_CONTEXT.chatId = message.chat.id;
    this.SHARE_CONTEXT.speakerId = message.from.id || message.chat.id;
    this.SHARE_CONTEXT.reverseHistoryKey = message?.from?.id ? `reverseHistory:${message.from.id || message.chat.id}` : '';
    this.SHARE_CONTEXT.reverseChatKey = message?.from?.id ? `reverseChatId:${message.from.id || message.chat.id}` : '';
  }

  async _initReverseContext() {
    try {
      if (ENV.REVERSE_MODE) {
        this.REVERSE_CONTEXT = JSON.parse((await DATABASE.get(this.SHARE_CONTEXT.reverseChatKey)) || '{}');
      }
      return null;
    } catch (e) {
      return new Response(errorToString(e), { status: 200 });
    }
  }

  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(message) {
    // 按顺序初始化上下文
    const chatId = message?.chat?.id;
    let replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null;
    await this._initShareContext(message);
    // console.log(this.SHARE_CONTEXT);
    // 回复提及的消息
    if (ENV.EXTRA_MESSAGE_CONTEXT && ENV.ENABLE_REPLY_TO_MENTION && CONST.GROUP_TYPES.includes(message.chat?.type) && message?.reply_to_message && this.SHARE_CONTEXT.currentBotId !== `${message?.reply_to_message?.from?.id}`) {
      replyId = message.reply_to_message.message_id;
    }
    this._initChatContext(chatId, replyId);
    // console.log(this.CURRENT_CHAT_CONTEXT);
    // 群组初始化用户配置移至handleChatType提及检测后 减少数据库的读取频率
  }
}
