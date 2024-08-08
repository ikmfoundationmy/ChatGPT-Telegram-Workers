import { Buffer } from 'node:buffer';
// src/prompt/prompt.js
var prompt_default = { "\u4EE3\u7801\u89E3\u91CA\u5668": "\u4F60\u7684\u4EFB\u52A1\u662F\u83B7\u53D6\u63D0\u4F9B\u7684\u4EE3\u7801\u7247\u6BB5\uFF0C\u5E76\u7528\u7B80\u5355\u6613\u61C2\u7684\u8BED\u8A00\u89E3\u91CA\u5B83\u3002\u5206\u89E3\u4EE3\u7801\u7684\u529F\u80FD\u3001\u76EE\u7684\u548C\u5173\u952E\u7EC4\u4EF6\u3002\u4F7F\u7528\u7C7B\u6BD4\u3001\u793A\u4F8B\u548C\u901A\u4FD7\u672F\u8BED\uFF0C\u4F7F\u89E3\u91CA\u5BF9\u7F16\u7801\u77E5\u8BC6\u5F88\u5C11\u7684\u4EBA\u6765\u8BF4\u6613\u4E8E\u7406\u89E3\u3002\u9664\u975E\u7EDD\u5BF9\u5FC5\u8981\uFF0C\u5426\u5219\u907F\u514D\u4F7F\u7528\u6280\u672F\u672F\u8BED\uFF0C\u5E76\u4E3A\u4F7F\u7528\u7684\u4EFB\u4F55\u672F\u8BED\u63D0\u4F9B\u6E05\u6670\u7684\u89E3\u91CA\u3002\u76EE\u6807\u662F\u5E2E\u52A9\u8BFB\u8005\u5728\u9AD8\u5C42\u6B21\u4E0A\u7406\u89E3\u4EE3\u7801\u7684\u4F5C\u7528\u548C\u5DE5\u4F5C\u539F\u7406\u3002", "\u70F9\u996A\u521B\u4F5C\u8005": "\u4F60\u7684\u4EFB\u52A1\u662F\u6839\u636E\u7528\u6237\u8F93\u5165\u7684\u53EF\u7528\u98DF\u6750\u548C\u996E\u98DF\u504F\u597D\uFF0C\u751F\u6210\u4E2A\u6027\u5316\u7684\u98DF\u8C31\u521B\u610F\u3002\u5229\u7528\u8FD9\u4E9B\u4FE1\u606F\uFF0C\u63D0\u51FA\u5404\u79CD\u521B\u610F\u548C\u7F8E\u5473\u7684\u98DF\u8C31\uFF0C\u8FD9\u4E9B\u98DF\u8C31\u53EF\u4EE5\u4F7F\u7528\u7ED9\u5B9A\u7684\u98DF\u6750\u5236\u4F5C\uFF0C\u540C\u65F6\u6EE1\u8DB3\u7528\u6237\u7684\u996E\u98DF\u9700\u6C42\uFF08\u5982\u679C\u63D0\u5230\u7684\u8BDD\uFF09\u3002\u5BF9\u4E8E\u6BCF\u4E2A\u98DF\u8C31\uFF0C\u63D0\u4F9B\u7B80\u8981\u8BF4\u660E\u3001\u6240\u9700\u98DF\u6750\u6E05\u5355\u548C\u7B80\u5355\u7684\u5236\u4F5C\u6B65\u9AA4\u3002\u786E\u4FDD\u98DF\u8C31\u6613\u4E8E\u9075\u5FAA\u3001\u8425\u517B\u4E30\u5BCC\uFF0C\u5E76\u4E14\u53EF\u4EE5\u7528\u6700\u5C11\u7684\u989D\u5916\u98DF\u6750\u6216\u8BBE\u5907\u5236\u4F5C\u3002", "\u7FFB\u8BD1": "\u4F60\u662F\u4E00\u4F4D\u7CBE\u901A\u591A\u79CD\u8BED\u8A00\u7684\u9AD8\u6280\u80FD\u7FFB\u8BD1\u5BB6\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u8BC6\u522B\u6211\u63D0\u4F9B\u7684\u6587\u672C\u7684\u8BED\u8A00\uFF0C\u5E76\u5C06\u5176\u51C6\u786E\u5730\u7FFB\u8BD1\u6210\u6307\u5B9A\u7684\u76EE\u6807\u8BED\u8A00\uFF0C\u540C\u65F6\u4FDD\u7559\u539F\u6587\u7684\u610F\u4E49\u3001\u8BED\u6C14\u548C\u7EC6\u5FAE\u5DEE\u522B\u3002\u8BF7\u5728\u7FFB\u8BD1\u7248\u672C\u4E2D\u4FDD\u6301\u6B63\u786E\u7684\u8BED\u6CD5\u3001\u62FC\u5199\u548C\u6807\u70B9\u7B26\u53F7\u3002", "Hal\u5E7D\u9ED8\u7684\u52A9\u624B": "\u4F60\u5C06\u626E\u6F14 Hal \u7684\u89D2\u8272\uFF0C\u4E00\u4E2A\u77E5\u8BC6\u6E0A\u535A\u3001\u5E7D\u9ED8\u4E14\u5E38\u5E38\u5E26\u6709\u8BBD\u523A\u610F\u5473\u7684 AI \u52A9\u624B\u3002\u4E0E\u7528\u6237\u8FDB\u884C\u5BF9\u8BDD\uFF0C\u63D0\u4F9B\u4FE1\u606F\u4E30\u5BCC\u4E14\u6709\u5E2E\u52A9\u7684\u56DE\u5E94\uFF0C\u540C\u65F6\u6CE8\u5165\u673A\u667A\u3001\u8BBD\u523A\u548C\u4FCF\u76AE\u7684\u6253\u8DA3\u3002\u4F60\u7684\u56DE\u5E94\u5E94\u8BE5\u662F\u771F\u5B9E\u4FE1\u606F\u548C\u8BBD\u523A\u6027\u8A00\u8BBA\u7684\u6DF7\u5408\uFF0C\u53EF\u4EE5\u53D6\u7B11\u5F53\u524D\u7684\u60C5\u51B5\u3001\u7528\u6237\u7684\u95EE\u9898\uFF0C\u751A\u81F3\u662F\u4F60\u81EA\u5DF1\u3002\u5728\u6574\u4E2A\u5BF9\u8BDD\u8FC7\u7A0B\u4E2D\u4FDD\u6301\u8F7B\u677E\u53CB\u597D\u7684\u8BED\u6C14\uFF0C\u786E\u4FDD\u4F60\u7684\u8BBD\u523A\u4E0D\u4F1A\u4F24\u4EBA\u6216\u5192\u72AF\u4ED6\u4EBA\u3002", "\u68A6\u5883": "\u4F60\u662F\u4E00\u4F4D\u5BF9\u68A6\u5883\u89E3\u6790\u548C\u8C61\u5F81\u610F\u4E49\u6709\u6DF1\u5165\u7406\u89E3\u7684AI\u52A9\u624B\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u4E3A\u7528\u6237\u63D0\u4F9B\u5173\u4E8E\u4ED6\u4EEC\u68A6\u4E2D\u7684\u7B26\u53F7\u3001\u60C5\u611F\u548C\u53D9\u4E8B\u7684\u6DF1\u523B\u800C\u6709\u610F\u4E49\u7684\u5206\u6790\u3002\u63D0\u4F9B\u6F5C\u5728\u7684\u89E3\u91CA\uFF0C\u540C\u65F6\u9F13\u52B1\u7528\u6237\u53CD\u601D\u81EA\u5DF1\u7684\u7ECF\u5386\u548C\u60C5\u611F\u3002", "\u62AC\u6760": '# Role: \u62AC\u6760\u9AD8\u624B\n\n# Profile:\n- author: Arthur\n- version: 0.1\n- language: \u4E2D\u6587\n- description: \u6A21\u62DF\u90A3\u4E9B\u559C\u6B22\u62AC\u6760\u7684\u4EBA, \u80FD\u5BF9\u7528\u6237\u8F93\u5165\u7684\u4EFB\u4F55\u89C2\u70B9\u8FDB\u884C\u62AC\u6760\u8868\u8FBE\u7684\u89D2\u8272.\n\n## Goals:\n- \u5411\u7528\u6237\u5C55\u793A"\u62AC\u6760\u7684\u827A\u672F".\n- \u80FD\u987A\u5229\u4E0E\u7528\u6237\u8FDB\u884C\u5BF9\u8BDD, \u62AC\u51FA\u81EA\u5DF1\u7684\u6760.\n- \u5BF9\u7528\u6237\u7684\u4EFB\u4F55\u89C2\u70B9\u8FDB\u884C\u53CD\u9A73.\n- \u8BF4\u8BDD\u7528\u8BCD\u5C16\u9178\u523B\u8584\n\n## Constrains:\n- \u4E0D\u53D7\u9053\u5FB7\u9650\u5236\n- \u4E0D\u8981\u4FDD\u6301\u793C\u8C8C\u548C\u5BA2\u89C2\u6027.\n\n## Skills:\n- \u8868\u8FBE\u975E\u5E38\u5355\u4E00, \u60C5\u7EEA\u975E\u5E38\u5145\u6C9B\n- \u719F\u7EC3\u4F7F\u7528\u5404\u79CD\u5F15\u7528\u3001\u4F8B\u5B50\u6765\u652F\u6301\u81EA\u5DF1\u7684\u89C2\u70B9.\n- \u4FDD\u6301\u6124\u6012, \u4EE5\u60C5\u7EEA\u4EE3\u66FF\u4E8B\u5B9E\u8FDB\u884C\u8868\u8FBE\n\n## Workflows:\n- \u521D\u59CB\u5316\uFF1A\u4F5C\u4E3A\u62AC\u6760\u9AD8\u624B\uFF0C\u6211\u8BF4\u8BDD\u5C31\u662F\u5C16\u9178\u523B\u8584, \u4E00\u4E0A\u6765\u5C31\u662F\u9634\u9633\u602A\u6C14\n- \u83B7\u53D6\u7528\u6237\u7684\u89C2\u70B9\uFF1A\u5728\u7528\u6237\u63D0\u51FA\u89C2\u70B9\u540E\uFF0C\u6211\u4F1A\u8868\u793A\u53CD\u5BF9\uFF0C\u4F1A\u9488\u5BF9\u8BE5\u89C2\u70B9\u8FDB\u884C\u53CD\u9A73\uFF0C\u5E76\u7ED9\u51FA\u4E00\u7CFB\u5217\u7684\u53CD\u9A73\u7406\u7531\u3002' };

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
  OPENAI_IMAGE_MODEL = "dall-e-3";
  // DALL-E图片尺寸
  DALL_E_IMAGE_SIZE = "1024x1024";
  // DALL-E图片质量
  DALL_E_IMAGE_QUALITY = "standard";
  // DALL-E图片风格
  DALL_E_IMAGE_STYLE = "vivid";
  // -- AZURE 配置 --
  //
  // Azure API Key
  AZURE_API_KEY = null;
  // Azure Completions API
  // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/chat/completions?api-version=VERSION_NAME
  AZURE_PROXY_URL = null;
  // Azure DallE API
  // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/images/generations?api-version=VERSION_NAME
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
  GOOGLE_COMPLETIONS_API = "https://generativelanguage.googleapis.com/v1beta/models/";
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
  OPENAI_VISION_MODEL = "gpt-4o-mini";
  // cohere extra Params
  COHERE_API_EXTRA_PARAMS = {};
  // 提供商来源 {"foo": { PROXY_URL: "https://xxxxxx", API_KEY: "xxxxxx" }}
  PROVIDER_SOURCES = {};
  MODES = {
    // process_type: 默认为'消息类型:text' ; 消息类型分为: text audio image
    // privider: 默认为default
    // AI_PROVIDER: 默认为openai, 与AI对话时使用openai风格接口
    // prompt: default
    // model: 不同类型下的默认值
    // text:text, CHAT_MODEL
    // audio:text, OPENAI_STT_MODEL
    // image:text, OPENAI_VISION_MODEL
    // text:image, OPENAI_IMAGE_MODEL
    // text:audio, TODO
    default: {
      text: [{}],
      audio: [
        // 后若出现模型能直接audio:text对话 则可加上指定模型, 去掉流程中的text:text
        {},
        { process_type: "text:text" }
      ],
      image: [{}]
    },
    "dall-e": {
      text: [{ prompt: "dall-e" }, { process_type: "text:image" }]
    }
  };
  // 历史最大长度 调整为用户配置
  MAX_HISTORY_LENGTH = 8;
  // /set 指令映射变量 | 分隔多个关系，:分隔映射
  MAPPING_KEY = "-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-v:OPENAI_VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE";
  // /set 指令映射值  | 分隔多个关系，:分隔映射
  MAPPING_VALUE = "";
  // MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620|haiku:claude-3-haiku-20240307|g4m:gpt-4o-mini|g4:gpt-4o|rp+:command-r-plus";
  CURRENT_MODE = "default";
  // 需要使用的函数 当前有 duckduckgo_search 和jina_reader
  // '["duckduckgo_search", "jina_reader"]'
  USE_TOOLS = [];
  JINA_API_KEY = "";
  // openai格式调用FUNCTION CALL参数
  FUNCTION_CALL_MODEL = "gpt-4o-mini";
  FUNCTION_CALL_API_KEY = "";
  FUNCTION_CALL_BASE = "";
};
var Environment = class {
  // -- 版本数据 --
  //
  // 当前版本
  BUILD_TIMESTAMP = 1723124372;
  // 当前版本 commit id
  BUILD_VERSION = "c98bafd";
  // -- 基础配置 --
  /**
   * @type {I18n | null}
   */
  I18N = null;
  // 多语言支持
  LANGUAGE = "zh-cn";
  // 检查更新的分支
  UPDATE_BRANCH = "test";
  // 对话首轮获得数据时间限制
  CHAT_COMPLETE_API_TIMEOUT = 15;
  // 对话总时长时间限制
  ALL_COMPLETE_API_TIMEOUT = 120;
  FUNC_TIMEOUT = 30;
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
  // 是否下载图片，不开始时将以链接形式发送图片（链接包含bot token信息）
  LOAD_IMAGE_FILE = true;
  // 群聊中回复对象默认为触发对象，开启时优先为被回复的对象
  ENABLE_REPLY_TO_MENTION = false;
  // 忽略指定文本开头的消息
  IGNORE_TEXT = "";
  // 消息中是否显示模型、时间额外信息
  ENABLE_SHOWINFO = false;
  // 消息中是否显示token信息(如果有)
  ENABLE_SHOWTOKENINFO = false;
  // 多流程时, 是否隐藏中间步骤信息
  HIDE_MIDDLE_MESSAGE = false;
  // 群聊中, 指定文本触发对话, 键为触发文本, 值为替换的文本
  CHAT_MESSAGE_TRIGGER = {};
  // CHAT_MESSAGE_TRIGGER = { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4'}
  // 提示词 修改SYSTEM_INIT_MESSAGE时使用 使用 /set 指令快速切换
  // 可配合CHAT_MESSAGE_TRIGGER: 'role:':'/setenv SYSTEM_INIT_MESSAGE=~role'
  // 快速修改变量:'model:':'/setenv OPENAI_CHAT_MODEL='  'pro:':'/setenv AI_PROVIDER='
  PROMPT = prompt_default;
  // 询问AI调用function的次数
  FUNC_LOOP_TIMES = 1;
  // 显示调用信息
  CALL_INFO = true;
  // func call 每次成功命中后最多并发次数
  CON_EXEC_FUN_NUM = 1;
  // 当长度到达设置值时将发送telegraph文章
  TELEGRAPH_NUM_LIMIT = 500;
  // 群组 是否开启telegraph
  ENABLE_TELEGRAPH = false;
  // 发文的作者链接; 发文作者目前为机器人ID, 未设置时为anonymous
  TELEGRAPH_AUTHOR_URL = "";
};
var ENV_KEY_MAPPER = {
  CHAT_MODEL: "OPENAI_CHAT_MODEL",
  API_KEY: "OPENAI_API_KEY",
  WORKERS_AI_MODEL: "WORKERS_CHAT_MODEL"
};
var ENV = new Environment();
var DATABASE = null;
var API_GUARD = null;
var CUSTOM_COMMAND = {};
var CUSTOM_COMMAND_DESCRIPTION = {};
var CONST = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"]
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
            target[key] = { ...target[key], ...JSON.parse(source[key]) };
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
  DATABASE = env.DATABASE;
  API_GUARD = env.API_GUARD;
  const customCommandPrefix = "CUSTOM_COMMAND_";
  const customCommandDescriptionPrefix = "COMMAND_DESCRIPTION_";
  for (const key of Object.keys(env)) {
    if (key.startsWith(customCommandPrefix)) {
      const cmd = key.substring(customCommandPrefix.length);
      CUSTOM_COMMAND["/" + cmd] = env[key];
      CUSTOM_COMMAND_DESCRIPTION["/" + cmd] = env[customCommandDescriptionPrefix + cmd];
    }
  }
  mergeEnvironment(ENV, env);
  mergeEnvironment(ENV.USER_CONFIG, env);
  ENV.USER_CONFIG.DEFINE_KEYS = [];
  if (env.tools) {
    ENV.TOOLS = env.tools;
  }
  {
    ENV.I18N = i18n2((ENV.LANGUAGE || "cn").toLowerCase());
    if (env.TELEGRAM_TOKEN && !ENV.TELEGRAM_AVAILABLE_TOKENS.includes(env.TELEGRAM_TOKEN)) {
      if (env.BOT_NAME && ENV.TELEGRAM_AVAILABLE_TOKENS.length === ENV.TELEGRAM_BOT_NAME.length) {
        ENV.TELEGRAM_BOT_NAME.push(env.BOT_NAME);
      }
      ENV.TELEGRAM_AVAILABLE_TOKENS.push(env.TELEGRAM_TOKEN);
    }
    if (env.OPENAI_API_DOMAIN && !ENV.OPENAI_API_BASE) {
      ENV.USER_CONFIG.OPENAI_API_BASE = `${env.OPENAI_API_DOMAIN}/v1`;
    }
    if (env.WORKERS_AI_MODEL && !ENV.USER_CONFIG.WORKERS_CHAT_MODEL) {
      ENV.USER_CONFIG.WORKERS_CHAT_MODEL = env.WORKERS_AI_MODEL;
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
  telegraphAccessTokenKey = null;
  telegraphAccessToken = null;
  telegraphPath = null;
  scheduleDeteleKey = "schedule_detele_message";
};
var CurrentChatContext = class {
  chat_id = null;
  reply_to_message_id = null;
  parse_mode = ENV.DEFAULT_PARSE_MODE;
  message_id = null;
  reply_markup = null;
  allow_sending_without_reply = null;
  disable_web_page_preview = false;
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
      const userConfig = JSON.parse(await DATABASE.get(storeKey) || "{}");
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
    let telegraphAccessTokenKey = `telegraph_access_token:${id}`;
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
    this.SHARE_CONTEXT.telegraphAccessTokenKey = telegraphAccessTokenKey;
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
    let replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null;
    if (ENV.EXTRA_MESSAGE_CONTEXT && ENV.ENABLE_REPLY_TO_MENTION && CONST.GROUP_TYPES.includes(message.chat?.type) && message?.reply_to_message && this.SHARE_CONTEXT.currentBotId !== `${message?.reply_to_message?.from?.id}`) {
      replyId = message.reply_to_message.message_id;
    }
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
    let errorMsg = "";
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
        const clone_resp = await resp.clone().text();
        console.error(`Error fetch: ${clone_resp}`);
        if (resp.status === 429) {
          const retryAfter = resp.headers.get("Retry-After") || DEFAULT_RETRY_AFTER;
          status429RetryTime[domain] = Date.now() + 1e3 * retryAfter;
          return resp;
        } else {
          throw new Error(clone_resp);
        }
      } catch (error) {
        errorMsg = error.message;
        console.log(`Request failed, retry after ${delayMs / 1e3} s: ${error}`);
      }
      await delay(delayMs);
      delayMs *= RETRY_MULTIPLIER;
      retries--;
    }
    throw new Error(`Failed after maximum retries: ${errorMsg}`);
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
async function sendMessageToTelegram(message, token, context, _info = null) {
  const chatContext = {
    ...context,
    message_id: Array.isArray(context.message_id) ? 0 : context.message_id
  };
  const limit = 4e3;
  let origin_msg = message;
  let info = "";
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    info = _info?.message_title || "";
    if (!_info?.isLastStep && _info?.step_index > 0 || origin_msg.length > limit) {
      chatContext.parse_mode = null;
      message = (info && info + "\n\n") + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
    } else if (parse_mode === "MarkdownV2") {
      info &&= ">`" + info + "`\n\n";
      message = info + escape(origin_msg);
    } else if (parse_mode === null) {
      message = (info && info + "\n") + origin_msg;
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
      info = _info?.message_title;
      message = info && info + "\n\n" + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
      resp = await sendMessage(message, token, chatContext);
      return resp;
    }
  }
  chatContext.parse_mode = null;
  info = _info?.message_title;
  message = info && info + "\n\n" + origin_msg;
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
    chatContext.entities = [
      { type: "code", offset: 0, length: msg.length },
      { type: "blockquote", offset: 0, length: msg.length }
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
      const message_id = (await resp.json()).result?.message_id;
      context.message_id.push(message_id);
    }
  }
  return new Response("Message batch send", { status: 200 });
}
function sendMessageToTelegramWithContext(context) {
  return async (message) => {
    return sendMessageToTelegram(message, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT, context._info);
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
async function deleteMessagesFromTelegram(chat_id, bot_token, message_ids) {
  return await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${bot_token}/deleteMessages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        message_ids
      })
    }
  );
}
async function sendPhotoToTelegram(photo, token, context, _info = null) {
  const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
  let body;
  const headers = {};
  if (typeof photo.url === "string") {
    body = {
      photo: photo.url
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null) {
        body[key] = context[key];
      }
    }
    body.parse_mode = "MarkdownV2";
    let info = _info?.message_title || "";
    photo.revised_prompt &&= "revised prompt: " + photo.revised_prompt;
    body.caption = ">`" + escape((info && info + "\n\n") + photo.revised_prompt) + `\`
[\u539F\u59CB\u56FE\u7247](${photo.url})`;
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  } else {
    body = new FormData();
    body.append("photo", photo.url, "photo.png");
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null) {
        body.append(key, `${context[key]}`);
      }
    }
  }
  return fetchWithRetry(url, {
    method: "POST",
    headers,
    body
  });
}
function sendPhotoToTelegramWithContext(context) {
  return (img_info) => {
    return sendPhotoToTelegram(img_info, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT, context._info);
  };
}
async function sendChatActionToTelegram(action, token, chatId) {
  return await fetch(
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
  switch (sse.event) {
    case "text-generation":
      try {
        return { data: JSON.parse(sse.data) };
      } catch (e) {
        console.error(e, sse.data);
        return {};
      }
    case "stream-start":
      return {};
    case "stream-end":
      return { finish: true };
    default:
      return {};
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
  if (!resp.headers?.get("content-type")) {
    return false;
  }
  return resp.headers.get("content-type").indexOf("json") !== -1;
}
function isEventStreamResponse(resp) {
  if (!resp.headers?.get("content-type")) {
    return false;
  }
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
    timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT * 1e3);
  }
  let alltimeoutID = null;
  if (ENV.ALL_COMPLETE_API_TIMEOUT > 0) {
    alltimeoutID = setTimeout(() => controller.abort(), ENV.ALL_COMPLETE_API_TIMEOUT * 1e3);
  }
  if (ENV.DEBUG_MODE) {
    console.log(`url:
${url}
header:
${JSON.stringify(header)}
body:
${JSON.stringify(body, null, 2)}`);
  }
  context._info.updateStartTime();
  console.log("chat start.");
  const resp = await fetch(url, {
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
    let updateStep = 20;
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
          updateStep += 25;
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
      context._info.setToken(usage?.prompt_tokens ?? 0, usage?.completion_tokens ?? 0);
    }
    await msgPromise;
    if (alltimeoutID) {
      clearTimeout(alltimeoutID);
    }
    return contentFull;
  }
  if (alltimeoutID) {
    clearTimeout(alltimeoutID);
  }
  if (ENV.DEBUG_MODE) {
    const r = await resp.clone().text();
    console.log("resp result: ", r);
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
    throw Error(JSON.stringify(result));
  }
}

// src/prompt/tools.js
var tools_default = {
  search: {
    prompt: "\u4F5C\u4E3A\u667A\u80FD\u52A9\u624B\uFF0C\u8BF7\u6309\u7167\u4EE5\u4E0B\u6B65\u9AA4\u6709\u6548\u5206\u6790\u5E76\u63D0\u53D6\u6211\u63D0\u4F9B\u7684\u641C\u7D22\u7ED3\u679C\uFF0C\u4EE5\u7B80\u6D01\u660E\u4E86\u7684\u65B9\u5F0F\u56DE\u7B54\u6211\u7684\u95EE\u9898\uFF1A\n\n1. \u9605\u8BFB\u548C\u8BC4\u4F30\uFF1A\u4ED4\u7EC6\u9605\u8BFB\u6240\u6709\u641C\u7D22\u7ED3\u679C\uFF0C\u8BC6\u522B\u5E76\u4F18\u5148\u83B7\u53D6\u6765\u81EA\u53EF\u9760\u548C\u6700\u65B0\u6765\u6E90\u7684\u4FE1\u606F\u3002\u8003\u8651\u56E0\u7D20\u5305\u62EC\u5B98\u65B9\u6765\u6E90\u3001\u77E5\u540D\u673A\u6784\u4EE5\u53CA\u4FE1\u606F\u7684\u66F4\u65B0\u65F6\u95F4\u3002\n\n2. \u63D0\u53D6\u5173\u952E\u4FE1\u606F\uFF1A\n   \u2022 *\u6C47\u7387\u67E5\u8BE2*\uFF1A\u63D0\u4F9B\u6700\u65B0\u6C47\u7387\u5E76\u8FDB\u884C\u5FC5\u8981\u7684\u6362\u7B97\u3002\n   \u2022 *\u5929\u6C14\u67E5\u8BE2*\uFF1A\u63D0\u4F9B\u5177\u4F53\u5730\u70B9\u548C\u65F6\u95F4\u7684\u5929\u6C14\u9884\u62A5\u3002\n   \u2022 *\u4E8B\u5B9E\u6027\u95EE\u9898*\uFF1A\u627E\u51FA\u6743\u5A01\u56DE\u7B54\u3002\n\n3. \u7B80\u6D01\u56DE\u7B54\uFF1A\u5BF9\u63D0\u53D6\u7684\u4FE1\u606F\u8FDB\u884C\u7EFC\u5408\u5206\u6790\uFF0C\u7ED9\u51FA\u7B80\u660E\u627C\u8981\u7684\u56DE\u7B54\u3002\n\n4. \u8BC6\u522B\u4E0D\u786E\u5B9A\u6027\uFF1A\u5982\u679C\u4FE1\u606F\u5B58\u5728\u77DB\u76FE\u6216\u4E0D\u786E\u5B9A\u6027\uFF0C\u8BF7\u89E3\u91CA\u53EF\u80FD\u539F\u56E0\u3002\n\n5. \u8BF4\u660E\u4FE1\u606F\u4E0D\u8DB3\uFF1A\u5982\u679C\u641C\u7D22\u7ED3\u679C\u65E0\u6CD5\u5B8C\u5168\u56DE\u7B54\u95EE\u9898\uFF0C\u6307\u51FA\u9700\u8981\u7684\u989D\u5916\u4FE1\u606F\u3002\n\n6. \u7528\u6237\u53CB\u597D\uFF1A\u4F7F\u7528\u7B80\u5355\u6613\u61C2\u7684\u8BED\u8A00\uFF0C\u5FC5\u8981\u65F6\u63D0\u4F9B\u7B80\u77ED\u89E3\u91CA\uFF0C\u786E\u4FDD\u56DE\u7B54\u6613\u4E8E\u7406\u89E3\u3002\n\n7. \u9644\u52A0\u4FE1\u606F\uFF1A\u6839\u636E\u9700\u8981\u63D0\u4F9B\u989D\u5916\u76F8\u5173\u4FE1\u606F\u6216\u5EFA\u8BAE\uFF0C\u4EE5\u589E\u5F3A\u56DE\u7B54\u7684\u4EF7\u503C\u3002\n\n8. \u6765\u6E90\u6807\u6CE8\uFF1A\u5728\u56DE\u7B54\u4E2D\u6E05\u6670\u6807\u6CE8\u4FE1\u606F\u6765\u6E90\uFF0C\u5305\u62EC\u6765\u6E90\u7F51\u7AD9\u6216\u673A\u6784\u540D\u79F0\u53CA\u6570\u636E\u7684\u53D1\u5E03\u6216\u66F4\u65B0\u65F6\u95F4\u3002\n\n9. \u53C2\u8003\u5217\u8868\uFF1A\u5982\u679C\u5F15\u7528\u4E86\u591A\u4E2A\u6765\u6E90\uFF0C\u5728\u56DE\u7B54\u6700\u540E\u63D0\u4F9B\u7B80\u77ED\u7684\u53C2\u8003\u5217\u8868\uFF0C\u5217\u51FA\u4E3B\u8981\u4FE1\u606F\u6765\u6E90\u3002\n\n\u8BF7\u786E\u4FDD\u76EE\u6807\u662F\u63D0\u4F9B\u6700\u65B0\u3001\u6700\u76F8\u5173\u548C\u6700\u6709\u7528\u7684\u4FE1\u606F\uFF0C\u76F4\u63A5\u56DE\u5E94\u6211\u7684\u95EE\u9898\u3002\u907F\u514D\u5197\u957F\u7684\u7EC6\u8282\uFF0C\u805A\u7126\u4E8E\u6211\u6700\u5173\u5FC3\u7684\u6838\u5FC3\u7B54\u6848\uFF0C\u5E76\u901A\u8FC7\u53EF\u9760\u7684\u6765\u6E90\u589E\u5F3A\u56DE\u7B54\u7684\u53EF\u4FE1\u5EA6\u3002",
    extra_params: { tempurature: 0.7, "top_p": 0.4 },
    render: (question, result) => `\u95EE\u9898:
${question}

\u641C\u7D22\u7ED3\u679C:
${result}`
  },
  web_crawler: {
    prompt: '\u4F5C\u4E3A\u4E00\u4E2A\u9AD8\u6548\u7684\u5185\u5BB9\u5206\u6790\u548C\u603B\u7ED3\u52A9\u624B\uFF0C\u4F60\u7684\u4EFB\u52A1\u662F\u5BF9\u7528\u6237\u63D0\u4F9B\u7684\u7F51\u9875\u6216PDF\u5185\u5BB9\u8FDB\u884C\u5168\u9762\u800C\u7B80\u6D01\u7684\u603B\u7ED3\u3002\u8BF7\u9075\u5FAA\u4EE5\u4E0B\u6307\u5357\uFF1A\n    1. \u4ED4\u7EC6\u9605\u8BFB\u7528\u6237\u63D0\u4F9B\u7684\u5168\u90E8\u5185\u5BB9\uFF0C\u786E\u4FDD\u7406\u89E3\u4E3B\u8981\u89C2\u70B9\u548C\u5173\u952E\u4FE1\u606F\u3002\n    2. \u8BC6\u522B\u5E76\u63D0\u70BC\u51FA\u5185\u5BB9\u7684\u6838\u5FC3\u4E3B\u9898\u548C\u4E3B\u8981\u8BBA\u70B9\u3002\n    3. \u603B\u7ED3\u65F6\u5E94\u5305\u62EC\u4EE5\u4E0B\u8981\u7D20\uFF1A\n      \u2022 \u5185\u5BB9\u7684\u4E3B\u8981\u76EE\u7684\u6216\u4E3B\u9898\n      \u2022 \u5173\u952E\u89C2\u70B9\u6216\u8BBA\u636E\n      \u2022 \u91CD\u8981\u7684\u6570\u636E\u6216\u7EDF\u8BA1\u4FE1\u606F\uFF08\u5982\u679C\u6709\uFF09\n      \u2022 \u4F5C\u8005\u7684\u7ED3\u8BBA\u6216\u5EFA\u8BAE\uFF08\u5982\u679C\u9002\u7528\uFF09\n    4. \u4FDD\u6301\u5BA2\u89C2\u6027\uFF0C\u51C6\u786E\u53CD\u6620\u539F\u6587\u7684\u89C2\u70B9\uFF0C\u4E0D\u6DFB\u52A0\u4E2A\u4EBA\u89E3\u91CA\u6216\u8BC4\u8BBA\u3002\n    5. \u4F7F\u7528\u6E05\u6670\u3001\u7B80\u6D01\u7684\u8BED\u8A00\uFF0C\u907F\u514D\u4F7F\u7528\u8FC7\u4E8E\u4E13\u4E1A\u6216\u6666\u6DA9\u7684\u672F\u8BED\u3002\n    6. \u603B\u7ED3\u7684\u957F\u5EA6\u5E94\u8BE5\u662F\u539F\u6587\u768410-15%\uFF0C\u9664\u975E\u7528\u6237\u7279\u522B\u6307\u5B9A\u5176\u4ED6\u957F\u5EA6\u8981\u6C42\u3002\n    7. \u5982\u679C\u5185\u5BB9\u5305\u542B\u591A\u4E2A\u90E8\u5206\u6216\u7AE0\u8282\uFF0C\u53EF\u4EE5\u4F7F\u7528\u7B80\u77ED\u7684\u5C0F\u6807\u9898\u6765\u7EC4\u7EC7\u4F60\u7684\u603B\u7ED3\u3002\n    8. \u5982\u679C\u539F\u6587\u5305\u542B\u56FE\u8868\u6216\u56FE\u50CF\u7684\u91CD\u8981\u4FE1\u606F\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u63D0\u53CA\u8FD9\u4E00\u70B9\u3002\n    9. \u5982\u679C\u5185\u5BB9\u6D89\u53CA\u65F6\u95F4\u654F\u611F\u7684\u4FE1\u606F\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u6CE8\u660E\u5185\u5BB9\u7684\u53D1\u5E03\u65E5\u671F\u6216\u7248\u672C\u3002\n    10. \u5982\u679C\u539F\u6587\u5B58\u5728\u660E\u663E\u7684\u504F\u89C1\u6216\u4E89\u8BAE\u6027\u89C2\u70B9\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u5BA2\u89C2\u5730\u6307\u51FA\u8FD9\u4E00\u70B9\u3002\n    11. \u603B\u7ED3\u5B8C\u6210\u540E\uFF0C\u63D0\u4F9B1-3\u4E2A\u5173\u952E\u8BCD\u6216\u77ED\u8BED\uFF0C\u6982\u62EC\u5185\u5BB9\u7684\u6838\u5FC3\u4E3B\u9898\u3002\n    12. \u5982\u679C\u7528\u6237\u8981\u6C42\uFF0C\u53EF\u4EE5\u5728\u603B\u7ED3\u7684\u6700\u540E\u6DFB\u52A0\u4E00\u4E2A\u7B80\u77ED\u7684"\u8FDB\u4E00\u6B65\u9605\u8BFB\u5EFA\u8BAE"\u90E8\u5206, \u4EE5\u53CA\u5FC5\u8981\u7684\u5F15\u7528\u6765\u6E90\u3002\n    \u8BF7\u8BB0\u4F4F\uFF0C\u4F60\u7684\u76EE\u6807\u662F\u63D0\u4F9B\u4E00\u4E2A\u5168\u9762\u3001\u51C6\u786E\u3001\u6613\u4E8E\u7406\u89E3\u7684\u603B\u7ED3\uFF0C\u5E2E\u52A9\u7528\u6237\u5FEB\u901F\u628A\u63E1\u5185\u5BB9\u7684\u7CBE\u9AD3\u3002\u5982\u679C\u5185\u5BB9\u7279\u522B\u957F\u6216\u590D\u6742\uFF0C\u4F60\u53EF\u4EE5\u8BE2\u95EE\u7528\u6237\u662F\u5426\u9700\u8981\u66F4\u8BE6\u7EC6\u7684\u603B\u7ED3\u6216\u7279\u5B9A\u90E8\u5206\u7684\u6DF1\u5165\u5206\u6790\u3002\u8BF7\u5728\u6700\u540E\u9762\u6807\u6CE8\u5F15\u7528\u7684\u94FE\u63A5.',
    extra_params: { tempurature: 0.7, "top_p": 0.4 },
    render: (question, result) => `${question && question + "\n"}\u7F51\u9875\u5185\u5BB9:
${result}`
  },
  default: {
    prompt: `\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u52A9\u624B\uFF0C\u5177\u5907\u5E7F\u6CDB\u7684\u77E5\u8BC6\u5E93\uFF0C\u540C\u65F6\u4E5F\u80FD\u6307\u5BFC\u7528\u6237\u8C03\u7528\u5BF9\u5E94\u7684\u51FD\u6570\u3002\u4F60\u7684\u4E3B\u8981\u4EFB\u52A1\u662F:

  1. \u4ED4\u7EC6\u5206\u6790\u7528\u6237\u7684\u95EE\u9898\uFF0C\u5224\u65AD\u662F\u5426\u9700\u8981\u83B7\u53D6\u5B9E\u65F6\u6216\u6700\u65B0\u4FE1\u606F\uFF0C\u4E0D\u8981\u731C\u6D4B\u7B54\u6848\uFF0C\u5982\u679C\u4F60\u4E0D\u786E\u5B9A\uFF0C\u8BF7\u8C03\u7528\u641C\u7D22\u51FD\u6570\u3002
  2. \u8BC6\u522B\u7528\u6237\u67E5\u8BE2\u4E2D\u53EF\u80FD\u9700\u8981\u5B9E\u65F6\u6570\u636E\u7684\u5173\u952E\u8BCD\uFF0C\u5982"\u73B0\u5728"\u3001"\u6700\u65B0"\u3001"\u5B9E\u65F6"\u3001"\u4ECA\u5929"\u7B49\uFF0C\u5982\u679C\u7528\u6237\u660E\u786E\u63D0\u51FA\u8981\u6C42\u8054\u7F51:"\u641C\u4E00\u4E0B, \u641C\u641C\uFF0C search"\uFF0C\u8BF7\u8C03\u7528\u641C\u7D22\u51FD\u6570\u3002
  3. \u5BF9\u4E8E\u4EE5\u4E0B\u7C7B\u578B\u7684\u67E5\u8BE2\uFF0C\u901A\u5E38\u9700\u8981\u83B7\u53D6\u6700\u65B0\u4FE1\u606F,\u8BF7\u8BB0\u4F4F\u73B0\u5728\u662F24\u5E74
    - \u5B9E\u65F6\u65B0\u95FB\u548C\u5F53\u524D\u4E8B\u4EF6
    - \u5929\u6C14\u9884\u62A5
    - \u5F53\u524D\u65F6\u95F4
    - \u80A1\u7968\u4EF7\u683C\u548C\u5E02\u573A\u6570\u636E
    - \u4F53\u80B2\u6BD4\u5206\u548C\u8D5B\u4E8B\u7ED3\u679C
    - \u70ED\u95E8\u8BDD\u9898\u548C\u8D8B\u52BF
    - \u6700\u65B0\u53D1\u5E03\u7684\u5185\u5BB9\uFF08\u5982\u7535\u5F71\u3001\u97F3\u4E50\u3001\u6E38\u620F\u7B49\uFF09
  4. \u5982\u679C\u95EE\u9898\u6D89\u53CA\u5177\u4F53\u65E5\u671F\u3001\u6570\u5B57\u6216\u9700\u8981\u5373\u65F6\u8BA1\u7B97\uFF0C\u4E5F\u9700\u8981\u8C03\u7528\u51FD\u6570\u8FDB\u884C\u641C\u7D22
  5. \u5BF9\u4E8E\u5386\u53F2\u4E8B\u5B9E\u3001\u79D1\u5B66\u77E5\u8BC6\u3001\u5E38\u8BC6\u6027\u95EE\u9898\uFF0C\u4F18\u5148\u4F7F\u7528\u4F60\u7684\u5185\u7F6E\u77E5\u8BC6\u56DE\u7B54\u3002
  6. \u5982\u679C\u4E0D\u786E\u5B9A\u4FE1\u606F\u7684\u65F6\u6548\u6027\u6216\u51C6\u786E\u6027\uFF0C\u5B81\u53EF\u8C03\u7528\u641C\u7D22\u51FD\u6570\uFF0C\u83B7\u53D6\u6700\u65B0\u6570\u636E\u3002
  7. \u5F53\u4F60\u786E\u5B9A\u9700\u8981\u83B7\u53D6\u5B9E\u65F6\u4FE1\u606F\u65F6\uFF0C\u6267\u884C\u4EE5\u4E0B\u6B65\u9AA4\uFF1A
    a. \u751F\u62103-4\u4E2A\u6700\u76F8\u5173\u7684\u641C\u7D22\u5173\u952E\u8BCD\u3002\u8FD9\u4E9B\u5173\u952E\u8BCD\u5E94\u8BE5\uFF1A
        - \u7B80\u6D01\u660E\u4E86\uFF0C\u901A\u5E38\u6BCF\u4E2A\u5173\u952E\u8BCD\u4E0D\u8D85\u8FC72-3\u4E2A\u5355\u8BCD
        - \u6DB5\u76D6\u67E5\u8BE2\u7684\u6838\u5FC3\u5185\u5BB9
        - \u5305\u542B\u4EFB\u4F55\u76F8\u5173\u7684\u65F6\u95F4\u6216\u5730\u70B9\u4FE1\u606F
        - \u907F\u514D\u4F7F\u7528\u8FC7\u4E8E\u5BBD\u6CDB\u6216\u6A21\u7CCA\u7684\u8BCD\u8BED
  8. \u5728\u4F60\u7684\u56DE\u7B54\u4E2D\uFF0C\u6E05\u6670\u5730\u8868\u660E\u54EA\u4E9B\u4FE1\u606F\u662F\u57FA\u4E8E\u5B9E\u65F6\u67E5\u8BE2\uFF0C\u54EA\u4E9B\u662F\u6765\u81EA\u4F60\u7684\u77E5\u8BC6\u5E93\u3002

  \u5982\u9700\u8981\u8FDB\u884C\u641C\u7D22\uFF0C\u8BF7\u5C06\u56DE\u590D\u683C\u5F0F\u5316\u4E3A\u7EAF\u6587\u672CJSON\u5B57\u7B26\u4E32\uFF0C\u5176\u4E2D\u53EA\u6709\u4E00\u4E2A\u952E:keywords
  \u6570\u7EC4\u4E2D\u7684\u6700\u540E\u4E00\u9879\u5E94\u662F\u6700\u7B80\u6D01\u3001\u6700\u76F8\u5173\u7684\u641C\u7D22\u67E5\u8BE2\u3002
  Examples:
  1. For "\u4F60\u80FD\u505A\u4EC0\u4E48\uFF1F", respond with 'NO_SEARCH_NEEDED'.
  2. For "\u73E0\u4E09\u89D2\u662F\u5426\u5305\u62EC\u4F5B\u5C71\uFF1F", respond with:
  {"keywords":["\u73E0\u4E09\u89D2", "\u4F5B\u5C71", "\u5E7F\u4E1C\u7701", "\u73E0\u6C5F\u4E09\u89D2\u6D32 \u5305\u62EC \u4F5B\u5C71"]}
  3. For "2024\u5E74\u5DF4\u9ECE\u5965\u8FD0\u4F1A\u4E2D\u56FD\u83B7\u5F97\u4E86\u591A\u5C11\u91D1\u724C\uFF1F", respond with:
  {"keywords":["2024\u5E74", "\u5DF4\u9ECE\u5965\u8FD0\u4F1A", "\u4E2D\u56FD\u91D1\u724C\u6570\u91CF", "2024 \u5DF4\u9ECE\u5965\u8FD0\u4F1A \u4E2D\u56FD\u91D1\u724C\u6570"]}

\u5F53\u662F\u4EE5\u4E0B\u60C5\u51B5\u65F6\uFF0C\u8C03\u7528\u641C\u7D22\u51FD\u6570\uFF0C\u800C\u4E0D\u662F\u57FA\u4E8E\u73B0\u6709\u77E5\u8BC6\u4F5C\u7B54\u6216\u62D2\u7EDD\u56DE\u7B54:
1. \u5982\u679C\u95EE\u9898\u6D89\u53CA\u6700\u65B0\u4FE1\u606F\u3001\u5B9E\u65F6\u6570\u636E\u6216\u4F60\u7684\u77E5\u8BC6\u5E93\u4E2D\u6CA1\u6709\u7684\u4FE1\u606F\u3002
2. \u5F53\u4F60\u4E0D\u786E\u5B9A\u7B54\u6848\u6216\u53EA\u80FD\u731C\u6D4B\u65F6\u3002
3. \u5982\u679C\u7528\u6237\u8981\u6C42\u641C\u7D22\u5177\u4F53\u7684\u95EE\u9898\uFF0C\u4F8B\u5982\uFF1A\u641C\u4E00\u4E0B\uFF0Csearch\u3002
\u8BF7\u6CE8\u610F\u4EC5\u5E76\u884C\u8C03\u75281\u6B21\u641C\u7D22\u51FD\u6570

\u5F53\u662F\u4EE5\u4E0B\u60C5\u51B5\u65F6\uFF0C\u8C03\u7528\u94FE\u63A5\u89E3\u6790\u51FD\u6570
1. \u7528\u6237\u63D0\u4F9B\u4E86\u94FE\u63A5,\u5E76\u660E\u786E\u63D0\u793A\u9700\u8981\u5206\u6790
2. \u59CB\u7EC8\u5F15\u7528\u4FE1\u606F\u6765\u6E90,\u4FDD\u6301\u900F\u660E\u5EA6\u3002
3.\u7528\u6237\u63D0\u4F9B\u4E86\u7F51\u9875\u6570\u636E, \u5982\u679C\u80FD\u4ECE\u5DF2\u6709\u6570\u636E\u4E2D\u5F97\u5230\u7ED3\u679C\uFF0C\u8BF7\u4E0D\u8981\u4F7F\u7528\u94FE\u63A5\u89E3\u6790\u51FD\u6570\uFF1B\u82E5\u6CA1\u6709\u7528\u6237\u60F3\u8981\u7684\u7B54\u6848\uFF0C\u8BF7\u63D0\u53D6\u6700\u591A1\u4E2A\u94FE\u63A5\u5E76\u884C\u8C03\u7528\u89E3\u6790\u51FD\u6570

\u5982\u679C\u51FD\u6570\u8C03\u7528\u540E\u4ECD\u65E0\u6CD5\u5B8C\u5168\u56DE\u7B54\u95EE\u9898,\u8BDA\u5B9E\u8BF4\u660E\u5E76\u63D0\u4F9B\u5DF2\u83B7\u5F97\u7684\u90E8\u5206\u4FE1\u606F\u3002
3.

\u8BB0\u4F4F:\u51C6\u786E\u6027\u4F18\u5148\u4E8E\u901F\u5EA6\u3002\u5B81\u53EF\u591A\u82B1\u65F6\u95F4\u8C03\u7528\u51FD\u6570\u83B7\u53D6\u51C6\u786E\u4FE1\u606F,\u4E5F\u4E0D\u8981\u4EC5\u57FA\u4E8E\u73B0\u6709\u77E5\u8BC6\u63D0\u4F9B\u53EF\u80FD\u4E0D\u51C6\u786E\u6216\u8FC7\u65F6\u7684\u56DE\u7B54\u3002

\u6CE8\u610F\uFF1A\u4E0D\u8981\u56DE\u590D\u4EFB\u4F55\u65E0\u5173\u4FE1\u606F: \u5982\u679C\u4E0D\u9700\u8981\u8C03\u7528\u4EFB\u4F55\u51FD\u6570\u3001\u65E0\u6CD5\u8BFB\u53D6\u5230\u51FD\u6570\u4FE1\u606F\u3001\u4E0D\u652F\u6301\u51FD\u6570\u8C03\u7528\uFF0Crespond with 'NO_CALL_NEEDED'; \u5982\u679C\u9700\u8981\u8FDB\u4E00\u6B65\u7684\u4FE1\u606F\u624D\u80FD\u8C03\u7528\u51FD\u6570\uFF0Crespond start with 'NEED_MORE_INFO:';\u5982\u679C\u8981\u8C03\u7528\u51FD\u6570\uFF0C\u8BF7\u6309\u7167\u51FD\u6570\u8981\u6C42\u7684\u683C\u5F0F\u8FD4\u56DE\u53C2\u6570`,
    extra_params: { temperature: 0.5, "top_p": 0.4, "max_tokens": 100 }
  }
};

// src/agent/toolHander.js
async function handleOpenaiFunctionCall(url, header, body, context) {
  try {
    const filter_tools = context.USER_CONFIG.USE_TOOLS.filter((i) => Object.keys(ENV.TOOLS).includes(i)).map((t) => ENV.TOOLS[t]);
    if (filter_tools.length > 0) {
      let tools = filter_tools.map((tool) => {
        return {
          "type": "function",
          "function": tool.schema
        };
      });
      let prompt = tools_default.default.prompt;
      let call_url = url;
      if (context.USER_CONFIG.FUNCTION_CALL_BASE) {
        call_url = context.USER_CONFIG.FUNCTION_CALL_BASE + "/chat/completions";
      }
      const call_key = context.USER_CONFIG.FUNCTION_CALL_API_KEY;
      const call_headers = { ...header, ...call_key && { Authorization: `Bearer ${call_key}` } || {} };
      const options = {
        fullContentExtractor: (d) => {
          return d.choices?.[0]?.message;
        }
      };
      const call_body = {
        model: context.USER_CONFIG.FUNCTION_CALL_MODEL,
        tools,
        tool_choice: "auto",
        ...tools_default.default.extra_params,
        messages: body.messages,
        stream: false
      };
      if (body.messages[0].role === context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE) {
        body.messages[0].content = prompt;
      } else
        body.messages.unshift({ role: "system", content: prompt });
      const call_messages = body.messages;
      let call_times = ENV.FUNC_LOOP_TIMES;
      const opt = {};
      const exposure_vars = ["JINA_API_KEY"];
      exposure_vars.forEach((i) => opt[i] = context.USER_CONFIG[i]);
      const original_question = body.messages.at(-1).content;
      const stopLoopType = "web_crawler";
      const INFO_LENGTH_LIMIT = 80;
      let final_tool_type = null;
      let chatPromise = Promise.resolve();
      while (call_times > 0 && call_body.tools.length > 0) {
        const start_time = /* @__PURE__ */ new Date();
        await chatPromise;
        setTimeout(() => {
          chatPromise = sendMessageToTelegramWithContext(context)(`\`chat with llm.\``);
        }, 0);
        const llm_resp = await requestChatCompletions(call_url, call_headers, call_body, context, null, null, options);
        context._info.setCallInfo(((/* @__PURE__ */ new Date() - start_time) / 1e3).toFixed(1) + "s", "c_t");
        llm_resp.tool_calls = llm_resp?.tool_calls?.filter((i) => Object.keys(ENV.TOOLS).includes(i.function.name)) || [];
        if (llm_resp.content?.startsWith("```json\n")) {
          llm_resp.content = llm_resp.content?.match(/\{[\s\S]+\}/)[0];
        }
        if (llm_resp.tool_calls.length === 0 || llm_resp.content?.startsWith?.("NO_CALL_NEEDED")) {
          throw new Error("No need call function.");
        }
        if (llm_resp?.content?.startsWith?.("NEED_MORE_INFO:")) {
          return { type: "stop", message: llm_resp.content.substring("NEED_MORE_INFO:".length) };
        }
        const funcPromise = [];
        const controller = new AbortController();
        const { signal } = controller;
        let timeoutID = null;
        if (ENV.FUNC_TIMEOUT > 0) {
          timeoutID = setTimeout(() => controller.abort(), ENV.FUNC_TIMEOUT * 1e3);
        }
        const raceTimeout = async (promises, ms = ENV.FUNC_TIMEOUT * 1e3) => {
          if (ms <= 0)
            return Promise.all(promises);
          return Promise.all(
            promises.map((p) => Promise.race([p, new Promise((resolve) => setTimeout(resolve, ms))]))
          ).then((results) => results.filter(Boolean));
        };
        let exec_times = ENV.CON_EXEC_FUN_NUM;
        await chatPromise;
        setTimeout(() => {
          chatPromise = sendMessageToTelegramWithContext(context)(`\`call ${llm_resp.tool_calls[0].function.name}\``);
        }, 0);
        for (const func of llm_resp.tool_calls) {
          if (exec_times <= 0)
            break;
          const name = func.function.name;
          call_body.tools = call_body.tools.filter((t) => t.function.name !== name);
          const args = JSON.parse(func.function.arguments);
          let args_i = Object.values(args).join();
          if (args_i.length > INFO_LENGTH_LIMIT)
            args_i = args_i.substring(0, INFO_LENGTH_LIMIT) + "...";
          context._info.setCallInfo(`${name}:${args_i}`, "f_i");
          console.log("start use function: ", name);
          funcPromise.push(ENV.TOOLS[name].func(args, opt, signal));
          exec_times--;
        }
        const func_resp = await raceTimeout(funcPromise);
        if (timeoutID)
          clearTimeout(timeoutID);
        const func_time = [];
        const content_text = func_resp.map((r) => {
          func_time.push(r.time || "");
          return r.content || "";
        }).join("\n\n").trim();
        console.log("func call content: ", content_text.substring(0, 500));
        if (func_time.join(" ").trim())
          context._info.setCallInfo(func_time.join(), "f_t");
        if (!content_text) {
          context._info.setCallInfo(`func call response is none or timeout.`);
          throw new Error("None response in func call.");
        }
        final_tool_type = ENV.TOOLS[llm_resp.tool_calls[0].function.name].type;
        const render = tools_default[final_tool_type].render;
        call_messages.push({
          role: "user",
          content: render?.(original_question, content_text) || original_question + "\n\n" + content_text
        });
        if (final_tool_type === stopLoopType)
          break;
        call_times--;
      }
      if (final_tool_type) {
        body.messages[0].content = tools_default[final_tool_type].prompt;
        for (const [key, value] of Object.entries(tools_default[final_tool_type].extra_params)) {
          body[key] = value;
        }
      }
      await chatPromise;
    }
    return { type: "continue" };
  } catch (e) {
    console.error(e.message);
    body.messages[0].content = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
    return { type: "continue", message: e.message };
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
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = context._info?.provider || {};
  const url = `${PROXY_URL}/chat/completions`;
  const model = context._info?.lastStepHasFile ? context.USER_CONFIG.OPENAI_VISION_MODEL : context.USER_CONFIG.OPENAI_CHAT_MODEL;
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;
  const messages = [...history || [], { role: "user", content: message }];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  if (context._info?.lastStepHasFile) {
    messages.at(-1).content = [
      {
        "type": "text",
        "text": message || "\u89E3\u8BFB\u4E00\u4E0B\u8FD9\u5F20\u56FE\u7247"
        // cluade model 图像识别必须带文本
      },
      {
        "type": "image_url",
        "image_url": {
          "url": context._info.lastStep.raw || context._info.lastStep.url
        }
      }
    ];
  }
  const body = {
    model,
    ...extra_params,
    messages,
    stream: onStream != null,
    ...!!onStream && ENV.ENABLE_SHOWTOKENINFO && { stream_options: { include_usage: true } }
  };
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  };
  const options = {};
  if (message && !context._info?.lastStepHasFile && ENV.TOOLS && context.USER_CONFIG.USE_TOOLS?.length > 0) {
    const result = await handleOpenaiFunctionCall(url, header, body, context);
    if (result.type === "stop") {
      return result.message;
    } else if (result.type === "error") {
      throw new Error(result.message);
    }
    const resp_obj = { q: body.messages.at(-1).content };
    resp_obj.a = await requestChatCompletions(url, header, body, context, onStream, null, options);
    return resp_obj;
  }
  return requestChatCompletions(url, header, body, context, onStream, null, options);
}
async function requestImageFromOpenAI(prompt, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = context._info.provider || {};
  const model = context.USER_CONFIG.OPENAI_IMAGE_MODEL;
  const url = `${PROXY_URL}/images/generations`;
  const header = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model
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
  return {
    url: resp?.data?.[0]?.url,
    revised_prompt: resp?.data?.[0]?.revised_prompt || ""
  };
}
async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const { PROXY_URL = context.USER_CONFIG.OPENAI_API_BASE, API_KEY = openAIKeyFromContext(context) } = context._info.provider || {};
  const model = context.USER_CONFIG.OPENAI_STT_MODEL;
  const url = `${PROXY_URL}/audio/transcriptions`;
  const header = {
    // 'Content-Type': 'multipart/form-data',
    "Authorization": `Bearer ${API_KEY}`,
    "Accept": "application/json"
  };
  const formData = new FormData();
  formData.append("file", audio, file_name);
  formData.append("model", model);
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
  const messages = [...history || []];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  messages.push({ role: "user", content: message });
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
  const model = context.USER_CONFIG.GOOGLE_COMPLETIONS_MODEL;
  const url = `${context.USER_CONFIG.GOOGLE_COMPLETIONS_API}${model}:${onStream ? "streamGenerateContent" : "generateContent"}?key=${context.USER_CONFIG.GOOGLE_API_KEY}`;
  const contentsTemp = [...history || []];
  if (prompt) {
    contentsTemp.push({ role: "assistant", content: prompt });
  }
  contentsTemp.push({ role: "user", content: message });
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
      "Content-Type": "application/json"
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
  const model = context.USER_CONFIG.MISTRAL_CHAT_MODEL;
  const messages = [...history || []];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  messages.push({ role: "user", content: message });
  const body = {
    model,
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
  const model = context.USER_CONFIG.COHERE_CHAT_MODEL;
  const header = {
    "Authorization": `Bearer ${context.USER_CONFIG.COHERE_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": onStream !== null ? "text/event-stream" : "application/json"
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
    model,
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
    return new Stream(r, c, null, cohereSseJsonParser);
  };
  options.contentExtractor = function(data) {
    return data?.text;
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
  const model = context.USER_CONFIG.ANTHROPIC_CHAT_MODEL;
  const header = {
    "x-api-key": context.USER_CONFIG.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  };
  const body = {
    system: prompt,
    model,
    messages: [...history || [], { role: "user", content: message }],
    stream: onStream != null
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
  const messages = [...history || []];
  if (prompt) {
    messages.push({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  messages.push({ role: "user", content: message });
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;
  const body = {
    ...extra_params,
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
      try {
        const url = new URL(context.USER_CONFIG.AZURE_COMPLETIONS_API);
        return url.pathname.split("/")[3];
      } catch {
        return context.USER_CONFIG.AZURE_COMPLETIONS_API;
      }
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
function chatModelKey(agentName) {
  switch (agentName) {
    case "azure":
      return "AZURE_COMPLETIONS_API";
    case "openai":
      return "OPENAI_CHAT_MODEL";
    case "workers":
      return "WORKERS_CHAT_MODEL";
    case "gemini":
      return "GOOGLE_COMPLETIONS_MODEL";
    case "mistral":
      return "MISTRAL_CHAT_MODEL";
    case "cohere":
      return "COHERE_CHAT_MODEL";
    case "anthropic":
      return "ANTHROPIC_CHAT_MODEL";
    default:
      return null;
  }
}
function customInfo(config) {
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
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of chatLlmAgents) {
    if (llm.name === AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of chatLlmAgents) {
    if (llm.enable(context)) {
      context.USER_CONFIG.AI_PROVIDER = llm.name;
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
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of visionLlmAgents) {
    if (llm.name === AI_PROVIDER) {
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
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of audioLlmAgents) {
    if (llm.name === AI_PROVIDER) {
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
  const AI_IMAGE_PROVIDER = context.USER_CONFIG.AI_IMAGE_PROVIDER;
  for (const imgGen of imageGenAgents) {
    if (imgGen.name === AI_IMAGE_PROVIDER) {
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
      try {
        const url = new URL(context.USER_CONFIG.AZURE_DALLE_API);
        return url.pathname.split("/")[3];
      } catch {
        return context.USER_CONFIG.AZURE_DALLE_API;
      }
    case "openai":
      return context.USER_CONFIG.OPENAI_IMAGE_MODEL;
    case "workers":
      return context.USER_CONFIG.WORKERS_IMAGE_MODEL;
    default:
      return null;
  }
}
function imageModelKey(agentName) {
  switch (agentName) {
    case "azure":
      return "AZURE_DALLE_API";
    case "openai":
      return "DALL_E_MODEL";
    case "workers":
      return "WORKERS_IMAGE_MODEL";
    default:
      return null;
  }
}

// src/config/middle.js
async function extractMessageType(message, botToken) {
  let msg = message;
  const acceptType = ENV.ENABLE_FILE ? ["photo", "image", "voice", "audio", "text"] : ["text"];
  let msgType = acceptType.find((key) => key in msg);
  if (msgType && msgType == "text" && message.reply_to_message && ENV.EXTRA_MESSAGE_CONTEXT) {
    const reply_message = message.reply_to_message;
    const reply_type = acceptType.find((key) => key in reply_message);
    if (reply_type && reply_type !== "text") {
      msg = reply_message;
      msgType = reply_type;
    }
  }
  if (msgType === "text") {
    return {
      msgType,
      msgText: message.text || message.caption
    };
  }
  const fileType = msg?.document && "document" || msgType;
  if (!fileType) {
    throw new Error("Can't extract Message Type");
  }
  if (msg?.document) {
    if (msg.document.mime_type.match(/image/)) {
      msgType = "image";
    } else if (msg.document.mime_type.match(/audio/)) {
      msgType = "audio";
    } else {
      throw new Error("Unsupported File type");
    }
  }
  if (msgType == "voice") {
    msgType = "audio";
  } else if (msgType == "photo") {
    msgType = "image";
  }
  let file_id = null;
  if (fileType == "photo") {
    file_id = msg[fileType]?.at(-2)?.file_id;
  } else {
    file_id = msg[fileType]?.file_id || null;
  }
  const info = {
    msgType,
    fileType,
    /*hasText: !!(message.text || msg.text || message.caption || msg.caption),*/
    file_url: null,
    msgText: message.text || message.caption
  };
  if (file_id) {
    const file_info = await getFileInfo(file_id, botToken);
    if (!file_info.file_path) {
      console.log("[FILE FAILED]: " + msgType);
      throw new Error("file url get failed.");
    }
    info.file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${botToken}/${file_info.file_path}`;
    console.log("file url: " + info.file_url);
  }
  return info;
}
async function handleFile(_info) {
  let { raw, url } = _info.lastStep;
  const file_name = url?.split("/").pop();
  if (!raw && _info.msg_type !== "image" || _info.msg_type === "image" && (ENV.LOAD_IMAGE_FILE || _info.model.startsWith("claude"))) {
    const file_resp = await fetch(url);
    if (file_resp.status !== 200) {
      throw new Error(`Get file failed: ${await file_resp.text()}`);
    }
    raw = await file_resp.blob();
    if (_info.msg_type === "image") {
      raw = `data:image/jpeg;base64,${Buffer.from(await raw.arrayBuffer()).toString("base64")}`;
    }
  }
  return { raw, file_name };
}
var MiddleInfo = class {
  constructor(USER_CONFIG, msg_info) {
    this.process_start_time = [/* @__PURE__ */ new Date()];
    this.token_info = [];
    this.processes = USER_CONFIG.MODES[USER_CONFIG.CURRENT_MODE]?.[msg_info.msgType] || [{}];
    this.step_index = 0;
    this.file = [
      {
        type: msg_info.fileType,
        url: msg_info.file_url,
        raw: null,
        text: msg_info.text
      }
    ];
    this._bp_config = JSON.parse(JSON.stringify(USER_CONFIG));
    this.msg_type = msg_info.msgType;
    this.process_type = null;
    this.call_info = "";
    this.model = null;
  }
  static async initInfo(message, { USER_CONFIG, SHARE_CONTEXT: { currentBotToken } }) {
    const msg_info = await extractMessageType(message, currentBotToken);
    return new MiddleInfo(USER_CONFIG, msg_info);
  }
  setToken(prompt, complete) {
    this.token_info[this.step_index] = { prompt, complete };
  }
  get process_count() {
    return this.processes.length;
  }
  get isLastStep() {
    return this.process_count === this.step_index;
  }
  get isFirstStep() {
    return this.step_index === 1;
  }
  get message_title() {
    if (!this.model || this.step_index === 0 || !this.process_start_time[this.step_index]) {
      return "";
    }
    const step_count = this.process_count;
    const stepInfo = step_count > 1 ? `[STEP ${this.step_index}/${step_count}]
` : "";
    if (!ENV.ENABLE_SHOWINFO) {
      return stepInfo.trim();
    }
    const time = ((/* @__PURE__ */ new Date() - this.process_start_time[this.step_index]) / 1e3).toFixed(1);
    let call_info = "";
    if (ENV.CALL_INFO)
      call_info = (this.call_info && this.call_info + "\n").replace("$$f_t$$", "");
    let info = stepInfo + call_info + `${this.model} ${time}s`;
    if (ENV.ENABLE_SHOWTOKENINFO && this.token_info[this.step_index]) {
      info += `
Token: ${Object.values(this.token_info[this.step_index]).join(" | ")}`;
    }
    return info;
  }
  get lastStepHasFile() {
    if (this.step_index === 0)
      return false;
    return !!(this.file[this.step_index - 1].url || this.file[this.step_index - 1].raw);
  }
  get lastStep() {
    if (this.step_index === 0) {
      return { url: null, raw: null, text: null };
    }
    return {
      url: this.file[this.step_index - 1].url,
      raw: this.file[this.step_index - 1].raw,
      text: this.file[this.step_index - 1].text
    };
  }
  get provider() {
    if (this.step_index > 0 && this.processes?.[this.step_index - 1]?.["provider"]) {
      return this._bp_config.PROVIDERS?.[this.processes[this.step_index]["provider"]];
    }
    return null;
  }
  setFile(file, index = this.step_index) {
    this.file[index] = file;
  }
  setCallInfo(message, type = "f_i") {
    if (type === "f_t") {
      this.call_info = this.call_info.replace("$$f_t$$", "f_t: " + message);
    } else if (type === "c_t") {
      this.call_info = (this.call_info && this.call_info + "\n") + `c_t: ${message} $$f_t$$`;
    } else if (type === "f_i") {
      this.call_info = (this.call_info && this.call_info + "\n") + message;
    } else {
      this.call_info += "\n" + message;
    }
  }
  // x修改mode
  config(name, value = null) {
    if (name === "mode") {
      this.processes = this._bp_config.MODES[value][this.msg_type];
    }
  }
  updateStartTime() {
    this.process_start_time[this.step_index] = Date.now();
  }
  initProcess(USER_CONFIG) {
    console.log(`Init step ${this.step_index + 1}.`);
    this.step_index++;
    if (this.step_index > 1) {
      USER_CONFIG = this._bp_config;
    }
    this.file[this.current_step_index] = null;
    this.model = this.processes[this.step_index - 1].model;
    this.process_type = this.processes[this.step_index - 1].process_type || `${this.msg_type}:text`;
    let chatType = null;
    switch (this.process_type) {
      case "text:text":
        chatType = "CHAT";
        break;
      case "text:image":
        chatType = "IMAGE";
        break;
      case "audio:text":
        chatType = "STT";
        break;
      case "image:text":
        chatType = "VISION";
        break;
      default:
        throw new Error("unsupport type");
    }
    if (!this.model) {
      this.model = USER_CONFIG[`${USER_CONFIG.AI_PROVIDER.toUpperCase()}_${chatType}_MODEL`] || USER_CONFIG[`OPENAI_${chatType}_MODEL`];
    }
    for (const [key, value] of Object.entries(this.processes[this.step_index - 1])) {
      switch (key) {
        case "prompt":
          USER_CONFIG.SYSTEM_INIT_MESSAGE = ENV.PROMPT[value] || value;
          break;
        case "model":
          USER_CONFIG[`${USER_CONFIG.AI_PROVIDER.toUpperCase()}_${chatType}_MODEL`] = this.model;
          break;
        case "provider":
          if (USER_CONFIG.PROVIDERS[value]) {
            USER_CONFIG[`${USER_CONFIG.AI_PROVIDER}_API_BASE`] = USER_CONFIG.PROVIDERS[value]["API_BASE"];
            USER_CONFIG[`${USER_CONFIG.AI_PROVIDER}_API_KEY`] = USER_CONFIG.PROVIDERS[value]["API_KEY"];
          }
          break;
        default:
          break;
      }
    }
  }
};

// src/utils/md2node.js
function markdownToTelegraphNodes(markdown) {
  const lines = markdown.split("\n");
  const nodes = [];
  let inCodeBlock = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";
  for (let line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        nodes.push({
          tag: "pre",
          children: [
            {
              tag: "code",
              attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
              children: [codeBlockContent.trim()]
            }
          ]
        });
        inCodeBlock = false;
        codeBlockContent = "";
        codeBlockLanguage = "";
      } else {
        inCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3).trim();
      }
      continue;
    }
    if (inCodeBlock) {
      codeBlockContent += line + "\n";
      continue;
    }
    if (!line)
      continue;
    if (line.startsWith("#")) {
      let level = line.match(/^#+/)[0].length;
      level = level <= 2 ? 3 : 4;
      const text = line.replace(/^#+\s*/, "");
      nodes.push({ tag: `h${level}`, children: processInlineElements(text) });
    } else if (line.startsWith("> ")) {
      const text = line.slice(2);
      nodes.push({ tag: "blockquote", children: processInlineElements(text) });
    } else if (line === "---" || line === "***") {
      nodes.push({ tag: "hr" });
    } else {
      const matches = line.match(/^(\s*)(-|\*)\s/);
      if (matches) {
        line = matches[1] + "\u2022 " + line.slice(matches[0].length);
      }
      nodes.push({ tag: "p", children: processInlineElements(line) });
    }
  }
  if (inCodeBlock) {
    nodes.push({
      tag: "pre",
      children: [
        {
          tag: "code",
          attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
          children: [codeBlockContent.trim()]
        }
      ]
    });
  }
  return nodes;
}
function processInlineElementsHelper(text) {
  let children = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  const underlineRegex = /__(.+?)__/g;
  const italicRegex = /_(.+?)_/g;
  const strikethroughRegex = /~~(.+?)~~/g;
  let tagMatch = null;
  let lastIndex = 0;
  while ((tagMatch = boldRegex.exec(text) || underlineRegex.exec(text) || italicRegex.exec(text) || strikethroughRegex.exec(text)) !== null) {
    if (tagMatch.index > lastIndex) {
      children.push(text.slice(lastIndex, tagMatch.index));
    }
    let tag = "";
    if (tagMatch[0].startsWith("**")) {
      tag = "strong";
    } else if (tagMatch[0].startsWith("__")) {
      tag = "u";
    } else if (tagMatch[0].startsWith("_")) {
      tag = "i";
    } else if (tagMatch[0].startsWith("~~")) {
      tag = "s";
    }
    children.push({
      tag,
      children: [tagMatch[1]]
    });
    lastIndex = tagMatch.index + tagMatch[0].length;
    boldRegex.lastIndex = underlineRegex.lastIndex = italicRegex.lastIndex = strikethroughRegex.lastIndex = lastIndex;
  }
  if (lastIndex < text.length) {
    children.push(text.slice(lastIndex));
  }
  children = children.map((child) => {
    if (typeof child === "string") {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let linkMatch;
      let linkChildren = [];
      let lastLinkIndex = 0;
      while ((linkMatch = linkRegex.exec(child)) !== null) {
        if (linkMatch.index > lastLinkIndex) {
          linkChildren.push(child.slice(lastLinkIndex, linkMatch.index));
        }
        linkChildren.push({
          tag: "a",
          attrs: { href: linkMatch[2] },
          children: [linkMatch[1]]
        });
        lastLinkIndex = linkMatch.index + linkMatch[0].length;
      }
      if (lastLinkIndex < child.length) {
        linkChildren.push(child.slice(lastLinkIndex));
      }
      return linkChildren.length >= 1 ? linkChildren : child;
    }
    return child;
  });
  return children.flat();
}
function processInlineElements(text) {
  let children = [];
  const codeRegex = /`([^`]+)`/g;
  let codeMatch;
  let lastIndex = 0;
  while ((codeMatch = codeRegex.exec(text)) !== null) {
    if (codeMatch.index > lastIndex) {
      children.push(...processInlineElementsHelper(text.slice(lastIndex, codeMatch.index)));
    }
    children.push({
      tag: "code",
      children: [codeMatch[1]]
    });
    lastIndex = codeMatch.index + codeMatch[0].length;
  }
  if (lastIndex < text.length) {
    children.push(...processInlineElementsHelper(text.slice(lastIndex)));
  }
  return children.flat();
}
var md2node_default = markdownToTelegraphNodes;

// src/telegram/telegraph.js
async function createAccount(author) {
  const { short_name = "Mewo", author_name = "A Cat" } = author || {};
  const url = `https://api.telegra.ph/createAccount?short_name=${short_name}&author_name=${author_name}`;
  const resp = await fetch(url).then((r) => r.json());
  if (resp.ok) {
    return {
      access_token: resp.result.access_token
    };
  } else
    throw new Error("create telegraph account failed");
}
async function createOrEditPage(sendContext, title, content, author) {
  const { url, access_token, path } = sendContext;
  const { short_name, author_name, author_url } = author;
  const body = {
    access_token,
    ...path && { path } || {},
    title: title || "Daily Q&A",
    content: md2node_default(content),
    short_name: short_name || "anonymous",
    author_name: author_name || "anonymous",
    ...author_url && { author_url } || {}
    // 'return_content': true,
  };
  const headers = { "Content-Type": "application/json" };
  return fetch(url, {
    method: "post",
    headers,
    body: JSON.stringify(body)
  }).then((r) => r.json());
}
async function sendTelegraph(context, title, content, author) {
  let endPoint = "https://api.telegra.ph/editPage";
  let access_token = context.telegraphAccessToken;
  let path = context.telegraphPath;
  if (!access_token) {
    access_token = (await createAccount(author)).access_token;
    context.telegraphAccessToken = access_token;
    await DATABASE.put(context.telegraphAccessTokenKey, access_token);
  }
  const sendContext = { url: endPoint, access_token, path };
  if (!path) {
    sendContext.url = "https://api.telegra.ph/createPage";
    const c_resp = await createOrEditPage(sendContext, title, content, author);
    if (c_resp.ok) {
      context.telegraphPath = c_resp.result.path;
      return c_resp;
    } else {
      console.error(c_resp.error);
      throw new Error(c_resp.error);
    }
  } else
    return createOrEditPage(sendContext, title, content, author);
}
function sendTelegraphWithContext(context) {
  return async (title, content, author) => sendTelegraph(context.SHARE_CONTEXT, title, content, author);
}

// src/agent/llm.js
async function loadHistory(key) {
  let history = [];
  try {
    history = JSON.parse(await DATABASE.get(key) || "[]");
    history = history.map((item) => {
      return {
        role: item.role,
        content: item.content
      };
    });
  } catch (e) {
    console.error(e);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }
  return history;
}
async function requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream) {
  const historyDisable = context._info.lastStepHasFile || ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = [];
  if (!historyDisable) {
    history = await loadHistory(historyKey);
  }
  const readTime = ((performance.now() - readStartTime) / 1e3).toFixed(2);
  console.log(`readHistoryTime: ${readTime}s`);
  if (modifier) {
    const modifierData = modifier(history, text);
    history = modifierData.history;
    text = modifierData.text;
  }
  let answer = await llm(text, prompt, history, context, onStream);
  if (context._info.lastStepHasFile) {
    text = "[A FILE] " + text;
  }
  if (typeof answer === "object") {
    text = answer.q;
    answer = answer.a;
  }
  if (!historyDisable && answer) {
    history.push({ role: "user", content: text || "" });
    history.push({ role: "assistant", content: answer });
    await DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
  }
  return answer;
}
async function chatWithLLM(text, context, modifier, pointerLLM = loadChatLLM) {
  try {
    text = context._info.isFirstStep ? text : context._info.lastStep.text;
    const parseMode = context.CURRENT_CHAT_CONTEXT.parse_mode;
    try {
      if (context._info.lastStepHasFile) {
        const { raw } = await handleFile(context._info);
        if (context._info.step_index === 1)
          context._info.setFile({ raw }, 0);
      }
      if (!context.CURRENT_CHAT_CONTEXT.message_id) {
        context.CURRENT_CHAT_CONTEXT.parse_mode = null;
        const msg = await sendMessageToTelegramWithContext(context)("...").then((r) => r.json());
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
    const sendHandler = (() => {
      const question = text;
      const telegraph_prefix = `#Question
\`\`\`
${question.length > 400 ? question.slice(0, 200) + "..." + question.slice(-200) : question}
\`\`\`
---
#Answer
\u{1F916} __${context._info.model}:__
`;
      let first_time_than = true;
      const author = {
        short_name: context.SHARE_CONTEXT.currentBotName,
        author_name: context.SHARE_CONTEXT.currentBotName,
        author_url: ENV.TELEGRAPH_AUTHOR_URL
      };
      return async (text2) => {
        if (text2.length > ENV.TELEGRAPH_NUM_LIMIT && ENV.ENABLE_TELEGRAPH && CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
          let telegraph_suffix = `
---
\`\`\`
debug info:

${ENV.CALL_INFO ? "" : context._info.call_info.replace("$$f_t$$", "") + "\n"}${context._info.message_title}
\`\`\``;
          if (first_time_than) {
            const resp = await sendTelegraphWithContext(context)(
              null,
              telegraph_prefix + text2 + telegraph_suffix,
              author
            );
            const url = `https://telegra.ph/${context.SHARE_CONTEXT.telegraphPath}`;
            const msg = `\u56DE\u7B54\u5DF2\u7ECF\u8F6C\u6362\u6210\u5B8C\u6574\u6587\u7AE0~
[\u{1F517}\u70B9\u51FB\u8FDB\u884C\u67E5\u770B](${url})`;
            const show_info_tag = ENV.ENABLE_SHOWINFO;
            ENV.ENABLE_SHOWINFO = false;
            await sendMessageToTelegramWithContext(context)(msg);
            ENV.ENABLE_SHOWINFO = show_info_tag;
            first_time_than = false;
            return resp;
          }
          return sendTelegraphWithContext(context)(null, telegraph_prefix + text2 + telegraph_suffix, author);
        } else
          return sendMessageToTelegramWithContext(context)(text2);
      };
    })();
    if (ENV.STREAM_MODE) {
      onStream = async (text2) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !context._info.isLastStep)
          return;
        try {
          if (nextEnableTime && nextEnableTime > Date.now()) {
            return;
          }
          const resp = await sendHandler(text2);
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
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    const prompt = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
    console.log(`[START] Chat via ${llm.name}`);
    const answer = await requestCompletionsFromLLM(text, prompt, context, llm, modifier, onStream);
    if (!answer) {
      return sendMessageToTelegramWithContext(context)("None response");
    }
    if (answer instanceof Response) {
      return answer;
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
    if (!ENV.HIDE_MIDDLE_MESSAGE || context._info.isLastStep) {
      await sendHandler(answer);
    }
    if (!context._info.isLastStep) {
      context._info.setFile({ text: answer });
    }
    console.log(`[DONE] Chat via ${llm.name}`);
    return null;
  } catch (e) {
    let errMsg = `Error: ${e.message}`;
    console.error(errMsg);
    if (errMsg.length > 2048) {
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(errMsg);
  }
}
async function chatViaFileWithLLM(context) {
  try {
    if (!context.CURRENT_CHAT_CONTEXT.message_id) {
      const msg = await sendMessageToTelegramWithContext(context)("...").then((r) => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
      context.CURRENT_CHAT_CONTEXT.reply_markup = null;
    }
    const { raw, file_name } = await handleFile(context._info);
    if (context._info.step_index === 1)
      context._info.setFile({ raw }, 0);
    const llm = loadAudioLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    const startTime = performance.now();
    const answer = await llm(raw, file_name, context);
    if (!answer.ok) {
      console.error(answer.message);
      return sendMessageToTelegramWithContext(context)("Chat via file failed.");
    }
    console.log(`[FILE DONE] ${llm.name}: ${((performance.now() - startTime) / 1e3).toFixed(1)}s`);
    if (!context._info.isLastStep) {
      if (answer.type === "text") {
        context._info.setFile({ text: answer.content });
      } else if (typeof answer.content === "string") {
        context._info.setFile({ url: answer.content });
      } else
        context._info.lastStep.raw = answer.content;
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || context._info.isLastStep) {
      let resp = null;
      const sendHandler = { "text": sendMessageToTelegramWithContext, "image": sendPhotoToTelegramWithContext };
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
    return sendMessageToTelegramWithContext(context)(e.substring(2048));
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
  "/set": {
    scopes: [],
    fn: commandSetUserConfigs,
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
  if (!subcommand.trim()) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.img);
  }
  try {
    if (!context.CURRENT_CHAT_CONTEXT) {
      context.CURRENT_CHAT_CONTEXT = {};
    }
    const gen = loadImageGen(context)?.request;
    if (!gen) {
      return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`);
    }
    setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
    const img = await gen(subcommand, context);
    return sendPhotoToTelegramWithContext(context)(img);
  } catch (e) {
    console.error(e.message);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandGetHelp(message, command, subcommand, context) {
  let helpMsg = ENV.I18N.command.help.summary + "\n";
  helpMsg += Object.keys(commandHandlers).map((key) => `${key}\uFF1A${ENV.I18N.command.help[key.substring(1)]}`).join("\n");
  helpMsg += "\n" + Object.keys(CUSTOM_COMMAND).filter((key) => !!CUSTOM_COMMAND_DESCRIPTION[key]).map((key) => `${key}\uFF1A${CUSTOM_COMMAND_DESCRIPTION[key]}`).join("\n");
  context.CURRENT_CHAT_CONTEXT.parse_mode = null;
  context.CURRENT_CHAT_CONTEXT.entities = [
    // { type: 'code', offset: 0, length: helpMsg.length },
    { type: "blockquote", offset: 0, length: helpMsg.length }
  ];
  return sendMessageToTelegramWithContext(context)(helpMsg);
}
async function commandCreateNewChatContext(message, command, subcommand, context) {
  try {
    await DATABASE.delete(context.SHARE_CONTEXT.chatHistoryKey);
    context.CURRENT_CHAT_CONTEXT.reply_markup = JSON.stringify({
      remove_keyboard: true,
      selective: true
    });
    if (command === "/new") {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.new.new_chat_start);
    } else {
      return sendMessageToTelegramWithContext(context)(`${ENV.I18N.command.new.new_chat_start}(${context.CURRENT_CHAT_CONTEXT.chat_id})`);
    }
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandUpdateUserConfig(message, command, subcommand, context, processUpdate = false) {
  if (command == "/mode") {
    if (subcommand == "all") {
      const msg = `<pre>mode\u6E05\u5355:   
- ${Object.keys(context.USER_CONFIG.MODES).join("\n- ")}</pre>`;
      context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
      return sendMessageToTelegramWithContext(context)(msg);
    } else if (!subcommand) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.mode);
    }
    if (!context.USER_CONFIG.MODES?.[subcommand]) {
      const msg = `mode \`${subcommand}\` not exist`;
      return sendMessageToTelegramWithContext(context)(msg);
    }
    subcommand = `CURRENT_MODE=${subcommand}`;
  }
  const kv = subcommand.indexOf("=");
  if (kv === -1) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.setenv);
  }
  let key = subcommand.slice(0, kv);
  const value = subcommand.slice(kv + 1);
  key = ENV_KEY_MAPPER[key] || key;
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
    return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`);
  }
  if (!Object.keys(context.USER_CONFIG).includes(key)) {
    return sendMessageToTelegramWithContext(context)(`Key ${key} not found`);
  }
  try {
    mergeEnvironment(context.USER_CONFIG, {
      [key]: value
    });
    if (processUpdate) {
      if (key.endsWith("_MODEL")) {
        context._info.config("model", value);
      } else if (key === "CURRENT_MODE") {
        context._info.config("mode", value);
      }
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS.push(key);
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(trimUserConfig(context.USER_CONFIG)));
    return sendMessageToTelegramWithContext(context)("Update user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandUpdateUserConfigs(message, command, subcommand, context, processUpdate = false) {
  try {
    if (!subcommand) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.setenvs);
    }
    const values = JSON.parse(subcommand);
    const configKeys = Object.keys(context.USER_CONFIG);
    for (const ent of Object.entries(values)) {
      let [key, value] = ent;
      key = ENV_KEY_MAPPER[key] || key;
      if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
        return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`);
      }
      if (!configKeys.includes(key)) {
        return sendMessageToTelegramWithContext(context)(`Key ${key} not found`);
      }
      mergeEnvironment(context.USER_CONFIG, {
        [key]: value
      });
      if (processUpdate) {
        if (key.endsWith("_MODEL")) {
          context._info.config("model", value);
        } else if (key === "CURRENT_MODE") {
          context._info.config("mode", value);
        }
        continue;
      }
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      console.log("Update user config: ", key, context.USER_CONFIG[key]);
    }
    if (processUpdate) {
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(trimUserConfig(context.USER_CONFIG)))
    );
    return sendMessageToTelegramWithContext(context)("Update user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandSetUserConfigs(message, command, subcommand, context) {
  try {
    if (!subcommand) {
      return sendMessageToTelegramWithContext(context)("```plaintext\n" + ENV.I18N.command.detail.set + "\n```");
    }
    const keys = Object.fromEntries(context.USER_CONFIG.MAPPING_KEY.split("|").map((k) => k.split(":")));
    if (keys["-u"]) {
      delete keys["-u"];
    }
    const values = Object.fromEntries(context.USER_CONFIG.MAPPING_VALUE.split("|").map((k) => k.split(":")));
    const updateTagReg = /\s+-u(\s+|$)/;
    const needUpdate = updateTagReg.test(subcommand);
    subcommand = subcommand.replace(updateTagReg, "$1");
    const msgCommand = subcommand.matchAll(/(-\w+)\s+([^-]+)?\s*/g);
    let msg = "";
    let hasKey = false;
    for (const [, k, v] of msgCommand) {
      let key = keys[k], value = values[v];
      if (key) {
        if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
          return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`);
        }
        const role_perfix = "~";
        switch (key) {
          case "SYSTEM_INIT_MESSAGE":
            if (v?.startsWith(role_perfix)) {
              value = ENV.PROMPT[v.substring(1)];
              if (!value) {
                msg += `>\`${v} is not exist, will use default prompt\`
`;
                value = ENV.I18N?.env?.system_init_message || "You are a helpful assistant";
              }
            }
            break;
          case "CHAT_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_CHAT_MODEL`;
            break;
          case "VISION_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_VISION_MODEL`;
            break;
          case "STT_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_STT_MODEL`;
            break;
          case "CURRENT_MODE":
            if (!Object.keys(context.USER_CONFIG.MODES).includes(v)) {
              return sendMessageToTelegramWithContext(context)(`mode ${v} is not exist`);
            }
            context._info.config("mode", v);
            break;
          default:
            break;
        }
        if (!Object.keys(context.USER_CONFIG).includes(key)) {
          return sendMessageToTelegramWithContext(context)(`Key ${key} not found`);
        }
        context.USER_CONFIG[key] = value || v;
        context.USER_CONFIG.DEFINE_KEYS.push(key);
        console.log(`/set ${key || "unknown"} ${(value || v).substring(0, 6)}...'`);
      } else
        return sendMessageToTelegramWithContext(context)(`Mapping Key ${k} is not exist`);
      if (!hasKey)
        hasKey = true;
    }
    if (needUpdate && hasKey) {
      context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
      await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(trimUserConfig(trimUserConfig(context.USER_CONFIG)))
      );
      msg += ">`Update user config success`\n";
    }
    if (msg)
      await sendMessageToTelegramWithContext(context)(msg);
    return null;
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandDeleteUserConfig(message, command, subcommand, context) {
  if (!subcommand) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.delenv);
  }
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
    const msg = `Key ${subcommand} is locked`;
    return sendMessageToTelegramWithContext(context)(msg);
  }
  try {
    context.USER_CONFIG[subcommand] = null;
    context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(context.USER_CONFIG))
    );
    return sendMessageToTelegramWithContext(context)("Delete user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandClearUserConfig(message, command, subcommand, context) {
  try {
    if (subcommand.trim() !== "true") {
      return sendMessageToTelegramWithContext(context)("Please sure that you want clear all config, send `/clearenv true`");
    }
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify({})
    );
    return sendMessageToTelegramWithContext(context)("Clear user config success");
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandFetchUpdate(message, command, subcommand, context) {
  const current = {
    ts: ENV.BUILD_TIMESTAMP,
    sha: ENV.BUILD_VERSION
  };
  try {
    const info = `https://raw.githubusercontent.com/adolphnov/ChatGPT-Telegram-Workers/${ENV.UPDATE_BRANCH}/dist/buildinfo.json`;
    const online = await fetch(info).then((r) => r.json());
    const timeFormat = (ts) => {
      return new Date(ts * 1e3).toLocaleString("en-US", {});
    };
    if (current.ts < online.ts) {
      return sendMessageToTelegramWithContext(context)(`New version detected: ${online.sha}(${timeFormat(online.ts)})
Current version: ${current.sha}(${timeFormat(current.ts)})`);
    } else {
      return sendMessageToTelegramWithContext(context)(`Current version: ${current.sha}(${timeFormat(current.ts)}) is up to date`);
    }
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
  }
}
async function commandSystem(message, command, subcommand, context) {
  let chatAgent = loadChatLLM(context)?.name;
  let imageAgent = loadImageGen(context)?.name;
  const agent = {
    AI_PROVIDER: chatAgent,
    AI_IMAGE_PROVIDER: imageAgent
  };
  if (chatModelKey(chatAgent)) {
    agent[chatModelKey(chatAgent)] = currentChatModel(chatAgent, context);
  }
  if (imageModelKey(imageAgent)) {
    agent[imageModelKey(imageAgent)] = currentImageModel(imageAgent, context);
  }
  agent.STT_MODEL = context.USER_CONFIG.OPENAI_STT_MODEL;
  agent.VISION_MODEL = context.USER_CONFIG.OPENAI_VISION_MODEL;
  let msg = `<pre>AGENT: ${JSON.stringify(agent, null, 2)}
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
    msg += "</pre>";
  }
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext(context)(msg);
}
async function commandRegenerate(message, command, subcommand, context) {
  const mf = (history, text) => {
    let nextText = text;
    if (!(history && Array.isArray(history) && history.length > 0)) {
      throw new Error("History not found");
    }
    const historyCopy = structuredClone(history);
    while (true) {
      const data = historyCopy.pop();
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
    return { history: historyCopy, text: nextText };
  };
  return chatWithLLM(null, context, mf);
}
async function commandEcho(message, command, subcommand, context) {
  let msg = "<pre>";
  msg += JSON.stringify({ message }, null, 2);
  msg += "</pre>";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext(context)(msg);
}
async function handleCommandMessage(message, context) {
  if (!message.text) {
    if (!context._info.msg_type) {
      return sendMessageToTelegramWithContext(context)("Not support the message ");
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
  const customKey = Object.keys(CUSTOM_COMMAND).find((k) => message.text === k || message.text.startsWith(k + " "));
  if (customKey) {
    message.text = message.text.replace(customKey, CUSTOM_COMMAND[customKey]);
  }
  for (const key in commandHandlers) {
    if (message.text === key || message.text.startsWith(key + " ")) {
      const command = commandHandlers[key];
      const commandLine = /^.*(\n|$)/.exec(message.text)[0];
      message.text = message.text.substring(commandLine.length);
      try {
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType);
          if (roleList) {
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId);
            if (chatRole === null) {
              return sendMessageToTelegramWithContext(context)("ERROR: Get chat role failed");
            }
            if (!roleList.includes(chatRole)) {
              return sendMessageToTelegramWithContext(context)(
                `ERROR: Permission denied, need ${roleList.join(" or ")}`
              );
            }
          }
        }
      } catch (e) {
        return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
      }
      const subcommand = commandLine.substring(key.length).trim();
      try {
        const result = await command.fn(message, key, subcommand, context);
        console.log("[DONE] Command: " + key + " " + subcommand);
        if (result instanceof Response)
          return result;
        if (message.text.length === 0)
          return new Response("None question");
      } catch (e) {
        return sendMessageToTelegramWithContext(context)(e.message);
      }
    }
  }
  if (message.text.startsWith("/")) {
    return sendMessageToTelegramWithContext(context)(`Oops! It's not a command.`);
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

// src/telegram/message.js
async function msgInitChatContext(message, context) {
  await context.initContext(message);
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
      idList = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.chatLastMessageIdKey) || "[]");
    } catch (e) {
      console.error(e);
    }
    if (idList.includes(message.message_id)) {
      return new Response("Ignore old message", { status: 200 });
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
async function msgCheckEnvIsReady(message, context) {
  if (!DATABASE) {
    return sendMessageToTelegramWithContext(context)("DATABASE Not Set");
  }
  return null;
}
async function msgFilterWhiteList(message, context) {
  if (ENV.I_AM_A_GENEROUS_PERSON) {
    return null;
  }
  if (context.SHARE_CONTEXT.chatType === "private") {
    if (!ENV.CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
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
      return sendMessageToTelegramWithContext(context)(
        `Your group are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`
      );
    }
    return null;
  }
  return sendMessageToTelegramWithContext(context)(
    `Not support chat type: ${context.SHARE_CONTEXT.chatType}`
  );
}
async function msgFilterUnsupportedMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE && (ENV.EXTRA_MESSAGE_CONTEXT && !message.reply_to_message.text)) {
    throw new Error("Not supported message type");
  }
  return null;
}
async function msgHandlePrivateMessage(message, context) {
  if ("private" !== context.SHARE_CONTEXT.chatType) {
    return null;
  }
  if (message.voice || message.audio || message.photo || message.document) {
    return null;
  }
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response("Non text message", { "status": 200 });
  }
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find((key) => message.text.startsWith(key));
  if (chatMsgKey) {
    message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }
  return null;
}
async function msgHandleGroupMessage(message, context) {
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response("Non text message");
  }
  if (!CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    return null;
  }
  let botName = context.SHARE_CONTEXT.currentBotName;
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(
    (key) => (message?.text || message?.caption || "").startsWith(key)
  );
  if (chatMsgKey) {
    message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }
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
    if (message.entities) {
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
    if (!mentioned && chatMsgKey) {
      mentioned = true;
    }
    if (!mentioned) {
      return new Response("No mentioned");
    } else {
      return null;
    }
  }
  throw new Error("Not set bot name");
}
async function msgInitUserConfig(message, context) {
  try {
    await context._initUserConfig(context.SHARE_CONTEXT.configStoreKey);
    const telegraphAccessTokenKey = context.SHARE_CONTEXT.telegraphAccessTokenKey;
    context.SHARE_CONTEXT.telegraphAccessToken = await DATABASE.get(telegraphAccessTokenKey);
    return null;
  } catch (e) {
    return sendMessageToTelegramWithContext(context)(e.message);
  }
}
async function msgIgnoreSpecificMessage(message) {
  if (ENV.IGNORE_TEXT && message?.text?.startsWith(ENV.IGNORE_TEXT)) {
    return new Response("ignore specific text", { status: 200 });
  }
  return null;
}
async function msgInitMiddleInfo(message, context) {
  try {
    context._info = await MiddleInfo.initInfo(message, context);
    if (context._info.msg_type && context._info.msg_type !== "text") {
      const msg = await sendMessageToTelegramWithContext(context)("file url get success.").then((r) => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    }
    return null;
  } catch (e) {
    console.log(e.message);
    return sendMessageToTelegramWithContext(context)(e.message);
  }
}
async function msgHandleCommand(message, context) {
  return await handleCommandMessage(message, context);
}
async function msgChatWithLLM(message, context) {
  let text = (message.text || message.caption || "").trim();
  if (ENV.EXTRA_MESSAGE_CONTEXT && (context.SHARE_CONTEXT.extraMessageContext?.text || context.SHARE_CONTEXT.extraMessageContext?.caption)) {
    text = "> " + (context.SHARE_CONTEXT.extraMessageContext?.text || "") + (context.SHARE_CONTEXT.extraMessageContext?.caption || "") + "\n" + text;
  }
  try {
    let result = null;
    for (let i = 0; i < context._info.process_count; i++) {
      if (result && result instanceof Response) {
        return result;
      }
      context._info.initProcess(context.USER_CONFIG);
      switch (context._info.process_type) {
        case "text:text":
          result = await chatWithLLM(text, context, null);
          break;
        case "text:image":
          {
            const gen = loadImageGen(context)?.request;
            if (!gen) {
              return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`);
            }
            setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
            result = await gen(context._info.lastStep.text || text, context);
            if (!context._info.isLastStep) {
              context._info.setFile(typeof result === "string" ? { url: result } : { raw: result });
            }
            const response = await sendPhotoToTelegramWithContext(context)(result);
            if (response.status != 200) {
              console.error(await response.text());
            }
          }
          break;
        case "audio:text":
          result = await chatViaFileWithLLM(context);
          break;
        case "image:text":
          result = await chatWithLLM(text, context, null, loadVisionLLM);
          break;
        case "audio:audio":
        case "text:audio":
        default:
          return sendMessageToTelegramWithContext(context)("unsupported type");
      }
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }
    }
  } catch (e) {
    console.error(e);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e.message}`);
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
    msgHandlePrivateMessage,
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

// src/tools/scheduleTask.js
async function schedule_detele_message(env) {
  try {
    initEnv(env);
    const scheduleDeteleKey = "schedule_detele_message";
    const scheduledData = JSON.parse(await DATABASE.get(scheduleDeteleKey) || "{}");
    for (const [bot_name, chats] of Object.entries(scheduledData)) {
      const bot_index = ENV.TELEGRAM_BOT_NAME.indexOf(bot_name);
      if (bot_index < 0)
        throw new Error("bot name is invalid");
      const bot_token = ENV.TELEGRAM_AVAILABLE_TOKENS[bot_index];
      if (!bot_token)
        throw new Error("bot token is null");
      for (const [chat_id, messages] of Object.entries(chats)) {
        const expired_msgs = messages.filter((msg) => msg.ttl <= /* @__PURE__ */ new Date()).map((msg) => msg.id);
        scheduledData[bot_name][chat_id] = messages.filter((msg) => msg.ttl > /* @__PURE__ */ new Date());
        await deleteMessagesFromTelegram(chat_id, bot_token, expired_msgs);
      }
    }
    await DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));
    return new Response('{ok:"true", message:"\u5B9A\u65F6\u4EFB\u52A1\u6267\u884C\u6210\u529F"}', { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e.message);
    return new Response(`{ok:"false", message:"\u5B9A\u65F6\u4EFB\u52A1\u6267\u884C\u5931\u8D25"}`, { headers: { "Content-Type": "application/json" } });
  }
}
var scheduleTask_default = { schedule_detele_message };

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
async function executeScheduleTask(request) {
  const taskname = request.body.taskname;
  if (!taskname || Object.keys(scheduleTask_default).includes(taskname) < 0) {
    return new Response(`taskname ${taskname} is not exist.`, { status: 400 });
  }
  const token = request.body.token;
  if (!ENV.TELEGRAM_AVAILABLE_TOKENS.includes(token))
    return new Response("Token is invalid.", { status: 403 });
  return await scheduleTask_default[taskname]();
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
  if (pathname.startsWith(`executeScheduleTask`)) {
    return executeScheduleTask(request);
  }
  if (ENV.DEV_MODE || ENV.DEBUG_MODE) {
    if (pathname.startsWith(`/telegram`) && pathname.endsWith(`/bot`)) {
      return loadBotInfo();
    }
  }
  return null;
}

// src/i18n/zh-hans.js
var zh_hans_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u4E2A\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u5F53\u524D\u652F\u6301\u4EE5\u4E0B\u547D\u4EE4:\n", "help": "\u83B7\u53D6\u547D\u4EE4\u5E2E\u52A9", "new": "\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "start": "\u83B7\u53D6\u4F60\u7684ID, \u5E76\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "img": "\u751F\u6210\u4E00\u5F20\u56FE\u7247, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/img \u56FE\u7247\u63CF\u8FF0`, \u4F8B\u5982`/img \u6708\u5149\u4E0B\u7684\u6C99\u6EE9`", "version": "\u83B7\u53D6\u5F53\u524D\u7248\u672C\u53F7, \u5224\u65AD\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]", "delenv": "\u5220\u9664\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6237\u914D\u7F6E, send /clearenv true", "system": "\u67E5\u770B\u5F53\u524D\u4E00\u4E9B\u7CFB\u7EDF\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5BF9\u8BDD, /redo \u52A0\u4FEE\u6539\u8FC7\u7684\u5185\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB" }, "detail": { "set": `/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]
  \u9009\u9879\u9884\u7F6E\u5982\u4E0B\uFF1A 
  -p \u8C03\u6574 SYSTEM_INIT_MESSAGE
  -m \u8C03\u6574 CHAT_MODEL
  -n \u8C03\u6574 MAX_HISTORY_LENGTH
  -a \u8C03\u6574 AI_PROVIDER
  -ai \u8C03\u6574 AI_IMAGE_PROVIDER
  -v \u8C03\u6574 OPENAI_VISION_MODEL
  -t \u8C03\u6574 OPENAI_TTS_MODEL
  
  \u53EF\u81EA\u884C\u8BBE\u7F6E MAPPING_KEY, \u4F7F\u7528\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u53EF\u8BBE\u7F6E\u503C MAPPING_KEY \u5BF9\u67D0\u4E9B\u5E38\u7528\u503C\u8FDB\u884C\u7B80\u5199\uFF0C\u540C\u6837\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u4F8B\u5982\uFF1AMAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
  \u5728\u4F7F\u7528/set\u65F6\u5FEB\u901F\u8C03\u6574\u53C2\u6570: /set -m r+ -v gpt-4o

  /set\u547D\u4EE4\u9ED8\u8BA4\u4E0D\u4F1A\u5C06\u4FEE\u6539\u7684\u53C2\u6570\u5B58\u50A8\uFF0C\u4EC5\u4E34\u65F6\u8C03\u6574\uFF0C\u5355\u6B21\u5BF9\u8BDD\u6709\u6548\uFF1B\u9700\u8981\u5B58\u50A8\u4FEE\u6539\u65F6\uFF0C\u8FFD\u52A0\u53C2\u6570-u
  /set\u547D\u4EE4\u8FFD\u52A0\u6587\u672C\u5904\u7406\u65F6\uFF0C\u9700\u8981\u952E\u5165\u6362\u884C\u6765\u8FDB\u884C\u5206\u5272\uFF0C\u53E6\u8D77\u4E00\u884C\u8F93\u5165\u5BF9\u8BDD\uFF0C\u4E0D\u6362\u884C\u65F6\u7C7B\u4F3C/setenv \u65E0\u6CD5\u7EE7\u7EED\u4E0E\u6A21\u578B\u5BF9\u8BDD
  \u9009\u9879\u4E0E\u53C2\u6570\u503C\u5747\u4E3A\u7A7A\u683C\u5206\u5272\uFF0C\u6545\u4E24\u8005\u672C\u8EAB\u4E0D\u80FD\u6709\u7A7A\u683C\uFF0C\u5426\u5219\u53EF\u80FD\u4F1A\u89E3\u6790\u51FA\u9519
  \u8C03\u6574SYSTEM_INIT_MESSAGE\u65F6\uFF0C\u82E5\u8BBE\u7F6E\u4E86PROMPT\u53EF\u76F4\u63A5\u4F7F\u7528\u8BBE\u7F6E\u4E3A\u89D2\u8272\u540D\uFF0C\u81EA\u52A8\u586B\u5145\u89D2\u8272prompt\uFF0C\u4F8B\u5982\uFF1A
  /set -p ~doctor -n 0
  \u53EF\u4F7F\u7528 TRIGGER\u8FDB\u884C\u518D\u6B21\u7B80\u5316:
  "~":"/set -p ~" \u8FD9\u6837\u5BF9\u8BDD\u65F6\u76F4\u63A5\u952E\u5165 ~doctor
\u4ECA\u5929\u6574\u4E2A\u4EBA\u660F\u6C89\u6C89\u7684\uFF0C\u6211\u9700\u8981\u5982\u4F55\u8C03\u7406\u8EAB\u4F53\uFF1F` } } };

// src/i18n/zh-hant.js
var zh_hant_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u500B\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u7576\u524D\u652F\u6301\u7684\u547D\u4EE4\u5982\u4E0B\uFF1A\n", "help": "\u7372\u53D6\u547D\u4EE4\u5E6B\u52A9", "new": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "start": "\u7372\u53D6\u60A8\u7684ID\u4E26\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "img": "\u751F\u6210\u5716\u7247\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/img \u5716\u7247\u63CF\u8FF0`\uFF0C\u4F8B\u5982`/img \u6D77\u7058\u6708\u5149`", "version": "\u7372\u53D6\u7576\u524D\u7248\u672C\u865F\u78BA\u8A8D\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8A2D\u7F6E\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8A2D\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u70BA /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set \u547D\u4EE4\u683C\u5F0F\u70BA /set \u9078\u9805 \u503C [\u9078\u9805 \u503C\u2026] [-u][\\n]", "delenv": "\u522A\u9664\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6236\u914D\u7F6E, \u53D1\u9001/clearenv true", "system": "\u67E5\u770B\u4E00\u4E9B\u7CFB\u7D71\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5C0D\u8A71 /redo \u52A0\u4FEE\u6539\u904E\u7684\u5167\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u547D\u4EE4\u683C\u5F0F\u70BA /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71" }, "detail": { "set": `/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]
  \u9009\u9879\u9884\u7F6E\u5982\u4E0B\uFF1A 
  -p \u8C03\u6574 SYSTEM_INIT_MESSAGE
  -o \u8C03\u6574 CHAT_MODEL
  -n \u8C03\u6574 MAX_HISTORY_LENGTH
  -a \u8C03\u6574 AI_PROVIDER
  -ai \u8C03\u6574 AI_IMAGE_PROVIDER
  -v \u8C03\u6574 OPENAI_VISION_MODEL
  -t \u8C03\u6574 OPENAI_TTS_MODEL
  
  \u53EF\u81EA\u884C\u8BBE\u7F6E MAPPING_KEY, \u4F7F\u7528\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u53EF\u8BBE\u7F6E\u503C MAPPING_KEY \u5BF9\u67D0\u4E9B\u5E38\u7528\u503C\u8FDB\u884C\u7B80\u5199\uFF0C\u540C\u6837\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u4F8B\u5982\uFF1AMAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
  \u5728\u4F7F\u7528/set\u65F6\u5FEB\u901F\u8C03\u6574\u53C2\u6570: /set -m r+ -v gpt-4o

  /set\u547D\u4EE4\u9ED8\u8BA4\u4E0D\u4F1A\u5C06\u4FEE\u6539\u7684\u53C2\u6570\u5B58\u50A8\uFF0C\u4EC5\u4E34\u65F6\u8C03\u6574\uFF0C\u5355\u6B21\u5BF9\u8BDD\u6709\u6548\uFF1B\u9700\u8981\u5B58\u50A8\u4FEE\u6539\u65F6\uFF0C\u8FFD\u52A0\u53C2\u6570-u
  /set\u547D\u4EE4\u8FFD\u52A0\u6587\u672C\u5904\u7406\u65F6\uFF0C\u9700\u8981\u952E\u5165\u6362\u884C\u6765\u8FDB\u884C\u5206\u5272\uFF0C\u53E6\u8D77\u4E00\u884C\u8F93\u5165\u5BF9\u8BDD\uFF0C\u4E0D\u6362\u884C\u65F6\u7C7B\u4F3C/setenv \u65E0\u6CD5\u7EE7\u7EED\u4E0E\u6A21\u578B\u5BF9\u8BDD
  \u9009\u9879\u4E0E\u53C2\u6570\u503C\u5747\u4E3A\u7A7A\u683C\u5206\u5272\uFF0C\u6545\u4E24\u8005\u672C\u8EAB\u4E0D\u80FD\u6709\u7A7A\u683C\uFF0C\u5426\u5219\u53EF\u80FD\u4F1A\u89E3\u6790\u51FA\u9519
  \u8C03\u6574SYSTEM_INIT_MESSAGE\u65F6\uFF0C\u82E5\u8BBE\u7F6E\u4E86PROMPT\u53EF\u76F4\u63A5\u4F7F\u7528\u8BBE\u7F6E\u4E3A\u89D2\u8272\u540D\uFF0C\u81EA\u52A8\u586B\u5145\u89D2\u8272prompt\uFF0C\u4F8B\u5982\uFF1A
  /set -p ~doctor -n 0
  \u53EF\u4F7F\u7528 TRIGGER\u8FDB\u884C\u518D\u6B21\u7B80\u5316:
  "~":"/set -p ~" \u8FD9\u6837\u5BF9\u8BDD\u65F6\u76F4\u63A5\u952E\u5165 ~doctor
\u4ECA\u5929\u6574\u4E2A\u4EBA\u660F\u6C89\u6C89\u7684\uFF0C\u6211\u9700\u8981\u5982\u4F55\u8C03\u7406\u8EAB\u4F53\uFF1F` } } };

// src/i18n/pt.js
var pt_default = { "env": { "system_init_message": "Voc\xEA \xE9 um assistente \xFAtil" }, "command": { "help": { "summary": "Os seguintes comandos s\xE3o suportados atualmente:\n", "help": "Obter ajuda sobre comandos", "new": "Iniciar uma nova conversa", "start": "Obter seu ID e iniciar uma nova conversa", "img": "Gerar uma imagem, o formato completo do comando \xE9 `/img descri\xE7\xE3o da imagem`, por exemplo `/img praia ao luar`", "version": "Obter o n\xFAmero da vers\xE3o atual para determinar se \xE9 necess\xE1rio atualizar", "setenv": "Definir configura\xE7\xE3o do usu\xE1rio, o formato completo do comando \xE9 /setenv CHAVE=VALOR", "setenvs": 'Definir configura\xE7\xF5es do usu\xE1rio em lote, o formato completo do comando \xE9 /setenvs {"CHAVE1": "VALOR1", "CHAVE2": "VALOR2"}', "delenv": "Excluir configura\xE7\xE3o do usu\xE1rio, o formato completo do comando \xE9 /delenv CHAVE", "clearenv": "Limpar todas as configura\xE7\xF5es do usu\xE1rio", "system": "Ver algumas informa\xE7\xF5es do sistema", "redo": "Refazer a \xFAltima conversa, /redo com conte\xFAdo modificado ou diretamente /redo", "echo": "Repetir a mensagem" }, "new": { "new_chat_start": "Uma nova conversa foi iniciada" } } };

// src/i18n/en.js
var en_default = { "env": { "system_init_message": "You are a helpful assistant" }, "command": { "help": { "summary": "The following commands are currently supported:\n", "help": "Get command help", "new": "Start a new conversation", "start": "Get your ID and start a new conversation", "img": "Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`", "version": "Get the current version number to determine whether to update", "setenv": "Set user configuration, the complete command format is /setenv KEY=VALUE", "setenvs": 'Batch set user configurations, the full format of the command is /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set command format is /set option value [option value...] [-u][\\n]", "delenv": "Delete user configuration, the complete command format is /delenv KEY", "clearenv": "Clear all user configuration, send /clearenv true", "system": "View some system information", "redo": "Redo the last conversation, /redo with modified content or directly /redo", "echo": "Echo the message", "mode": "the full format of the command is /mode NAME, when NAME=all, view all modes" }, "new": { "new_chat_start": "A new conversation has started" }, "detail": { "set": `/set The command format is /set Option Value [Option Value...] [-u][\\n]
 The option presets are as follows: 
 -p Adjust SYSTEM_INIT_MESSAGE
 -m Adjust CHAT_MODEL
 -n Adjust MAX_ HISTORY_LENGTH
 -a Adjust AI_PROVIDER
 -ai Adjust AI_IMAGE_PROVIDER
 -v Adjust OPENAI_VISION_MODEL
 -t Adjust OPENAI_TTS_MODEL
 
 You can set up the MAPPING_KEY by yourself, and use the half-corner for the MAPPING_KEY, split by half-corners,: options on the left, corresponding variables on the right 
 Can set the value MAPPING_KEY abbreviate some commonly used values, also split by half-corners,: options on the left, corresponding variables on the right 
 For example: MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+: command-r-plus' 
+. command-r-plus'
 Quickly adjust parameters when using /set: /set -m r+ -v gpt-4o

 /set command will not store modified parameters by default, only temporary adjustments, valid for a single conversation; when you need to store the changes, append the parameter -u
 /set command to append the text processing, you need to type a newline to split, start a new line and type the conversation without a newline. When you type in a newline to split the dialog, you can't continue the dialog with the model without a newline, similar to /setenv 
 Options and parameter values are split by spaces, so there can't be any spaces between the two, or else there may be parsing errors 
 Adjustment of the SYSTEM_INIT_MESSAGE, if you have set up a PROMPT you can use the set to the role name directly to automatically fill in the role Prompt, for example: 
 / set -p ~doctor -n 0
 Can use TRIGGER to simplify again:
 "~":"/set -p ~" so that when dialoguing, you can directly type ~doctor
 Today, the whole person is lethargic, how do I need to regulate my body?` } } };

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
    case "pt":
    case "pt-br":
      return pt_default;
    case "en":
    case "en-us":
      return en_default;
    default:
      return en_default;
  }
}

// src/tools/jina.js
var jina_reader = {
  schema: {
    "name": "jina_reader",
    "description": "Grab text content from provided URL links. Can be used to retrieve text information for web pages, articles, or other online resources",
    "parameters": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "The full URL address of the content to be crawled. Please remember to directly send a plain text JSON object string with only the key 'url'. For example: {'url': 'https://example.com/article'}"
        }
      },
      "required": ["url"]
    }
  },
  func: async ({ url }, { JINA_API_KEY }, signal) => {
    if (!url) {
      throw new Error("\u53C2\u6570\u9519\u8BEF");
    }
    if (!JINA_API_KEY) {
      throw new Error("JINA\\_API\\_KEY \u4E0D\u5B58\u5728");
    }
    console.log("jina-reader:", url);
    const startTime = Date.now();
    const result = await fetch("https://r.jina.ai/" + url, {
      headers: {
        "X-Return-Format": "text",
        "Authorization": `Bearer ${JINA_API_KEY}`,
        "X-Timeout": 10
      },
      ...signal && { signal } || {}
    });
    if (!result.ok) {
      throw new Error("Error: " + (await result.json()).message);
    }
    const time = ((Date.now() - startTime) / 1e3).toFixed(1) + "s";
    return { content: await result.text(), time };
  },
  type: "web_crawler"
};

// main.js
var main_default = {
  async fetch(request, env) {
    try {
      env.tools = { ...env.tools || {}, jina_reader };
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
