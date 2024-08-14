/* eslint-disable no-unused-vars */
import adapter, {bindGlobal} from 'cloudflare-worker-adapter';
import {MemoryCache} from 'cloudflare-worker-adapter/cache/memory.js';
import fs from 'fs';
import HttpsProxyAgent from 'https-proxy-agent';
import fetch from 'node-fetch';
import { ENV } from '../../src/config/env.js';
import toml from 'toml';
import { default as worker } from '../../main.js';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// 配置数据库
let cache = new MemoryCache();
switch (config?.database?.type) {
  case 'local':
    // eslint-disable-next-line no-case-declarations
    const {LocalCache} = await import('cloudflare-worker-adapter/cache/local.js');
    cache = new LocalCache(config.database.uri);
    break;
  case 'sqlite':
    // eslint-disable-next-line no-case-declarations
    const {SqliteCache} = await import('cloudflare-worker-adapter/cache/sqlite.js');
    cache = new SqliteCache(config.database.uri);
    break;
  case 'redis':
    // eslint-disable-next-line no-case-declarations
    const {RedisCache} = await import('cloudflare-worker-adapter/cache/redis.js');
    cache = new RedisCache(config.database.uri);
    break;
  default:
    // eslint-disable-next-line no-case-declarations
    const {MemoryCache} = await import('cloudflare-worker-adapter/cache/memory.js');
    cache = new MemoryCache();
    break;
}

console.log(`database: ${config?.database?.type} is ready`);

// 配置代理
const proxy = config.https_proxy || process.env.https_proxy || process.env.HTTPS_PROXY;
if (proxy) {
  console.log(`https proxy: ${proxy}`);
  const agent = new HttpsProxyAgent(proxy);
  const proxyFetch = async (url, init) => {
    return fetch(url, {agent, ...init});
  };
  bindGlobal({
    fetch: proxyFetch,
  });
}

// 配置版本信息
try {
  const buildInfo = JSON.parse(fs.readFileSync('../../dist/buildinfo.json', 'utf-8'));
  ENV.BUILD_TIMESTAMP = buildInfo.timestamp;
  ENV.BUILD_VERSION = buildInfo.sha;
  console.log(buildInfo);

  // 定时任务
  const raw = fs.readFileSync('../../wrangler.toml');
  const env = { ...toml.parse(raw).vars, DATABASE: cache };
  if (env.SCHEDULE_TIME && env.SCHEDULE_TIME >= 5) {
    setInterval(async () => {
      await worker.scheduled(null, env, null);
    }, env.SCHEDULE_TIME * 60 * 1000);
  }

} catch (e) {
  console.log(e);
}

// const {default: worker} = await import('../../main.js');
adapter.startServer(
    config.port || 8787,
    config.host || '0.0.0.0',
    '../../wrangler.toml',
    {DATABASE: cache},
    {server: config.server},
    worker.fetch,
);
