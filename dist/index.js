import { Buffer } from 'node:buffer';
// src/env.js
var Environment = class {
  // -- 版本数据 --
  //
  // 当前版本
  BUILD_TIMESTAMP = 1721560800;
  // 当前版本 commit id
  BUILD_VERSION = "c496861";
  // -- 基础配置 --
  /**
   * @type {I18n | null}
   */
  I18N = null;
  // 多语言支持
  LANGUAGE = "zh-cn";
  // 检查更新的分支
  UPDATE_BRANCH = "master";
  // AI提供商: auto, openai, azure, workers, gemini, mistral
  AI_PROVIDER = "auto";
  // AI图片提供商: auto, openai, azure, workers
  AI_IMAGE_PROVIDER = "auto";
  // -- Telegram 相关 --
  //
  // Telegram API Domain
  TELEGRAM_API_DOMAIN = "https://api.telegram.org";
  // 允许访问的Telegram Token， 设置时以逗号分隔
  TELEGRAM_AVAILABLE_TOKENS = [];
  // --  权限相关 --
  //
  // 允许所有人使用
  I_AM_A_GENEROUS_PERSON = false;
  // 白名单
  CHAT_WHITE_LIST = [];
  // 用户配置
  LOCK_USER_CONFIG_KEYS = [];
  // -- 群组相关 --
  //
  // 允许访问的Telegram Token 对应的Bot Name， 设置时以逗号分隔
  TELEGRAM_BOT_NAME = [];
  // 群组白名单
  CHAT_GROUP_WHITE_LIST = [];
  // 群组机器人开关
  GROUP_CHAT_BOT_ENABLE = true;
  // 群组机器人共享模式,关闭后，一个群组只有一个会话和配置。开启的话群组的每个人都有自己的会话上下文
  GROUP_CHAT_BOT_SHARE_MODE = false;
  // -- 历史记录相关 --
  //
  // 为了避免4096字符限制，将消息删减
  AUTO_TRIM_HISTORY = true;
  // 最大历史记录长度
  MAX_HISTORY_LENGTH = 20;
  // 最大消息长度
  MAX_TOKEN_LENGTH = 2048;
  // 使用GPT3的TOKEN计数
  GPT3_TOKENS_COUNT = false;
  // GPT3计数器资源地址
  GPT3_TOKENS_COUNT_REPO = "https://raw.githubusercontent.com/tbxark-arc/GPT-3-Encoder/master";
  // -- Prompt 相关 --
  //
  // 全局默认初始化消息
  SYSTEM_INIT_MESSAGE = null;
  // 全局默认初始化消息角色
  SYSTEM_INIT_MESSAGE_ROLE = "system";
  // -- Open AI 配置 --
  //
  // OpenAI API Key
  API_KEY = [];
  // OpenAI的模型名称
  CHAT_MODEL = "gpt-3.5-turbo-0125";
  // OpenAI API Domain 可替换兼容openai api的其他服务商
  OPENAI_API_DOMAIN = "https://api.openai.com";
  // OpenAI API BASE `https://api.openai.com/v1`
  OPENAI_API_BASE = null;
  OPENAI_STT_MODEL = "whisper-1";
  OPENAI_VISION_MODEL = "gpt-4o";
  // -- DALLE 配置 --
  //
  // DALL-E的模型名称
  DALL_E_MODEL = "dall-e-2";
  // DALL-E图片尺寸
  DALL_E_IMAGE_SIZE = "512x512";
  // DALL-E图片质量
  DALL_E_IMAGE_QUALITY = "standard";
  // DALL-E图片风格
  DALL_E_IMAGE_STYLE = "vivid";
  // -- 特性开关 --
  //
  // 是否开启使用统计
  ENABLE_USAGE_STATISTICS = false;
  // 隐藏部分命令按钮
  HIDE_COMMAND_BUTTONS = ["/role"];
  // 显示快捷回复按钮
  SHOW_REPLY_BUTTON = false;
  // 额外引用消息开关
  EXTRA_MESSAGE_CONTEXT = false;
  ENABLE_REPLY_TO_MENTION = false;
  // 忽略指定文本开头的消息
  IGNORE_TEXT = "";
  // 消息中是否显示提供商, 模型等额外信息
  ENABLE_SHOWINFO = false;
  // 对话首次长时间无响应时间
  OPENAI_CHAT_TIMEOUT = 15;
  COHERE_TIMEOUT = 15;
  // 消息中是否显示token信息
  ENABLE_SHOWTOKENINFO = false;
  // 是否隐藏中间步骤
  HIDE_MIDDLE_MESSAGE = false;
  CHAT_MESSAGE_TRIGGER = {};
  // CHAT_MESSAGE_TRIGGER = { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4', ':c':'' }
  // 额外信息
  EXTRA_TINFO = "";
  MODES = {
    default: {
      text: [
        {
          // 默认TYPE为 消息类型:text
          // TYPE: 'text:text',
          // 默认来源为default 没有则为全局变量中的baselurl和apikey
          // PROVIDER_SOURCE: 'default',
          // 默认AI_PROVIDER 为 openai // 发送openai格式的请求 处理openai格式的消息
          // AI_PROVIDER: 'openai',
          // 默认模型为环境变量中的CHAT_MODEL
          // MODEL: ENV.CHAT_MODEL,
        }
      ],
      audio: [
        // 后若出现模型能直接audio:text对话 则可加上指定模型, 去掉流程中的text:text
        {
          // 默认TYPE为 消息类型:text
          // TYPE: 'audio:text',
          // PROVIDER_SOURCE: 'default',
          // AI_PROVIDER: 'openai',
          // 模型默认环境变量中的STT_MODEL
        },
        {
          TYPE: "text:text"
          // PROVIDER_SOURCE: 'default',
          // AI_PROVIDER: 'openai',
        }
      ],
      image: [
        {
          // 默认TYPE为 消息类型:text
          // TYPE: 'image:text',
          // PROVIDER_SOURCE: 'default',
          // AI_PROVIDER: 'openai',
          // 模型默认环境变量中的OPENAI_VISION_MODEL,
        }
      ]
    },
    "dall-e": {
      text: [
        {
          // 默认TYPE为 消息类型:text
          // TYPE: 'text:text',
          // PROVIDER_SOURCE: 'default',
          // AI_PROVIDER: 'openai',
        },
        {
          TYPE: "text:image"
          // PROVIDER_SOURCE: 'default',
          // AI_PROVIDER: 'openai',
          // 默认环境变量中的 DALL_E_MODEL
          // MODEL: ENV.DALL_E_MODEL,
        }
      ]
    }
  };
  CURRENT_MODE = "default";
  // 默认不开启 读取文件类型消息
  ENABLE_FILE = false;
  PROVIDER_SOURCES = {};
  REVERSE_MODE = false;
  REVERSE_TOKEN = "";
  REVERSE_PERFIX = "";
  // 是否读取图片
  LOAD_IMAGE_FILE = false;
  // -- 模式开关 --
  //
  // 使用流模式
  STREAM_MODE = true;
  // 安全模式
  SAFE_MODE = true;
  // 调试模式
  DEBUG_MODE = false;
  // 开发模式
  DEV_MODE = false;
  // -- AZURE 配置 --
  //
  // Azure API Key
  AZURE_API_KEY = null;
  // Azure Completions API
  AZURE_API_BASE = null;
  // Azure DallE API
  AZURE_DALLE_API = null;
  // Cloudflare Account ID
  CLOUDFLARE_ACCOUNT_ID = null;
  // Cloudflare Token
  CLOUDFLARE_TOKEN = null;
  // Text Generation Model
  WORKERS_CHAT_MODEL = "@cf/mistral/mistral-7b-instruct-v0.1 ";
  // Text-to-Image Model
  WORKERS_IMAGE_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  // Google Gemini API Key
  GOOGLE_API_KEY = null;
  // Google Gemini API BASE
  GOOGLE_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
  // Google Gemini Model
  GOOGLE_CHAT_MODEL = "gemini-pro";
  // mistral api key
  MISTRAL_API_KEY = null;
  // mistral api base
  MISTRAL_COMPLETIONS_API = "https://api.mistral.ai/v1/chat/completions";
  // mistral api model
  MISTRAL_CHAT_MODEL = "mistral-tiny";
  // cohere api key
  COHERE_API_KEY = "";
  // cohere api base
  COHERE_API_BASE = "https://api.cohere.com/v1";
  // cohere api model
  COHERE_CHAT_MODEL = "command-r-plus";
  COHERE_CONNECT_TRIGGER = {};
  // COHERE_CONNECT_TRIGGER = { "web-search": ['^search', '搜一下'] };
};
var ENV = new Environment();
var DATABASE = null;
var API_GUARD = null;
var CUSTOM_COMMAND = {};
var CONST = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
};
function initEnv(env, i18n2) {
  DATABASE = env.DATABASE;
  API_GUARD = env.API_GUARD;
  const envValueTypes = {
    SYSTEM_INIT_MESSAGE: "string",
    OPENAI_API_BASE: "string",
    AZURE_API_KEY: "string",
    AZURE_API_BASE: "string",
    AZURE_DALLE_API: "string",
    CLOUDFLARE_ACCOUNT_ID: "string",
    CLOUDFLARE_TOKEN: "string",
    GOOGLE_API_KEY: "string",
    GOOGLE_API_BASE: "string",
    MISTRAL_API_KEY: "string",
    COHERE_API_KEY: "string",
    PROVIDER_SOURCES: "object",
    MODES: "object"
  };
  const customCommandPrefix = "CUSTOM_COMMAND_";
  for (const key of Object.keys(env)) {
    if (key.startsWith(customCommandPrefix)) {
      const cmd = key.substring(customCommandPrefix.length);
      CUSTOM_COMMAND["/" + cmd] = env[key];
    }
  }
  for (const key of Object.keys(ENV)) {
    const t = envValueTypes[key] ? envValueTypes[key] : ENV[key] !== null ? typeof ENV[key] : "string";
    if (env[key]) {
      switch (t) {
        case "number":
          ENV[key] = parseInt(env[key]) || ENV[key];
          break;
        case "boolean":
          ENV[key] = (env[key] || "false") === "true";
          break;
        case "string":
          ENV[key] = env[key];
          break;
        case "array":
          ENV[key] = env[key].split(",");
          break;
        case "object":
          if (Array.isArray(ENV[key])) {
            ENV[key] = env[key].split(",");
          } else {
            try {
              ENV[key] = { ...ENV[key], ...JSON.parse(env[key]) };
            } catch (e) {
              console.error(e);
            }
          }
          break;
        default:
          ENV[key] = env[key];
          break;
      }
    }
  }
  {
    ENV.I18N = i18n2((ENV.LANGUAGE || "cn").toLowerCase());
    if (env.TELEGRAM_TOKEN && !ENV.TELEGRAM_AVAILABLE_TOKENS.includes(env.TELEGRAM_TOKEN)) {
      if (env.BOT_NAME && ENV.TELEGRAM_AVAILABLE_TOKENS.length === ENV.TELEGRAM_BOT_NAME.length) {
        ENV.TELEGRAM_BOT_NAME.push(env.BOT_NAME);
      }
      ENV.TELEGRAM_AVAILABLE_TOKENS.push(env.TELEGRAM_TOKEN);
    }
    if (env.WORKERS_AI_MODEL) {
      ENV.WORKERS_CHAT_MODEL = env.WORKERS_AI_MODEL;
    }
    if (!ENV.OPENAI_API_BASE) {
      ENV.OPENAI_API_BASE = `${ENV.OPENAI_API_DOMAIN}/v1`;
    }
    if (!ENV.SYSTEM_INIT_MESSAGE) {
      ENV.SYSTEM_INIT_MESSAGE = ENV.I18N?.env?.system_init_message || "You are a helpful assistant";
    }
  }
}

// src/context.js
function mergeObject(target, source, keys) {
  if (Object.keys(target).length === 0) {
    if (Object.keys(source).length === 0)
      return;
    for (const key of Object.keys(source)) {
      if (typeof source[key] === "object") {
        target[key] = Object.entries(source[key]).reduce((acc, [k, v]) => {
          if (keys.includes(k))
            acc[k] = v;
          return acc;
        }, {});
      } else if (keys.includes(key)) {
        target[key] = source[key];
      }
    }
    return;
  }
  for (const key of Object.keys(target)) {
    if (!source?.[key])
      continue;
    if (keys !== null && !keys.includes(key))
      continue;
    if (typeof source[key] === typeof target[key]) {
      target[key] = source[key];
    }
  }
}
var Context = class {
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
    OPENAI_API_KEY: "",
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
    GOOGLE_API_BASE: ENV.GOOGLE_API_BASE,
    // Google Gemini Model
    GOOGLE_CHAT_MODEL: ENV.GOOGLE_CHAT_MODEL,
    // Cohere Model
    COHERE_CHAT_MODEL: ENV.COHERE_CHAT_MODEL,
    // Cohere API Key
    COHERE_API_KEY: ENV.COHERE_API_KEY,
    // Cohere API
    COHERE_API_BASE: ENV.COHERE_API_BASE,
    COHERE_API_EXTRA_PARAMS: {},
    COHERE_CONNECT_TRIGGER: ENV.COHERE_CONNECT_TRIGGER,
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
      ...ENV.PROVIDER_SOURCES || {}
      // TEST: { PROXY_URL: 'https://xxxxxx', API_KEY: 'xxxxxx' },
    },
    MODES: ENV.MODES,
    CURRENT_MODE: ENV.CURRENT_MODE || "default",
    // mistral api key
    MISTRAL_API_KEY: ENV.MISTRAL_API_KEY,
    // mistral api base
    MISTRAL_COMPLETIONS_API: ENV.MISTRAL_COMPLETIONS_API,
    // mistral api model
    MISTRAL_CHAT_MODEL: ENV.MISTRAL_CHAT_MODEL,
    REVERSE_TOKEN: ENV.REVERSE_TOKEN,
    REVERSE_PERFIX: ENV.REVERSE_PERFIX
  };
  USER_DEFINE = {
    VALID_KEYS: ["OPENAI_API_EXTRA_PARAMS", "SYSTEM_INIT_MESSAGE"],
    // 自定义角色
    ROLE: {}
  };
  // 当前聊天上下文
  CURRENT_CHAT_CONTEXT = {
    chat_id: null,
    reply_to_message_id: null,
    // 如果是群组，这个值为消息ID，否则为null
    parse_mode: "MarkdownV2",
    message_id: null,
    // 编辑消息的ID
    reply_markup: null
    // 回复键盘
  };
  // 共享上下文
  SHARE_CONTEXT = {
    currentBotId: null,
    // 当前机器人 ID
    currentBotToken: null,
    // 当前机器人 Token
    currentBotName: null,
    // 当前机器人名称: xxx_bot
    chatHistoryKey: null,
    // history:chat_id:bot_id:(from_id)
    chatLastMessageIDKey: null,
    // last_message_id:(chatHistoryKey)
    configStoreKey: null,
    // user_config:chat_id:bot_id:(from_id)
    groupAdminKey: null,
    // group_admin:group_id
    usageKey: null,
    // usage:bot_id
    chatType: null,
    // 会话场景, private/group/supergroup 等, 来源 message.chat.type
    chatId: null,
    // 会话 id, private 场景为发言人 id, group/supergroup 场景为群组 id
    speakerId: null,
    // 发言人 id
    role: null,
    // 角色
    extraMessageContext: null,
    // 额外消息上下文
    reverseHistoryKey: null,
    // reverse openai hstory conversation and parent id;
    reverseChatKey: null
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
      const userConfig = JSON.parse(await DATABASE.get(storeKey) || "{}");
      let keys = userConfig?.DEFINE_KEYS || [];
      this.USER_CONFIG.DEFINE_KEYS = keys;
      const userDefine = "USER_DEFINE";
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
      const aiProvider = new Set("auto,openai,azure,workers,gemini,mistral,cohere".split(","));
      if (!aiProvider.has(this.USER_CONFIG.AI_PROVIDER)) {
        this.USER_CONFIG.AI_PROVIDER = "auto";
      }
    }
    {
      const aiImageProvider = new Set("auto,openai,azure,workers".split(","));
      if (!aiImageProvider.has(this.USER_CONFIG.AI_IMAGE_PROVIDER)) {
        this.USER_CONFIG.AI_IMAGE_PROVIDER = "auto";
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
      throw new Error("Token not allowed");
    }
    this.SHARE_CONTEXT.currentBotToken = token;
    this.SHARE_CONTEXT.currentBotId = token.split(":")[0];
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
    if (id === void 0 || id === null) {
      throw new Error("Chat id not found");
    }
    const botId = this.SHARE_CONTEXT.currentBotId;
    let historyKey = `history:${id}`;
    let configStoreKey = `user_config:${id}`;
    if (message?.chat?.is_forum && message?.is_topic_message) {
      historyKey += `:${message.message_thread_id}`;
      configStoreKey += `:${message.message_thread_id}`;
    }
    let groupAdminKey = null;
    if (botId) {
      historyKey += `:${botId}`;
      configStoreKey += `:${botId}`;
    }
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
    this.SHARE_CONTEXT.reverseHistoryKey = message?.from?.id ? `reverseHistory:${message.from.id || message.chat.id}` : "";
    this.SHARE_CONTEXT.reverseChatKey = message?.from?.id ? `reverseChatId:${message.from.id || message.chat.id}` : "";
  }
  async _initReverseContext() {
    try {
      if (ENV.REVERSE_MODE) {
        this.REVERSE_CONTEXT = JSON.parse(await DATABASE.get(this.SHARE_CONTEXT.reverseChatKey) || "{}");
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
    const chatId = message?.chat?.id;
    let replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null;
    await this._initShareContext(message);
    if (ENV.EXTRA_MESSAGE_CONTEXT && ENV.ENABLE_REPLY_TO_MENTION && CONST.GROUP_TYPES.includes(message.chat?.type) && message?.reply_to_message && this.SHARE_CONTEXT.currentBotId !== `${message?.reply_to_message?.from?.id}`) {
      replyId = message.reply_to_message.message_id;
    }
    this._initChatContext(chatId, replyId);
  }
};

// src/vendors/gpt3.js
async function gpt3TokensCounter(repo, loader) {
  const encoder = await loader("encoder_raw_file", `${repo}/encoder.json`).then((x) => JSON.parse(x));
  const bpe_file = await loader("bpe_raw_file", `${repo}/vocab.bpe`);
  const range = (x, y) => {
    const res = Array.from(Array(y).keys()).slice(x);
    return res;
  };
  const ord = (x) => {
    return x.charCodeAt(0);
  };
  const chr = (x) => {
    return String.fromCharCode(x);
  };
  const textEncoder = new TextEncoder("utf-8");
  const encodeStr = (str) => {
    return Array.from(textEncoder.encode(str)).map((x) => x.toString());
  };
  const dictZip = (x, y) => {
    const result = {};
    x.map((_, i) => {
      result[x[i]] = y[i];
    });
    return result;
  };
  function bytes_to_unicode() {
    const bs = range(ord("!"), ord("~") + 1).concat(range(ord("\xA1"), ord("\xAC") + 1), range(ord("\xAE"), ord("\xFF") + 1));
    let cs = bs.slice();
    let n = 0;
    for (let b = 0; b < 2 ** 8; b++) {
      if (!bs.includes(b)) {
        bs.push(b);
        cs.push(2 ** 8 + n);
        n = n + 1;
      }
    }
    cs = cs.map((x) => chr(x));
    const result = {};
    bs.map((_, i) => {
      result[bs[i]] = cs[i];
    });
    return result;
  }
  function get_pairs(word) {
    const pairs = /* @__PURE__ */ new Set();
    let prev_char = word[0];
    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      pairs.add([prev_char, char]);
      prev_char = char;
    }
    return pairs;
  }
  const pat = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  const decoder = {};
  Object.keys(encoder).map((x) => {
    decoder[encoder[x]] = x;
  });
  const lines = bpe_file.split("\n");
  const bpe_merges = lines.slice(1, lines.length - 1).map((x) => {
    return x.split(/(\s+)/).filter(function(e) {
      return e.trim().length > 0;
    });
  });
  const byte_encoder = bytes_to_unicode();
  const byte_decoder = {};
  Object.keys(byte_encoder).map((x) => {
    byte_decoder[byte_encoder[x]] = x;
  });
  const bpe_ranks = dictZip(bpe_merges, range(0, bpe_merges.length));
  const cache = /* @__PURE__ */ new Map();
  function bpe(token) {
    if (cache.has(token)) {
      return cache.get(token);
    }
    ``;
    let word = token.split("");
    let pairs = get_pairs(word);
    if (!pairs) {
      return token;
    }
    while (true) {
      const minPairs = {};
      Array.from(pairs).map((pair) => {
        const rank = bpe_ranks[pair];
        minPairs[isNaN(rank) ? 1e11 : rank] = pair;
      });
      const bigram = minPairs[Math.min(...Object.keys(minPairs).map(
        (x) => {
          return parseInt(x);
        }
      ))];
      if (!(bigram in bpe_ranks)) {
        break;
      }
      const first = bigram[0];
      const second = bigram[1];
      let new_word = [];
      let i = 0;
      while (i < word.length) {
        const j = word.indexOf(first, i);
        if (j === -1) {
          new_word = new_word.concat(word.slice(i));
          break;
        }
        new_word = new_word.concat(word.slice(i, j));
        i = j;
        if (word[i] === first && i < word.length - 1 && word[i + 1] === second) {
          new_word.push(first + second);
          i = i + 2;
        } else {
          new_word.push(word[i]);
          i = i + 1;
        }
      }
      word = new_word;
      if (word.length === 1) {
        break;
      } else {
        pairs = get_pairs(word);
      }
    }
    word = word.join(" ");
    cache.set(token, word);
    return word;
  }
  return function tokenCount(text) {
    let tokensCount = 0;
    const matches = Array.from(text.matchAll(pat)).map((x) => x[0]);
    for (let token of matches) {
      token = encodeStr(token).map((x) => {
        return byte_encoder[x];
      }).join("");
      const new_tokens = bpe(token).split(" ").map((x) => encoder[x]);
      tokensCount += new_tokens.length;
    }
    return tokensCount;
  };
}

// src/utils.js
function randomString(length) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
async function historyPassword() {
  let password = await DATABASE.get(CONST.PASSWORD_KEY);
  if (password === null) {
    password = randomString(32);
    await DATABASE.put(CONST.PASSWORD_KEY, password);
  }
  return password;
}
function renderHTML(body) {
  return `
<html>  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
  `;
}
function errorToString2(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
}
function mergeConfig(config, key, value) {
  const type = typeof config[key];
  switch (type) {
    case "number":
      config[key] = parseInt(value, 10);
      break;
    case "boolean":
      config[key] = value === "true";
      break;
    case "string":
      config[key] = value;
      break;
    case "object":
      const object = JSON.parse(value);
      if (typeof object === "object") {
        config[key] = object;
        break;
      }
      throw new Error(ENV.I18N.utils.not_supported_configuration);
    default:
      throw new Error(ENV.I18N.utils.not_supported_configuration);
  }
}
async function tokensCounter() {
  let counter = (text) => Array.from(text).length;
  try {
    if (ENV.GPT3_TOKENS_COUNT) {
      const loader = async (key, url) => {
        try {
          const raw = await DATABASE.get(key);
          if (raw && raw !== "") {
            return raw;
          }
        } catch (e) {
          console.error(e);
        }
        try {
          const bpe = await fetchWithRetry(url, {
            headers: {
              "User-Agent": CONST.USER_AGENT
            }
          }).then((x) => x.text());
          await DATABASE.put(key, bpe);
          return bpe;
        } catch (e) {
          console.error(e);
        }
        return null;
      };
      counter = await gpt3TokensCounter(ENV.GPT3_TOKENS_COUNT_REPO, loader);
    }
  } catch (e) {
    console.error(e);
  }
  return (text) => {
    try {
      return counter(text);
    } catch (e) {
      console.error(e);
      return Array.from(text).length;
    }
  };
}
async function makeResponse200(resp) {
  if (resp === null) {
    return new Response("NOT HANDLED", { status: 200 });
  }
  if (resp.status === 200) {
    return resp;
  } else {
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Original-Status": resp.status,
        ...resp.headers
      }
    });
  }
}
function isJsonResponse(resp) {
  return resp.headers.get("content-type").indexOf("json") !== -1;
}
function isEventStreamResponse(resp) {
  return ["application/stream+json", "text/event-stream"].includes(resp.headers.get("content-type"));
}
function fetchWithRetryFunc() {
  const status429RetryTime = {};
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1e3;
  const RETRY_MULTIPLIER = 2;
  const DEFAULT_RETRY_AFTER = 10;
  return async (url, options, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) => {
    while (retries > 0) {
      try {
        const parsedUrl = new URL(url);
        const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const now = Date.now();
        if ((status429RetryTime[domain] ?? now) > now) {
          return new Response('{"ok":false}', {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((status429RetryTime[domain] - now) / 1e3)
            }
          });
        }
        if (status429RetryTime[domain]) {
          status429RetryTime[domain] = null;
        }
        let resp = await fetch(url, options);
        if (resp.ok) {
          if (retries < MAX_RETRIES)
            console.log(`[DONE] after ${MAX_RETRIES - retries} times`);
          return resp;
        }
        const clone_resp = await resp.clone().json();
        if (resp.status === 429) {
          const isTgMsg = domain == ENV.TELEGRAM_API_DOMAIN;
          const retryAfter = (isTgMsg ? clone_resp?.parameters?.retry_after : resp.headers.get("Retry-After")) || DEFAULT_RETRY_AFTER;
          status429RetryTime[domain] = Date.now() + 1e3 * retryAfter;
          return resp;
        } else if (resp.status !== 503) {
          return resp;
        }
      } catch (error) {
        console.log(`Request failed, retry after ${delayMs / 1e3} s: ${error}`);
      }
      await delay(delayMs);
      delayMs *= RETRY_MULTIPLIER;
      retries--;
    }
    throw new Error("Failed after maximum retries");
  };
}
var fetchWithRetry = fetchWithRetryFunc();
function delay(ms = 1e3) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function queryProcessInfo(context, PROCESS) {
  const PROCESS_INFO = {
    TYPE: PROCESS.TYPE,
    PROVIDER_SOURCE: PROCESS.PROVIDER_SOURCE || "default",
    AI_PROVIDER: PROCESS.AI_PROVIDER || context.USER_CONFIG.AI_PROVIDER,
    MODEL: PROCESS.MODEL
  };
  const provider_up = PROCESS_INFO.AI_PROVIDER.toUpperCase();
  PROCESS_INFO.PROXY_URL = context.USER_CONFIG.PROVIDER_SOURCES?.[PROCESS.PROVIDER_SOURCE]?.["PROXY_URL"] || context.USER_CONFIG?.[`${provider_up}_API_BASE`];
  PROCESS_INFO.API_KEY = context.USER_CONFIG.PROVIDER_SOURCES?.[PROCESS.PROVIDER_SOURCE]?.["API_KEY"] || context.USER_CONFIG?.[`${provider_up}_API_KEY`];
  if (!PROCESS_INFO.MODEL) {
    switch (PROCESS.TYPE) {
      case "text:text":
        PROCESS_INFO.MODEL = context.USER_CONFIG[`${provider_up}_CHAT_MODEL`] || context.USER_CONFIG.CHAT_MODEL;
        break;
      case "text:image":
        PROCESS_INFO.MODEL = context.USER_CONFIG.DALL_E_MODEL;
        break;
      case "audio:text":
        PROCESS_INFO.MODEL = context.USER_CONFIG[`${provider_up}_STT_MODEL`];
        break;
      case "image:text":
        PROCESS_INFO.MODEL = context.USER_CONFIG[`${provider_up}_VISION_MODEL`];
        break;
      case "text:audio":
        PROCESS_INFO.MODEL = context.USER_CONFIG[`${provider_up}_TTS_MODEL`];
        break;
      case "audio:audio":
      default:
        return sendMessageToTelegramWithContext(context)(
          "unsupported type"
        );
    }
  }
  return PROCESS_INFO;
}
function CUSTOM_TINFO(config) {
  let AI_PROVIDER = config.AI_PROVIDER;
  if (config.AI_PROVIDER === "auto") {
    AI_PROVIDER = "openai";
  }
  let CHAT_MODEL = "";
  switch (AI_PROVIDER) {
    case "openai":
    case "azure":
    default:
      CHAT_MODEL = config.CHAT_MODEL;
      break;
    case "workers":
      CHAT_MODEL = config.WORKERS_CHAT_MODEL;
      break;
    case "gemini":
      CHAT_MODEL = config.GOOGLE_CHAT_MODEL;
      break;
    case "mistral":
      CHAT_MODEL = config.MISTRAL_CHAT_MODEL;
      break;
  }
  let info = `MODE: ${config.CURRENT_MODE}
CHAT_MODEL:${CHAT_MODEL}`;
  const PROCESS = config.MODES[config.CURRENT_MODE] || ENV.MODES[config.CURRENT_MODE] || [];
  for (const [k, v] of Object.entries(PROCESS)) {
    info += `
- ${k}
` + " ".repeat(4) + v.map((i) => Object.values(i).join(" ") || `${k}:text`).join("\n" + " ".repeat(4));
  }
  return info;
}
function UUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}

// src/md2tgmd.js
var escapeChars = /([\_\*\[\]\(\)\\\~\`\>\#\+\-\=\|\{\}\.\!])/g;
function escape(text) {
  const lines = text.split("\n");
  const stack = [];
  const result = [];
  let linetrim = "";
  for (const [i, line] of lines.entries()) {
    linetrim = line.trim();
    let startIndex;
    if (/^```.+/.test(linetrim)) {
      stack.push(i);
    } else if (linetrim === "```") {
      if (stack.length) {
        startIndex = stack.pop();
        if (!stack.length) {
          const content = lines.slice(startIndex, i + 1).join("\n");
          result.push(handleEscape(content, "code"));
          continue;
        }
      } else {
        stack.push(i);
      }
    }
    if (!stack.length) {
      result.push(handleEscape(line));
    }
  }
  if (stack.length) {
    const last = lines.slice(stack[0]).join("\n") + "\n```";
    result.push(handleEscape(last, "code"));
  }
  return result.join("\n");
}
function handleEscape(text, type = "text") {
  if (!text.trim()) {
    return text;
  }
  if (type === "text") {
    text = text.replace(escapeChars, "\\$1").replace(/\\\*\\\*(.*?[^\\])\\\*\\\*/g, "*$1*").replace(/\\_\\_(.*?[^\\])\\_\\_/g, "__$1__").replace(/\\_(.*?[^\\])\\_/g, "_$1_").replace(/\\~(.*?[^\\])\\~/g, "~$1~").replace(/\\\|\\\|(.*?[^\\])\\\|\\\|/g, "||$1||").replace(/\\\[([^\]]+?)\\\]\\\((.+?)\\\)/g, "[$1]($2)").replace(/\\\`(.*?[^\\])\\\`/g, "`$1`").replace(/\\\\\\([\_\*\[\]\(\)\\\~\`\>\#\+\-\=\|\{\}\.\!])/g, "\\$1").replace(/^(\s*)\\(>.+\s*)$/gm, "$1$2").replace(/^(\s*)\\-\s*(.+)$/gm, "$1\u2022 $2").replace(/^((\\#){1,3}\s)(.+)/gm, "$1*$3*");
  } else {
    const codeBlank = text.length - text.trimStart().length;
    if (codeBlank > 0) {
      const blankReg = new RegExp(`^\\s{${codeBlank}}`, "gm");
      text = text.replace(blankReg, "");
    }
    text = text.trimEnd().replace(/([\\\`])/g, "\\$1").replace(/^\\`\\`\\`([\s\S]+)\\`\\`\\`$/g, "```$1```");
  }
  return text;
}

// src/telegram.js
async function sendMessage(message, token, context) {
  const body = {
    text: message
  };
  for (const key of Object.keys(context)) {
    if (context[key] !== void 0 && context[key] !== null && ["MIDDLE_INFO", "PROCESS_INFO"].indexOf(key) < 0) {
      body[key] = context[key];
    }
  }
  let method = "sendMessage";
  if (context?.message_id) {
    method = "editMessageText";
  }
  return await fetchWithRetry(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
}
async function sendMessageToTelegram(message, token, context) {
  const chatContext = {
    ...context,
    message_id: Array.isArray(context.message_id) ? 0 : context.message_id
  };
  let origin_msg = message;
  let info = "";
  const step = context.PROCESS_INFO?.STEP?.split("/") || [0, 0];
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    info = context.MIDDLE_INFO?.TEMP_INFO?.trim() || "";
    if (step[0] < step[1] && !ENV.HIDE_MIDDLE_MESSAGE) {
      chatContext.parse_mode = null;
      message = info + " \n\n" + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
    } else if (parse_mode === "MarkdownV2" && chatContext?.MIDDLE_INFO?.TEMP_INFO) {
      message = ">`" + info + "` \n\n\n" + escape(origin_msg);
    } else if (parse_mode === "MarkdownV2") {
      message = escape(origin_msg);
    } else {
      message = info ? info + " \n" + origin_msg : origin_msg;
    }
    if (parse_mode !== "MarkdownV2" && context?.MIDDLE_INFO?.TEMP_INFO) {
      chatContext.entities = [
        { type: "code", offset: 0, length: info.length },
        { type: "blockquote", offset: 0, length: info.length }
      ];
    }
  };
  if (message.length <= 4096) {
    escapeContent();
    let resp = await sendMessage(message, token, chatContext);
    if (resp.status === 200) {
      return resp;
    } else {
      chatContext.parse_mode = null;
      context.parse_mode = null;
      escapeContent();
      resp = await sendMessage(message, token, chatContext);
      if (resp.status !== 200) {
        chatContext.entities = [];
        return await sendMessage(message, token, chatContext);
      }
      console.log("sec request ok");
      return resp;
    }
  }
  const limit = 4096;
  chatContext.parse_mode = null;
  if (!chatContext.entities) {
    chatContext.entities = [
      { type: "code", offset: 0, length: info.length },
      { type: "blockquote", offset: 0, length: info.length }
    ];
  }
  escapeContent();
  if (!Array.isArray(context.message_id)) {
    context.message_id = [context.message_id];
  }
  let msgIndex = 0;
  for (let i = 0; i < message.length; i += limit) {
    chatContext.message_id = context.message_id[msgIndex];
    msgIndex += 1;
    if (msgIndex > 1 && context.message_id[msgIndex] && i + limit < message.length) {
      continue;
    }
    if (msgIndex == 1 && context.message_id.length > 1 && !ENV.ENABLE_SHOWINFO && !ENV.ENABLE_SHOWTOKENINFO) {
      continue;
    }
    const msg = message.slice(i, Math.min(i + limit, message.length));
    chatContext.entities[0].length = msg.length;
    chatContext.entities[1].length = msg.length;
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
      const message_id = (await resp.json()).result?.message_id;
      context.message_id.push(message_id);
    }
  }
  return new Response("Message batch send", { status: 200 });
}
function sendMessageToTelegramWithContext2(context) {
  return async (message) => {
    return sendMessageToTelegram(message, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT);
  };
}
function deleteMessageFromTelegramWithContext(context) {
  return async (messageId) => {
    return await fetchWithRetry(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${context.SHARE_CONTEXT.currentBotToken}/deleteMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: context.CURRENT_CHAT_CONTEXT.chat_id,
          message_id: messageId
        })
      }
    );
  };
}
async function sendPhotoToTelegram(photo, token, context) {
  const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
  let body = null;
  const headers = {};
  if (typeof photo === "string") {
    body = {
      photo
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null && ["MIDDLE_INFO", "PROCESS"].indexOf(key) < 0) {
        body[key] = context[key];
      }
    }
    body.parse_mode = "MarkdownV2";
    let info = ">" + context.MIDDLE_INFO.TEMP_INFO + (context.MIDDLE_INFO.TEXT || "") + "\n";
    body.caption = escape(info) + `[\u539F\u59CB\u56FE\u7247](${photo})`;
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  } else {
    body = new FormData();
    body.append("photo", photo, "photo.png");
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null && ["MIDDLE_INFO", "PROCESS"].indexOf(key) < 0) {
        body.append(key, `${context[key]}`);
      }
    }
  }
  const option = {
    method: "POST",
    headers,
    body
  };
  const resp = await fetchWithRetry(url, option);
  if (resp.status === 400) {
    console.log(await resp.text());
    body = JSON.parse(body);
    delete body.parse_mode;
    option.body = JSON.stringify(body);
    return fetchWithRetry(url, option);
  }
  return resp;
}
function sendPhotoToTelegramWithContext(context) {
  return (url) => {
    return sendPhotoToTelegram(url, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT);
  };
}
async function sendChatActionToTelegram(action, token, chatId) {
  return await fetchWithRetry(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        action
      })
    }
  ).then((res) => res.json());
}
function sendChatActionToTelegramWithContext(context) {
  return (action) => {
    return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id);
  };
}
async function bindTelegramWebHook(token, url) {
  return await fetchWithRetry(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url
      })
    }
  ).then((res) => res.json());
}
async function getChatRole(id, groupAdminKey, chatId, token) {
  let groupAdmin;
  try {
    groupAdmin = JSON.parse(await DATABASE.get(groupAdminKey) || "[]");
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
    await DATABASE.put(
      groupAdminKey,
      JSON.stringify(groupAdmin),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (let i = 0; i < groupAdmin.length; i++) {
    const user = groupAdmin[i];
    if (user.user.id === id) {
      return user.status;
    }
  }
  return "member";
}
function getChatRoleWithContext(context) {
  return (id) => {
    return getChatRole(id, context.SHARE_CONTEXT.groupAdminKey, context.CURRENT_CHAT_CONTEXT.chat_id, context.SHARE_CONTEXT.currentBotToken);
  };
}
async function getChatAdminister(chatId, token) {
  try {
    const resp = await fetchWithRetry(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id: chatId })
      }
    ).then((res) => res.json());
    if (resp.ok) {
      return resp.result;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
async function getBot(token) {
  const resp = await fetchWithRetry(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getMe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then((res) => res.json());
  if (resp.ok) {
    return {
      ok: true,
      info: {
        name: resp.result.first_name,
        bot_name: resp.result.username,
        can_join_groups: resp.result.can_join_groups,
        can_read_all_group_messages: resp.result.can_read_all_group_messages
      }
    };
  } else {
    return resp;
  }
}
async function getFileInfo(file_id, token) {
  const data = await fetchWithRetry(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((r) => r.json());
  if (data.ok) {
    return data.result;
  }
  return data;
}
async function getFile(fullPath) {
  return fetchWithRetry(fullPath);
}
async function sendLoadingMessageToTelegramWithContext(context) {
  try {
    if (!context.CURRENT_CHAT_CONTEXT.message_id) {
      const msg = await sendMessageToTelegramWithContext2(context)(
        ENV.I18N.message.loading
      ).then((r) => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
      context.CURRENT_CHAT_CONTEXT.reply_markup = null;
    }
  } catch (e) {
    console.error(e);
  }
}

// src/vendors/stream.js
var Stream = class {
  constructor(response, controller) {
    this.response = response;
    this.controller = controller;
    this.decoder = new SSEDecoder();
  }
  async *iterMessages() {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error(`Attempted to iterate over a response with no body`);
    }
    const lineDecoder = new LineDecoder();
    const iter = this.response.body;
    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse = this.decoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = this.decoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  async *[Symbol.asyncIterator]() {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done)
          continue;
        if (sse.data.startsWith("[DONE]")) {
          done = true;
          continue;
        }
        if (sse.event === null) {
          try {
            yield JSON.parse(sse.data);
          } catch (e) {
            console.error(`Could not parse message into JSON:`, sse.data);
            console.error(`From chunk:`, sse.raw);
            throw e;
          }
        }
      }
      done = true;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError")
        return;
      throw e;
    } finally {
      if (!done)
        this.controller.abort();
    }
  }
};
var SSEDecoder = class {
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length)
        return null;
      const sse = {
        event: this.event,
        data: this.data.join("\n"),
        raw: this.chunks
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldname, _, value] = partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldname === "event") {
      this.event = value;
    } else if (fieldname === "data") {
      this.data.push(value);
    }
    return null;
  }
};
var LineDecoder = class {
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = "\r" + text;
      this.trailingCR = false;
    }
    if (text.endsWith("\r")) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
    let lines = text.split(LineDecoder.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    var _a;
    if (bytes == null)
      return "";
    if (typeof bytes === "string")
      return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        (_a = this.textDecoder) !== null && _a !== void 0 ? _a : this.textDecoder = new TextDecoder("utf8");
        return this.textDecoder.decode(bytes, { stream: true });
      }
      throw new Error(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new Error(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
function partition(str, delimiter) {
  const index = str.indexOf(delimiter);
  if (index !== -1) {
    return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
  }
  return [str, "", ""];
}

// src/openai.js
function openAIKeyFromContext(context) {
  const API_KEY = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.["API_KEY"] || context.USER_CONFIG.OPENAI_API_KEY;
  if (API_KEY) {
    return API_KEY;
  }
  if (ENV.API_KEY.length === 0) {
    return null;
  }
  return ENV.API_KEY[Math.floor(Math.random() * ENV.API_KEY.length)];
}
function azureKeyFromContext(context) {
  return context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["API_KEY"] || ENV.AZURE_API_KEY;
}
function isOpenAIEnable(context) {
  return context.USER_CONFIG.OPENAI_API_KEY || ENV.API_KEY.length > 0;
}
function isAzureEnable(context) {
  const key = context.USER_CONFIG.AZURE_API_KEY || ENV.AZURE_API_KEY;
  return key !== null;
}
async function requestCompletionsFromOpenAI(message, history, context, onStream) {
  const url = `${context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["PROXY_URL"]}/chat/completions`;
  let model = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["MODEL"];
  let messages = [{ role: "user", content: message }];
  if (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL) {
    model = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO.MODEL;
    messages[0].content = [{
      "type": "text",
      "text": message || "what is this?"
      // cluade-3-haiku model 图像识别必须带文本
    }, {
      "type": "image_url",
      "image_url": {
        "url": ENV.LOAD_IMAGE_FILE ? `${context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE}` : context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL
      }
    }];
  } else {
    messages.unshift(...history || []);
  }
  const body = {
    model,
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages,
    stream: onStream != null,
    ...!!onStream && ENV.ENABLE_SHOWTOKENINFO && { stream_options: { include_usage: true } }
  };
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIKeyFromContext(context)}`
  };
  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream, (result) => {
    setTimeout(() => updateBotUsage(result?.usage, context).catch(console.error), 0);
  });
}
async function requestCompletionsFromReverseOpenAI(message, reverseContext, context, onStream) {
  const url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversation`;
  let model = context.USER_CONFIG.CHAT_MODEL;
  let content = { parts: [`${message}`], content_type: "text" };
  const body = {
    conversation_mode: { kind: "primary_assistant" },
    force_paragen: false,
    messages: [{ metadata: {}, id: reverseContext.id, author: { role: "user" }, content }],
    timezone_offset_min: "-480",
    ...reverseContext.conversation_id !== ":new:" && { conversation_id: reverseContext.conversation_id },
    parent_message_id: reverseContext.parent_message_id,
    action: "next",
    force_rate_limit: false,
    suggestions: [],
    history_and_training_disabled: false,
    model,
    arkose_token: null
  };
  const header = {
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1",
    "Authorization": `Bearer ${context.USER_CONFIG.REVERSE_TOKEN}`
  };
  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream);
}
async function requestReverseChatListOrHistory(context, type = "list", num = 30) {
  let url = "";
  if (!context.USER_CONFIG.REVERSE_PERFIX || !context.USER_CONFIG.REVERSE_TOKEN) {
    throw new Error("REVERSE \u5173\u952E\u53D8\u91CF\u672A\u8BBE\u7F6E");
  }
  if (type === "list") {
    url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversations?offset=0&limit=${num}&order=updated`;
  } else
    url = `${context.USER_CONFIG.REVERSE_PERFIX}/backend-api/conversation/${context.REVERSE_CONTEXT.conversation_id}`;
  const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1",
    Authorization: `Bearer ${context.USER_CONFIG.REVERSE_TOKEN}`,
    "Accept-Language": "en-US"
  };
  const result = await fetch(url, { headers });
  if (result.status !== 200) {
    throw new Error(await result.text());
  }
  return result.json();
}
async function requestCompletionsFromAzureOpenAI(message, history, context, onStream) {
  const url = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["PROXY_URL"];
  const body = {
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...history || [], { role: "user", content: message }],
    stream: onStream != null,
    ...!!onStream && ENV.ENABLE_SHOWTOKENINFO && { stream_options: { include_usage: true } }
  };
  const header = {
    "Content-Type": "application/json",
    "api-key": azureKeyFromContext(context)
  };
  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream);
}
async function requestCompletionsFromOpenAICompatible(url, header, body, context, onStream, onResult = null) {
  const controller = new AbortController();
  const { signal } = controller;
  const timeout = 1e3 * 60 * 5;
  setTimeout(() => controller.abort(), timeout);
  let firstTimeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    firstTimeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`No response in ${ENV.OPENAI_CHAT_TIMEOUT}s`));
    }, ENV.OPENAI_CHAT_TIMEOUT * 1e3);
  });
  let startTime = performance.now();
  console.log("[START] Chat via OpenAILike");
  const resp = await Promise.race([timeoutPromise, fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
    signal
  })]);
  clearTimeout(firstTimeoutId);
  const immediatePromise = Promise.resolve("immediate");
  if (onStream && resp.ok && isEventStreamResponse(resp) && !ENV.REVERSE_MODE) {
    const stream = new Stream(resp, controller);
    let contentFull = "";
    let lengthDelta = 0;
    let updateStep = 20;
    let msgPromise = null;
    let lastChunk = null;
    let usage = null;
    try {
      for await (const data of stream) {
        const c = data?.choices?.[0]?.delta?.content || "";
        usage = data?.usage;
        lengthDelta += c.length;
        if (lastChunk)
          contentFull = contentFull + lastChunk;
        if (lastChunk && lengthDelta > updateStep) {
          lengthDelta = 0;
          updateStep += 10;
          if (!msgPromise || await Promise.race([msgPromise, immediatePromise]) !== "immediate") {
            msgPromise = onStream(`${contentFull}\u25CF`);
          }
        }
        lastChunk = c;
      }
    } catch (e) {
      contentFull += `
ERROR: ${e.message}`;
      console.log(`errorEnd`);
    }
    contentFull += lastChunk;
    if (ENV.GPT3_TOKENS_COUNT && usage && !ENV.REVERSE_MODE) {
      onResult?.({ usage });
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.promptToken = usage?.prompt_tokens ?? 0;
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.completionToken = usage?.completion_tokens ?? 0;
    }
    let endTime = performance.now();
    console.log(`[DONE] Chat via OpenAILike: ${((endTime - startTime) / 1e3).toFixed(2)}s`);
    await msgPromise;
    console.log(`MiddleMsgTime: ${((performance.now() - startTime) / 1e3).toFixed(2)}s`);
    return contentFull;
  } else if (ENV.REVERSE_MODE) {
    const stream = new Stream(resp, controller);
    let updateStep = 10;
    let delta = 20;
    let content = "";
    let lastChunk = null;
    let msgPromise = null;
    let conversation_id = "";
    let id = "";
    let model = "";
    let title = "";
    try {
      for await (const data of stream) {
        content = data?.message?.content?.parts?.[0] || content;
        if (!conversation_id)
          conversation_id = data?.conversation_id;
        if (!id)
          id = data?.message?.id;
        if (!model)
          model = data?.model || data?.message?.metadata?.model_slug;
        if (!title)
          title = data?.title;
        if (lastChunk && content.length > updateStep) {
          updateStep += delta;
          delta += 25;
          if (!msgPromise || await Promise.race([msgPromise, immediatePromise]) !== "immediate") {
            msgPromise = onStream(`${lastChunk}\u25CF`);
          }
        }
        lastChunk = content;
      }
      context.REVERSE_CONTEXT.conversation_id = conversation_id;
      context.REVERSE_CONTEXT.parent_message_id = id;
      if (title)
        context.REVERSE_CONTEXT.title = title;
    } catch (e) {
      console.error(e.message);
      content = `Error: ${e.message}`;
    }
    let endTime = performance.now();
    const LLMTime = `${((endTime - startTime) / 1e3).toFixed(2)}s`;
    if (ENV.ENABLE_SHOWINFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = `${model || context.USER_CONFIG.CHAT_MODEL} ${LLMTime} `;
    }
    console.log(`[DONE] Chat via OpenAILike: ${LLMTime}`);
    await msgPromise;
    console.log(`MiddleMsgTime: ${((performance.now() - startTime) / 1e3).toFixed(2)}s`);
    return lastChunk;
  }
  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }
  const result = await resp.json();
  if (!result) {
    throw new Error("Empty response");
  }
  if (result.error?.message) {
    throw new Error(result.error.message);
  }
  try {
    onResult?.(result);
    return result.choices[0].message.content;
  } catch (e) {
    throw Error(result?.error?.message || JSON.stringify(result));
  }
}
async function requestImageFromOpenAI(prompt, context) {
  let url = `${context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.["PROXY_URL"] || context.USER_CONFIG.OPENAI_API_BASE}/images/generations`;
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIKeyFromContext(context)}`
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model: context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.["MODEL"] || context.USER_CONFIG.DALL_E_MODEL
  };
  if (body.model === "dall-e-3") {
    body.quality = context.USER_CONFIG.DALL_E_IMAGE_QUALITY;
    body.style = context.USER_CONFIG.DALL_E_IMAGE_STYLE;
  }
  {
    const provider = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.["PROVIDER"] || context.USER_CONFIG.AI_IMAGE_PROVIDER;
    let isAzureModel = false;
    switch (provider) {
      case "azure":
        isAzureModel = true;
        break;
      case "openai":
        isAzureModel = false;
        break;
      case "auto":
        isAzureModel = isAzureEnable(context) && context.USER_CONFIG.AZURE_DALLE_API !== null;
        break;
      default:
        break;
    }
    if (isAzureModel) {
      url = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["PROXY_URL"] || context.USER_CONFIG.AZURE_DALLE_API;
      const validSize = ["1792x1024", "1024x1024", "1024x1792"];
      if (!validSize.includes(body.size)) {
        body.size = "1024x1024";
      }
      header["api-key"] = azureKeyFromContext(context);
      delete header["Authorization"];
      delete body.model;
    }
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return resp.data[0].url;
}
async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const url = `${context.USER_CONFIG.OPENAI_API_BASE}/audio/transcriptions`;
  const header = {
    // 'Content-Type': 'multipart/form-data',
    "Authorization": `Bearer ${openAIKeyFromContext(context)}`,
    "Accept": "application/json"
  };
  const formData = new FormData();
  formData.append("file", audio, file_name);
  formData.append("model", context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["MODEL"]);
  if (context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS) {
    Object.entries(context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  formData.append("response_format", "json");
  return await fetch(url, {
    method: "POST",
    headers: header,
    body: formData,
    redirect: "follow"
  }).catch((error) => {
    console.log(error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 503 });
  });
}
async function updateBotUsage(usage, context) {
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    return;
  }
  let dbValue;
  try {
    dbValue = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.usageKey));
  } catch {
    dbValue = "";
  }
  if (!dbValue) {
    dbValue = {
      tokens: {
        total: 0,
        chats: {}
      }
    };
  }
  dbValue.tokens.total += usage?.total_tokens ?? 0;
  if (!dbValue.tokens.chats[context.SHARE_CONTEXT.chatId]) {
    dbValue.tokens.chats[context.SHARE_CONTEXT.chatId] = usage?.total_tokens ?? 0;
  } else {
    dbValue.tokens.chats[context.SHARE_CONTEXT.chatId] += usage?.total_tokens ?? 0;
  }
  await DATABASE.put(context.SHARE_CONTEXT.usageKey, JSON.stringify(dbValue));
}

// src/workersai.js
async function run(model, body) {
  const id = ENV.CLOUDFLARE_ACCOUNT_ID;
  const token = ENV.CLOUDFLARE_TOKEN;
  return await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify(body)
    }
  );
}
function isWorkersAIEnable(context) {
  return !!(ENV.CLOUDFLARE_ACCOUNT_ID && ENV.CLOUDFLARE_TOKEN);
}
async function requestCompletionsFromWorkersAI(message, history, context, onStream) {
  const model = ENV.WORKERS_CHAT_MODEL;
  const request = {
    messages: [...history || [], { role: "user", content: message }],
    stream: onStream !== null
  };
  const resp = await run(model, request);
  const controller = new AbortController();
  if (onStream && resp.ok && isEventStreamResponse(resp)) {
    const stream = new Stream(resp, controller);
    let contentFull = "";
    let lengthDelta = 0;
    let updateStep = 20;
    try {
      for await (const chunk of stream) {
        const c = chunk?.response || "";
        lengthDelta += c.length;
        contentFull = contentFull + c;
        if (contentFull.endsWith("\n\n\n\n")) {
          contentFull = contentFull.replace(/\n+$/, "");
          controller.abort();
          break;
        }
        if (lengthDelta > updateStep) {
          lengthDelta = 0;
          updateStep += 5;
          await onStream(`${contentFull}\u25CF`);
        }
      }
    } catch (e) {
      contentFull = `ERROR: ${e.message}`;
    }
    return contentFull;
  } else {
    const data = await resp.json();
    try {
      return data.result.response;
    } catch (e) {
      if (!data) {
        throw new Error("Empty response");
      }
      throw new Error(data?.errors?.[0]?.message || JSON.stringify(data));
    }
  }
}
async function requestImageFromWorkersAI(prompt, context) {
  const raw = await run(ENV.WORKERS_IMAGE_MODEL, { prompt });
  return await raw.blob();
}

// src/gemini.js
function isGeminiAIEnable(context) {
  return !!context.USER_CONFIG.GOOGLE_API_KEY;
}
async function requestCompletionsFromGeminiAI(message, history, context, onStream) {
  const url = `${context.USER_CONFIG.GOOGLE_API_BASE}${context.USER_CONFIG.GOOGLE_CHAT_MODEL}:${// 暂时不支持stream模式
  // onStream ? 'streamGenerateContent' : 'generateContent'
  "generateContent"}?key=${context.USER_CONFIG.GOOGLE_API_KEY}`;
  const contentsTemp = [...history || [], { role: "user", content: message }];
  const contents = [];
  for (const msg of contentsTemp) {
    switch (msg.role) {
      case "assistant":
        msg.role = "model";
        break;
      case "system":
      case "user":
        msg.role = "user";
        break;
      default:
        continue;
    }
    if (contents.length === 0 || contents[contents.length - 1].role !== msg.role) {
      contents.push({
        "role": msg.role,
        "parts": [
          {
            "text": msg.content
          }
        ]
      });
    } else {
      contents[contents.length - 1].parts[0].text += msg.content;
    }
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": CONST.USER_AGENT
    },
    body: JSON.stringify({ contents })
  });
  const data = await resp.json();
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (e) {
    if (!data) {
      throw new Error("Empty response");
    }
    throw new Error(data?.error?.message || JSON.stringify(data));
  }
}

// src/mistralai.js
function isMistralAIEnable(context) {
  return !!(context.USER_CONFIG.MISTRAL_API_KEY && context.USER_CONFIG.MISTRAL_COMPLETIONS_API && context.USER_CONFIG.MISTRAL_CHAT_MODEL);
}
async function requestCompletionsFromMistralAI(message, history, context, onStream) {
  const url = context.USER_CONFIG.MISTRAL_COMPLETIONS_API;
  const body = {
    model: context.USER_CONFIG.MISTRAL_CHAT_MODEL,
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages: [...history || [], { role: "user", content: message }],
    stream: onStream != null
  };
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${context.USER_CONFIG.MISTRAL_API_KEY}`
  };
  return requestCompletionsFromOpenAICompatible(url, header, body, context, onStream);
}

// src/vendors/cohereStream.js
var Stream2 = class {
  constructor(response, controller) {
    this.response = response;
    this.controller = controller;
    this.decoder = new SSEDecoder2();
  }
  async *iterMessages() {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error(`Attempted to iterate over a response with no body`);
    }
    const lineDecoder = new LineDecoder2();
    const iter = this.response.body;
    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse = this.decoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = this.decoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  async *[Symbol.asyncIterator]() {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done)
          continue;
        if (sse.data.startsWith('{"is_finished":true')) {
          done = true;
          yield JSON.parse(sse.data);
          continue;
        }
        if (sse.event === null) {
          try {
            yield JSON.parse(sse.data);
          } catch (e) {
            console.error(`Could not parse message into JSON:`, sse.data);
            console.error(`From chunk:`, sse.raw);
            throw e;
          }
        }
      }
      done = true;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError")
        return;
      throw e;
    } finally {
      if (!done)
        this.controller.abort();
    }
  }
};
var SSEDecoder2 = class {
  constructor() {
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (line) {
      let type = identifyType(line, SSEDecoder2.TYPE_REGEXP);
      const sse = { event: line, data: line, raw: line };
      if (type === "text-generation" || type === "stream-end") {
        sse.event = null;
      } else
        sse.data = "";
      return sse;
    }
    return null;
  }
};
var LineDecoder2 = class {
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = "\r" + text;
      this.trailingCR = false;
    }
    if (text.endsWith("\r")) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = LineDecoder2.NEWLINE_CHARS.has(text[text.length - 1] || "");
    let lines = text.split(LineDecoder2.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    var _a;
    if (bytes == null)
      return "";
    if (typeof bytes === "string")
      return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(
        `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
      );
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        (_a = this.textDecoder) !== null && _a !== void 0 ? _a : this.textDecoder = new TextDecoder("utf8");
        return this.textDecoder.decode(bytes, { stream: true });
      }
      throw new Error(
        `Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`
      );
    }
    throw new Error(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
LineDecoder2.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder2.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
SSEDecoder2.TYPE_REGEXP = /"event_type":"(.*?)"/;
function identifyType(str, regex) {
  return str.match(regex)?.[1] || "Unknown";
}

// src/cohereai.js
function isCohereAIEnable(context) {
  return !!(context.USER_CONFIG.COHERE_API_KEY && context.USER_CONFIG.COHERE_API_BASE && context.USER_CONFIG.COHERE_CHAT_MODEL);
}
async function requestCompletionsFromCohereAI(message, history, context, onStream) {
  const url = `${context.USER_CONFIG.COHERE_API_BASE}/chat`;
  const header = {
    "Authorization": `Bearer ${context.USER_CONFIG.COHERE_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  const contentsTemp = [];
  let preamble = "";
  for (const msg of history) {
    switch (msg.role) {
      case "system":
        preamble = msg.content;
        break;
      case "assistant":
        contentsTemp.push({ role: "CHATBOT", message: msg.content });
        break;
      case "user":
        contentsTemp.push({ role: "USER", message: msg.content });
        break;
      default:
        continue;
    }
  }
  let connectors = [];
  Object.entries(context.USER_CONFIG.COHERE_CONNECT_TRIGGER).forEach(([id, triggers]) => {
    const result2 = triggers.some((trigger) => {
      const triggerRegex = new RegExp(trigger, "i");
      return triggerRegex.test(message);
    });
    if (result2)
      connectors.push({ id });
  });
  const body = {
    message,
    model: context.USER_CONFIG.COHERE_CHAT_MODEL,
    stream: onStream != null,
    preamble,
    chat_history: contentsTemp,
    ...connectors.length && { connectors },
    ...context.USER_CONFIG.COHERE_API_EXTRA_PARAMS
  };
  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = 1e3 * 60 * 5;
  setTimeout(() => controller.abort(), timeout);
  let firstTimeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    firstTimeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`No response in ${ENV.COHERE_TIMEOUT}s`));
    }, ENV.COHERE_TIMEOUT * 1e3);
  });
  const startTime = performance.now();
  const resp = await Promise.race([
    timeoutPromise,
    fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
      signal
    })
  ]);
  clearTimeout(firstTimeoutId);
  const immediatePromise = Promise.resolve("immediate");
  if (onStream && resp.ok && isEventStreamResponse(resp)) {
    const stream = new Stream2(resp, controller);
    let contentFull = "";
    let lengthDelta = 0;
    let updateStep = 20;
    let msgPromise = null;
    let lastChunk = null;
    try {
      for await (const data of stream) {
        if (data.event_type === "stream-end") {
          continue;
        }
        const c = data?.text || "";
        lengthDelta += c.length;
        if (lastChunk)
          contentFull = contentFull + lastChunk;
        if (lastChunk && lengthDelta > updateStep) {
          lengthDelta = 0;
          updateStep += 10;
          if (!msgPromise || await Promise.race([msgPromise, immediatePromise]) !== "immediate") {
            msgPromise = onStream(`${contentFull}\u25CF`);
          }
        }
        lastChunk = c;
      }
    } catch (e) {
      contentFull += `
ERROR: ${e.message}`;
      console.log(`errorEnd`);
    }
    contentFull += lastChunk;
    let endTime = performance.now();
    console.log(`[DONE] Chat via Cohere: ${((endTime - startTime) / 1e3).toFixed(2)}s`);
    await msgPromise;
    console.log(`MiddleMsgTime: ${((performance.now() - startTime) / 1e3).toFixed(2)}s`);
    return contentFull;
  }
  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }
  const result = await resp.json();
  if (!result) {
    throw new Error("Empty response");
  }
  if (result?.message) {
    throw new Error(result.message);
  }
  try {
    return result.text;
  } catch (e) {
    throw Error(result?.message || JSON.stringify(result));
  }
}

// src/llm.js
async function loadHistory(key, context) {
  const initMessage = { role: "system", content: context.USER_CONFIG.SYSTEM_INIT_MESSAGE };
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  if (historyDisable) {
    initMessage.role = ENV.SYSTEM_INIT_MESSAGE_ROLE;
    return { real: [initMessage], original: [initMessage] };
  }
  let history = [];
  try {
    history = JSON.parse(await DATABASE.get(key) || "{}");
  } catch (e) {
    console.error(e);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }
  let original = JSON.parse(JSON.stringify(history));
  if (context.SHARE_CONTEXT.role) {
    history = history.filter((chat) => context.SHARE_CONTEXT.role === chat.cosplay);
  }
  history.forEach((item) => {
    delete item.cosplay;
  });
  const counter = await tokensCounter();
  const trimHistory = (list, initLength, maxLength, maxToken) => {
    if (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL)
      maxLength = 2;
    if (list.length > maxLength) {
      list = list.splice(list.length - maxLength);
    }
    let tokenLength = initLength;
    for (let i = list.length - 1; i >= 0; i--) {
      const historyItem = list[i];
      let length = 0;
      if (historyItem.content) {
        length = counter(historyItem.content);
      } else {
        historyItem.content = "";
      }
      tokenLength += length;
      if (tokenLength > maxToken) {
        list = list.splice(i + 1);
        break;
      }
    }
    return list;
  };
  if (ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH > 0) {
    const initLength = counter(initMessage.content);
    const roleCount = Math.max(Object.keys(context.USER_DEFINE.ROLE).length, 1);
    history = trimHistory(history, initLength, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    original = trimHistory(original, initLength, ENV.MAX_HISTORY_LENGTH * roleCount, ENV.MAX_TOKEN_LENGTH * roleCount);
  }
  switch (history.length > 0 ? history[0].role : "") {
    case "assistant":
    case "system":
      history[0] = initMessage;
      break;
    default:
      history.unshift(initMessage);
  }
  if (ENV.SYSTEM_INIT_MESSAGE_ROLE !== "system" && history.length > 0 && history[0].role === "system") {
    history[0].role = ENV.SYSTEM_INIT_MESSAGE_ROLE;
  }
  return { real: history, original };
}
function loadChatLLM(context) {
  if (ENV.REVERSE_MODE)
    return requestCompletionsFromReverseOpenAI;
  switch (context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["AI_PROVIDER"]) {
    case "openai":
      return requestCompletionsFromOpenAI;
    case "azure":
      return requestCompletionsFromAzureOpenAI;
    case "workers":
      return requestCompletionsFromWorkersAI;
    case "gemini":
      return requestCompletionsFromGeminiAI;
    case "mistral":
      return requestCompletionsFromMistralAI;
    case "cohere":
      return requestCompletionsFromCohereAI;
    default:
      if (isAzureEnable(context)) {
        return requestCompletionsFromAzureOpenAI;
      }
      if (isOpenAIEnable(context)) {
        return requestCompletionsFromOpenAI;
      }
      if (isWorkersAIEnable(context)) {
        return requestCompletionsFromWorkersAI;
      }
      if (isGeminiAIEnable(context)) {
        return requestCompletionsFromGeminiAI;
      }
      if (isMistralAIEnable(context)) {
        return requestCompletionsFromMistralAI;
      }
      if (isCohereAIEnable(context)) {
        return requestCompletionsFromCohereAI;
      }
      return null;
  }
}
function loadImageGen(context) {
  switch (context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.["PROVIDER"] || context.USER_CONFIG.AI_IMAGE_PROVIDER) {
    case "openai":
      return requestImageFromOpenAI;
    case "azure":
      return requestImageFromOpenAI;
    case "workers":
      return requestImageFromWorkersAI;
    default:
      if (isOpenAIEnable(context) || isAzureEnable(context)) {
        return requestImageFromOpenAI;
      }
      if (isWorkersAIEnable(context)) {
        return requestImageFromWorkersAI;
      }
      return null;
  }
}
async function requestCompletionsFromLLM(text, context, llm, modifier, onStream) {
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = { real: [], original: [] };
  history = await loadHistory(historyKey, context);
  const readTime = ((performance.now() - readStartTime) / 1e3).toFixed(2);
  console.log(`readHistoryTime: ${readTime}s`);
  if (modifier) {
    const modifierData = modifier(history, text);
    history = modifierData.history;
    text = modifierData.text;
  }
  const { real: realHistory, original: originalHistory } = history;
  const answer = await llm(text, realHistory, context, onStream);
  if (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL) {
    text = "[A FILE] " + text;
  }
  if (!historyDisable) {
    originalHistory.push({ role: "user", content: text || "", cosplay: context.SHARE_CONTEXT.role || "" });
    originalHistory.push({ role: "assistant", content: answer, cosplay: context.SHARE_CONTEXT.role || "" });
    await DATABASE.put(historyKey, JSON.stringify(originalHistory)).catch(console.error);
  }
  return answer;
}
async function requestCompletionsFromReverseLLM(text, context, llm, modifier, onStream) {
  const CHAT_ID = context.REVERSE_CONTEXT.conversation_id;
  if (!CHAT_ID) {
    throw new Error("\u672A\u8BBE\u7F6E\u6D88\u606FID \u5982\u9700\u65B0\u5EFA\u5BF9\u8BDD \u8BF7\u6267\u884C `/new`\u547D\u4EE4");
  }
  const reverseContext = { ...context.REVERSE_CONTEXT, id: UUIDv4() };
  if (CHAT_ID === ":new:") {
    reverseContext.parent_message_id = UUIDv4();
  } else {
    if (CHAT_ID && !reverseContext.parent_message_id) {
      try {
        const detail2 = await requestReverseChatListOrHistory(context, "detail");
        reverseContext.parent_message_id = detail2?.current_node;
      } catch (e) {
        throw new Error(e.message);
      }
      if (!reverseContext.parent_message_id) {
        console.error(JSON.stringify(detail));
        throw new Error(`Can't get parent message id.`);
      }
    }
  }
  let history = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
  const answer = await llm(text, reverseContext, context, onStream);
  const { conversation_id, parent_message_id, title } = context.REVERSE_CONTEXT;
  if (!history[conversation_id]) {
    history[conversation_id] = {};
  }
  history[conversation_id] = {
    parent_message_id,
    title: title || history[conversation_id].title || "",
    update_time: /* @__PURE__ */ new Date()
  };
  history = Object.fromEntries(
    Object.entries(history).sort(([, a], [, b]) => new Date(b.update_time) - new Date(a.update_time)).slice(0, 25)
  );
  await DATABASE.put(
    context.SHARE_CONTEXT.reverseChatKey,
    JSON.stringify({
      conversation_id,
      parent_message_id
    })
  );
  await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(history));
  return answer;
}
async function chatWithLLM(text, context, modifier) {
  text = (context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.TEXT || "") + text;
  const sendFinalMsg = async (msg) => {
    let finalResponse = await sendMessageToTelegramWithContext2(context)(msg);
    if (finalResponse.status === 429) {
      let retryTime = 1e3 * (finalResponse.headers.get("Retry-After") ?? 10);
      console.log(`Wait ${retryTime / 1e3}s for final msg`);
      await delay(retryTime);
      finalResponse = await sendMessageToTelegramWithContext2(context)(msg);
    }
    if (finalResponse.status !== 200) {
      console.log(`[FAILED] Final Msg: ${await finalResponse.text()}`);
    } else {
      console.log(`[DONE] Final Msg`);
    }
    return finalResponse;
  };
  try {
    if (!context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {};
    }
    if (context.CURRENT_CHAT_CONTEXT.reply_markup) {
      delete context.CURRENT_CHAT_CONTEXT.reply_markup;
    }
    await sendLoadingMessageToTelegramWithContext(context);
    if (ENV.ENABLE_SHOWINFO && !ENV.REVERSE_MODE) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO += context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["MODEL"];
    }
    let originalInfo = context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO?.TEMP_INFO || "";
    const steps = context.CURRENT_CHAT_CONTEXT?.PROCESS_INFO?.STEP?.split("/") || [1, 1];
    const isLastStep = steps[0] == steps[1];
    setTimeout(() => sendChatActionToTelegramWithContext(context)("typing").catch(console.error), 0);
    let onStream = null;
    const generateInfo = async (text2) => {
      let extraInfo = "";
      if (ENV.ENABLE_SHOWINFO) {
        const time = ((performance.now() - llmStart) / 1e3).toFixed(2);
        extraInfo = ` ${time}s`;
      }
      if (ENV.ENABLE_SHOWTOKENINFO && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO.promptToken && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO.completionToken && !ENV.REVERSE_MODE) {
        extraInfo += " \nToken: " + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.promptToken + " | " + context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.completionToken + " ";
      }
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = originalInfo + extraInfo;
      return null;
    };
    if (ENV.STREAM_MODE) {
      onStream = async (text2) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !isLastStep) {
          return;
        }
        try {
          await generateInfo();
          const resp = await sendMessageToTelegramWithContext2(context)(text2);
          if (!context.CURRENT_CHAT_CONTEXT.message_id && resp.ok) {
            context.CURRENT_CHAT_CONTEXT.message_id = (await resp.json()).result.message_id;
          }
          return resp;
        } catch (e) {
          console.error(e);
        }
      };
    }
    const llm = loadChatLLM(context);
    if (llm === null) {
      return sendMessageToTelegramWithContext2(context)(`LLM is not enable`);
    }
    console.log(`[START] Chat via ${llm.name}`);
    const llmStart = performance.now();
    const answer = await (ENV.REVERSE_MODE ? requestCompletionsFromReverseLLM : requestCompletionsFromLLM)(text, context, llm, modifier, onStream);
    console.log(`[DONE] Chat with LLM: ${((performance.now() - llmStart) / 1e3).toFixed(2)}s`);
    if (ENV.SHOW_REPLY_BUTTON && context.CURRENT_CHAT_CONTEXT.message_id) {
      try {
        await deleteMessageFromTelegramWithContext(context)(context.CURRENT_CHAT_CONTEXT.message_id);
        context.CURRENT_CHAT_CONTEXT.message_id = null;
        context.CURRENT_CHAT_CONTEXT.reply_markup = {
          keyboard: [[{ text: "/new" }, { text: "/redo" }]],
          selective: true,
          resize_keyboard: true,
          one_time_keyboard: true
        };
      } catch (e) {
        console.error(e);
      }
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || isLastStep) {
      if (!ENV.REVERSE_MODE)
        await generateInfo(answer);
      await sendFinalMsg(answer);
    }
    context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT = answer;
    return null;
  } catch (e) {
    let errMsg = `Error: ${e.message}`;
    console.error(errMsg);
    if (errMsg.length > 2048) {
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendFinalMsg(errMsg);
  }
}

// src/command.js
var commandAuthCheck = {
  default: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      return ["administrator", "creator"];
    }
    return false;
  },
  shareModeGroup: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE) {
        return false;
      }
      return ["administrator", "creator"];
    }
    return false;
  }
};
var commandSortList = [
  "/new",
  "/redo",
  "/img",
  "/role",
  "/setenv",
  "/delenv",
  "/version",
  "/usage",
  "/system",
  "/help",
  "/mode"
];
var commandSortListNew = [
  "/new",
  "/setenv",
  "/delenv",
  "/chatlist",
  "/history",
  "/setid",
  "/setalias",
  "/refreshchatlist",
  "/system",
  "/help"
];
var commandHandlers = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandGetHelp
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/start": {
    scopes: [],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandGenerateImg,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandFetchUpdate,
    needAuth: commandAuthCheck.default
  },
  "/setenv": {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/setenvs": {
    scopes: [],
    fn: commandUpdateUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/clearenv": {
    scopes: [],
    fn: commandClearUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/usage": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandUsage,
    needAuth: commandAuthCheck.default
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandSystem,
    needAuth: commandAuthCheck.default
  },
  "/role": {
    scopes: ["all_private_chats"],
    fn: commandUpdateRole,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: commandRegenerate,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/mode": {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  }
};
var commandHandlersNew = {
  "/new": {
    scopes: ["all_private_chats"],
    fn: commandReverseNewChat,
    needAuth: commandAuthCheck.default
  },
  "/setenv": {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/setenvs": {
    scopes: [],
    fn: commandUpdateUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/chatlist": {
    scopes: ["all_private_chats"],
    fn: commandGetChatList,
    needAuth: commandAuthCheck.default
  },
  "/history": {
    scopes: ["all_private_chats"],
    fn: commandReverseHistory,
    needAuth: commandAuthCheck.default
  },
  "/system": {
    scopes: ["all_private_chats"],
    fn: commandSystemNew,
    needAuth: commandAuthCheck.default
  },
  "/setid": {
    scopes: ["all_private_chats"],
    fn: commandSetId,
    needAuth: commandAuthCheck.default
  },
  "/help": {
    scopes: ["all_private_chats"],
    fn: commandGetHelp
  },
  "/setalias": {
    scopes: ["all_private_chats"],
    needAuth: commandAuthCheck.default,
    fn: commandSetChatAlias
  },
  "/refreshchatlist": {
    scopes: ["all_private_chats"],
    fn: commandRefreshChatList,
    needAuth: commandAuthCheck.default
  }
};
async function commandUpdateRole(message, command, subcommand, context) {
  if (subcommand === "show") {
    const size = Object.getOwnPropertyNames(context.USER_DEFINE.ROLE).length;
    if (size === 0) {
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.not_defined_any_role);
    }
    let showMsg = ENV.I18N.command.role.current_defined_role(size);
    for (const role2 in context.USER_DEFINE.ROLE) {
      if (Object.prototype.hasOwnProperty.call(context.USER_DEFINE.ROLE, role2)) {
        showMsg += `~${role2}:
<pre>`;
        showMsg += JSON.stringify(context.USER_DEFINE.ROLE[role2]) + "\n";
        showMsg += "</pre>";
      }
    }
    context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
    return sendMessageToTelegramWithContext2(context)(showMsg);
  }
  const kv = subcommand.indexOf(" ");
  if (kv === -1) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.help);
  }
  const role = subcommand.slice(0, kv);
  const settings = subcommand.slice(kv + 1).trim();
  const skv = settings.indexOf("=");
  if (skv === -1) {
    if (settings === "del") {
      try {
        if (context.USER_DEFINE.ROLE[role]) {
          delete context.USER_DEFINE.ROLE[role];
          await DATABASE.put(
            context.SHARE_CONTEXT.configStoreKey,
            JSON.stringify(Object.assign(context.USER_CONFIG, { USER_DEFINE: context.USER_DEFINE }))
          );
          return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.delete_role_success);
        }
      } catch (e) {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.delete_role_error(e));
      }
    }
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.help);
  }
  const key = settings.slice(0, skv);
  const value = settings.slice(skv + 1);
  if (!context.USER_DEFINE.ROLE[role]) {
    context.USER_DEFINE.ROLE[role] = {
      // 系统初始化消息
      SYSTEM_INIT_MESSAGE: ENV.SYSTEM_INIT_MESSAGE,
      // OpenAI API 额外参数
      OPENAI_API_EXTRA_PARAMS: {}
    };
  }
  try {
    mergeConfig(context.USER_DEFINE.ROLE[role], key, value);
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(Object.assign(context.USER_CONFIG, { USER_DEFINE: context.USER_DEFINE }))
    );
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.update_role_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.role.update_role_error(e));
  }
}
async function commandGenerateImg(message, command, subcommand, context) {
  if (subcommand === "") {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.img.help);
  }
  try {
    setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
    const PROCESS_INFO = {
      TYPE: "text:image",
      PROVIDER_SOURCE: "default",
      AI_PROVIDER: ENV.AI_IMAGE_PROVIDER,
      MODEL: context.USER_CONFIG.DALL_E_MODEL
    };
    if (!context.CURRENT_CHAT_CONTEXT) {
      context.CURRENT_CHAT_CONTEXT = {};
    }
    context.CURRENT_CHAT_CONTEXT.PROCESS_INFO = PROCESS_INFO;
    const gen = loadImageGen(context);
    if (!gen) {
      return sendMessageToTelegramWithContext2(context)(`ERROR: Image generator not found`);
    }
    const startTime = performance.now();
    const img = await gen(subcommand, context);
    if (typeof img === "string") {
      const provider = (context.USER_CONFIG.AI_IMAGE_PROVIDER == "auto" ? "openai" : context.USER_CONFIG.AI_PROVIDER).toUpperCase();
      let model = PROCESS_INFO.MODEL;
      if (provider == "OPENAI") {
        model = context.USER_CONFIG.DALL_E_MODEL + " " + context.USER_CONFIG.DALL_E_IMAGE_QUALITY + " " + context.USER_CONFIG.DALL_E_IMAGE_STYLE + " " + context.USER_CONFIG.DALL_E_IMAGE_SIZE;
      } else if (provider == "WORKERS") {
        model = ENV.WORKERS_IMAGE_MODEL;
      }
      const time = ((performance.now() - startTime) / 1e3).toFixed(2);
      if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO) {
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {};
      }
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = `${time}s
>${model}`;
    }
    return sendPhotoToTelegramWithContext(context)(img);
  } catch (e) {
    console.error(e.message);
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandGetHelp(message, command, subcommand, context) {
  const helpMsg = ENV.I18N.command.help.summary + "```markdown\n" + Object.keys(ENV.REVERSE_MODE ? commandHandlersNew : commandHandlers).map((key) => `${key}\uFF1A${ENV.I18N.command.help[key.substring(1)]}`).join("\n") + "\n```";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "MarkdownV2";
  return sendMessageToTelegramWithContext2(context)(helpMsg);
}
async function commandCreateNewChatContext(message, command, subcommand, context) {
  try {
    await DATABASE.delete(context.SHARE_CONTEXT.chatHistoryKey);
    context.CURRENT_CHAT_CONTEXT.reply_markup = JSON.stringify({
      remove_keyboard: true,
      selective: true
    });
    if (command === "/new") {
      if (message?.text || message.text.replace(command).trim() === "") {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.new.new_chat_start);
      }
      return null;
    } else {
      if (context.SHARE_CONTEXT.chatType === "private") {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.new.new_chat_start_private(context.CURRENT_CHAT_CONTEXT.chat_id));
      } else {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.new.new_chat_start_group(context.CURRENT_CHAT_CONTEXT.chat_id));
      }
    }
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandUpdateUserConfig(message, command, subcommand, context) {
  if (command == "/mode") {
    if (subcommand == "all") {
      const msg = `<pre>mode\u6E05\u5355:   
- ${Object.keys(context.USER_CONFIG.MODES).join("\n- ")}</pre>`;
      context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
      return sendMessageToTelegramWithContext2(context)(msg);
    } else if (!subcommand) {
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.mode.help);
    }
    if (!context.USER_CONFIG.MODES?.[subcommand]) {
      const msg = ENV.I18N.command.setenv.update_config_error(new Error(`mode \`${subcommand}\` not exist`));
      return sendMessageToTelegramWithContext2(context)(msg);
    }
    subcommand = `CURRENT_MODE=${subcommand}`;
  }
  const kv = subcommand.indexOf("=");
  if (kv === -1) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.help);
  }
  const key = subcommand.slice(0, kv).trim();
  const value = subcommand.slice(kv + 1).trim();
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
    const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${key} is locked`));
    return sendMessageToTelegramWithContext2(context)(msg);
  }
  try {
    context.USER_CONFIG.DEFINE_KEYS.push(key);
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    mergeConfig(context.USER_CONFIG, key, value);
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(context.USER_CONFIG)
    );
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandUpdateUserConfigs(message, command, subcommand, context) {
  try {
    const values = JSON.parse(subcommand);
    for (const ent of Object.entries(values)) {
      const [key, value] = ent;
      if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
        const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${key} is locked`));
        return sendMessageToTelegramWithContext2(context)(msg);
      }
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      mergeConfig(context.USER_CONFIG, key, value);
      console.log(JSON.stringify(context.USER_CONFIG));
    }
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(context.USER_CONFIG)
    );
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandDeleteUserConfig(message, command, subcommand, context) {
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
    const msg = ENV.I18N.command.setenv.update_config_error(new Error(`Key ${subcommand} is locked`));
    return sendMessageToTelegramWithContext2(context)(msg);
  }
  try {
    if (subcommand === "all") {
      context.USER_CONFIG = new Context().USER_CONFIG;
    } else
      context.USER_CONFIG[subcommand] = null;
    context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(context.USER_CONFIG)
    );
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandClearUserConfig(message, command, subcommand, context) {
  try {
    context.USER_CONFIG.DEFINE_KEYS = [];
    context.USER_CONFIG = {};
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify({})
    );
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandFetchUpdate(message, command, subcommand, context) {
  const config = {
    headers: {
      "User-Agent": CONST.USER_AGENT
    }
  };
  const current = {
    ts: ENV.BUILD_TIMESTAMP,
    sha: ENV.BUILD_VERSION
  };
  const repo = `https://raw.githubusercontent.com/TBXark/ChatGPT-Telegram-Workers/${ENV.UPDATE_BRANCH}`;
  const ts = `${repo}/dist/timestamp`;
  const info = `${repo}/dist/buildinfo.json`;
  let online = await fetchWithRetry(info, config).then((r) => r.json()).catch(() => null);
  if (!online) {
    online = await fetchWithRetry(ts, config).then((r) => r.text()).then((ts2) => ({ ts: Number(ts2.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }));
  }
  if (current.ts < online.ts) {
    const msg = ENV.I18N.command.version.new_version_found(current, online);
    return sendMessageToTelegramWithContext2(context)(msg);
  } else {
    const msg = ENV.I18N.command.version.current_is_latest_version(current);
    return sendMessageToTelegramWithContext2(context)(msg);
  }
}
async function commandUsage(message, command, subcommand, context) {
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.usage.usage_not_open);
  }
  const usage = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.usageKey));
  let text = ENV.I18N.command.usage.current_usage;
  if (usage?.tokens) {
    const { tokens } = usage;
    const sortedChats = Object.keys(tokens.chats || {}).sort((a, b) => tokens.chats[b] - tokens.chats[a]);
    text += ENV.I18N.command.usage.total_usage(tokens.total);
    for (let i = 0; i < Math.min(sortedChats.length, 30); i++) {
      text += `
  - ${sortedChats[i]}: ${tokens.chats[sortedChats[i]]} tokens`;
    }
    if (sortedChats.length === 0) {
      text += "0 tokens";
    } else if (sortedChats.length > 30) {
      text += "\n  ...";
    }
  } else {
    text += ENV.I18N.command.usage.no_usage;
  }
  return sendMessageToTelegramWithContext2(context)(text);
}
async function commandSystem(message, command, subcommand, context) {
  let msg = "<pre>CHAT_MODEL: " + context.USER_CONFIG.CHAT_MODEL + "\n";
  if (!ENV.DEV_MODE) {
    msg += "AI_PROVIDER: " + context.USER_CONFIG.AI_PROVIDER + "\nVISION_MODEL: " + context.USER_CONFIG.OPENAI_VISION_MODEL + "\nSTT_MODEL: " + context.USER_CONFIG.OPENAI_STT_MODEL + "\nDALL_E_MODEL: " + context.USER_CONFIG.DALL_E_MODEL + " " + context.USER_CONFIG.DALL_E_IMAGE_SIZE + " " + context.USER_CONFIG.DALL_E_IMAGE_QUALITY + " " + context.USER_CONFIG.DALL_E_IMAGE_STYLE + "\n---\n" + CUSTOM_TINFO(context.USER_CONFIG) + "\n";
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
      Object.keys(source).map((k) => source[k] = "******");
      return null;
    });
    msg = `<pre>
USER_CONFIG: ${JSON.stringify(context.USER_CONFIG, null, 2)}
`;
    msg += `CHAT_CONTEXT: ${JSON.stringify(context.CURRENT_CHAT_CONTEXT, null, 2)}
`;
    msg += `SHARE_CONTEXT: ${JSON.stringify(shareCtx, null, 2)}
`;
  }
  msg += "</pre>";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext2(context)(msg);
}
async function commandRegenerate(message, command, subcommand, context) {
  const mf = (history, text) => {
    const { real, original } = history;
    let nextText = text;
    if (!real || !original || real.length === 0 || original.length === 0) {
      throw new Error(ENV.I18N.message.history_empty);
    }
    while (true) {
      const data = real.pop();
      original.pop();
      if (data === void 0 || data === null) {
        break;
      } else if (data.role === "user") {
        if (text === "" || text === void 0 || text === null) {
          nextText = data.content;
        }
        break;
      }
    }
    if (subcommand) {
      nextText = subcommand;
    }
    return { history: { real, original }, text: nextText };
  };
  return chatWithLLM(null, context, mf);
}
async function commandEcho(message, command, subcommand, context) {
  let msg = "<pre>";
  msg += JSON.stringify({ message }, null, 2);
  msg += "</pre>";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext2(context)(msg);
}
async function handleCommandMessage(message, context) {
  if (!message.text) {
    const acceptType = ["document", "photo", "image", "voice", "audio"];
    const isContainFile = acceptType.some((key) => key in message);
    if (!isContainFile)
      return sendMessageToTelegramWithContext2(context)("No question found");
    return null;
  }
  if (ENV.DEV_MODE) {
    commandHandlers["/echo"] = {
      help: "[DEBUG ONLY] echo message",
      scopes: ["all_private_chats", "all_chat_administrators"],
      fn: commandEcho,
      needAuth: commandAuthCheck.default
    };
  }
  if (context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL) {
    return null;
  }
  const customKey = Object.keys(CUSTOM_COMMAND).find((k) => message.text.startsWith(k));
  if (customKey) {
    message.text = message.text.replace(customKey, CUSTOM_COMMAND[customKey]);
  }
  const commandSelect = ENV.REVERSE_MODE ? commandHandlersNew : commandHandlers;
  const msgRegExp = /^.*?[!！]/;
  const commandMsg = msgRegExp.exec(message.text)?.[0].slice(0, -1) || message.text;
  const otherMsg = message.text.substring(commandMsg.length + 1);
  for (const key in commandSelect) {
    if (commandMsg === key || commandMsg.startsWith(key + " ") || commandMsg.startsWith(key + `@${context.SHARE_CONTEXT.currentBotName}`)) {
      const command = commandSelect[key];
      try {
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType);
          if (roleList) {
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId);
            if (chatRole === null) {
              return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.permission.not_authorized);
            }
            if (!roleList.includes(chatRole)) {
              const msg = ENV.I18N.command.permission.not_enough_permission(roleList, chatRole);
              return sendMessageToTelegramWithContext2(context)(msg);
            }
          }
        }
      } catch (e) {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.permission.role_error(e));
      }
      const subcommand = commandMsg.substring(key.length).trim();
      try {
        const result = await command.fn(message, key, subcommand, context);
        console.log("[DONE] Command: " + key + " " + subcommand);
        if (!otherMsg) {
          return result;
        }
        message.text = otherMsg;
        break;
      } catch (e) {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.permission.command_error(e));
      }
    }
  }
  if (message.text.startsWith("/")) {
    return sendMessageToTelegramWithContext2(context)(`Oops! It's not a command.`);
  }
  return null;
}
async function bindCommandForTelegram(token) {
  const scopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  const commands = ENV.REVERSE_MODE ? commandSortListNew : commandSortList;
  if (!ENV.ENABLE_USAGE_STATISTICS) {
    commands.splice(commands.indexOf("/usage"), 1);
  }
  const commandHandlersSelect = ENV.REVERSE_MODE ? commandHandlersNew : commandHandlers;
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
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commands: scopeCommandMap[scope].map((command) => ({
            command,
            description: ENV.I18N.command.help[command.substring(1)] || ""
          })),
          scope: {
            type: scope
          }
        })
      }
    ).then((res) => res.json());
  }
  return { ok: true, result };
}
function commandsDocument() {
  return Object.keys(commandHandlers).map((key) => {
    return {
      command: key,
      description: ENV.I18N.command.help[key.substring(1)]
    };
  });
}
async function commandGetChatList(message, command, subcommand, context) {
  const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
  try {
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
    if (Object.keys(reverseChatInfo).length === 0) {
      await loadingPromise;
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.refreshchatlist);
    }
    let conversation_id = context.REVERSE_CONTEXT.conversation_id;
    context.CURRENT_CHAT_CONTEXT.parse_mode = "MarkdownV2";
    let formatData = Object.entries(reverseChatInfo).map(
      ([k, { title: title2, update_time: update_time2, alias: alias2 }], i) => `${i}. ${title2 || "-"}
` + (update_time2 ? `update time: ${update_time2.substring(0, 19)}
` : "") + (alias2 ? `- alias: ${alias2}
` : "")
      // + `\n${k}`,
    );
    const { alias, title = "-", update_time } = reverseChatInfo?.[conversation_id] ?? {};
    formatData = "```\n\u5F53\u524D\u5BF9\u8BDD:\n" + (title ? `title: ${title} ` : "- ") + (update_time ? `
update time: ${update_time.substring(0, 19)}
` : "\n") + `id: ${conversation_id || null}
` + (alias ? `alias: ${alias}

` : "\n") + formatData.join("\n") + "\n```";
    await loadingPromise;
    return sendMessageToTelegramWithContext2(context)(formatData);
  } catch (e) {
    await loadingPromise;
    return sendMessageToTelegramWithContext2(context)(e.message);
  }
}
async function commandRefreshChatList(message, command, subcommand, context) {
  try {
    const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
    const chatListData = await requestReverseChatListOrHistory(context, "list", 25);
    if (!chatListData.items || chatListData?.items?.length === 0) {
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.chatlist_not_found);
    }
    chatListData?.items?.forEach(({ id, title, update_time, create_time }) => {
      reverseChatInfo[id] = {
        ...reverseChatInfo[id] || {},
        title,
        // parent_message_id: '',
        // id: i.id,
        // alias: '',
        update_time,
        create_time
        // is_archived: i.is_archived,
      };
    });
    reverseChatInfo = Object.fromEntries(
      Object.entries(reverseChatInfo).sort(([, a], [, b]) => new Date(b.update_time) - new Date(a.update_time)).slice(0, 25)
    );
    await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(reverseChatInfo));
    await loadingPromise;
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.refreshchatlist.refresh_success(chatListData.items.length));
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(e.message);
  }
}
async function commandReverseHistory(message, command, subcommand, context) {
  const loadingPromise = sendLoadingMessageToTelegramWithContext(context);
  try {
    let toDateTime = function(timestamp) {
      const date = new Date(timestamp);
      const options = { timeZone: "Asia/Shanghai", hour12: false };
      return date.toLocaleString("zh-CN", options);
    };
    const conversation_id = context.REVERSE_CONTEXT.conversation_id;
    if (!conversation_id || conversation_id === ":new:") {
      await loadingPromise;
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.new_chat_or_id_is_empty);
    }
    const detail2 = await requestReverseChatListOrHistory(context, "detail");
    const parent_message_id = detail2?.current_node || "";
    const reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
    if (parent_message_id && parent_message_id !== context.REVERSE_CONTEXT.parent_message_id) {
      reverseChatInfo[conversation_id].parent_message_id = parent_message_id;
      context.REVERSE_CONTEXT.parent_message_id = parent_message_id;
      await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
      await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(reverseChatInfo));
    } else if (!parent_message_id) {
      await loadingPromise;
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.history.query_error);
    }
    let filterData = Object.values(detail2.mapping).filter(({ message: message2 }) => message2?.author?.name !== "browser" && "text" === message2?.content?.content_type && message2.content.parts.join("")).sort((a, b) => a.message.create_time - b.message.create_time).slice(-10).map(({ message: { author: { role }, content: { parts }, create_time } }) => {
      role = role === "user" ? "you" : "gpt";
      return `${role} [${toDateTime(create_time * 1e3)}]:
${parts.join("\n")}
`;
    }).join("-".repeat(36) + "\n");
    filterData = "```markdown\nLatest 10 messages:\n\n" + filterData + "```\n";
    await loadingPromise;
    return sendMessageToTelegramWithContext2(context)(filterData);
  } catch (e) {
    await loadingPromise;
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandReverseNewChat(message, command, subcommand, context) {
  try {
    context.REVERSE_CONTEXT = { conversation_id: ":new:", parent_message_id: "" };
    await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandSetId(message, command, subcommand, context) {
  try {
    subcommand = subcommand.trim();
    const idIndexreg = /^\d+$/;
    const idAliasReg = /^\S+$/;
    const idReg = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
    let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
    let message2 = "";
    if (idIndexreg.test(subcommand)) {
      if (Object.keys(reverseChatInfo).length === 0) {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.history_empty);
      }
      if (subcommand > Object.keys(reverseChatInfo).length - 1 || subcommand < 0) {
        message2 = ENV.I18N.command.setid.out_of_range(Object.keys(reverseChatInfo).length);
      }
      const dataList = Object.entries(reverseChatInfo);
      context.REVERSE_CONTEXT = {
        conversation_id: dataList[subcommand][0],
        parent_message_id: dataList[subcommand][1].parent_message_id
      };
    } else if (idReg.test(subcommand)) {
      context.REVERSE_CONTEXT = {
        conversation_id: subcommand,
        parent_id: reverseChatInfo[subcommand].parent_message_id
      };
    } else if (idAliasReg.test(subcommand)) {
      const conversation_id = Object.keys(reverseChatInfo).find((key) => reverseChatInfo[key].alias === subcommand);
      if (conversation_id) {
        context.REVERSE_CONTEXT = {
          conversation_id,
          parent_message_id: reverseChatInfo[conversation_id].parent_message_id
        };
      } else
        message2 = ENV.I18N.commond.setid.alias_not_found(subcommand);
    } else
      message2 = ENV.I18N.command.setid.help;
    if (message2) {
      return sendMessageToTelegramWithContext2(context)(message2);
    } else {
      await DATABASE.put(context.SHARE_CONTEXT.reverseChatKey, JSON.stringify(context.REVERSE_CONTEXT));
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
    }
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandSetChatAlias(message, command, subcommand, context) {
  try {
    const idAndAliasregex = /^\s*(\d+)\s*(\S+)$/;
    const result = subcommand.match(idAndAliasregex);
    if (result?.[1] && result?.[2]) {
      let reverseChatInfo = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.reverseHistoryKey) || "{}");
      if (Object.keys(reverseChatInfo).length === 0) {
        return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.refreshchatlist);
      }
      if (result[1] > Object.keys(reverseChatInfo).length) {
        throw new Error(`Error: index need smaller than ${Object.keys(reverseChatInfo).length}`);
      }
      const dataList = Object.entries(reverseChatInfo);
      dataList[result[1]][1].alias = result[2];
      await DATABASE.put(context.SHARE_CONTEXT.reverseHistoryKey, JSON.stringify(Object.fromEntries(dataList)));
    } else
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setalias.help);
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_success);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}
async function commandSystemNew(message, command, subcommand, context) {
  try {
    let msg = `\`\`\`markdown
REVERSE_PERFIX: ${context.USER_CONFIG.REVERSE_PERFIX}
REVERSE_TOKEN: ${context.USER_CONFIG.REVERSE_TOKEN ? "******" : "null"}
CHAT_MODEL: ${context.USER_CONFIG.CHAT_MODEL}

REVERSE_CHAT: ${JSON.stringify(context.REVERSE_CONTEXT, null, 2)}
\`\`\``;
    context.CURRENT_CHAT_CONTEXT.parse_mode = "MarkdownV2";
    return sendMessageToTelegramWithContext2(context)(msg);
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.setenv.update_config_error(e));
  }
}

// src/message.js
async function msgInitChatContext(message, context) {
  try {
    await context.initContext(message);
  } catch (e) {
    return new Response(errorToString2(e), { status: 200 });
  }
  return null;
}
async function msgSaveLastMessage(message, context) {
  if (ENV.DEBUG_MODE) {
    const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
    await DATABASE.put(lastMessageKey, JSON.stringify(message), { expirationTtl: 3600 });
  }
  return null;
}
async function msgIgnoreOldMessage(message, context) {
  if (ENV.SAFE_MODE) {
    let idList = [];
    try {
      const rawValue = await DATABASE.get(context.SHARE_CONTEXT.chatLastMessageIDKey).catch(() => "[]");
      idList = typeof rawValue === "string" && rawValue ? JSON.parse(rawValue) : [];
    } catch (e) {
      console.error(e);
    }
    if (idList.includes(message.message_id)) {
      console.log("ignore old msg");
      return new Response(JSON.stringify({
        ok: true
      }), { status: 200 });
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
async function msgCheckEnvIsReady(message, context) {
  if (!DATABASE) {
    return sendMessageToTelegramWithContext2(context)("DATABASE Not Set");
  }
  return null;
}
async function msgFilterWhiteList(message, context) {
  if (ENV.I_AM_A_GENEROUS_PERSON) {
    return null;
  }
  if (context.SHARE_CONTEXT.chatType === "private") {
    if (!ENV.CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext2(context)(
        ENV.I18N.message.user_has_no_permission_to_use_the_bot(context.CURRENT_CHAT_CONTEXT.chat_id)
      );
    }
    return null;
  }
  if (CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    if (!ENV.GROUP_CHAT_BOT_ENABLE) {
      return new Response("Not support", { status: 401 });
    }
    if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext2(context)(
        ENV.I18N.message.group_has_no_permission_to_use_the_bot(context.CURRENT_CHAT_CONTEXT.chat_id)
      );
    }
    return null;
  }
  return sendMessageToTelegramWithContext2(context)(
    ENV.I18N.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType)
  );
}
async function msgFilterNonTextMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE && (ENV.EXTRA_MESSAGE_CONTEXT && !message.reply_to_message.text)) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.not_supported_chat_type_message);
  }
  return null;
}
async function msgHandlePrivateMessage(message, context) {
  if (ENV.REVERSE_MODE) {
    return null;
  }
  if (message.voice || message.audio || message.photo || message.document) {
    return null;
  }
  if (!message.text) {
    return new Response("Non text message", { "status": 200 });
  }
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) => message.text.startsWith(key));
  if (chatMsgKey) {
    message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey] + "!");
  }
  return null;
}
async function msgHandleGroupMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response("Non text message", { status: 200 });
  }
  let botName = context.SHARE_CONTEXT.currentBotName;
  if (!botName) {
    const res = await getBot(context.SHARE_CONTEXT.currentBotToken);
    context.SHARE_CONTEXT.currentBotName = res.info.bot_name;
    botName = res.info.bot_name;
  }
  if (message.reply_to_message) {
    if (`${message.reply_to_message.from.id}` === context.SHARE_CONTEXT.currentBotId) {
      return null;
    } else if (ENV.EXTRA_MESSAGE_CONTEXT) {
      context.SHARE_CONTEXT.extraMessageContext = message.reply_to_message;
    }
  }
  if (botName) {
    let mentioned = false;
    const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) => (message?.text || "").startsWith(key));
    if (chatMsgKey) {
      mentioned = true;
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey] + "!");
    } else if (message.entities) {
      let content = "";
      let offset = 0;
      message.entities.forEach((entity) => {
        switch (entity.type) {
          case "bot_command":
            if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length
              );
              if (mention.endsWith(botName)) {
                mentioned = true;
              }
              const cmd = mention.replaceAll("@" + botName, "").replaceAll(botName, "").trim();
              content += cmd;
              offset = entity.offset + entity.length;
            }
            break;
          case "mention":
          case "text_mention":
            if (!mentioned && context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL) {
              mentioned = true;
              break;
            } else if (!mentioned) {
              const mention = message.text.substring(
                entity.offset,
                entity.offset + entity.length
              );
              if (mention === botName || mention === "@" + botName) {
                mentioned = true;
              }
            }
            content += message?.text.substring(offset, entity.offset) || "";
            offset = entity.offset + entity.length;
            break;
        }
      });
      content += message?.text.substring(offset, message.text.length) || "";
      message.text = content.trim();
    }
    if (!mentioned) {
      return new Response("No mentioned", { status: 200 });
    } else {
      return null;
    }
  }
  return new Response("Not set bot name", { status: 200 });
}
async function msgInitUserConfig(message, context) {
  try {
    await context._initUserConfig(context.SHARE_CONTEXT.configStoreKey);
    if (ENV.REVERSE_MODE) {
      await context._initReverseContext();
    }
    return null;
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(e.message);
  }
}
async function msgIgnoreSpecificMessage(message, context) {
  if (ENV.IGNORE_TEXT && message?.text?.startsWith(ENV.IGNORE_TEXT)) {
    return new Response("ignore specific text", { status: 200 });
  }
  return null;
}
async function msgHandleCommand(message, context) {
  return await handleCommandMessage(message, context);
}
async function msgHandleRole(message, context) {
  if (!(message.text || "").startsWith("~")) {
    return null;
  }
  message.text = message.text.slice(1);
  const kv = message.text.indexOf(" ");
  if (kv === -1) {
    return null;
  }
  const role = message.text.slice(0, kv);
  const msg = message.text.slice(kv + 1).trim();
  if (Object.prototype.hasOwnProperty.call(context.USER_DEFINE.ROLE, role)) {
    context.SHARE_CONTEXT.role = role;
    message.text = msg;
    const roleConfig = context.USER_DEFINE.ROLE[role];
    for (const key in roleConfig) {
      if (Object.prototype.hasOwnProperty.call(context.USER_CONFIG, key) && typeof context.USER_CONFIG[key] === typeof roleConfig[key]) {
        if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
          continue;
        }
        context.USER_CONFIG[key] = roleConfig[key];
      }
    }
  }
}
async function msgHandleFile(message, fileType, context) {
  if (!context.CURRENT_CHAT_CONTEXT.message_id) {
    const msg = await sendMessageToTelegramWithContext2(context)(
      ENV.I18N.message.loading
    ).then((r) => r.json());
    context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    context.CURRENT_CHAT_CONTEXT.reply_markup = null;
  }
  let file = null, file_name = "", file_url = "";
  let errorMsg = "";
  if (!context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILEURL && !context.CURRENT_CHAT_CONTEXT?.MIDDLE_INFO?.FILE) {
    let file_id;
    if (fileType == "photo") {
      const photoLength = message[fileType].length;
      file_id = (message[fileType]?.[photoLength - 1]?.file_id || message[fileType]?.file_id) ?? 0;
      console.log("photo: \n" + JSON.stringify(message[fileType]));
    } else {
      file_id = message[fileType]?.file_id ?? "0";
    }
    if (!message.text) {
      message.text = message.caption ?? "";
    }
    const info = await getFileInfo(file_id, context.SHARE_CONTEXT.currentBotToken);
    if (!info.file_path) {
      console.log("[FILE][FAILED]: " + msgType);
      await sendMessageToTelegramWithContext2(context)(`GET FILE_PATH ERROR: ${info.description}`);
      return new Response("Handle file msg error", { status: 200 });
    }
    if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO) {
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {};
    }
    file_name = info.file_path.split("/").pop();
    file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${context.SHARE_CONTEXT.currentBotToken}/${info.file_path}`;
    console.log("File url:", file_url);
    context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = file_url;
    if (fileType != "photo" || fileType == "photo" && ENV.LOAD_IMAGE_FILE) {
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
  try {
    switch (fileType) {
      case "photo":
      case "image":
        if (errorMsg)
          break;
        if (ENV.LOAD_IMAGE_FILE) {
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = `data:image/jpeg;base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
        }
        ;
        console.log(
          `[FILE][DONE] ${fileType}: ${((performance.now() - start) / 1e3).toFixed(2)}s`
        );
        return null;
      case "voice":
      case "audio": {
        if (errorMsg)
          break;
        const stt_data = await requestTranscriptionFromOpenAI(
          file,
          file_name,
          context
        ).then((r) => r.json());
        if (stt_data.error) {
          errorMsg = `[FILE][FAILED] STT: ${stt_data.error.message}`;
          console.log(`${errorMsg}`);
          break;
        }
        const time = ((performance.now() - start) / 1e3).toFixed(2);
        console.log(`[FILE][DONE] STT: ${time}s`);
        console.log("Transcription:\n" + stt_data.text);
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT = stt_data.text;
        const steps = context.CURRENT_CHAT_CONTEXT.PROCESS_INFO.STEP.split("/");
        const isLastStep = steps[0] == steps[1];
        if (!ENV.HIDE_MIDDLE_MESSAGE || isLastStep) {
          const model_time_msg = ENV.ENABLE_SHOWINFO ? `${context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["MODEL"]} ${time}s   ` : "";
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO += model_time_msg;
          const msgResp = await sendMessageToTelegramWithContext2(context)(
            stt_data.text
          ).then((r) => r.json());
          if (!msgResp.ok) {
            errorMsg = `[FILE][FAILED] Send transcription failed: ${msgResp.message}`;
            console.log(`${errorMsg}`);
            break;
          }
        }
        console.log("[FILE][DONE]: " + fileType);
        return null;
      }
    }
  } catch (e) {
    console.error(e);
  }
  if (errorMsg) {
    return sendMessageToTelegramWithContext2(context)(errorMsg);
  }
  return new Response("Handle file msg failed", { status: 200 });
}
async function msgChatWithLLM(message, context) {
  if (ENV.REVERSE_MODE)
    return chatWithLLM(message.text, context, null);
  const acceptType = ENV.ENABLE_FILE ? ["photo", "image", "voice", "audio", "text"] : ["text"];
  let msgType2 = acceptType.find((key) => key in message);
  let fileType = ENV.ENABLE_FILE ? message?.document || msgType2 : msgType2;
  if (message?.document && ENV.ENABLE_FILE) {
    if (message.document.mime_type.match(/image/)) {
      msgType2 = "image";
    } else if (message.document.mime_type.match(/audio/))
      msgType2 = "audio";
  }
  if (!fileType) {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.message.not_supported_chat_type_message);
  }
  console.log("[FILE]: " + fileType);
  const MODE = context.USER_CONFIG.CURRENT_MODE;
  if (msgType2 == "voice") {
    msgType2 = "audio";
  } else if (msgType2 == "photo") {
    msgType2 = "image";
  }
  try {
    const HANDLE_PROCESS = context.USER_CONFIG.MODES?.[MODE]?.[msgType2] || ENV.MODES.default?.[msgType2];
    let text = (message.text || "").trim();
    if (ENV.EXTRA_MESSAGE_CONTEXT && context.SHARE_CONTEXT?.extraMessageContext?.text) {
      text = context.SHARE_CONTEXT.extraMessageContext.text + "\n" + text;
    }
    if (context.USER_CONFIG.AI_PROVIDER == "auto") {
      context.USER_CONFIG.AI_PROVIDER = "openai";
    }
    let result;
    for (const [i, PROCESS] of HANDLE_PROCESS.entries()) {
      if (result && result instanceof Response) {
        return result;
      }
      if (!PROCESS.TYPE) {
        PROCESS.TYPE = `${msgType2}:text`;
      }
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }
      const PROCESS_INFO = queryProcessInfo(context, PROCESS);
      PROCESS_INFO.STEP = `${i + 1}/${HANDLE_PROCESS.length}`;
      if (PROCESS_INFO instanceof Response) {
        return PROCESS_INFO;
      }
      context.CURRENT_CHAT_CONTEXT.PROCESS_INFO = PROCESS_INFO;
      if (!context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO) {
        context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO = {};
      }
      context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = HANDLE_PROCESS.length == 1 || ENV.HIDE_MIDDLE_MESSAGE ? "" : `[step ${PROCESS_INFO.STEP}]
`;
      switch (PROCESS.TYPE) {
        case "text:text":
          result = await chatWithLLM(text, context, null);
          break;
        case "text:image":
          const gen = loadImageGen(context);
          if (!gen) {
            return sendMessageToTelegramWithContext2(context)(`ERROR: Image generator not found`);
          }
          const startTime = performance.now();
          result = await gen(context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEXT, context);
          if (typeof result === "string") {
            context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = result;
          } else
            context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = result;
          const time = ((performance.now() - startTime) / 1e3).toFixed(2);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO = (context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.TEMP_INFO || "") + context.CURRENT_CHAT_CONTEXT.PROCESS_INFO["MODEL"] + ` ${time}s  `;
          const response = await sendPhotoToTelegramWithContext(context)(result);
          if (response.status != 200) {
            console.error(await response.text());
          }
          break;
        case "audio:text":
          result = await msgHandleFile(message, fileType, context);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = null;
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = null;
          break;
        case "image:text":
          await msgHandleFile(message, fileType, context);
          result = await chatWithLLM(message.text, context, null);
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILE = null;
          context.CURRENT_CHAT_CONTEXT.MIDDLE_INFO.FILEURL = null;
          break;
        case "audio:audio":
        case "text:audio":
        default:
          return sendMessageToTelegramWithContext2(context)("unsupported trans type");
      }
    }
  } catch (e) {
    console.error(e);
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
  return new Response("success", { status: 200 });
}
async function msgProcessByChatType(message, context) {
  let handlerMap;
  if (ENV.REVERSE_MODE) {
    handlerMap = {
      "private": [
        msgFilterWhiteList,
        msgFilterNonTextMessage,
        msgIgnoreOldMessage,
        msgInitUserConfig,
        msgHandleCommand
      ],
      "group": [msgFilterWhiteList, msgHandleGroupMessage, msgIgnoreOldMessage, msgInitUserConfig, msgHandleCommand],
      "supergroup": [
        msgFilterWhiteList,
        msgHandleGroupMessage,
        msgIgnoreOldMessage,
        msgInitUserConfig,
        msgHandleCommand
      ]
    };
  } else {
    handlerMap = {
      "private": [
        msgFilterWhiteList,
        msgFilterNonTextMessage,
        msgHandlePrivateMessage,
        msgIgnoreOldMessage,
        msgInitUserConfig,
        msgHandleCommand,
        msgHandleRole
      ],
      "group": [
        msgFilterWhiteList,
        msgHandleGroupMessage,
        msgFilterNonTextMessage,
        msgIgnoreOldMessage,
        msgInitUserConfig,
        msgHandleCommand,
        msgHandleRole
      ],
      "supergroup": [
        msgFilterWhiteList,
        msgHandleGroupMessage,
        msgFilterNonTextMessage,
        msgIgnoreOldMessage,
        msgInitUserConfig,
        msgHandleCommand,
        msgHandleRole
      ]
    };
  }
  if (!Object.prototype.hasOwnProperty.call(handlerMap, context.SHARE_CONTEXT.chatType)) {
    return sendMessageToTelegramWithContext2(context)(
      ENV.I18N.message.not_supported_chat_type(context.SHARE_CONTEXT.chatType)
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
      return sendMessageToTelegramWithContext2(context)(
        ENV.I18N.message.handle_chat_type_message_error(context.SHARE_CONTEXT.chatType)
      );
    }
  }
  return null;
}
async function loadMessage(request, context) {
  const raw = await request.json();
  if (ENV.DEV_MODE) {
    setTimeout(() => {
      DATABASE.put(`log:${(/* @__PURE__ */ new Date()).toISOString()}`, JSON.stringify(raw), { expirationTtl: 600 }).catch(console.error);
    });
  }
  if (raw.edited_message) {
    throw new Error("Ignore edited message");
  }
  if (raw.message) {
    return raw.message;
  } else {
    throw new Error("Invalid message");
  }
}
async function handleMessage(request) {
  const context = new Context();
  context.initTelegramContext(request);
  const message = await loadMessage(request, context);
  const handlers = [
    msgIgnoreSpecificMessage,
    // 忽略特定文本
    msgCheckEnvIsReady,
    // 检查环境是否准备好: API_KEY, DATABASE
    msgInitChatContext,
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    msgProcessByChatType,
    // 根据类型对消息进一步处理
    // msgInitReverseContext, // 初始化REVERSE_MODE上下文 生成 conversation_id, parent_message_id
    msgSaveLastMessage,
    // 保存最后一条消息
    msgChatWithLLM
    // 与llm聊天
  ];
  for (const handler of handlers) {
    try {
      const result = await handler(message, context);
      if (result && result instanceof Response) {
        return result;
      }
    } catch (e) {
      console.error(e);
      return new Response(errorToString2(e), { status: 500 });
    }
  }
  return null;
}

// src/router.js
var helpLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/en/DEPLOY.md";
var issueLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues";
var initLink = "./init";
var footer = `
<br/>
<p>For more information, please visit <a href="${helpLink}">${helpLink}</a></p>
<p>If you have any questions, please visit <a href="${issueLink}">${issueLink}</a></p>
`;
function buildKeyNotFoundHTML(key) {
  return `<p style="color: red">Please set the <strong>${key}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function bindWebHookAction(request) {
  const result = [];
  const domain = new URL(request.url).host;
  const hookMode = API_GUARD ? "safehook" : "webhook";
  for (const token of ENV.TELEGRAM_AVAILABLE_TOKENS) {
    const url = `https://${domain}/telegram/${token.trim()}/${hookMode}`;
    console.log(`webhook url: ${url}`);
    const id = token.split(":")[0];
    result[id] = {
      webhook: await bindTelegramWebHook(token, url).catch((e) => errorToString2(e)),
      command: await bindCommandForTelegram(token).catch((e) => errorToString2(e))
    };
  }
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${domain}</h2>
    ${ENV.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? buildKeyNotFoundHTML("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(result).map((id) => `
        <br/>
        <h4>Bot ID: ${id}</h4>
        <p style="color: ${result[id].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(result[id].webhook)}</p>
        <p style="color: ${result[id].command.ok ? "green" : "red"}">Command: ${JSON.stringify(result[id].command)}</p>
        `).join("")}
      ${footer}
    `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function loadChatHistory(request) {
  const password = await historyPassword();
  const { pathname } = new URL(request.url);
  const historyKey = pathname.match(/^\/telegram\/(.+)\/history/)[1];
  const params = new URL(request.url).searchParams;
  const passwordParam = params.get("password");
  if (passwordParam !== password) {
    return new Response("Password Error", { status: 401 });
  }
  const history = JSON.parse(await DATABASE.get(historyKey));
  const HTML = renderHTML(`
        <div id="history" style="width: 100%; height: 100%; overflow: auto; padding: 10px;">
            ${history.map((item) => `
                <div style="margin-bottom: 10px;">
                    <hp style="font-size: 16px; color: #999; margin-bottom: 5px;">${item.role}:</hp>
                    <p style="font-size: 12px; color: #333;">${item.content}</p>
                </div>
            `).join("")}
        </div>
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function telegramWebhook(request) {
  try {
    return await makeResponse200(await handleMessage(request));
  } catch (e) {
    console.error(e);
    return new Response(errorToString2(e), { status: 200 });
  }
}
async function telegramSafeHook(request) {
  try {
    if (API_GUARD === void 0 || API_GUARD === null) {
      return telegramWebhook(request);
    }
    console.log("API_GUARD is enabled");
    const url = new URL(request.url);
    url.pathname = url.pathname.replace("/safehook", "/webhook");
    request = new Request(url, request);
    return await makeResponse200(await API_GUARD.fetch(request));
  } catch (e) {
    console.error(e);
    return new Response(errorToString2(e), { status: 200 });
  }
}
async function defaultIndexAction() {
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${ENV.BUILD_TIMESTAMP},sha:${ENV.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${initLink}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    ${ENV.API_KEY ? "" : buildKeyNotFoundHTML("API_KEY")}
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${commandsDocument().map((item) => `<p><strong>${item.command}</strong> - ${item.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${footer}
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function gpt3TokenTest(request) {
  const text = new URL(request.url).searchParams.get("text") || "Hello World";
  const counter = await tokensCounter();
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Token Counter:</p>
    <p>source text: ${text}</p>
    <p>token count: ${counter(text)}</p>
    <br/>
    `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function loadBotInfo() {
  const result = [];
  for (const token of ENV.TELEGRAM_AVAILABLE_TOKENS) {
    const id = token.split(":")[0];
    result[id] = await getBot(token);
  }
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <h4>Environment About Bot</h4>
    <p><strong>GROUP_CHAT_BOT_ENABLE:</strong> ${ENV.GROUP_CHAT_BOT_ENABLE}</p>
    <p><strong>GROUP_CHAT_BOT_SHARE_MODE:</strong> ${ENV.GROUP_CHAT_BOT_SHARE_MODE}</p>
    <p><strong>TELEGRAM_BOT_NAME:</strong> ${ENV.TELEGRAM_BOT_NAME.join(",")}</p>
    ${Object.keys(result).map((id) => `
            <br/>
            <h4>Bot ID: ${id}</h4>
            <p style="color: ${result[id].ok ? "green" : "red"}">${JSON.stringify(result[id])}</p>
            `).join("")}
    ${footer}
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  if (pathname === `/`) {
    return defaultIndexAction();
  }
  if (pathname.startsWith(`/init`)) {
    return bindWebHookAction(request);
  }
  if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/webhook`)) {
    return telegramWebhook(request);
  }
  if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/safehook`)) {
    return telegramSafeHook(request);
  }
  if (ENV.DEV_MODE || ENV.DEBUG_MODE) {
    if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/history`)) {
      return loadChatHistory(request);
    }
    if (pathname.startsWith(`/gpt3/tokens/test`)) {
      return gpt3TokenTest(request);
    }
    if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/bot`)) {
      return loadBotInfo();
    }
  }
  return null;
}

// src/i18n/zh-hans.js
var zh_hans_default = {
  env: {
    "system_init_message": "\u4F60\u662F\u4E00\u4E2A\u5F97\u529B\u7684\u52A9\u624B"
  },
  utils: {
    "not_supported_configuration": "\u4E0D\u652F\u6301\u7684\u914D\u7F6E\u9879\u6216\u6570\u636E\u7C7B\u578B\u9519\u8BEF"
  },
  message: {
    "loading": "\u52A0\u8F7D\u4E2D",
    "not_supported_chat_type": (type) => `\u6682\u4E0D\u652F\u6301${type}\u7C7B\u578B\u7684\u804A\u5929`,
    "not_supported_chat_type_message": "\u6682\u4E0D\u652F\u6301\u975E\u6587\u672C\u683C\u5F0F\u6D88\u606F",
    "handle_chat_type_message_error": (type) => `\u5904\u7406${type}\u7C7B\u578B\u7684\u804A\u5929\u6D88\u606F\u51FA\u9519`,
    "user_has_no_permission_to_use_the_bot": (id) => `\u4F60\u6CA1\u6709\u6743\u9650\u4F7F\u7528\u8FD9\u4E2Abot, \u8BF7\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u6DFB\u52A0\u4F60\u7684ID(${id})\u5230\u767D\u540D\u5355`,
    "group_has_no_permission_to_use_the_bot": (id) => `\u8BE5\u7FA4\u672A\u5F00\u542F\u804A\u5929\u6743\u9650, \u8BF7\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u6DFB\u52A0\u7FA4ID(${id})\u5230\u767D\u540D\u5355`,
    "history_empty": "\u6682\u65E0\u5386\u53F2\u6D88\u606F",
    "refreshchatlist": "\u8BF7\u5148\u6267\u884C`/refreshchatlist`\u547D\u4EE4\u5237\u65B0\u5217\u8868`",
    "chatlist_not_found": "\u672A\u67E5\u8BE2\u5230\u4EFB\u4F55\u5BF9\u8BDD\u8BB0\u5F55",
    "new_chat_or_id_is_empty": "\u5F53\u524D\u4E3A\u65B0\u5BF9\u8BDD\u6216ID\u4E3A\u7A7A"
  },
  command: {
    help: {
      "summary": "\u5F53\u524D\u652F\u6301\u4EE5\u4E0B\u547D\u4EE4:\n",
      "help": "\u83B7\u53D6\u547D\u4EE4\u5E2E\u52A9",
      "new": "\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD",
      "start": "\u83B7\u53D6\u4F60\u7684ID, \u5E76\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD",
      "img": "\u751F\u6210\u4E00\u5F20\u56FE\u7247, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/img \u56FE\u7247\u63CF\u8FF0`, \u4F8B\u5982`/img \u6708\u5149\u4E0B\u7684\u6C99\u6EE9`",
      "version": "\u83B7\u53D6\u5F53\u524D\u7248\u672C\u53F7, \u5224\u65AD\u662F\u5426\u9700\u8981\u66F4\u65B0",
      "setenv": "\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenv KEY=VALUE",
      "setenvs": '\u6279\u91CF\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}',
      "delenv": "\u5220\u9664\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u683C\u5F0F\u4E3A /delenv KEY, \u5220\u9664\u7528\u6237\u6240\u6709\u914D\u7F6E, \u547D\u4EE4\u683C\u5F0F\u4E3A /delenv all",
      "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6237\u914D\u7F6E",
      "usage": "\u83B7\u53D6\u5F53\u524D\u673A\u5668\u4EBA\u7684\u7528\u91CF\u7EDF\u8BA1",
      "system": "\u67E5\u770B\u5F53\u524D\u4E00\u4E9B\u7CFB\u7EDF\u4FE1\u606F",
      "role": "\u8BBE\u7F6E\u9884\u8BBE\u7684\u8EAB\u4EFD",
      "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5BF9\u8BDD, /redo \u52A0\u4FEE\u6539\u8FC7\u7684\u5185\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo",
      "echo": "\u56DE\u663E\u6D88\u606F",
      "bill": "\u67E5\u770B\u5F53\u524D\u8D26\u5355",
      "mode": "\u8BBE\u7F6E\u5F53\u524D\u6A21\u5F0F \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode",
      "chatlist": "\u67E5\u8BE2\u5BF9\u8BDD\u5217\u8868",
      "history": "\u67E5\u8BE2\u5386\u53F2\u8BB0\u5F55",
      "setid": "\u8BBE\u7F6E\u5BF9\u8BDDID \u683C\u5F0F\u4E3A `/setid id`",
      "setalias": "\u8BBE\u7F6E\u5BF9\u8BDD\u522B\u540D \u683C\u5F0F\u4E3A `/setalias \u5BF9\u8BDD\u5E8F\u5217\u53F7(\u6570\u5B57) \u522B\u540D`",
      "refreshchatlist": "\u66F4\u65B0\u7F13\u5B58\u7684\u5BF9\u8BDD\u5217\u8868"
    },
    role: {
      "not_defined_any_role": "\u8FD8\u672A\u5B9A\u4E49\u4EFB\u4F55\u89D2\u8272",
      "current_defined_role": (size) => `\u5F53\u524D\u5DF2\u5B9A\u4E49\u7684\u89D2\u8272\u5982\u4E0B(${size}):
`,
      "help": "\u683C\u5F0F\u9519\u8BEF: \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/role \u64CD\u4F5C`\n\u5F53\u524D\u652F\u6301\u4EE5\u4E0B`\u64CD\u4F5C`:\n `/role show` \u663E\u793A\u5F53\u524D\u5B9A\u4E49\u7684\u89D2\u8272.\n `/role \u89D2\u8272\u540D del` \u5220\u9664\u6307\u5B9A\u540D\u79F0\u7684\u89D2\u8272.\n `/role \u89D2\u8272\u540D KEY=VALUE` \u8BBE\u7F6E\u6307\u5B9A\u89D2\u8272\u7684\u914D\u7F6E.\n  \u76EE\u524D\u4EE5\u4E0B\u8BBE\u7F6E\u9879:\n   `SYSTEM_INIT_MESSAGE`:\u521D\u59CB\u5316\u6D88\u606F\n   `OPENAI_API_EXTRA_PARAMS`:OpenAI API \u989D\u5916\u53C2\u6570\uFF0C\u5FC5\u987B\u4E3AJSON",
      "delete_role_success": "\u5220\u9664\u89D2\u8272\u6210\u529F",
      "delete_role_error": (e) => `\u5220\u9664\u89D2\u8272\u9519\u8BEF: \`${e.message}\``,
      "update_role_success": "\u66F4\u65B0\u914D\u7F6E\u6210\u529F",
      "update_role_error": (e) => `\u914D\u7F6E\u9879\u683C\u5F0F\u9519\u8BEF: \`${e.message}\``
    },
    img: {
      "help": "\u8BF7\u8F93\u5165\u56FE\u7247\u63CF\u8FF0\u3002\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/img \u72F8\u82B1\u732B`"
    },
    new: {
      "new_chat_start": "\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB",
      "new_chat_start_private": (id) => `\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB\uFF0C\u4F60\u7684ID(${id})`,
      "new_chat_start_group": (id) => `\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB\uFF0C\u7FA4\u7EC4ID(${id})`
    },
    setenv: {
      "help": "\u914D\u7F6E\u9879\u683C\u5F0F\u9519\u8BEF: \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenv KEY=VALUE",
      "update_config_success": "\u66F4\u65B0\u914D\u7F6E\u6210\u529F",
      "update_config_error": (e) => `\u914D\u7F6E\u9879\u683C\u5F0F\u9519\u8BEF: ${e.message}`
    },
    version: {
      "new_version_found": (current, online) => `\u53D1\u73B0\u65B0\u7248\u672C\uFF0C\u5F53\u524D\u7248\u672C: ${JSON.stringify(current)}\uFF0C\u6700\u65B0\u7248\u672C: ${JSON.stringify(online)}`,
      "current_is_latest_version": (current) => `\u5F53\u524D\u5DF2\u7ECF\u662F\u6700\u65B0\u7248\u672C, \u5F53\u524D\u7248\u672C: ${JSON.stringify(current)}`
    },
    usage: {
      "usage_not_open": "\u5F53\u524D\u673A\u5668\u4EBA\u672A\u5F00\u542F\u7528\u91CF\u7EDF\u8BA1",
      "current_usage": "\u{1F4CA} \u5F53\u524D\u673A\u5668\u4EBA\u7528\u91CF\n\nTokens:\n",
      "total_usage": (total) => `- \u603B\u7528\u91CF\uFF1A${total || 0} tokens
- \u5404\u804A\u5929\u7528\u91CF\uFF1A`,
      "no_usage": "- \u6682\u65E0\u7528\u91CF"
    },
    permission: {
      "not_authorized": "\u8EAB\u4EFD\u6743\u9650\u9A8C\u8BC1\u5931\u8D25",
      "not_enough_permission": (roleList, chatRole) => `\u6743\u9650\u4E0D\u8DB3,\u9700\u8981${roleList.join(",")},\u5F53\u524D:${chatRole}`,
      "role_error": (e) => `\u8EAB\u4EFD\u9A8C\u8BC1\u51FA\u9519:` + e.message,
      "command_error": (e) => `\u547D\u4EE4\u6267\u884C\u9519\u8BEF: ${e.message}`
    },
    bill: {
      "bill_detail": (totalAmount, totalUsage, remaining) => `\u{1F4CA} \u672C\u6708\u673A\u5668\u4EBA\u7528\u91CF

	- \u603B\u989D\u5EA6: $${totalAmount || 0}
	- \u5DF2\u4F7F\u7528: $${totalUsage || 0}
	- \u5269\u4F59\u989D\u5EA6: $${remaining || 0}`
    },
    mode: {
      "help": "\u914D\u7F6E\u9879\u683C\u5F0F\u9519\u8BEF: \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode"
    },
    setid: {
      "help": "\u683C\u5F0F\u9519\u8BEF\uFF1A\u547D\u4EE4\u683C\u5F0F\u4E3A `/setid id`",
      "out_of_range": (length) => `\u7D22\u5F15\u5927\u5C0F\u8D85\u51FA\u8303\u56F4\uFF1A${length}`,
      "alias_not_found": (alias) => `\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u522B\u540D\uFF1A\`${alias}\``
    },
    setalias: {
      "help": "\u683C\u5F0F\u9519\u8BEF\uFF1A\u547D\u4EE4\u683C\u5F0F\u4E3A `/setalias index alias`"
    },
    refreshchatlist: {
      "refresh_success": (length) => `\u5171\u5237\u65B0${length}\u6761\u8BB0\u5F55`
    },
    history: {
      "query_error": "\u65E0\u6CD5\u83B7\u53D6\u7236\u6D88\u606Fid"
    }
  }
};

// src/i18n/zh-hant.js
var zh_hant_default = {
  env: {
    "system_init_message": "\u4F60\u662F\u4E00\u500B\u5F97\u529B\u7684\u52A9\u624B"
  },
  utils: {
    "not_supported_configuration": "\u4E0D\u652F\u6301\u7684\u914D\u7F6E\u6216\u6578\u64DA\u985E\u578B\u932F\u8AA4"
  },
  message: {
    "loading": "\u52A0\u8F7D\u4E2D",
    "not_supported_chat_type": (type) => `\u7576\u524D\u4E0D\u652F\u6301${type}\u985E\u578B\u7684\u804A\u5929`,
    "not_supported_chat_type_message": "\u7576\u524D\u4E0D\u652F\u6301\u975E\u6587\u672C\u683C\u5F0F\u6D88\u606F",
    "handle_chat_type_message_error": (type) => `\u8655\u7406${type}\u985E\u578B\u7684\u804A\u5929\u6D88\u606F\u51FA\u932F`,
    "user_has_no_permission_to_use_the_bot": (id) => `\u60A8\u6C92\u6709\u6B0A\u9650\u4F7F\u7528\u672C\u6A5F\u5668\u4EBA\uFF0C\u8ACB\u806F\u7E6B\u7BA1\u7406\u54E1\u5C07\u60A8\u7684ID(${id})\u6DFB\u52A0\u5230\u767D\u540D\u55AE\u4E2D`,
    "group_has_no_permission_to_use_the_bot": (id) => `\u8A72\u7FA4\u7D44\u672A\u958B\u555F\u804A\u5929\u6B0A\u9650\uFF0C\u8ACB\u806F\u7E6B\u7BA1\u7406\u54E1\u5C07\u8A72\u7FA4\u7D44ID(${id})\u6DFB\u52A0\u5230\u767D\u540D\u55AE\u4E2D`,
    "history_empty": "\u66AB\u7121\u6B77\u53F2\u6D88\u606F",
    "refreshchatlist": "\u8ACB\u5148\u57F7\u884C`/refreshchatlist`\u547D\u4EE4\u5237\u65B0\u5217\u8868`",
    "chatlist_not_found": "\u672A\u67E5\u5230\u4EFB\u4F55\u5C0D\u8A71\u8A18\u9304",
    "new_chat_or_id_is_empty": "\u7576\u524D\u70BA\u65B0\u5C0D\u8A71\u6216ID\u70BA\u7A7A"
  },
  command: {
    help: {
      "summary": "\u7576\u524D\u652F\u6301\u7684\u547D\u4EE4\u5982\u4E0B\uFF1A\n",
      "help": "\u7372\u53D6\u547D\u4EE4\u5E6B\u52A9",
      "new": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71",
      "start": "\u7372\u53D6\u60A8\u7684ID\u4E26\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71",
      "img": "\u751F\u6210\u5716\u7247\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/img \u5716\u7247\u63CF\u8FF0`\uFF0C\u4F8B\u5982`/img \u6D77\u7058\u6708\u5149`",
      "version": "\u7372\u53D6\u7576\u524D\u7248\u672C\u865F\u78BA\u8A8D\u662F\u5426\u9700\u8981\u66F4\u65B0",
      "setenv": "\u8A2D\u7F6E\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/setenv KEY=VALUE",
      "setenvs": '\u6279\u91CF\u8A2D\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u70BA /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}',
      "delenv": "\u522A\u9664\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/delenv KEY",
      "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6236\u914D\u7F6E",
      "usage": "\u7372\u53D6\u6A5F\u5668\u4EBA\u7576\u524D\u7684\u4F7F\u7528\u60C5\u6CC1\u7D71\u8A08",
      "system": "\u67E5\u770B\u4E00\u4E9B\u7CFB\u7D71\u4FE1\u606F",
      "role": "\u8A2D\u7F6E\u9810\u8A2D\u8EAB\u4EFD",
      "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5C0D\u8A71 /redo \u52A0\u4FEE\u6539\u904E\u7684\u5167\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo",
      "echo": "\u56DE\u663E\u6D88\u606F",
      "bill": "\u67E5\u770B\u7576\u524D\u7684\u8CEC\u55AE",
      "mode": "\u8A2D\u7F6E\u7576\u524D\u6A21\u5F0F \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u70BA `/mode NAME`\uFF0C\u7576 NAME=all \u6642\uFF0C\u67E5\u770B\u6240\u6709\u6A21\u5F0F",
      "chatlist": "\u67E5\u8A62\u5C0D\u8A71\u5217\u8868",
      "history": "\u67E5\u8A62\u6B77\u53F2\u8A18\u9304",
      "setid": "\u8A2D\u7F6E\u5C0D\u8A71 ID \u683C\u5F0F\u70BA `/setid id`",
      "setalias": "\u8A2D\u7F6E\u5C0D\u8A71\u5225\u540D \u683C\u5F0F\u70BA `/setalias \u5C0D\u8A71\u5E8F\u5217\u865F(\u6570\u5B57) \u5225\u540D`",
      "refreshchatlist": "\u66F4\u65B0\u7DE9\u5B58\u7684\u5C0D\u8A71\u5217\u8868"
    },
    role: {
      "not_defined_any_role": "\u5C1A\u672A\u5B9A\u7FA9\u4EFB\u4F55\u89D2\u8272",
      "current_defined_role": (size) => `\u7576\u524D\u5DF2\u5B9A\u7FA9\u7684\u89D2\u8272\u5982\u4E0B(${size})\uFF1A
`,
      "help": "\u683C\u5F0F\u932F\u8AA4\uFF1A\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/role \u64CD\u4F5C`\n\u7576\u524D\u652F\u6301\u7684`\u64CD\u4F5C`\u5982\u4E0B\uFF1A\n `/role show` \u67E5\u770B\u7576\u524D\u5DF2\u5B9A\u7FA9\u7684\u89D2\u8272\u3002\n `/role \u89D2\u8272\u540D del` \u522A\u9664\u6307\u5B9A\u7684\u89D2\u8272\u3002\n `/role \u89D2\u8272\u540D KEY=VALUE` \u8A2D\u7F6E\u6307\u5B9A\u89D2\u8272\u7684\u914D\u7F6E\u3002\n  \u7576\u524D\u652F\u6301\u7684\u8A2D\u7F6E\u5982\u4E0B\uFF1A\n   `SYSTEM_INIT_MESSAGE`\uFF1A\u521D\u59CB\u5316\u6D88\u606F\n   `OPENAI_API_EXTRA_PARAMS`\uFF1AOpenAI API\u984D\u5916\u53C3\u6578\uFF0C\u5FC5\u9808\u70BAJSON",
      "delete_role_success": "\u522A\u9664\u89D2\u8272\u6210\u529F",
      "delete_role_error": (e) => `\u522A\u9664\u89D2\u8272\u51FA\u932F\uFF1A\`${e.message}\``,
      "update_role_success": "\u66F4\u65B0\u914D\u7F6E\u6210\u529F",
      "update_role_error": (e) => `\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4\uFF1A\`${e.message}\``
    },
    img: {
      "help": "\u8ACB\u8F38\u5165\u5716\u7247\u63CF\u8FF0\u3002\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/img raccoon cat`"
    },
    new: {
      "new_chat_start": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71",
      "new_chat_start_private": (id) => `\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71\uFF0C\u60A8\u7684ID(${id})`,
      "new_chat_start_group": (id) => `\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71\uFF0C\u7FA4\u7D44ID(${id})`
    },
    setenv: {
      "help": "\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4\uFF1A\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/setenv KEY=VALUE",
      "update_config_success": "\u66F4\u65B0\u914D\u7F6E\u6210\u529F",
      "update_config_error": (e) => `\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4\uFF1A\`${e.message}\``
    },
    version: {
      "new_version_found": (current, online) => `\u767C\u73FE\u65B0\u7248\u672C\uFF0C\u7576\u524D\u7248\u672C\uFF1A${JSON.stringify(current)}\uFF0C\u6700\u65B0\u7248\u672C\uFF1A${JSON.stringify(online)}`,
      "current_is_latest_version": (current) => `\u7576\u524D\u5DF2\u662F\u6700\u65B0\u7248\u672C\uFF0C\u7576\u524D\u7248\u672C\uFF1A${JSON.stringify(current)}`
    },
    usage: {
      "usage_not_open": "\u7576\u524D\u6A5F\u5668\u4EBA\u672A\u958B\u555F\u4F7F\u7528\u60C5\u6CC1\u7D71\u8A08",
      "current_usage": "\u{1F4CA} \u7576\u524D\u6A5F\u5668\u4EBA\u4F7F\u7528\u60C5\u6CC1\n\n\u4F7F\u7528\u60C5\u6CC1\uFF1A\n",
      "total_usage": (total) => `- \u7E3D\u8A08\uFF1A${total || 0} \u6B21
- \u6BCF\u500B\u7FA4\u7D44\u4F7F\u7528\u60C5\u6CC1\uFF1A `,
      "no_usage": "- \u66AB\u7121\u4F7F\u7528\u60C5\u6CC1"
    },
    permission: {
      "not_authorized": "\u8EAB\u4EFD\u6B0A\u9650\u9A57\u8B49\u5931\u6557",
      "not_enough_permission": (roleList, chatRole) => `\u6B0A\u9650\u4E0D\u8DB3\uFF0C\u9700\u8981${roleList.join(",")}\uFF0C\u7576\u524D\uFF1A${chatRole}`,
      "role_error": (e) => `\u8EAB\u4EFD\u9A57\u8B49\u51FA\u932F\uFF1A` + e.message,
      "command_error": (e) => `\u547D\u4EE4\u57F7\u884C\u51FA\u932F\uFF1A${e.message}`
    },
    bill: {
      "bill_detail": (totalAmount, totalUsage, remaining) => `\u{1F4CA} \u672C\u6708\u673A\u5668\u4EBA\u7528\u91CF

	- \u603B\u989D\u5EA6: $${totalAmount || 0}
	- \u5DF2\u4F7F\u7528: $${totalUsage || 0}
	- \u5269\u4F59\u989D\u5EA6: $${remaining || 0}`
    },
    mode: {
      "help": "\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4: \u547D\u4EE4\u683C\u5F0F\u70BA /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode"
    },
    setid: {
      "help": "\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4\uFF1A\u547D\u4EE4\u683C\u5F0F\u70BA `/setid id`",
      "out_of_range": (length) => `\u7D22\u5F15\u5927\u5C0F\u8D85\u51FA\u8303\u56F4\uFF1A${length}`,
      "alias_not_found": (alias) => `\u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u522B\u540D\uFF1A${alias}`
    },
    setalias: {
      "help": "\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4\uFF1A\u547D\u4EE4\u683C\u5F0F\u70BA `/setalias index alias`"
    },
    refreshchatlist: {
      "refresh_success": (length) => `\u5171\u5237\u65B0${length}\u4E2A\u8BB0\u5F55`
    },
    history: {
      "query_error": "\u7121\u6CD5\u7372\u53D6\u7236\u6D88\u606Fid"
    }
  }
};

// src/i18n/en.js
var en_default = {
  env: {
    "system_init_message": "You are a helpful assistant"
  },
  utils: {
    "not_supported_configuration": "Not supported configuration or data type error"
  },
  message: {
    "loading": "Loading",
    "not_supported_chat_type": (type) => `Currently not supported ${type} type of chat`,
    "not_supported_chat_type_message": "Currently not supported non-text format messages",
    "handle_chat_type_message_error": (type) => `Error handling ${type} type of chat messages`,
    "user_has_no_permission_to_use_the_bot": (id) => `You do not have permission to use this bot, please contact the administrator to add your ID (${id}) to the whitelist`,
    "group_has_no_permission_to_use_the_bot": (id) => `The group has not enabled chat permissions, please contact the administrator to add the group ID (${id}) to the whitelist`,
    "history_empty": "No history messages",
    "refreshchatlist": "Please run the `/refreshchatlist` command first to refresh the list",
    "chatlist_not_found": "Chat list not found",
    "new_chat_or_id_is_empty": "New chat or ID is empty"
  },
  command: {
    help: {
      "summary": "The following commands are currently supported:\n",
      "help": "Get command help",
      "new": "Start a new conversation",
      "start": "Get your ID and start a new conversation",
      "img": "Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`",
      "version": "Get the current version number to determine whether to update",
      "setenv": "Set user configuration, the complete command format is /setenv KEY=VALUE",
      "setenvs": 'Batch set user configurations, the full format of the command is /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}',
      "delenv": "Delete user configuration, the complete command format is /delenv KEY",
      "clearenv": "Clear all user configuration",
      "usage": "Get the current usage statistics of the robot",
      "system": "View some system information",
      "role": "Set the preset identity",
      "redo": "Redo the last conversation, /redo with modified content or directly /redo",
      "echo": "Echo the message",
      "bill": "View current bill",
      "chatlist": "Query dialog list",
      "history": "Query history",
      "setid": "Set the conversation ID, the complete command format is `/setid id`",
      "setalias": "Set conversation alias format is `/setalias conversation_number alias`",
      "refreshchatlist": "Update the list of cached conversations"
    },
    role: {
      "not_defined_any_role": "No roles have been defined yet",
      "current_defined_role": (size) => `The following roles are currently defined (${size}):
`,
      "help": "Format error: the complete command format is `/role operation`\nThe following `operation` is currently supported:\n `/role show` Display the currently defined roles.\n `/role role name del` Delete the specified role.\n `/role role name KEY=VALUE` Set the configuration of the specified role.\n  The following settings are currently supported:\n   `SYSTEM_INIT_MESSAGE`: Initialization message\n   `OPENAI_API_EXTRA_PARAMS`: OpenAI API extra parameters, must be JSON",
      "delete_role_success": "Delete role successfully",
      "delete_role_error": (e) => `Delete role error: \`${e.message}\``,
      "update_role_success": "Update configuration successfully",
      "update_role_error": (e) => `Configuration item format error: \`${e.message}\``
    },
    img: {
      "help": "Please enter the image description. The complete command format is `/img raccoon cat`"
    },
    new: {
      "new_chat_start": "A new conversation has started",
      "new_chat_start_private": (id) => `A new conversation has started, your ID (${id})`,
      "new_chat_start_group": (id) => `A new conversation has started, group ID (${id})`
    },
    setenv: {
      "help": "Configuration item format error: the complete command format is /setenv KEY=VALUE",
      "update_config_success": "Update configuration successfully",
      "update_config_error": (e) => `Configuration item format error: ${e.message}`
    },
    version: {
      "new_version_found": (current, online) => `New version found, current version: ${JSON.stringify(current)}, latest version: ${JSON.stringify(online)}`,
      "current_is_latest_version": (current) => `Current is the latest version, current version: ${JSON.stringify(current)}`
    },
    usage: {
      "usage_not_open": "The current robot is not open for usage statistics",
      "current_usage": "\u{1F4CA} Current robot usage\n\nTokens:\n",
      "total_usage": (total) => `- Total: ${total || 0} tokens
- Per chat usage: `,
      "no_usage": "- No usage"
    },
    permission: {
      "not_authorized": "Identity permission verification failed",
      "not_enough_permission": (roleList, chatRole) => `Insufficient permissions, need ${roleList.join(",")}, current: ${chatRole}`,
      "role_error": (e) => `Identity verification error: ` + e.message,
      "command_error": (e) => `Command execution error: ${e.message}`
    },
    bill: {
      "bill_detail": (totalAmount, totalUsage, remaining) => `\u{1F4CA} This month usage

	- Amount: $${totalAmount || 0}
	- Usage: $${totalUsage || 0}
	- Remaining: $${remaining || 0}`
    },
    mode: {
      "help": "Configuration entry format error: the full format of the command is /mode NAME, when NAME=all, view all modes"
    },
    setid: {
      "help": "Configuration entry format error: the full format of the command is /setid id",
      "out_of_range": (length) => `Error: Index need smaller than ${length}`,
      "alias_not_found": (alias) => `Error: alias \`${alias}\` not found`
    },
    setalias: {
      "help": "Configuration entry format error: the full format of the command is /setalias index alias"
    },
    refreshchatlist: {
      "refresh_success": (length) => `freshed ${length} records`
    },
    history: {
      "query_error": "Data don't obtain parent message id"
    }
  }
};

// src/i18n/index.js
function i18n(lang) {
  switch (lang.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return zh_hans_default;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return zh_hant_default;
    case "en":
    case "en-us":
      return en_default;
  }
}

// main.js
var main_default = {
  async fetch(request, env) {
    try {
      initEnv(env, i18n);
      const resp = await handleRequest(request);
      return resp || new Response("NOTFOUND", { status: 404 });
    } catch (e) {
      console.error(e);
      return new Response(errorToString2(e), { status: 500 });
    }
  }
};
export {
  main_default as default
};
