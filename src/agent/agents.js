import {isOpenAIEnable, requestCompletionsFromOpenAI, requestImageFromOpenAI, requestTranscriptionFromOpenAI} from "./openai.js";
import {isWorkersAIEnable, requestCompletionsFromWorkersAI, requestImageFromWorkersAI} from "./workersai.js";
import {isGeminiAIEnable, requestCompletionsFromGeminiAI} from "./gemini.js";
import {isMistralAIEnable, requestCompletionsFromMistralAI} from "./mistralai.js";
import {isCohereAIEnable, requestCompletionsFromCohereAI} from "./cohere.js";
import {isAnthropicAIEnable, requestCompletionsFromAnthropicAI} from "./anthropic.js";
import {
    isAzureEnable,
    isAzureImageEnable,
    requestCompletionsFromAzureOpenAI,
    requestImageFromAzureOpenAI
} from "./azure.js";
import "../types/context.js";

/**
 *
 * @typedef {function} ChatAgentRequest
 * @param {string} message
 * @param {string} prompt
 * @param {Array} history
 * @param {ContextType} context
 * @param {function} onStream
 * @return {Promise<string>}
 * */
/**
 * @typedef {object} ChatAgent
 * @property {string} name
 * @property {function} enable
 * @property {ChatAgentRequest} request
 */
/**
 * @type {ChatAgent[]}
 */
export const chatLlmAgents = [
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

/**
 * @param {string} agentName
 * @param {ContextType} context
 * @returns {null|string}
 */
export function currentChatModel(agentName, context) {
    switch (agentName) {
        case "azure":
            try {
                const url = new URL(context.USER_CONFIG.AZURE_COMPLETIONS_API);
                return url.pathname.split("/")[3];
            } catch  {
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

/**
 * @param {string} agentName
 * @returns {null|string}
 */
export function chatModelKey(agentName) {
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

/**
 * 提取模型等信息
 * @param {UserConfigType} config
 * @return {string} info
 */
export function customInfo(config) {
  let info = `MODE: ${config.CURRENT_MODE}`;
  const PROCESS = config.MODES[config.CURRENT_MODE] || [];
  for (const [k, v] of Object.entries(PROCESS)) {
    info +=
      `\n- ${k}\n` +
      ' '.repeat(4) +
      v
        .map((i) => {
          if (Object.keys(i).indexOf('API_KEY') > -1) {
            delete i.API_KEY;
            delete i.PROXY_URL;
          }
          return Object.values(i).join(' ') || `${k}:text`;
        })
        .join('\n' + ' '.repeat(4));
  }
  return info;
}


/**
 * 加载聊天AI
 *
 * @param {ContextType} context
 * @return {ChatAgent | null}
 */
export function loadChatLLM(context) {
    const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
    for (const llm of chatLlmAgents) {
        if (llm.name === AI_PROVIDER) {
            return llm;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const llm of chatLlmAgents) {
        if (llm.enable(context)) {
            context.USER_CONFIG.AI_PROVIDER = llm.name;
            return llm;
        }
    }
    return null;
}



export const visionLlmAgents = [
  // 当前仅实现OpenAI图像识别
  {
      name: "openai",
      enable: isOpenAIEnable,
      request: requestCompletionsFromOpenAI
  }
]

/**
 * 加载图像识别AI
 *
 * @param {ContextType} context
 * @return {ChatAgent | null}
 */
export function loadVisionLLM(context) {
    const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
    for (const llm of visionLlmAgents) {
        if (llm.name === AI_PROVIDER) {
            return llm;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const llm of chatLlmAgents) {
        if (llm.enable(context)) {
            return llm;
        }
    }
    return null;
}


export const audioLlmAgents = [
  // 当前仅实现OpenAI音频处理
  {
      name: "openai",
      enable: isOpenAIEnable,
      request: requestTranscriptionFromOpenAI
  }
]

/**
 * 加载音频转录AI
 *
 * @param {ContextType} context
 * @return {ChatAgent | null}
 */
export function loadAudioLLM(context) {
    const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
    for (const llm of audioLlmAgents) {
        if (llm.name === AI_PROVIDER) {
            return llm;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const llm of audioLlmAgents) {
        if (llm.enable(context)) {
            return llm;
        }
    }
    return null;
}


/**
 *
 * @typedef {function} ImageAgentRequest
 * @param {string} prompt
 * @param {ContextType} context
 */
/**
 * @typedef {object} ImageAgent
 * @property {string} name
 * @property {function} enable
 * @property {ImageAgentRequest} request
 */
/**
 * @type {ImageAgent[]}
 */
export const imageGenAgents = [
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


/**
 * 加载图片AI
 *
 * @param {ContextType} context
 * @return {ImageAgent | null}
 */
export function loadImageGen(context) {
    const AI_IMAGE_PROVIDER = context.USER_CONFIG.AI_IMAGE_PROVIDER;
    for (const imgGen of imageGenAgents) {
        if (imgGen.name === AI_IMAGE_PROVIDER) {
            return imgGen;
        }
    }
    // 找不到指定的AI，使用第一个可用的AI
    for (const imgGen of imageGenAgents) {
        if (imgGen.enable(context)) {
            return imgGen;
        }
    }
    return null;
}

/**
 * @param {string} agentName
 * @param {ContextType} context
 * @returns {null|string}
 */
export function currentImageModel(agentName, context) {
    switch (agentName) {
        case "azure":
            try {
                const url = new URL(context.USER_CONFIG.AZURE_DALLE_API);
                return url.pathname.split("/")[3];
            } catch  {
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

/**
 * @param {string} agentName
 * @returns {null|string}
 */
export function imageModelKey(agentName) {
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
