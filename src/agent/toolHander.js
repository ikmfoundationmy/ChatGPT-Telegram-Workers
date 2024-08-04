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
export async function handleOpenaiFunctionCall(url, header, body, context) {
  try {
    const filter_tools = ENV.USE_TOOLS.filter((i) => Object.keys(ENV.TOOLS).includes(i)).map((t) => ENV.TOOLS[t]);
    if (filter_tools.length > 0) {
      let tools = filter_tools.map((tool) => {
        return {
          'type': 'function',
          'function': tool.schema,
        };
      });

      //默认使用的提示词与前缀
      let prompt = ENV.PROMPT['tools_prompt'];
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
        messages: body.messages,
        stream: false,
      };

      // if (prompt.includes('json') || prompt.includes('JSON')) {
      //   body.response_format = {
      //     'type': 'json_object',
      //   };
      // }
      if (body.messages[0].role === context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE) {
        body.messages[0].content = prompt;
      } else body.messages.unshift({ role: 'system', content: prompt });

      const call_messages = body.messages;
      let call_times = ENV.FUNC_LOOP_TIMES; //最多循环调用次数
      const opt = {};
      const exposure_vars = ['JINA_API_KEY'];
      exposure_vars.forEach((i) => (opt[i] = context.USER_CONFIG[i]));
      const original_question = body.messages.at(-1).content;
      let final_prompt = context.USER_CONFIG.SYSTEM_INIT_MESSAGE;
      while (call_times > 0) {
        const start_time = new Date();
        const llm_resp = await requestChatCompletions(call_url, call_headers, call_body, context, null, null, options);
        context._info.setCallInfo('call_time: ' + ((new Date() - start_time) / 1000).toFixed(1) + 's');
        sendMessageToTelegramWithContext(context)('...');
        llm_resp.tool_calls =
          llm_resp?.tool_calls?.filter((i) => Object.keys(ENV.TOOLS).includes(i.function.name)) || [];
        if (llm_resp.content?.startsWith('```json\n')) {
          llm_resp.content = llm_resp.content?.match(/\{[\s\S]+\}/)[0];
        }

        if (llm_resp.tool_calls.length === 0 || llm_resp.content?.startsWith?.('NO_CALL_NEEDED')) {
          console.log('No need call function.');
          body.messages[0].content = final_prompt;
          return { type: 'continue', message: 'No need call function.' };
          // return false;
        }

        if (llm_resp?.content?.startsWith?.('NEED_MORE_INFO:')) {
          return { type: 'stop', message: llm_resp.content.substring('NEED_MORE_INFO:'.length) };
          // return llm_resp.content.substring('NEED_MORE_INFO:'.length);
        }

        const funcPromise = [];
        for (const func of llm_resp.tool_calls) {
          const name = func.function.name;
          const args = JSON.parse(func.function.arguments);
          context._info.setCallInfo(`${name}:\n${Object.values(args).join().substring(0,30)}...`);
          console.log('start use function: ', name);
          funcPromise.push(ENV.TOOLS[name].func(args, opt));
        }

        const func_resp = await Promise.all(funcPromise);
        const func_time = [];
        const content_text = func_resp
          .map((r) => {
            func_time.push(r.time || '');
            return r.content || '';
          })
          .join('\n\n')
          .trim();
        if(func_time.join(' ').trim()) context._info.setCallInfo(`time: ${func_time.join()}`);
        if(content_text === '') {
          return { type: 'continue', message: 'None response in func call.' };
          // throw new Error(llm_resp.content.substring('None response in func call.'));
        }
        call_messages.pop();
        const tool_type = ENV.TOOLS[llm_resp.tool_calls[0].function.name].type;
        const render = tools_settings[tool_type].render;
        call_messages.push({
          role: 'user',
          content: render?.(original_question, content_text) || original_question + '\n\n' + content_text,
        });
        if (tools_settings[tool_type].prompt) final_prompt = tools_settings[tool_type].prompt;
        call_times--;
      }
      body.messages[0].content = final_prompt;
    }
    return { type: 'continue' };
    // return false;
  } catch (e) {
    // throw new Error(e.message);
    return { type: 'error', message: e.message };
  }
}
