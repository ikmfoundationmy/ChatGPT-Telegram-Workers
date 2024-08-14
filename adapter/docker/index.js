import adapter from 'cloudflare-worker-adapter';
import { RedisCache } from 'cloudflare-worker-adapter/cache/redis.js';
import toml from 'toml';
import tasks from 'chatgpt-telegram-workers/task';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cache = new RedisCache(redisUrl);
const { default: worker } = await import('chatgpt-telegram-workers');

// 定时任务
const raw = fs.readFileSync('./config/config.toml');
const env = { ...toml.parse(raw).vars, DATABASE: cache };
if (env.SCHEDULE_TIME && env.SCHEDULE_TIME > 5) {
  setInterval(
    async () => {
      const promises = [];
      for (const task of Object.values(tasks)) {
        promises.push(task(env));
      }
      await Promise.all(promises);
    },
    env.SCHEDULE_TIME * 60 * 1000,
  );
}

adapter.startServer(
  8787,
  '0.0.0.0',
  './config/config.toml',
  { DATABASE: cache },
  { server: process.env.DOMAIN },
  worker.fetch,
);
