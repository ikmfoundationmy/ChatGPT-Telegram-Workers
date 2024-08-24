/* eslint-disable unused-imports/no-unused-vars */
import fs from 'node:fs';
import { createCache, startServer } from 'cloudflare-worker-adapter';
import cron from 'node-cron';
import toml from 'toml';
import worker from '../../main.js';

const {
  CONFIG_PATH = './config/config.json',
  TOML_PATH = './config/config.toml',
} = process.env;

let config = {
  database: {
    type: 'redis',
    uri: 'redis://localhost:6379',
  },
};
try {
  config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
} catch (e) {
  console.log('No config use default config');
}

const cache = await createCache(config?.database?.type, config?.database);
console.log(`database: ${config?.database?.type} is ready`);

// 定时任务
const raw = fs.readFileSync(TOML_PATH);
const env = { ...toml.parse(raw).vars, DATABASE: cache };
if (env.EXPIRED_TIME && env.EXPIRED_TIME > 0 && env.CRON_CHECK_TIME) {
  try {
    cron.schedule(env.CRON_CHECK_TIME, async () => {
      await worker.scheduled(null, env, null);
    });
  } catch (e) {
    console.error('Failed to schedule cron job:', e);
  }
}

startServer(
  8787,
  '0.0.0.0',
  TOML_PATH,
  { DATABASE: cache },
  { baseURL: config.server || process.env.DOMAIN },
  worker.initHander,
);
