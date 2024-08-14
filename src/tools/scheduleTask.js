import { deleteMessagesFromTelegram } from '../telegram/telegram.js';
import { parseArray } from "../config/env.js";

async function schedule_detele_message(ENV) {
  try {
    console.log("- Start task: schedule_detele_message");
    const DATABASE = ENV.DATABASE;
    const scheduleDeteleKey = 'schedule_detele_message';
    const scheduledData = JSON.parse((await DATABASE.get(scheduleDeteleKey)) || '{}');
    let botTokens = [];

    if (typeof ENV.TELEGRAM_AVAILABLE_TOKENS === 'string') {
      botTokens = parseArray(ENV.TELEGRAM_AVAILABLE_TOKENS);
    } else botTokens = ENV.TELEGRAM_AVAILABLE_TOKENS;

    const taskPromises = [];

    for (const [bot_name, chats] of Object.entries(scheduledData)) {
      const bot_index = ENV.TELEGRAM_BOT_NAME.indexOf(bot_name);
      if (bot_index < 0) throw new Error('bot name is invalid');
      const bot_token = botTokens[bot_index];
      if (!bot_token) throw new Error('bot token is null');
      for (const [chat_id, messages] of Object.entries(chats)) {
        if (messages.length === 0) continue;

        const expired_msgs = messages.filter((msg) => msg.ttl <= Date.now()).map((msg) => msg.id).flat();
        if (expired_msgs.length === 0) continue;

        scheduledData[bot_name][chat_id] = messages.filter((msg) => msg.ttl > Date.now());

        console.log(`Start delete: ${chat_id} - ${expired_msgs}`);

        // 每次最多只能删除100条
        for (let i = 0; i < expired_msgs.length; i += 100) {
          taskPromises.push(deleteMessagesFromTelegram(chat_id, bot_token, expired_msgs.slice(i, i + 100)));
        }
      }
    }
    
    const resp = await Promise.all(taskPromises);
    for (const [i, { ok, description }] of Object.entries(resp)) {
      if (ok) {
        console.log(`task ${+i + 1}: delete successful`);
      } else {
        console.error(`task {i+1}: ${description}`);
      }
    }

    await DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));
    return new Response(`{ok:"true"}`, { headers: { 'Content-Type': "application/json" } });
  } catch (e) {
    console.error(e.message);
    return new Response(`{ok:"false"}`, { headers: { 'Content-Type': "application/json" } });
  }
}

export default { schedule_detele_message };
