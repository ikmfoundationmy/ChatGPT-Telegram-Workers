import { deleteMessagesFromTelegram } from '../telegram/telegram.js';
import { initEnv, ENV, DATABASE } from '../config/env.js';

async function schedule_detele_message(env) {
  try {
    initEnv(env);
    const scheduleDeteleKey = 'schedule_detele_message';
    const scheduledData = JSON.parse((await DATABASE.get(scheduleDeteleKey)) || '{}');

    for (const [bot_name, chats] of Object.entries(scheduledData)) {
      const bot_index = ENV.TELEGRAM_BOT_NAME.indexOf(bot_name);
      if (bot_index < 0) throw new Error('bot name is invalid');
      const bot_token = ENV.TELEGRAM_AVAILABLE_TOKENS[bot_index];
      if (!bot_token) throw new Error('bot token is null');
      for (const [chat_id, messages] of Object.entries(chats)) {
        const expired_msgs = messages.filter((msg) => msg.ttl <= new Date()).map((msg) => msg.id);
        scheduledData[bot_name][chat_id] = messages.filter((msg) => msg.ttl > new Date());
        await deleteMessagesFromTelegram(chat_id, bot_token, expired_msgs);
      }
    }

    await DATABASE.put(scheduleDeteleKey, JSON.stringify(scheduledData));

    return new Response('{ok:"true", message:"定时任务执行成功"}', { headers: { 'Content-Type': "application/json" } });
  } catch (e) {
    console.error(e.message);
    return new Response(`{ok:"false", message:"定时任务执行失败"}`, { headers: { 'Content-Type': "application/json" } });
  }
}

export default { schedule_detele_message };
