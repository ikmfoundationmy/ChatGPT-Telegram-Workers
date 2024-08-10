import { requestChatCompletions } from './request.js';
import { ENV } from '../config/env.js';
import { sendMessageToTelegramWithContext } from '../telegram/telegram.js';
import tools_settings from '../prompt/tools.js';

/**
 * 处理tool
 *
 * @param {TelegramMessage} message
 * @param {Context} context
 * @return {Promise<Response>}
 */
export async function handleOpenaiFunctionCall(url, header, body, prompt, context, onStream) {
  let final_tool_type = null;
  try {
    const filter_tools = context.USER_CONFIG.USE_TOOLS.filter((i) => Object.keys(ENV.TOOLS).includes(i)).map((t) => ENV.TOOLS[t]);
    if (filter_tools.length > 0) {
      let tools = filter_tools.map((tool) => {
        return {
          'type': 'function',
          'function': tool.schema,
          'strict': true,
        };
      });

      //默认使用的提示词与前缀
      let prompt = tools_settings.default.prompt;
      let call_url = url;
      if (context.USER_CONFIG.FUNCTION_CALL_BASE) {
        call_url = context.USER_CONFIG.FUNCTION_CALL_BASE + '/chat/completions';
      }
      const call_key = context.USER_CONFIG.FUNCTION_CALL_API_KEY;
      const call_headers = { ...header, ...((call_key && { Authorization: `Bearer ${call_key}` }) || {}) };

      const options = {
        fullContentExtractor: (d) => {
          return d.choices?.[0]?.message;
        },
      };

      const call_body = {
        model: context.USER_CONFIG.FUNCTION_CALL_MODEL,
        tools,
        tool_choice: 'auto',
        ...tools_settings.default.extra_params,
        messages: body.messages,
        stream: context.USER_CONFIG.FUNCTION_REPLY_ASAP,
      };
      let isOnstream = null;
      if (context.USER_CONFIG.FUNCTION_REPLY_ASAP) {
        delete call_body['max_tokens'];
        isOnstream = onStream;
      }

      if (prompt) {
        body.messages[0].content = prompt;
      } else body.messages.unshift({ role: 'system', content: prompt });

      // const call_messages = body.messages;
      let call_times = ENV.FUNC_LOOP_TIMES; //最多循环调用次数
      const opt = {};
      const exposure_vars = ['JINA_API_KEY'];
      exposure_vars.forEach((i) => (opt[i] = context.USER_CONFIG[i]));
      const original_question = body.messages.at(-1).content;
      const stopLoopType = 'web_crawler';
      const INFO_LENGTH_LIMIT = 80;
      let chatPromise = Promise.resolve();

      while (call_times > 0 && call_body.tools.length > 0) {
        const start_time = new Date();
        await chatPromise;
        setTimeout(() => {
          chatPromise = sendMessageToTelegramWithContext(context)(`\`chat with llm.\``);
        }, 0);
        const llm_resp = await requestChatCompletions(
          call_url,
          call_headers,
          call_body,
          context,
          isOnstream,
          null,
          options,
        );
        if (!llm_resp.tool_calls) {
          llm_resp.tool_calls = [];
        }
        llm_resp.tool_calls = llm_resp?.tool_calls?.filter((i) => Object.keys(ENV.TOOLS).includes(i.function.name));

        if (llm_resp.tool_calls.length === 0) {
          if (final_tool_type) call_body.messages[0].content = tools_settings[final_tool_type].prompt;
          if (call_times === ENV.FUNC_LOOP_TIMES) {
            // 第一次立即返回
            return { type: 'first_answer', message: llm_resp.content };
          } else return { type: 'next_answer', message: llm_resp.content };
        }
        context._info.setCallInfo(((new Date() - start_time) / 1000).toFixed(1) + 's', 'c_t');

        if (llm_resp.content?.startsWith('```json\n')) {
          llm_resp.content = llm_resp.content?.match(/\{[\s\S]+\}/)[0];
        }

        const funcPromise = [];
        const controller = new AbortController();
        const { signal } = controller;
        let timeoutID = null;
        if (ENV.FUNC_TIMEOUT > 0) {
          timeoutID = setTimeout(() => controller.abort(), ENV.FUNC_TIMEOUT * 1e3);
        }
        const raceTimeout = async (promises, ms = ENV.FUNC_TIMEOUT * 1e3) => {
          if (ms <= 0) return Promise.all(promises);
          return Promise.all(
            promises.map((p) => Promise.race([p, new Promise((resolve) => setTimeout(resolve, ms))])),
          ).then((results) => results.filter(Boolean));
        };
        let exec_times = ENV.CON_EXEC_FUN_NUM;
        await chatPromise;
        setTimeout(() => {
          chatPromise = sendMessageToTelegramWithContext(context)(`\`call ${llm_resp.tool_calls[0].function.name}\``);
        }, 0);
        for (const func of llm_resp.tool_calls) {
          if (exec_times <= 0) break;
          const name = func.function.name;
          call_body.tools = call_body.tools.filter((t) => t.function.name !== name);
          const args = JSON.parse(func.function.arguments);
          let args_i = Object.values(args).join();
          if (args_i.length > INFO_LENGTH_LIMIT) args_i = args_i.substring(0, INFO_LENGTH_LIMIT) + '...';
          context._info.setCallInfo(`${name}:${args_i}`, 'f_i');
          console.log('start use function: ', name);
          funcPromise.push(ENV.TOOLS[name].func(args, opt, signal));
          exec_times--;
        }

        const func_resp = await raceTimeout(funcPromise);
        if (timeoutID) clearTimeout(timeoutID);
        const func_time = [];
        const content_text = func_resp
          .map((r) => {
            func_time.push(r.time || '');
            return r.content || '';
          })
          .join('\n\n')
          .trim();
        console.log('func call content: ', content_text.substring(0, 500));
        if (func_time.join(' ').trim()) context._info.setCallInfo(func_time.join(), 'f_t');
        if (!content_text) {
          context._info.setCallInfo(`func call response is none or timeout.`);
          throw new Error('None response in func call.');
        }

        if (call_times === ENV.FUNC_LOOP_TIMES) call_body.messages.pop();
        final_tool_type = ENV.TOOLS[llm_resp.tool_calls[0].function.name].type;
        const render = tools_settings[final_tool_type].render;
        call_body.messages.push({
          role: 'user',
          content: render?.(original_question, content_text) || original_question + '\n\n' + content_text,
        });
        // if (tools_settings[final_tool_type].prompt) call_body.messages[0].content = tools_settings[final_tool_type].prompt;
        if (final_tool_type === stopLoopType) break;
        call_times--;
      }
      if (final_tool_type) {
        call_body.messages[0].content = tools_settings[final_tool_type].prompt;
        for (const [key, value] of Object.entries(tools_settings[final_tool_type].extra_params)) {
          body[key] = value;
        }
      }
      await chatPromise;
    }
    return { type: 'continue' };
  } catch (e) {
    console.error(e.message);
    if (final_tool_type) body.messages[0].content = tools_settings[final_tool_type].prompt;
    return { type: 'continue', message: e.message };
  }
}
