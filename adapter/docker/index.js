import adapter from 'cloudflare-worker-adapter';
import { RedisCache } from 'cloudflare-worker-adapter/cache/redis.js';
import tools from "chatgpt-telegram-workers/tools";

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cache = new RedisCache(redisUrl);
const {default: worker} = await import('chatgpt-telegram-workers');

adapter.startServer(
    8787,
    '0.0.0.0',
    './config/config.toml',
    {DATABASE: cache},
    {server: process.env.DOMAIN},
    worker.fetch,
    {tools}
);
