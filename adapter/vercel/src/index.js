/* eslint-disable no-unused-vars */
import worker from '../../../main.js';
import { RedisCache } from '../utils/redis.js';
import Middle from './_middleware.js';
import {duckduckgo_search} from '../utils/duckduckgo.js';

export const config = {
  runtime: 'edge',
};

// cloudflare to vercel adapter
export default async (req, res) => {
  const result = Middle(req);
  if (result instanceof Response) {
    return result;
  }
  const redis = new RedisCache(process.env.REDIS_URL, process.env.REDIS_TOKEN);
  const env = {
    ...(process.env || {}),
    DATABASE: redis,
    tools: {duckduckgo_search}
  };
  const body = await req.text();
  const cfReq = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    ...(body && { body }),
  });

  // console.log(`url: ${req.url}`)
  // console.log(`body: ${JSON.stringify(req)}`);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const resp = await worker.fetch(cfReq, env);
        controller.enqueue(encoder.encode(await resp.text()));
        controller.close();
      } catch (e) {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
