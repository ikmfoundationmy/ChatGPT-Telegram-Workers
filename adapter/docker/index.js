import adapter from 'cloudflare-worker-adapter';
import { RedisCache } from 'cloudflare-worker-adapter/cache/redis.js';
import toml from 'toml';
import { default as worker } from 'chatgpt-telegram-workers';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cache = new RedisCache(redisUrl);

  // 定时任务
  const raw = fs.readFileSync('./config/config.toml');
  const env = { ...toml.parse(raw).vars, DATABASE: cache };
  if (env.SCHEDULE_TIME && env.SCHEDULE_TIME > 5) {
    setInterval(async () => {
      await worker.scheduled(null, env, null);
    }, env.SCHEDULE_TIME * 60 * 1000);
  }

adapter.startServer(
  8787,
  '0.0.0.0',
  './config/config.toml',
  { DATABASE: cache },
  { server: process.env.DOMAIN },
  worker.fetch,
);
