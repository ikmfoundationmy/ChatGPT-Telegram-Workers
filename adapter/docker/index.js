import adapter from 'cloudflare-worker-adapter';
import { RedisCache } from 'cloudflare-worker-adapter/cache/redis.js';
import toml from 'toml';
import fs from 'fs';
import { default as worker } from 'chatgpt-telegram-workers';
import cron from 'node-cron';


const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cache = new RedisCache(redisUrl);

// 定时任务
const raw = fs.readFileSync('./config/config.toml');
const env = { ...toml.parse(raw).vars, DATABASE: cache };
// if (env.EXPIRED_TIME && env.EXPIRED_TIME >= 5) {
//   setInterval(async () => {
//     await worker.scheduled(null, env, null);
//   }, env.EXPIRED_TIME * 60 * 1000);
// }
if (env.EXPIRED_TIME && env.EXPIRED_TIME > 0 && env.CRON_CHECK_TIME) {
  try {
    cron.schedule(env.CRON_CHECK_TIME, async () => {
      await worker.scheduled(null, env, null);
    });
  } catch (e) {
    console.error('Failed to schedule cron job:', e);
  }
}

adapter.startServer(
  8787,
  '0.0.0.0',
  './config/config.toml',
  { DATABASE: cache },
  { server: process.env.DOMAIN },
  worker.initHander,
);
