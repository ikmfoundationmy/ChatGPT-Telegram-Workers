import '../types/context.js';
import { cohereSseJsonParser, Stream } from './stream.js';
import { ENV } from '../config/env.js';
import { requestChatCompletions } from './request.js';

/**
 * @param {ContextType} context
 * @return {boolean}
 */
export function isCohereAIEnable(context) {
  return !!context.USER_CONFIG.COHERE_API_KEY;
}

/**
 * 发送消息到Cohere AI
 *
 * @param {string} message
 * @param {string} prompt
 * @param {Array} history
 * @param {ContextType} context
 * @param {function} onStream
 * @return {Promise<string>}
 */
export async function requestCompletionsFromCohereAI(message, prompt, history, context, onStream) {
  const url = `${context.USER_CONFIG.COHERE_API_BASE}/chat`;
  const model = context.USER_CONFIG.COHERE_CHAT_MODEL;
  const header = {
    'Authorization': `Bearer ${context.USER_CONFIG.COHERE_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': onStream !== null ? 'text/event-stream' : 'application/json',
  };

  const roleMap = {
    'assistant': 'CHATBOT',
    'user': 'USER',
  };

  let connectors = [];
  Object.entries(ENV.COHERE_CONNECT_TRIGGER).forEach(([id, triggers]) => {
    const result = triggers.some((trigger) => {
      const triggerRegex = new RegExp(trigger, 'i');
      return triggerRegex.test(message);
    });
    if (result) connectors.push({ id });
  });

  const body = {
    message,
    model,
    stream: onStream != null,
    preamble: prompt,
    chat_history: history.map((msg) => {
      return {
        role: roleMap[msg.role],
        message: msg.content,
      };
    }),
    ...(connectors.length && { connectors }),
  };
  if (!body.preamble) {
    delete body.preamble;
  }

  /**
   * @type {SseChatCompatibleOptions}
   */
  const options = {};
  options.streamBuilder = function (r, c) {
    return new Stream(r, c, null, cohereSseJsonParser);
  };
  options.contentExtractor = function (data) {
    return data?.text;
  };
  options.fullContentExtractor = function (data) {
    return data?.text;
  };
  options.errorExtractor = function (data) {
    return data?.message;
  };
  return requestChatCompletions(url, header, body, context, onStream, null, options);
}
