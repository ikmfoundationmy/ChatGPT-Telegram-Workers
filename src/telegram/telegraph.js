import { DATABASE } from '../config/env.js';
import md2node from "../utils/md2node.js";

async function createAccount(author) {
  const { short_name = 'Mewo', author_name = 'A Cat' } = author || {};
  const url = `https://api.telegra.ph/createAccount?short_name=${short_name}&author_name=${author_name}`;
  const resp = await fetch(url).then((r) => r.json());
  if (resp.ok) {
    return {
      access_token: resp.result.access_token,
    };
  } else throw new Error('create telegraph account failed');
}

async function createOrEditPage(sendContext, title, content, author) {
  // const url = 'https://api.telegra.ph/createPage';
  const { url, access_token, path } = sendContext;
  const {short_name, author_name, author_url} = author;
  const body = {
    access_token,
    ...(path && { path } || {}),
    title: title || 'Daily Q&A',
    content: md2node(content),
    short_name: short_name || "anonymous",
    author_name: author_name || "anonymous",
    ...(author_url && { author_url } || {})
    // 'return_content': true,
  };
  const headers = { 'Content-Type': 'application/json' };
  return fetch(url, {
    method: 'post',
    headers,
    body: JSON.stringify(body),
  }).then((r) => r.json());
}

// async function editTelegraph(access_token, path, title, content, author_name) {
//   const url = 'https://api.telegra.ph/editPage';
//   const headers = { 'Content-Type': 'application/json' };
//   // const perfix_nodes = [
//   //   { tag: 'h3', children: ['Question'] },
//   //   { tag: 'blockquote', children: [content.question] },
//   //   { tag: 'hr' },
//   //   { tag: 'h3', children: ['Answer'] }];
  
//   const body = {
//     access_token,
//     path,
//     title,
//     author_name,
//     content: md2node(content.answer)
//     // 'return_content': true,
//   };

//   return fetch(url, {
//     method: 'post',
//     headers,
//     body: JSON.stringify(body),
//   }).then((r) => r.json());
// }

// function render(title, content) {
//   return [
//     { tag: 'h3', children: ['Question'] },
//     { tag: 'blockquote', children: [title] },
//     { tag: 'hr' },
//     { tag: 'h3', children: ['Answer'] },
//     { tag: 'pre', children: [content] },
//   ];
// }

async function sendTelegraph(context, title, content, author) {
  let endPoint = 'https://api.telegra.ph/editPage';
  let access_token = context.telegraphAccessToken;
  let path = context.telegraphPath;
  if (!access_token) {
    access_token = (await createAccount(author)).access_token;
    context.telegraphAccessToken = access_token;
    await DATABASE.put(context.telegraphAccessTokenKey, access_token);
  }
  const sendContext = { url: endPoint, access_token, path };

  if (!path) {
    sendContext.url = 'https://api.telegra.ph/createPage';
    const c_resp = await createOrEditPage(sendContext, title, content, author);
    if (c_resp.ok) {
      context.telegraphPath = c_resp.result.path;
      // console.log('telegraph url: ', c_resp.result.url);
      return c_resp;
    } else { console.error(c_resp.error); throw new Error(c_resp.error); }
  } else return createOrEditPage(sendContext, title, content, author);
}

export function sendTelegraphWithContext(context) {
  return async (title, content, author) => sendTelegraph(context.SHARE_CONTEXT, title, content, author);
}
