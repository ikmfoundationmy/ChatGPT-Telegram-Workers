/* eslint-disable no-unused-vars */
import worker from 'chatgpt-telegram-workers';
import Middle from './_middleware.js';

export const config = {
  runtime: 'edge',
};

// cloudflare to vercel adapter
export default async (req, res) => {
  const result = Middle(req);
  if (result instanceof Response) {
    return result;
  }
  const env = process.env;

  // 兼容之前的环境变量名
  env.UPSTASH_REDIS_REST_URL ||= process.env.REDIS_URL;
  env.UPSTASH_REDIS_REST_TOKEN ||= process.env.REDIS_TOKEN;

  const body = await req.text();
  const cfReq = new Request(req.url, {
    method: req.method,
    headers: req.headers,
    ...(body && { body }),
  });

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
