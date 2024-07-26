import { Buffer } from 'node:buffer';
// src/config/env.js
var UserConfig = class {
  // -- 非配置属性 --
  DEFINE_KEYS = [];
  // -- 通用配置 --
  //
  // AI提供商: auto, openai, azure, workers, gemini, mistral
  AI_PROVIDER = "auto";
  // AI图片提供商: auto, openai, azure, workers
  AI_IMAGE_PROVIDER = "auto";
  // 全局默认初始化消息
  SYSTEM_INIT_MESSAGE = null;
  // 全局默认初始化消息角色
  SYSTEM_INIT_MESSAGE_ROLE = "system";
  // -- Open AI 配置 --
  //
  // OpenAI API Key
  OPENAI_API_KEY = [];
  // OpenAI的模型名称
  OPENAI_CHAT_MODEL = "gpt-4o-mini";
  // OpenAI API BASE ``
  OPENAI_API_BASE = "https://api.openai.com/v1";
  // OpenAI API Extra Params
  OPENAI_API_EXTRA_PARAMS = {};
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
  // -- AZURE 配置 --
  //
  // Azure API Key
  AZURE_API_KEY = null;
  // Azure Completions API
  AZURE_PROXY_URL = null;
  // Azure DallE API
  AZURE_DALLE_API = null;
  // -- Workers 配置 --
  //
  // Cloudflare Account ID
  CLOUDFLARE_ACCOUNT_ID = null;
  // Cloudflare Token
  CLOUDFLARE_TOKEN = null;
  // Text Generation Model
  WORKERS_CHAT_MODEL = "@cf/mistral/mistral-7b-instruct-v0.1 ";
  // Text-to-Image Model
  WORKERS_IMAGE_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  // -- Gemini 配置 --
  //
  // Google Gemini API Key
  GOOGLE_API_KEY = null;
  // Google Gemini API
  GOOGLE_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
  // Google Gemini Model
  GOOGLE_CHAT_MODEL = "gemini-pro";
  // -- Mistral 配置 --
  //
  // mistral api key
  MISTRAL_API_KEY = null;
  // mistral api base
  MISTRAL_API_BASE = "https://api.mistral.ai/v1";
  // mistral api model
  MISTRAL_CHAT_MODEL = "mistral-tiny";
  // -- Cohere 配置 --
  //
  // cohere api key
  COHERE_API_KEY = null;
  // cohere api base
  COHERE_API_BASE = "https://api.cohere.com/v1";
  // cohere api model
  COHERE_CHAT_MODEL = "command-r-plus";
  // -- Anthropic 配置 --
  //
  // Anthropic api key
  ANTHROPIC_API_KEY = null;
  // Anthropic api base
  ANTHROPIC_API_BASE = "https://api.anthropic.com/v1";
  // Anthropic api model
  ANTHROPIC_CHAT_MODEL = "claude-3-haiku-20240307";
  // -- EXTRA 配置 --
  //
  // OpenAI Speech to text额外参数
  OPENAI_STT_EXTRA_PARAMS = {};
  // 语音识别模型
  OPENAI_STT_MODEL = "whisper-1";
  // 文字生成语音模型
  OPENAI_TTS_MODEL = "tts-1";
  // 图像识别模型
  OPENAI_VISION_MODEL = "gpt-4o";
  // cohere extra Params
  COHERE_API_EXTRA_PARAMS = {};
  // 提供商来源 例如 {"foo": { PROXY_URL: "https://xxxxxx", API_KEY: "xxxxxx" }}
  PROVIDER_SOURCES = {};
  MODES = {
    // TYPE: 默认为'消息类型:text' ; 消息类型分为: text audio image
    // PROVIDER_SOURCE: 默认为default
    // AI_PROVIDER: 默认为openai, 与AI对话时使用openai风格接口
    // ROLE: 默认为SYSTEM_INIT_MESSAGE_ROLE TODO
    // MODEL: 不同类型下的默认值
    // text:text, CHAT_MODEL
    // audio:text, OPENAI_STT_MODEL
    // image:text, OPENAI_VISION_MODEL
    // text:image, DALL_E_MODEL
    // text:audio, TODO
    default: {
      text: [{}],
      audio: [
        // 后若出现模型能直接audio:text对话 则可加上指定模型, 去掉流程中的text:text
        {},
        { TYPE: "text:text" }
      ],
      image: [{}]
    },
    "dall-e": {
      text: [{}, { TYPE: "text:image", ROLE: "Illustrator" }]
    }
  };
  CURRENT_MODE = "default";
};
var Environment = class {
  // -- 版本数据 --
  //
  // 当前版本
  BUILD_TIMESTAMP = 1721994754;
  // 当前版本 commit id
  BUILD_VERSION = "ef057ae";
  // -- 基础配置 --
  /**
   * @type {I18n | null}
   */
  I18N = null;
  // 多语言支持
  LANGUAGE = "zh-cn";
  // 检查更新的分支
  UPDATE_BRANCH = "master";
  // Chat Complete API Timeout
  CHAT_COMPLETE_API_TIMEOUT = 0;
  // -- Telegram 相关 --
  //
  // Telegram API Domain
  TELEGRAM_API_DOMAIN = "https://api.telegram.org";
  // 允许访问的Telegram Token， 设置时以逗号分隔
  TELEGRAM_AVAILABLE_TOKENS = [];
  // 默认消息模式
  DEFAULT_PARSE_MODE = "MarkdownV2";
  // --  权限相关 --
  //
  // 允许所有人使用
  I_AM_A_GENEROUS_PERSON = false;
  // 白名单
  CHAT_WHITE_LIST = [];
  // 用户配置
  LOCK_USER_CONFIG_KEYS = [
    // 默认为API BASE 防止被替换导致token 泄露
    "OPENAI_API_BASE",
    "GOOGLE_COMPLETIONS_API",
    "MISTRAL_API_BASE",
    "COHERE_API_BASE",
    "ANTHROPIC_API_BASE",
    "AZURE_PROXY_URL",
    "AZURE_DALLE_API"
  ];
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
  // -- 特性开关 --
  //
  // 隐藏部分命令按钮
  HIDE_COMMAND_BUTTONS = [];
  // 显示快捷回复按钮
  SHOW_REPLY_BUTTON = false;
  // 额外引用消息开关
  EXTRA_MESSAGE_CONTEXT = false;
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
  USER_CONFIG = new UserConfig();
  // -- EXTRA 配置 --
  //
  // cohere connector 触发条件; example: {"web-search":["^search","搜一下"]};
  COHERE_CONNECT_TRIGGER = {};
  // 
  // 是否读取文件类型消息(当前支持图片与音频)
  ENABLE_FILE = false;
  // 是否下载图片 anthropic进行图像识别时, 需开启
  LOAD_IMAGE_FILE = false;
  // 群聊中回复对象默认为触发对象，开启时优先为被回复的对象
  ENABLE_REPLY_TO_MENTION = false;
  // 忽略指定文本开头的消息
  IGNORE_TEXT = "";
  // 消息中是否显示模型、时间等额外信息
  ENABLE_SHOWINFO = false;
  // 对话首次长时间无响应时间
  CHAT_TIMEOUT = 15;
  // 消息中是否显示token信息(如果有)
  ENABLE_SHOWTOKENINFO = false;
  // 多流程时, 是否隐藏中间步骤信息
  HIDE_MIDDLE_MESSAGE = false;
  // 群聊中, 指定文本触发对话, 键为触发文本, 值为替换的文本
  CHAT_MESSAGE_TRIGGER = {};
  // CHAT_MESSAGE_TRIGGER = { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4', ':c':'' }
  // REVSER MODE 参数
  REVERSE_MODE = false;
  REVERSE_TOKEN = "";
  REVERSE_PERFIX = "";
};
var ENV = new Environment();
var DATABASE2 = null;
var API_GUARD = null;
var CUSTOM_COMMAND = {};
var CONST = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Safari/605.1.15"
};
var ENV_TYPES = {
  SYSTEM_INIT_MESSAGE: "string",
  AZURE_API_KEY: "string",
  AZURE_PROXY_URL: "string",
  AZURE_DALLE_API: "string",
  CLOUDFLARE_ACCOUNT_ID: "string",
  CLOUDFLARE_TOKEN: "string",
  GOOGLE_API_KEY: "string",
  MISTRAL_API_KEY: "string",
  COHERE_API_KEY: "string",
  ANTHROPIC_API_KEY: "string"
};
function parseArray(raw) {
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  return raw.split(",");
}
function mergeEnvironment(target, source) {
  const sourceKeys = new Set(Object.keys(source));
  for (const key of Object.keys(target)) {
    if (!sourceKeys.has(key)) {
      continue;
    }
    const t = ENV_TYPES[key] || typeof target[key];
    if (typeof source[key] !== "string") {
      target[key] = source[key];
      continue;
    }
    switch (t) {
      case "number":
        target[key] = parseInt(source[key], 10);
        break;
      case "boolean":
        target[key] = (source[key] || "false") === "true";
        break;
      case "string":
        target[key] = source[key];
        break;
      case "array":
        target[key] = parseArray(source[key]);
        break;
      case "object":
        if (Array.isArray(target[key])) {
          target[key] = parseArray(source[key]);
        } else {
          try {
            target[key] = JSON.parse(source[key]);
          } catch (e) {
            console.error(e);
          }
        }
        break;
      default:
        target[key] = source[key];
        break;
    }
  }
}
function initEnv(env, i18n2) {
  DATABASE2 = env.DATABASE;
  API_GUARD = env.API_GUARD;
  const customCommandPrefix = "CUSTOM_COMMAND_";
  for (const key of Object.keys(env)) {
    if (key.startsWith(customCommandPrefix)) {
      const cmd = key.substring(customCommandPrefix.length);
      CUSTOM_COMMAND["/" + cmd] = env[key];
    }
  }
  mergeEnvironment(ENV, env);
  mergeEnvironment(ENV.USER_CONFIG, env);
  ENV.USER_CONFIG.DEFINE_KEYS = [];
  {
    ENV.I18N = i18n2((ENV.LANGUAGE || "cn").toLowerCase());
    if (env.TELEGRAM_TOKEN && !ENV.TELEGRAM_AVAILABLE_TOKENS.includes(env.TELEGRAM_TOKEN)) {
      if (env.BOT_NAME && ENV.TELEGRAM_AVAILABLE_TOKENS.length === ENV.TELEGRAM_BOT_NAME.length) {
        ENV.TELEGRAM_BOT_NAME.push(env.BOT_NAME);
      }
      ENV.TELEGRAM_AVAILABLE_TOKENS.push(env.TELEGRAM_TOKEN);
    }
    if (env.WORKERS_AI_MODEL) {
      ENV.USER_CONFIG.WORKERS_CHAT_MODEL = env.WORKERS_AI_MODEL;
    }
    if (env.OPENAI_API_DOMAIN && !ENV.OPENAI_API_BASE) {
      ENV.USER_CONFIG.OPENAI_API_BASE = `${env.OPENAI_API_DOMAIN}/v1`;
    }
    if (env.API_KEY && ENV.USER_CONFIG.OPENAI_API_KEY.length === 0) {
      ENV.USER_CONFIG.OPENAI_API_KEY = env.API_KEY.split(",");
    }
    if (env.CHAT_MODEL && !ENV.USER_CONFIG.OPENAI_CHAT_MODEL) {
      ENV.USER_CONFIG.OPENAI_CHAT_MODEL = env.CHAT_MODEL;
    }
    if (!ENV.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
      ENV.USER_CONFIG.SYSTEM_INIT_MESSAGE = ENV.I18N?.env?.system_init_message || "You are a helpful assistant";
    }
  }
}

// src/config/context.js
function trimUserConfig(userConfig) {
  const config = {
    ...userConfig
  };
  const keysSet = new Set(userConfig.DEFINE_KEYS);
  for (const key of ENV.LOCK_USER_CONFIG_KEYS) {
    keysSet.delete(key);
  }
  keysSet.add("DEFINE_KEYS");
  for (const key of Object.keys(config)) {
    if (!keysSet.has(key)) {
      delete config[key];
    }
  }
  return config;
}
var ShareContext = class {
  currentBotId = null;
  currentBotToken = null;
  currentBotName = null;
  chatHistoryKey = null;
  chatLastMessageIdKey = null;
  configStoreKey = null;
  groupAdminKey = null;
  usageKey = null;
  chatType = null;
  chatId = null;
  speakerId = null;
  extraMessageContext = null;
};
var CurrentChatContext = class {
  chat_id = null;
  reply_to_message_id = null;
  parse_mode = ENV.DEFAULT_PARSE_MODE;
  message_id = null;
  reply_markup = null;
  allow_sending_without_reply = null;
  disable_web_page_preview = null;
};
var Context = class {
  // 用户配置
  USER_CONFIG = new UserConfig();
  CURRENT_CHAT_CONTEXT = new CurrentChatContext();
  SHARE_CONTEXT = new ShareContext();
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
   * @param {string | null} storeKey
   */
  async _initUserConfig(storeKey) {
    try {
      this.USER_CONFIG = {
        ...ENV.USER_CONFIG
      };
      const userConfig = JSON.parse(await DATABASE2.get(storeKey) || "{}");
      mergeEnvironment(this.USER_CONFIG, trimUserConfig(userConfig));
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * @param {Request} request
   */
  initTelegramContext(request) {
    const { pathname } = new URL(request.url);
    const token = pathname.match(
      /^\/telegram\/(\d+:[A-Za-z0-9_-]{35})\/webhook/
    )[1];
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
    let groupAdminKey = null;
    if (botId) {
      historyKey += `:${botId}`;
      configStoreKey += `:${botId}`;
    }
    if (message?.chat?.is_forum && message?.is_topic_message) {
      if (message?.message_thread_id) {
        historyKey += `:${message.message_thread_id}`;
        configStoreKey += `:${message.message_thread_id}`;
      }
    }
    if (CONST.GROUP_TYPES.includes(message.chat?.type)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE && message.from.id) {
        historyKey += `:${message.from.id}`;
        configStoreKey += `:${message.from.id}`;
      }
      groupAdminKey = `group_admin:${id}`;
    }
    this.SHARE_CONTEXT.chatHistoryKey = historyKey;
    this.SHARE_CONTEXT.chatLastMessageIdKey = `last_message_id:${historyKey}`;
    this.SHARE_CONTEXT.configStoreKey = configStoreKey;
    this.SHARE_CONTEXT.groupAdminKey = groupAdminKey;
    this.SHARE_CONTEXT.chatType = message.chat?.type;
    this.SHARE_CONTEXT.chatId = message.chat.id;
    this.SHARE_CONTEXT.speakerId = message.from.id || message.chat.id;
  }
  /**
   * @param {TelegramMessage} message
   * @return {Promise<void>}
   */
  async initContext(message) {
    const chatId = message?.chat?.id;
    const replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null;
    this._initChatContext(chatId, replyId);
    await this._initShareContext(message);
  }
};

// src/utils/md2tgmd.js
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
    text = text.replace(escapeChars, "\\$1").replace(/([^\\]|)\\`([^\s].*?[^\\]|[^\\]|(\\\\)*)\\`/g, "$1`$2`").replace(/([^\\]|)\\\*\\\*([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\\*\\\*/g, "$1*$2*").replace(/([^\\]|)\\_\\_([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\_\\_/g, "$1__$2__").replace(/([^\\]|)\\_([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\_/g, "$1_$2_").replace(/([^\\]|)\\~\\~([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\~\\~/g, "$1~$2~").replace(/([^\\]|)\\\|\\\|([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\\|\\\|/g, "$1||$2||").replace(/\\\[([^\]]+?)\\\]\\\((.+?)\\\)/g, "[$1]($2)").replace(/\\\\\\([_*[]\(\)\\~`>#\+-=\|\{\}\.!])/g, "\\$1").replace(/^(\s*)\\(>.+\s*)$/, "$1$2").replace(/^(\s*)\\-\s*(.+)$/, "$1\u2022 $2").replace(/^((\\#){1,3}\s)(.+)/, "$1*$3*");
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

// src/utils/utils.js
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
function errorToString(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  });
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
          const retryAfter = resp.headers.get("Retry-After") || DEFAULT_RETRY_AFTER;
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

// src/telegram/telegram.js
async function sendMessage(message, token, context) {
  const body = {
    text: message
  };
  for (const key of Object.keys(context)) {
    if (context[key] !== void 0 && context[key] !== null) {
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
  const limit = 4096;
  let origin_msg = message;
  let info = "";
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    info = ENV._MIDDLEINFO.message_title;
    if (!ENV._MIDDLEINFO.isLastStep()) {
      chatContext.parse_mode = null;
      message = info ? info + "\n\n" + origin_msg : origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
    } else if (parse_mode === "MarkdownV2") {
      info = info ? ">`" + info + "`\n\n" : "";
      message = info + escape(origin_msg);
    } else {
      message = info ? info + "\n" + origin_msg : origin_msg;
    }
    if (parse_mode !== "MarkdownV2") {
      info = info ? info + "\n" : "";
      chatContext.entities = [
        { type: "code", offset: 0, length: info.length },
        { type: "blockquote", offset: 0, length: info.length }
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
      message = origin_msg;
      resp = await sendMessage(message, token, chatContext);
      if (resp.status !== 200) {
        chatContext.entities = [];
        return await sendMessage(message, token, chatContext);
      }
      console.log("sec request ok");
      return resp;
    }
  }
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
    return await fetch(
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
  let body;
  const headers = {};
  if (typeof photo === "string") {
    body = {
      photo
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null) {
        body[key] = context[key];
      }
    }
    body.parse_mode = "MarkdownV2";
    let info = ">`" + ENV._MIDDLEINFO.message_title + "`\n";
    body.caption = escape(info) + `[\u539F\u59CB\u56FE\u7247](${photo})`;
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  } else {
    body = new FormData();
    body.append("photo", photo, "photo.png");
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null) {
        body.append(key, `${context[key]}`);
      }
    }
  }
  const resp = await fetchWithRetry(url, {
    method: "POST",
    headers,
    body
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
    groupAdmin = JSON.parse(await DATABASE2.get(groupAdminKey) || "[]");
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
    await DATABASE2.put(
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
    const resp = await fetch(
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
  const resp = await fetch(
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
  const resp = await fetchWithRetry(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((r) => r.json());
  if (resp.ok) {
    return {
      ok: true,
      file_path: resp.result.file_path
    };
  }
  return resp;
}
async function getFile(fullPath) {
  return fetchWithRetry(fullPath);
}

// src/agent/stream.js
var Stream = class {
  constructor(response, controller, decoder = null, parser = null) {
    this.response = response;
    this.controller = controller;
    this.decoder = decoder || new SSEDecoder();
    this.parser = parser || openaiSseJsonParser;
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
        if (done) {
          continue;
        }
        if (!sse) {
          continue;
        }
        const { finish, data } = this.parser(sse);
        if (finish) {
          done = finish;
          continue;
        }
        if (data) {
          yield data;
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
      if (!this.event && !this.data.length) {
        return null;
      }
      const sse = {
        event: this.event,
        data: this.data.join("\n")
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
    let [fieldName, _, value] = this.partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldName === "event") {
      this.event = value;
    } else if (fieldName === "data") {
      this.data.push(value);
    }
    return null;
  }
  partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
      return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
    }
    return [str, "", ""];
  }
};
var JSONLDecoder = class {
  constructor() {
  }
  decode(line) {
    return line;
  }
};
function openaiSseJsonParser(sse) {
  if (sse.data.startsWith("[DONE]")) {
    return { finish: true };
  }
  if (sse.event === null) {
    try {
      return { data: JSON.parse(sse.data) };
    } catch (e) {
      console.error(e, sse);
    }
  }
  return {};
}
function cohereSseJsonParser(sse) {
  try {
    const res = JSON.parse(sse);
    return {
      finish: res.is_finished,
      data: res
    };
  } catch (e) {
    console.error(e, sse);
    const finish = sse.startsWith('{"is_finished":true');
    return { finish };
  }
}
function anthropicSseJsonParser(sse) {
  switch (sse.event) {
    case "content_block_delta":
      try {
        return { data: JSON.parse(sse.data) };
      } catch (e) {
        console.error(e, sse.data);
        return {};
      }
    case "message_start":
    case "content_block_start":
    case "content_block_stop":
      return {};
    case "message_stop":
      return { finish: true };
    default:
      return {};
  }
}
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

// src/agent/request.js
function fixOpenAICompatibleOptions(options) {
  options = options || {};
  options.streamBuilder = options.streamBuilder || function(r, c) {
    return new Stream(r, c);
  };
  options.contentExtractor = options.contentExtractor || function(d) {
    return d?.choices?.[0]?.delta?.content;
  };
  options.fullContentExtractor = options.fullContentExtractor || function(d) {
    return d.choices?.[0]?.message.content;
  };
  options.errorExtractor = options.errorExtractor || function(d) {
    return d.error?.message;
  };
  return options;
}
function isJsonResponse(resp) {
  return resp.headers.get("content-type").indexOf("json") !== -1;
}
function isEventStreamResponse(resp) {
  const types = ["application/stream+json", "text/event-stream"];
  const content = resp.headers.get("content-type");
  for (const type of types) {
    if (content.indexOf(type) !== -1) {
      return true;
    }
  }
  return false;
}
async function requestChatCompletions(url, header, body, context, onStream, onResult = null, options = null) {
  const controller = new AbortController();
  const { signal } = controller;
  let timeoutID = null;
  if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0) {
    timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT);
  }
  const resp = await fetchWithRetry(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body),
    signal
  });
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  options = fixOpenAICompatibleOptions(options);
  const immediatePromise = Promise.resolve("immediate");
  if (onStream && resp.ok && isEventStreamResponse(resp)) {
    const stream = options.streamBuilder(resp, controller);
    let contentFull = "";
    let lengthDelta = 0;
    let updateStep = 25;
    let msgPromise = null;
    let lastChunk = null;
    let usage = null;
    try {
      for await (const data of stream) {
        const c = options.contentExtractor(data) || "";
        if (c === "") {
          continue;
        }
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
    }
    contentFull += lastChunk;
    if (ENV.GPT3_TOKENS_COUNT && usage) {
      onResult?.(result);
      ENV._MIDDLEINFO.tokenUpdate({ prompt: usage?.prompt_tokens ?? 0, completion: usage?.completion_tokens ?? 0 });
    }
    await msgPromise;
    return contentFull;
  }
  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }
  const result = await resp.json();
  if (!result) {
    throw new Error("Empty response");
  }
  if (options.errorExtractor(result)) {
    throw new Error(options.errorExtractor(result));
  }
  try {
    onResult?.(result);
    return options.fullContentExtractor(result);
  } catch (e) {
    console.error(e);
    throw Error(JSON.stringify(result));
  }
}

// src/agent/openai.js
function openAIKeyFromContext(context) {
  const length = context.USER_CONFIG.OPENAI_API_KEY.length;
  return context.USER_CONFIG.OPENAI_API_KEY[Math.floor(Math.random() * length)];
}
function isOpenAIEnable(context) {
  return context.USER_CONFIG.OPENAI_API_KEY.length > 0;
}
async function requestCompletionsFromOpenAI(message, prompt, history, context, onStream) {
  const url = `${ENV._MIDDLEINFO.process_info.PROXY_URL}/chat/completions`;
  const messages = [{ role: "user", content: message }];
  const firstStepWithFile = ENV._MIDDLEINFO.current_step_index == 1 && (ENV._MIDDLEINFO.file_raw || ENV._MIDDLEINFO.file_uri);
  const otherStepWithFile = ENV._MIDDLEINFO.current_step_index !== 1 && (ENV._MIDDLEINFO.prestep_file_raw || ENV._MIDDLEINFO.prestep_file_uri);
  if (firstStepWithFile || otherStepWithFile) {
    messages[0].content = [{
      "type": "text",
      "text": message || "what is this?"
      // cluade-3-haiku model 图像识别必须带文本
    }, {
      "type": "image_url",
      "image_url": {
        "url": firstStepWithFile || otherStepWithFile
      }
    }];
  }
  messages.unshift(...history || []);
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    model: ENV._MIDDLEINFO.process_info.MODEL,
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages,
    stream: onStream != null,
    ...!!onStream && ENV.ENABLE_SHOWTOKENINFO && { stream_options: { include_usage: true } }
  };
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIKeyFromContext(context)}`
  };
  return requestChatCompletions(url, header, body, context, onStream);
}
async function requestImageFromOpenAI(prompt, context) {
  const url = `${ENV._MIDDLEINFO.process_info.PROXY_URL || context.USER_CONFIG.OPENAI_API_BASE}/images/generations`;
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${openAIKeyFromContext(context)}`
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model: context.USER_CONFIG.DALL_E_MODEL
  };
  if (body.model === "dall-e-3") {
    body.quality = context.USER_CONFIG.DALL_E_IMAGE_QUALITY;
    body.style = context.USER_CONFIG.DALL_E_IMAGE_STYLE;
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return resp?.data?.[0]?.url;
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
  formData.append("model", ENV._MIDDLEINFO.process_info.MODEL);
  if (context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS) {
    Object.entries(context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  formData.append("response_format", "json");
  let resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: formData,
    redirect: "follow"
  }).catch((e) => {
    console.error(e.message);
    return { ok: false, message: e.message };
  });
  if (resp.ok) {
    resp = await resp.json();
    console.log(`Transcription: ${resp.text}`);
    return { ok: !resp.error, type: "text", content: resp.text, message: resp.error };
  } else {
    return { ok: false, message: await resp.text() };
  }
}

// src/agent/workersai.js
async function run(model, body, id, token) {
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
  return !!(context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID && context.USER_CONFIG.CLOUDFLARE_TOKEN);
}
async function requestCompletionsFromWorkersAI(message, prompt, history, context, onStream) {
  const id = context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID;
  const token = context.USER_CONFIG.CLOUDFLARE_TOKEN;
  const model = context.USER_CONFIG.WORKERS_CHAT_MODEL;
  const url = `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`;
  const header = {
    Authorization: `Bearer ${token}`
  };
  const messages = [...history || [], { role: "user", content: message }];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    messages,
    stream: onStream !== null
  };
  const options = {};
  options.contentExtractor = function(data) {
    return data?.response;
  };
  options.fullContentExtractor = function(data) {
    return data?.result?.response;
  };
  options.errorExtractor = function(data) {
    return data?.errors?.[0]?.message;
  };
  return requestChatCompletions(url, header, body, context, onStream, null, options);
}
async function requestImageFromWorkersAI(prompt, context) {
  const id = context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID;
  const token = context.USER_CONFIG.CLOUDFLARE_TOKEN;
  const raw = await run(context.USER_CONFIG.WORKERS_IMAGE_MODEL, { prompt }, id, token);
  return await raw.blob();
}

// src/agent/gemini.js
function isGeminiAIEnable(context) {
  return !!context.USER_CONFIG.GOOGLE_API_KEY;
}
async function requestCompletionsFromGeminiAI(message, prompt, history, context, onStream) {
  onStream = null;
  const url = `${context.USER_CONFIG.GOOGLE_COMPLETIONS_API}${context.USER_CONFIG.GOOGLE_COMPLETIONS_MODEL}:${onStream ? "streamGenerateContent" : "generateContent"}?key=${context.USER_CONFIG.GOOGLE_API_KEY}`;
  const contentsTemp = [...history || [], { role: "user", content: message }];
  if (prompt) {
    contentsTemp.push({ role: "assistant", content: prompt });
  }
  const contents = [];
  const rolMap = {
    "assistant": "model",
    "system": "user",
    "user": "user"
  };
  for (const msg of contentsTemp) {
    msg.role = rolMap[msg.role];
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
    console.error(e);
    if (!data) {
      throw new Error("Empty response");
    }
    throw new Error(data?.error?.message || JSON.stringify(data));
  }
}

// src/agent/mistralai.js
function isMistralAIEnable(context) {
  return !!context.USER_CONFIG.MISTRAL_API_KEY;
}
async function requestCompletionsFromMistralAI(message, prompt, history, context, onStream) {
  const url = `${context.USER_CONFIG.MISTRAL_API_BASE}/chat/completions`;
  const messages = [...history || [], { role: "user", content: message }];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    model: context.USER_CONFIG.MISTRAL_CHAT_MODEL,
    messages,
    stream: onStream != null
  };
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${context.USER_CONFIG.MISTRAL_API_KEY}`
  };
  return requestChatCompletions(url, header, body, context, onStream);
}

// src/agent/cohere.js
function isCohereAIEnable(context) {
  return !!context.USER_CONFIG.COHERE_API_KEY;
}
async function requestCompletionsFromCohereAI(message, prompt, history, context, onStream) {
  const url = `${context.USER_CONFIG.COHERE_API_BASE}/chat`;
  const header = {
    "Authorization": `Bearer ${context.USER_CONFIG.COHERE_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  const roleMap = {
    "assistant": "CHATBOT",
    "user": "USER"
  };
  let connectors = [];
  Object.entries(ENV.COHERE_CONNECT_TRIGGER).forEach(([id, triggers]) => {
    const result = triggers.some((trigger) => {
      const triggerRegex = new RegExp(trigger, "i");
      return triggerRegex.test(message);
    });
    if (result)
      connectors.push({ id });
  });
  const body = {
    message,
    model: context.USER_CONFIG.COHERE_CHAT_MODEL,
    stream: onStream != null,
    preamble: prompt,
    chat_history: history.map((msg) => {
      return {
        role: roleMap[msg.role],
        message: msg.content
      };
    }),
    ...connectors.length && { connectors }
  };
  if (!body.preamble) {
    delete body.preamble;
  }
  const options = {};
  options.streamBuilder = function(r, c) {
    return new Stream(r, c, new JSONLDecoder(), cohereSseJsonParser);
  };
  options.contentExtractor = function(data) {
    if (data?.event_type === "text-generation") {
      return data?.text;
    }
    return null;
  };
  options.fullContentExtractor = function(data) {
    return data?.text;
  };
  options.errorExtractor = function(data) {
    return data?.message;
  };
  return requestChatCompletions(url, header, body, context, onStream, null, options);
}

// src/agent/anthropic.js
function isAnthropicAIEnable(context) {
  return !!context.USER_CONFIG.ANTHROPIC_API_KEY;
}
async function requestCompletionsFromAnthropicAI(message, prompt, history, context, onStream) {
  const url = `${context.USER_CONFIG.ANTHROPIC_API_BASE}/messages`;
  const header = {
    "x-api-key": context.USER_CONFIG.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  };
  const body = {
    system: prompt,
    model: context.USER_CONFIG.ANTHROPIC_CHAT_MODEL,
    messages: [...history || [], { role: "user", content: message }],
    stream: onStream != null,
    max_tokens: ENV.MAX_TOKEN_LENGTH
  };
  if (!body.system) {
    delete body.system;
  }
  const options = {};
  options.streamBuilder = function(r, c) {
    return new Stream(r, c, null, anthropicSseJsonParser);
  };
  options.contentExtractor = function(data) {
    return data?.delta?.text;
  };
  options.fullContentExtractor = function(data) {
    return data?.content?.[0].text;
  };
  options.errorExtractor = function(data) {
    return data?.error?.message;
  };
  return requestChatCompletions(url, header, body, context, onStream, null, options);
}

// src/agent/azure.js
function azureKeyFromContext(context) {
  return context.USER_CONFIG.AZURE_API_KEY;
}
function isAzureEnable(context) {
  return !!(context.USER_CONFIG.AZURE_API_KEY && context.USER_CONFIG.AZURE_PROXY_URL);
}
function isAzureImageEnable(context) {
  return !!(context.USER_CONFIG.AZURE_API_KEY && context.USER_CONFIG.AZURE_DALLE_API);
}
async function requestCompletionsFromAzureOpenAI(message, prompt, history, context, onStream) {
  const url = context.USER_CONFIG.AZURE_PROXY_URL;
  const messages = [...history || [], { role: "user", content: message }];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    ...context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS,
    messages,
    stream: onStream != null
  };
  const header = {
    "Content-Type": "application/json",
    "api-key": azureKeyFromContext(context)
  };
  return requestChatCompletions(url, header, body, context, onStream);
}
async function requestImageFromAzureOpenAI(prompt, context) {
  const url = context.USER_CONFIG.AZURE_DALLE_API;
  const header = {
    "Content-Type": "application/json",
    "api-key": azureKeyFromContext(context)
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    style: context.USER_CONFIG.DALL_E_IMAGE_STYLE,
    quality: context.USER_CONFIG.DALL_E_IMAGE_QUALITY
  };
  const validSize = ["1792x1024", "1024x1024", "1024x1792"];
  if (!validSize.includes(body.size)) {
    body.size = "1024x1024";
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return resp?.data?.[0]?.url;
}

// src/agent/agents.js
var chatLlmAgents = [
  {
    name: "azure",
    enable: isAzureEnable,
    request: requestCompletionsFromAzureOpenAI
  },
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestCompletionsFromOpenAI
  },
  {
    name: "workers",
    enable: isWorkersAIEnable,
    request: requestCompletionsFromWorkersAI
  },
  {
    name: "gemini",
    enable: isGeminiAIEnable,
    request: requestCompletionsFromGeminiAI
  },
  {
    name: "mistral",
    enable: isMistralAIEnable,
    request: requestCompletionsFromMistralAI
  },
  {
    name: "cohere",
    enable: isCohereAIEnable,
    request: requestCompletionsFromCohereAI
  },
  {
    name: "anthropic",
    enable: isAnthropicAIEnable,
    request: requestCompletionsFromAnthropicAI
  }
];
function currentChatModel(agentName, context) {
  switch (agentName) {
    case "azure":
      return "azure";
    case "openai":
      return context.USER_CONFIG.OPENAI_CHAT_MODEL;
    case "workers":
      return context.USER_CONFIG.WORKERS_CHAT_MODEL;
    case "gemini":
      return context.USER_CONFIG.GOOGLE_COMPLETIONS_MODEL;
    case "mistral":
      return context.USER_CONFIG.MISTRAL_CHAT_MODEL;
    case "cohere":
      return context.USER_CONFIG.COHERE_CHAT_MODEL;
    case "anthropic":
      return context.USER_CONFIG.ANTHROPIC_CHAT_MODEL;
    default:
      return null;
  }
}
function customInfo(config) {
  let AI_PROVIDER = config.AI_PROVIDER;
  if (config.AI_PROVIDER === "auto") {
    AI_PROVIDER = "openai";
  }
  let CHAT_MODEL = "";
  switch (AI_PROVIDER) {
    case "openai":
    case "azure":
    default:
      CHAT_MODEL = config.OPENAI_CHAT_MODEL;
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
  let info = `MODE: ${config.CURRENT_MODE}`;
  const PROCESS = config.MODES[config.CURRENT_MODE] || [];
  for (const [k, v] of Object.entries(PROCESS)) {
    info += `
- ${k}
` + " ".repeat(4) + v.map((i) => {
      if (Object.keys(i).indexOf("API_KEY") > -1) {
        delete i.API_KEY;
        delete i.PROXY_URL;
      }
      return Object.values(i).join(" ") || `${k}:text`;
    }).join("\n" + " ".repeat(4));
  }
  return info;
}
function loadChatLLM(context) {
  for (const llm of chatLlmAgents) {
    if (llm.name === (ENV._MIDDLEINFO.process_info?.AI_PROVIDER || context.USER_CONFIG.AI_PROVIDER)) {
      return llm;
    }
  }
  for (const llm of chatLlmAgents) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
var visionLlmAgents = [
  // 当前仅实现OpenAI图像识别
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestCompletionsFromOpenAI
  }
];
function loadVisionLLM(context) {
  for (const llm of visionLlmAgents) {
    if (llm.name === ENV._MIDDLEINFO.process_info.AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of chatLlmAgents) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
var audioLlmAgents = [
  // 当前仅实现OpenAI音频处理
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestTranscriptionFromOpenAI
  }
];
function loadAudioLLM(context) {
  for (const llm of audioLlmAgents) {
    if (llm.name === ENV._MIDDLEINFO.process_info.AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of audioLlmAgents) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
var imageGenAgents = [
  {
    name: "azure",
    enable: isAzureImageEnable,
    request: requestImageFromAzureOpenAI
  },
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestImageFromOpenAI
  },
  {
    name: "workers",
    enable: isWorkersAIEnable,
    request: requestImageFromWorkersAI
  }
];
function loadImageGen(context) {
  for (const imgGen of imageGenAgents) {
    if (imgGen.name === context.USER_CONFIG.AI_IMAGE_PROVIDER) {
      return imgGen;
    }
  }
  for (const imgGen of imageGenAgents) {
    if (imgGen.enable(context)) {
      return imgGen;
    }
  }
  return null;
}
function currentImageModel(agentName, context) {
  switch (agentName) {
    case "azure":
      return "azure";
    case "openai":
      return context.USER_CONFIG.DALL_E_MODEL;
    case "workers":
      return context.USER_CONFIG.WORKERS_IMAGE_MODEL;
    default:
      return null;
  }
}

// src/agent/llm.js
function tokensCounter() {
  return (text) => {
    return text.length;
  };
}
async function loadHistory(context, key) {
  const historyDisable = !!ENV._MIDDLEINFO.file_uri || ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  if (historyDisable) {
    return { real: [], original: [] };
  }
  let history = [];
  try {
    history = JSON.parse(await DATABASE2.get(key) || "{}");
  } catch (e) {
    console.error(e);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }
  let original = JSON.parse(JSON.stringify(history));
  const counter = tokensCounter();
  const trimHistory = (list, initLength, maxLength, maxToken) => {
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
    history = trimHistory(history, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
    original = trimHistory(original, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
  }
  return { real: history, original };
}
async function requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream) {
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = await loadHistory(context, historyKey);
  const readTime = ((performance.now() - readStartTime) / 1e3).toFixed(2);
  console.log(`readHistoryTime: ${readTime}s`);
  if (modifier) {
    const modifierData = modifier(history, text);
    history = modifierData.history;
    text = modifierData.text;
  }
  const { real: realHistory, original: originalHistory } = history;
  const answer = await llm(text, prompt, realHistory, context, onStream);
  if (ENV._MIDDLEINFO.file_uri) {
    text = "[A FILE] " + text;
  }
  if (!historyDisable) {
    originalHistory.push({ role: "user", content: text || "" });
    originalHistory.push({ role: "assistant", content: answer });
    await DATABASE2.put(historyKey, JSON.stringify(originalHistory)).catch(console.error);
  }
  return answer;
}
async function chatWithLLM(text, context, modifier, pointerLLM = loadChatLLM) {
  try {
    text = ENV._MIDDLEINFO.prestep_text || text;
    const parseMode = context.CURRENT_CHAT_CONTEXT.parse_mode;
    try {
      if (!context.CURRENT_CHAT_CONTEXT.message_id) {
        context.CURRENT_CHAT_CONTEXT.parse_mode = null;
        const msg = await sendMessageToTelegramWithContext2(context)("...").then((r) => r.json());
        context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
      }
      context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
      context.CURRENT_CHAT_CONTEXT.reply_markup = null;
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => sendChatActionToTelegramWithContext(context)("typing").catch(console.error), 0);
    let onStream = null;
    let nextEnableTime = null;
    if (ENV.STREAM_MODE) {
      onStream = async (text2) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !ENV._MIDDLEINFO.isLastStep())
          return;
        try {
          if (nextEnableTime && nextEnableTime > Date.now()) {
            return;
          }
          const resp = await sendMessageToTelegramWithContext2(context)(text2);
          if (resp.status === 429) {
            const retryAfter = parseInt(resp.headers.get("Retry-After"));
            if (retryAfter) {
              nextEnableTime = Date.now() + retryAfter * 1e3;
              return;
            }
          }
          nextEnableTime = null;
        } catch (e) {
          console.error(e);
        }
      };
    }
    const llm = pointerLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext2(context)(`LLM is not enable`);
    }
    const prompt = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
    console.log(`[START] Chat via ${llm.name}`);
    const answer = await requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream);
    if (!answer) {
      return sendMessageToTelegramWithContext2(context)("None response");
    }
    context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
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
    if (nextEnableTime && nextEnableTime > Date.now()) {
      console.log(`The last message need wait:${((nextEnableTime - Date.now()) / 1e3).toFixed(1)}s`);
      await new Promise((resolve) => setTimeout(resolve, nextEnableTime - Date.now()));
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || ENV._MIDDLEINFO.isLastStep()) {
      await sendMessageToTelegramWithContext2(context)(answer);
    }
    if (!ENV._MIDDLEINFO.isLastStep()) {
      ENV._MIDDLEINFO.prestep_text = answer;
    }
    console.log(`[DONE] Chat via ${llm.name}`);
    return null;
  } catch (e) {
    let errMsg = `Error: ${e.message}`;
    if (errMsg.length > 2048) {
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext2(context)(errMsg);
  }
}
async function chatViaFileWithLLM(file, fileName, context) {
  try {
    const llm = loadAudioLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext2(context)(`LLM is not enable`);
    }
    const startTime = performance.now();
    const answer = await llm(file, fileName, context);
    if (!answer.ok) {
      console.error(answer.message);
      return sendMessageToTelegramWithContext2(context)("Chat via file failed.");
    }
    console.log(`[FILE DONE] ${llm.name}: ${((performance.now() - startTime) / 1e3).toFixed(1)}s`);
    if (!ENV._MIDDLEINFO.isLastStep()) {
      if (answer.type === "text") {
        ENV._MIDDLEINFO.prestep_text = answer.content;
      } else if (typeof answer.content === "string") {
        ENV._MIDDLEINFO.prestep_uri = answer.content;
      } else
        ENV._MIDDLEINFO.prestep_raw = answer.content;
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || ENV._MIDDLEINFO.isLastStep()) {
      let resp = null;
      const sendHandler = { "text": sendMessageToTelegramWithContext2, "image": sendPhotoToTelegramWithContext };
      resp = await sendHandler[answer.type]?.(context)(answer.content).then((r) => r.json()) || {
        ok: false,
        message: "cannot find handler"
      };
      if (!resp.ok) {
        console.error(`[FILE FAILED] Send data failed: ${resp.message}`);
      }
    }
    return null;
  } catch (e) {
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext2(context)(e.message.substring(2048));
  }
}

// src/telegram/command.js
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
  "/setenv",
  "/delenv",
  "/version",
  "/system",
  "/help",
  "/mode"
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
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandSystem,
    needAuth: commandAuthCheck.default
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
async function commandGenerateImg(message, command, subcommand, context) {
  if (subcommand === "") {
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.img.help);
  }
  try {
    setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
    const provider = context.USER_CONFIG.AI_IMAGE_PROVIDER == "auto" ? "openai" : context.USER_CONFIG.AI_PROVIDER;
    const PROCESS_INFO = {
      TYPE: "text:image",
      PROVIDER_SOURCE: "default",
      AI_PROVIDER: provider,
      MODEL: provider == "openai" ? context.USER_CONFIG.DALL_E_MODEL : context.USER_CONFIG.WORKERS_IMAGE_MODEL
    };
    if (!context.CURRENT_CHAT_CONTEXT) {
      context.CURRENT_CHAT_CONTEXT = {};
    }
    ENV._MIDDLEINFO.process_info = PROCESS_INFO;
    const gen = loadImageGen(context)?.request;
    if (!gen) {
      return sendMessageToTelegramWithContext2(context)(`ERROR: Image generator not found`);
    }
    const img = await gen(subcommand, context);
    return sendPhotoToTelegramWithContext(context)(img);
  } catch (e) {
    console.error(e.message);
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandGetHelp(message, command, subcommand, context) {
  const helpMsg = ENV.I18N.command.help.summary + "```markdown\n" + Object.keys(commandHandlers).map((key) => `${key}\uFF1A${ENV.I18N.command.help[key.substring(1)]}`).join("\n") + "\n```";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "MarkdownV2";
  return sendMessageToTelegramWithContext2(context)(helpMsg);
}
async function commandCreateNewChatContext(message, command, subcommand, context) {
  try {
    await DATABASE2.delete(context.SHARE_CONTEXT.chatHistoryKey);
    context.CURRENT_CHAT_CONTEXT.reply_markup = JSON.stringify({
      remove_keyboard: true,
      selective: true
    });
    if (command === "/new") {
      return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.new.new_chat_start);
    } else {
      return sendMessageToTelegramWithContext2(context)(`${ENV.I18N.command.new.new_chat_start}(${context.CURRENT_CHAT_CONTEXT.chat_id})`);
    }
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandUpdateUserConfig(message, command, subcommand, context, processUpdate = false) {
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
    return sendMessageToTelegramWithContext2(context)(ENV.I18N.command.help.setenv);
  }
  const key = subcommand.slice(0, kv);
  const value = subcommand.slice(kv + 1);
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
    return sendMessageToTelegramWithContext2(context)(`Key ${key} is locked`);
  }
  try {
    mergeEnvironment(context.USER_CONFIG, {
      [key]: value
    });
    if (processUpdate) {
      ENV._MIDDLEINFO.updateProcess(context.USER_CONFIG, key, value);
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS.push(key);
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    console.log("Update user config: ", key, context.USER_CONFIG[key]);
    await DATABASE2.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(trimUserConfig(context.USER_CONFIG)));
    return sendMessageToTelegramWithContext2(context)("Update user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandUpdateUserConfigs(message, command, subcommand, context, processUpdate = false) {
  try {
    const values = JSON.parse(subcommand);
    for (const ent of Object.entries(values)) {
      const [key, value] = ent;
      if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
        return sendMessageToTelegramWithContext2(context)(`Key ${key} is locked`);
      }
      mergeEnvironment(context.USER_CONFIG, {
        [key]: value
      });
      if (processUpdate) {
        ENV._MIDDLEINFO.updateProcess(context.USER_CONFIG, key, value);
        continue;
      }
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      console.log("Update user config: ", key, context.USER_CONFIG[key]);
    }
    if (processUpdate) {
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE2.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(trimUserConfig(context.USER_CONFIG)))
    );
    return sendMessageToTelegramWithContext2(context)("Update user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandDeleteUserConfig(message, command, subcommand, context) {
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
    const msg = `Key ${subcommand} is locked`;
    return sendMessageToTelegramWithContext2(context)(msg);
  }
  try {
    context.USER_CONFIG[subcommand] = null;
    context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
    await DATABASE2.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(context.USER_CONFIG))
    );
    return sendMessageToTelegramWithContext2(context)("Delete user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
}
async function commandClearUserConfig(message, command, subcommand, context) {
  try {
    await DATABASE2.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify({})
    );
    return sendMessageToTelegramWithContext2(context)("Clear user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
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
  let online = await fetch(info, config).then((r) => r.json()).catch(() => null);
  if (!online) {
    online = await fetch(ts, config).then((r) => r.text()).then((ts2) => ({ ts: Number(ts2.trim()), sha: "unknown" })).catch(() => ({ ts: 0, sha: "unknown" }));
  }
  if (current.ts < online.ts) {
    return sendMessageToTelegramWithContext2(context)(`New version detected: ${online.sha}(${online.ts})
Current version: ${current.sha}(${current.ts})`);
  } else {
    return sendMessageToTelegramWithContext2(context)(`Current version: ${current.sha}(${current.ts}) is up to date`);
  }
}
async function commandSystem(message, command, subcommand, context) {
  let chatAgent = loadChatLLM(context)?.name;
  let imageAgent = loadImageGen(context)?.name;
  let chatModel = currentChatModel(chatAgent, context);
  let imageModel = currentImageModel(imageAgent, context);
  let msg = `<pre>AGENT: ${JSON.stringify({
    CHAT_AGENT: chatAgent,
    CHAT_MODEL: chatModel,
    IMAGE_AGENT: imageAgent,
    IMAGE_MODEL: imageModel,
    STT_MODEL: context.USER_CONFIG.OPENAI_STT_MODEL,
    VISION_MODEL: context.USER_CONFIG.OPENAI_VISION_MODEL
  }, null, 2)}
` + customInfo(context.USER_CONFIG) + "\n</pre>";
  if (ENV.DEV_MODE) {
    const shareCtx = { ...context.SHARE_CONTEXT };
    shareCtx.currentBotToken = "******";
    context.USER_CONFIG.OPENAI_API_KEY = ["******"];
    context.USER_CONFIG.AZURE_API_KEY = "******";
    context.USER_CONFIG.AZURE_PROXY_URL = "******";
    context.USER_CONFIG.AZURE_DALLE_API = "******";
    context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID = "******";
    context.USER_CONFIG.CLOUDFLARE_TOKEN = "******";
    context.USER_CONFIG.GOOGLE_API_KEY = "******";
    context.USER_CONFIG.MISTRAL_API_KEY = "******";
    context.USER_CONFIG.COHERE_API_KEY = "******";
    context.USER_CONFIG.ANTHROPIC_API_KEY = "******";
    const config = trimUserConfig(context.USER_CONFIG);
    msg = "<pre>\n" + msg;
    msg += `USER_CONFIG: ${JSON.stringify(config, null, 2)}
`;
    msg += `CHAT_CONTEXT: ${JSON.stringify(context.CURRENT_CHAT_CONTEXT, null, 2)}
`;
    msg += `SHARE_CONTEXT: ${JSON.stringify(shareCtx, null, 2)}
`;
    msg += CUSTOM_TINFO(context.USER_CONFIG) + "\n</pre>";
  }
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext2(context)(msg);
}
async function commandRegenerate(message, command, subcommand, context) {
  const mf = (history, text) => {
    const { real, original } = history;
    let nextText = text;
    if (!real || !original || real.length === 0 || original.length === 0) {
      throw new Error("History not found");
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
    if (!ENV._MIDDLEINFO.orignal_msg_info.msgType) {
      return sendMessageToTelegramWithContext2(context)("Not support the message ");
    }
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
  const customKey = Object.keys(CUSTOM_COMMAND).find((k) => message.text.startsWith(k));
  let commandMsg = message.text;
  if (customKey) {
    message.text = message.text.substring(customKey.length + 1).trim();
    commandMsg = CUSTOM_COMMAND[customKey];
  }
  for (const key in commandHandlers) {
    if (commandMsg === key || commandMsg.startsWith(key + " ")) {
      const command = commandHandlers[key];
      try {
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType);
          if (roleList) {
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId);
            if (chatRole === null) {
              return sendMessageToTelegramWithContext2(context)("ERROR: Get chat role failed");
            }
            if (!roleList.includes(chatRole)) {
              return sendMessageToTelegramWithContext2(context)(
                `ERROR: Permission denied, need ${roleList.join(" or ")}`
              );
            }
          }
        }
      } catch (e) {
        return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
      }
      const subcommand = commandMsg.substring(key.length).trim();
      if (message.text && customKey && key.startsWith("/setenv")) {
        await command.fn(message, key, subcommand, context, true);
        break;
      }
      try {
        const result = await command.fn(message, key, subcommand, context);
        console.log("[DONE] Command: " + key + " " + subcommand);
        return result;
      } catch (e) {
        return sendMessageToTelegramWithContext2(context)(e.message);
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
  for (const key of commandSortList) {
    if (ENV.HIDE_COMMAND_BUTTONS.includes(key)) {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(commandHandlers, key) && commandHandlers[key].scopes) {
      for (const scope of commandHandlers[key].scopes) {
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

// src/config/middle.js
function extractMessageType(message) {
  let msg = message;
  const acceptType = ["photo", "image", "voice", "audio", "text"];
  let msgType2 = acceptType.find((key) => key in msg);
  if (msgType2 && msgType2 == "text" && message.reply_to_message && ENV.EXTRA_MESSAGE_CONTEXT) {
    const reply_message = message.reply_to_message;
    const reply_type = acceptType.find((key) => key in reply_message);
    if (reply_type && reply_type !== "text") {
      msg = reply_message;
      msgType2 = reply_type;
    }
  }
  const fileType = msg?.document || msgType2;
  if (!fileType) {
    throw new Error("Can't extractMessageType");
  }
  if (msg?.document) {
    if (msg.document.mime_type.match(/image/)) {
      msgType2 = "image";
    } else if (msg.document.mime_type.match(/audio/)) {
      msgType2 = "audio";
    } else {
      throw new Error("Unsupported File type");
    }
  }
  if (msgType2 == "voice") {
    msgType2 = "audio";
  } else if (msgType2 == "photo") {
    msgType2 = "image";
  }
  let file_id = null;
  if (fileType == "photo") {
    const photoLength = msg[fileType].length;
    file_id = msg[fileType]?.[photoLength - 1]?.file_id || msg[fileType]?.file_id;
  } else {
    file_id = msg[fileType]?.file_id || null;
  }
  return { msgType: msgType2, fileType, hasText: !!(message.text || msg.text || message.caption || msg.caption), file_id };
}
var MiddleInfo = class {
  constructor(message, context) {
    this.process_start_time = /* @__PURE__ */ new Date();
    this._token_info = { prompt: 0, completion: 0 };
    this.elapsed_sec = 0;
    this.mode_name = context?.CURRENT_MODE || "default";
    this.current_step_index = 0;
    this.orignal_msg_info = extractMessageType(message);
    MiddleInfo.initProcesses.call(this, context);
    this.process_info = null;
    this.original_text = message.text || (message.caption ? "caption: " + message.caption : "");
    this.file_uri = "";
    this.file_raw = "";
    this.prestep_text = "";
    this.prestep_file_uri = "";
    this.prestep_file_raw = "";
  }
  tokenUpdate(token_info) {
    if (ENV.ENABLE_SHOWINFO && ENV.ENABLE_SHOWTOKENINFO) {
      this._token_info = token_info;
    }
  }
  isLastStep() {
    if (!this.process_info) {
      return true;
    }
    return this.processes.length == this.current_step_index;
  }
  isFirstStep() {
    if (!this.process_info) {
      return true;
    }
    return this.current_step_index === 1;
  }
  get message_title() {
    if (!this.process_info) {
      return "";
    }
    const stepInfo = this.processes.length > 1 ? `[STEP ${this.current_step_index}/${this.processes.length}]
` : "";
    if (!ENV.ENABLE_SHOWINFO) {
      return stepInfo.trim();
    }
    const showToken = ENV.ENABLE_SHOWTOKENINFO;
    const line1Format = "{model} {time}";
    const line2Format = "Token: {prompt} | {completion}";
    return stepInfo + (showToken && this._token_info.prompt ? line1Format + "\n" + line2Format : line1Format).replace("{model}", this.process_info.MODEL).replace("{time}", ((/* @__PURE__ */ new Date() - this.process_start_time) / 1e3).toFixed(1) + "s").replace("{prompt}", this._token_info.prompt).replace("{comcompletionpl}", this._token_info.completion);
  }
  static initProcesses(USER_CONFIG) {
    const msgType2 = this.orignal_msg_info?.msgType;
    if (this.mode_name && msgType2) {
      const defaultModeInfo = { text: [{}], image: [{}], audio: [{}, { TYPE: "text:text" }] };
      this.processes = (USER_CONFIG.MODES[this.mode_name]?.[msgType2] || defaultModeInfo[msgType2]).map((i) => ({
        ...i
      }));
    }
  }
  updateProcess(USER_CONFIG, k, v) {
    switch (k) {
      case "CURRENT_MODE":
        this.mode_name = v;
        MiddleInfo.initProcesses.call(this, USER_CONFIG);
        break;
      case "AI_PROVIDER":
      case "ROLE":
        this.processes[this.current_step_index][k] = v;
        break;
      default:
        break;
    }
  }
  initProcess(USER_CONFIG) {
    this.startTime = /* @__PURE__ */ new Date();
    this.process_info = this.processes[this.current_step_index];
    this.current_step_index++;
    if (!this.process_info?.TYPE) {
      this.process_info.TYPE = `${this.orignal_msg_info.msgType}:text`;
    }
    if (!this.process_info?.AI_PROVIDER) {
      this.process_info.AI_PROVIDER = USER_CONFIG.AI_PROVIDER === "auto" ? "openai" : USER_CONFIG.AI_PROVIDER;
    }
    const provider_up = this.process_info.AI_PROVIDER.toUpperCase();
    const provider_source = USER_CONFIG.PROVIDER_SOURCES[this.process_info.PROVIDER_SOURCE || "default"];
    this.process_info.PROXY_URL = provider_source?.["PROXY_URL"] || USER_CONFIG?.[`${provider_up}_API_BASE`];
    this.process_info.API_KEY = provider_source?.["API_KEY"] || USER_CONFIG?.[`${provider_up}_API_KEY`];
    if (!this.process_info?.MODEL) {
      switch (this.process_info.TYPE) {
        case "text:text":
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_CHAT_MODEL`] || USER_CONFIG.CHAT_MODEL;
          break;
        case "text:image":
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_IMAGE_MODEL`] || USER_CONFIG.DALL_E_MODEL;
          break;
        case "audio:text":
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_STT_MODEL`] || USER_CONFIG.OPENAI_STT_MODEL;
          break;
        case "image:text":
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_VISION_MODEL`] || USER_CONFIG.OPENAI_VISION_MODEL;
          break;
        case "text:audio":
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_TTS_MODEL`] || USER_CONFIG.OPENAI_TTS_MODEL;
          break;
        case "audio:audio":
        default:
          throw new Error("unsupported type");
      }
    }
    console.log(`Init step ${this.current_step_index} success.`);
  }
};

// src/telegram/message.js
async function msgInitChatContext(message, context) {
  await context.initContext(message);
  return null;
}
async function msgSaveLastMessage(message, context) {
  if (ENV.DEBUG_MODE) {
    const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
    await DATABASE2.put(lastMessageKey, JSON.stringify(message), { expirationTtl: 3600 });
  }
  return null;
}
async function msgIgnoreOldMessage(message, context) {
  if (ENV.SAFE_MODE) {
    let idList = [];
    try {
      idList = JSON.parse(await DATABASE2.get(context.SHARE_CONTEXT.chatLastMessageIdKey) || "[]");
    } catch (e) {
      console.error(e);
    }
    if (idList.includes(message.message_id)) {
      throw new Error("Ignore old message");
    } else {
      idList.push(message.message_id);
      if (idList.length > 100) {
        idList.shift();
      }
      await DATABASE2.put(context.SHARE_CONTEXT.chatLastMessageIdKey, JSON.stringify(idList));
    }
  }
  return null;
}
async function msgCheckEnvIsReady(message, context) {
  if (!DATABASE2) {
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
        `You are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`
      );
    }
    return null;
  }
  if (CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    if (!ENV.GROUP_CHAT_BOT_ENABLE) {
      throw new Error("Not support");
    }
    if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext2(context)(
        `Your group are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`
      );
    }
    return null;
  }
  return sendMessageToTelegramWithContext2(context)(
    `Not support chat type: ${context.SHARE_CONTEXT.chatType}`
  );
}
async function msgFilterUnsupportedMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE && (ENV.EXTRA_MESSAGE_CONTEXT && !message.reply_to_message.text)) {
    throw new Error("Not supported message type");
  }
  return null;
}
async function msgHandleGroupMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response("Non text message", { status: 200 });
  }
  if (!CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    return null;
  }
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
    const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) => (message?.text || "").startsWith(key));
    if (chatMsgKey) {
      mentioned = true;
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
    } else if (message.entities) {
      let content = "";
      let offset = 0;
      message.entities.forEach((entity) => {
        switch (entity.type) {
          case "bot_command":
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
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
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
              if (mention === botName || mention === "@" + botName) {
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
    if (!mentioned) {
      throw new Error("No mentioned");
    } else {
      return null;
    }
  }
  throw new Error("Not set bot name");
}
async function msgInitUserConfig(message, context) {
  try {
    await context._initUserConfig(context.SHARE_CONTEXT.configStoreKey);
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
function msgInitMiddleInfo(message, context) {
  try {
    ENV._MIDDLEINFO = new MiddleInfo(message, context.USER_CONFIG);
    return null;
  } catch (e) {
    return sendMessageToTelegramWithContext2(context)(e.message);
  }
}
async function msgHandleCommand(message, context) {
  return await handleCommandMessage(message, context);
}
async function msgHandleFile(message, fileType, context) {
  if (!context.CURRENT_CHAT_CONTEXT.message_id) {
    const msg = await sendMessageToTelegramWithContext2(context)("...").then((r) => r.json());
    context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    context.CURRENT_CHAT_CONTEXT.reply_markup = null;
  }
  let file = null, file_name = "", file_url = "";
  let errorMsg = "";
  if (!ENV._MIDDLEINFO.prestep_file_uri && !ENV._MIDDLEINFO.prestep_file_raw) {
    const info = await getFileInfo(ENV._MIDDLEINFO.orignal_msg_info.file_id, context.SHARE_CONTEXT.currentBotToken);
    if (!info.ok) {
      console.log("[FILE FAILED]: " + msgType);
      await sendMessageToTelegramWithContext2(context)(`GET FILE_PATH ERROR: ${info.description}`);
      return new Response("Handle file msg error", { status: 200 });
    }
    sendMessageToTelegramWithContext2(context)("File info done.");
    file_name = info.file_path.split("/").pop();
    file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${context.SHARE_CONTEXT.currentBotToken}/${info.file_path}`;
    console.log("File url:", file_url);
    if (fileType != "photo" || fileType == "photo" && (ENV.LOAD_IMAGE_FILE || ENV._MIDDLEINFO.process_info.MODEL.startsWith("claude"))) {
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
    file_name = ENV._MIDDLEINFO.prestep_file_uri.split("/").pop();
  }
  const start = performance.now();
  if (ENV._MIDDLEINFO.isFirstStep()) {
    ENV._MIDDLEINFO.file_uri = file_url;
    ENV._MIDDLEINFO.file_raw = file;
  } else if (ENV._MIDDLEINFO.isLastStep()) {
    ENV._MIDDLEINFO.prestep_file_uri = file_url;
    ENV._MIDDLEINFO.prestep_file_raw = file;
  }
  try {
    switch (fileType) {
      case "photo":
      case "image":
        if (errorMsg)
          break;
        if (ENV.LOAD_IMAGE_FILE || ENV._MIDDLEINFO.process_info.MODEL.startsWith("claude")) {
          sendMessageToTelegramWithContext2(context)("Image load success.");
          file = `data:image/jpeg;base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
          if (ENV._MIDDLEINFO.isFirstStep()) {
            ENV._MIDDLEINFO.file_raw = file;
          } else if (!ENV._MIDDLEINFO.isLastStep()) {
            ENV._MIDDLEINFO.prestep_file_raw = file;
          }
        }
        console.log(`[FILE DONE] ${fileType}: ${((performance.now() - start) / 1e3).toFixed(2)}s`);
        return { file, file_name };
      case "voice":
      case "audio": {
        if (errorMsg)
          break;
        return { file, file_name };
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
  const { fileType } = ENV._MIDDLEINFO.orignal_msg_info;
  console.log("[FILE]: " + fileType);
  try {
    let text = (message.text || message.caption || "").trim();
    if (ENV.EXTRA_MESSAGE_CONTEXT && context.SHARE_CONTEXT?.extraMessageContext?.text) {
      text = context.SHARE_CONTEXT.extraMessageContext.text || context.SHARE_CONTEXT.extraMessageContext.caption + "\n" + text;
    }
    let result = null;
    const HANDLE_PROCESS = ENV._MIDDLEINFO.processes;
    const clearPreStepInfo = (type) => {
      switch (type) {
        case "text:text":
        case "text:image":
        case "text:audio":
          ENV._MIDDLEINFO.prestep_file_uri = "";
          ENV._MIDDLEINFO.prestep_file_raw = "";
          break;
        case "audio:text":
        case "image:text":
          ENV._MIDDLEINFO.prestep_text = "";
          break;
        default:
          break;
      }
    };
    for (const _ of HANDLE_PROCESS) {
      if (result && result instanceof Response) {
        return result;
      }
      ENV._MIDDLEINFO.initProcess(context.USER_CONFIG);
      clearPreStepInfo(ENV._MIDDLEINFO.process_info.TYPE);
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }
      switch (ENV._MIDDLEINFO.process_info.TYPE) {
        case "text:text":
          result = await chatWithLLM(text, context, null);
          break;
        case "text:image":
          const gen = loadImageGen(context)?.request;
          if (!gen) {
            return sendMessageToTelegramWithContext2(context)(`ERROR: Image generator not found`);
          }
          result = await gen(ENV._MIDDLEINFO.prestep_text || text, context);
          if (!ENV._MIDDLEINFO.isLastStep()) {
            if (typeof result === "string") {
              ENV._MIDDLEINFO.prestep_file_uri = result;
            } else
              ENV._MIDDLEINFO.prestep_file_raw = result;
          }
          const response = await sendPhotoToTelegramWithContext(context)(result);
          if (response.status != 200) {
            console.error(await response.text());
          }
          break;
        case "audio:text":
          const { file, file_name } = await msgHandleFile(message, fileType, context);
          result = await chatViaFileWithLLM(file, file_name, context);
          break;
        case "image:text":
          await msgHandleFile(message, fileType, context);
          result = await chatWithLLM(text, context, null, loadVisionLLM);
          break;
        case "audio:audio":
        case "text:audio":
        default:
          return sendMessageToTelegramWithContext2(context)("unsupported type");
      }
    }
  } catch (e) {
    console.error(e);
    return sendMessageToTelegramWithContext2(context)(`ERROR: ${e.message}`);
  }
  return new Response("success", { status: 200 });
}
async function loadMessage(request, context) {
  const raw = await request.json();
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
    msgChatWithLLM
  ];
  for (const handler of handlers) {
    try {
      const result = await handler(message, context);
      if (result && result instanceof Response) {
        return result;
      }
    } catch (e) {
      console.error(e);
      return new Response(errorToString(e), { status: 500 });
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
      webhook: await bindTelegramWebHook(token, url).catch((e) => errorToString(e)),
      command: await bindCommandForTelegram(token).catch((e) => errorToString(e))
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
async function telegramWebhook(request) {
  try {
    return await makeResponse200(await handleMessage(request));
  } catch (e) {
    console.error(e);
    return new Response(errorToString(e), { status: 200 });
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
    return new Response(errorToString(e), { status: 200 });
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
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${commandsDocument().map((item) => `<p><strong>${item.command}</strong> - ${item.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${footer}
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
    if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/bot`)) {
      return loadBotInfo();
    }
  }
  return null;
}

// src/i18n/zh-hans.js
var zh_hans_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u4E2A\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u5F53\u524D\u652F\u6301\u4EE5\u4E0B\u547D\u4EE4:\n", "help": "\u83B7\u53D6\u547D\u4EE4\u5E2E\u52A9", "new": "\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "start": "\u83B7\u53D6\u4F60\u7684ID, \u5E76\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "img": "\u751F\u6210\u4E00\u5F20\u56FE\u7247, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/img \u56FE\u7247\u63CF\u8FF0`, \u4F8B\u5982`/img \u6708\u5149\u4E0B\u7684\u6C99\u6EE9`", "version": "\u83B7\u53D6\u5F53\u524D\u7248\u672C\u53F7, \u5224\u65AD\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "\u5220\u9664\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6237\u914D\u7F6E", "system": "\u67E5\u770B\u5F53\u524D\u4E00\u4E9B\u7CFB\u7EDF\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5BF9\u8BDD, /redo \u52A0\u4FEE\u6539\u8FC7\u7684\u5185\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u914D\u7F6E\u9879\u683C\u5F0F\u9519\u8BEF: \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB" } } };

// src/i18n/zh-hant.js
var zh_hant_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u500B\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u7576\u524D\u652F\u6301\u7684\u547D\u4EE4\u5982\u4E0B\uFF1A\n", "help": "\u7372\u53D6\u547D\u4EE4\u5E6B\u52A9", "new": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "start": "\u7372\u53D6\u60A8\u7684ID\u4E26\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "img": "\u751F\u6210\u5716\u7247\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/img \u5716\u7247\u63CF\u8FF0`\uFF0C\u4F8B\u5982`/img \u6D77\u7058\u6708\u5149`", "version": "\u7372\u53D6\u7576\u524D\u7248\u672C\u865F\u78BA\u8A8D\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8A2D\u7F6E\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8A2D\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u70BA /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "\u522A\u9664\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6236\u914D\u7F6E", "system": "\u67E5\u770B\u4E00\u4E9B\u7CFB\u7D71\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5C0D\u8A71 /redo \u52A0\u4FEE\u6539\u904E\u7684\u5167\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u914D\u7F6E\u9805\u683C\u5F0F\u932F\u8AA4: \u547D\u4EE4\u683C\u5F0F\u70BA /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71" } } };

// src/i18n/en.js
var en_default = { "env": { "system_init_message": "You are a helpful assistant" }, "command": { "help": { "summary": "The following commands are currently supported:\n", "help": "Get command help", "new": "Start a new conversation", "start": "Get your ID and start a new conversation", "img": "Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`", "version": "Get the current version number to determine whether to update", "setenv": "Set user configuration, the complete command format is /setenv KEY=VALUE", "setenvs": 'Batch set user configurations, the full format of the command is /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "delenv": "Delete user configuration, the complete command format is /delenv KEY", "clearenv": "Clear all user configuration", "system": "View some system information", "redo": "Redo the last conversation, /redo with modified content or directly /redo", "echo": "Echo the message", "mode": "Configuration entry format error: the full format of the command is /mode NAME, when NAME=all, view all modes" }, "new": { "new_chat_start": "A new conversation has started" } } };

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
      return new Response(errorToString(e), { status: 500 });
    }
  }
};
export {
  main_default as default
};
