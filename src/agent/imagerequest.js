import { sendMediaGroupToTelegramWithContext } from "../telegram/telegram.js";
import { openaiLikeAgent } from "./openai.js";

const requestHander = {
  'silicon': requestImage2ImageFromSilicon
}


function requestImage2ImageFromSilicon(context, params) {
  const { prompt, images, batch_size, size, extra_params = {} } = params;
  const { style_name, num_inference_steps } = extra_params;
  const { url, key, model } = openaiLikeAgent(context, 'image2image');
  const body = {
    prompt,
    image: images[0],
    image_size: size,
    num_inference_steps: num_inference_steps || defaultParams.num_inference_steps,
    batch_size: batch_size || defaultParams.batch_size,
  };

  const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${key}`,
  };
  
  if (model.startsWith('stabilityai') || model.startsWith('ByteDance')) {
    body.guidance_scale = 7.5;
  } else if (model.startsWith('InstantX')) {
    delete body.image;
    delete body.image_size;
    delete body.batch_size;
    body.face_image = images[0];
    body.pose_image = images[1];
    body.style_name = style_name || 'Film Noir';
  } else if (model.startsWith('TencentARC')) {
    body.style_name = style_name || 'Photographic';
    body.guidance_scale = 5;
  } else if (model.startsWith('BeijingUltimatech')) {
    delete body.image;
    body.room_image = images[0];
    body.reference_style_image = images[1];
  } else throw new Error('unsupported model');

  return requestImage2Image(url, header, body, context);
  
}

async function requestImage2Image(url, header, body, context) {
  const controller = new AbortController();
  const { signal } = controller;
  
  let timeoutID = null;
  if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0) {
    timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT * 1e3);
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: header,
    body: body,
    signal,
  }).then(r => r.json());

  if (timeoutID) {
    clearTimeout(timeoutID);
  }

  if (resp.images && resp.images.length > 0) {
    return sendMediaGroupToTelegramWithContext(context)({type: 'photo', media: resp.images});
  } else {
    console.log(JSON.stringify(resp));
    throw new Error('No images return')
  };
  
}

const defaultParams = {
  batch_size: 1,
  num_inference_steps: 20,
  stabilityai: {
    image_size: ['1024x1024', '1024x2048', '1536x1024', '1536x2048', '1152x2048', '2048x1152'],
  }
}