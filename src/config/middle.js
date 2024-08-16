import { ENV } from "./env.js";
import { getFileUrl } from '../telegram/telegram.js';
import {uploadImageToTelegraph} from "../utils/image.js";

/**
 * 提取消息类型与文件url
 *
 * @param {TelegramMessage} message
 * @returns {Promise<MsgInfo>}
 */
async function extractMessageType(message, botToken) {
  let msg = message;
  const acceptType = ENV.ENABLE_FILE ? ['photo', 'image', 'voice', 'audio', 'text'] : ['text'];
  let msgType = acceptType.find((key) => key in msg);

  if (msgType && msgType == 'text' && message.reply_to_message && ENV.EXTRA_MESSAGE_CONTEXT) {
    // 仅在开启EXTRA_MESSAGE_CONTEXT 且 触发对象消息类型为text 时尝试读取reply_message的文件
    const reply_message = message.reply_to_message;
    const reply_type = acceptType.find((key) => key in reply_message);
    if (reply_type && reply_type !== 'text') {
      msg = reply_message;
      msgType = reply_type;
    }
  }

  if (msgType === 'text') {
    return {
      msgType: 'text',
      fileType: 'text',
      text: message.text || message.caption,
    };
  }

  let fileType = msgType;
  if (msgType == 'voice') {
    fileType = 'audio';
  } else if (msgType == 'photo') {
    fileType = 'image';
  }
  if (msg?.document) {
    msgType = 'document';
    if (msg.document.mime_type.match(/image/)) {
      fileType = 'image';
    } else if (msg.document.mime_type.match(/audio/)) {
      fileType = 'audio';
    } 
  }

  if (!fileType) {
    throw new Error("Unsupported message type.");
  }

  let file_id = null;
  if (msgType == 'photo') {
    let sizeIndex = 0;
    if (ENV.TELEGRAM_PHOTO_SIZE_OFFSET >= 0) {
      sizeIndex = ENV.TELEGRAM_PHOTO_SIZE_OFFSET;
    } else if (ENV.TELEGRAM_PHOTO_SIZE_OFFSET < 0) {
      sizeIndex = msg.photo.length + ENV.TELEGRAM_PHOTO_SIZE_OFFSET;
    }
    sizeIndex = Math.max(0, Math.min(sizeIndex, msg.photo.length - 1));
    file_id = msg.photo[sizeIndex].file_id;
  } else {
    file_id = msg[msgType]?.file_id || null;
  }
  const info = {
    msgType,
    fileType,
    /*hasText: !!(message.text || msg.text || message.caption || msg.caption),*/
    file_url: null,
    text: message.text || message.caption,
  };
  if (file_id) {
    let file_url = await getFileUrl(file_id, botToken);
    if (!file_url) {
      throw new Error('file url get failed.');
    }
    
    if (ENV.TELEGRAPH_IMAGE_ENABLE && fileType === 'image') {
      file_url = await uploadImageToTelegraph(file_url);
    }

    info.file_url = file_url;
    console.log("file url: " + info.file_url);
  }

  return info;
}

/**
 * 下载文件
 * @return {Promise<Response>}
 */
export async function handleFile(_info) {
  let {raw, url, type} = _info.lastStep;
  const file_name = url?.split('/').pop();
  if (!raw && type !== 'image'){
    const file_resp = await fetch(url);
    if (file_resp.status !== 200) {
      throw new Error(`Get file failed: ${await file_resp.text()}`);
    }
    raw = await file_resp.blob();
  }
  return { raw, file_name };
}

/**
 * @description: 初始化中间信息
 * @return {*}
 */
export class MiddleInfo {
  constructor(USER_CONFIG, msg_info) {
    this.process_start_time = [Date.now()];
    this.token_info = [];
    this.processes = USER_CONFIG.MODES[USER_CONFIG.CURRENT_MODE]?.[msg_info.fileType] || [{}];
    this.step_index = 0;
    this.file = [
      {
        type: msg_info.fileType,
        url: msg_info.file_url,
        raw: null,
        text: msg_info.text,
      },
    ];
    this._bp_config = JSON.parse(JSON.stringify(USER_CONFIG)); // 备份用户配置
    this.process_type = null;
    this.call_info = '';
    this.model = null;
    this.msg_type = msg_info.fileType;
  }

  static async initInfo(message, { USER_CONFIG, SHARE_CONTEXT: { currentBotToken } }) {
    const msg_info = await extractMessageType(message, currentBotToken);
    return new MiddleInfo(USER_CONFIG, msg_info);
  }
  // token数据正常从1开始缓存 0为命令缓存
  setToken(prompt, complete) {
    if (!this.token_info[this.step_index]) {
      this.token_info[this.step_index] = [];
    }
    this.token_info[this.step_index].push({ prompt, complete });
  }
  get token() {
    return this.token_info[this.step_index];
  }

  get process_count() {
    return this.processes.length;
  }

  get isLastStep() {
    return this.process_count === this.step_index;
  }

  get isFirstStep() {
    return this.step_index === 1;
  }

  get message_title() {
    if (!this.model || !this.process_start_time[this.step_index]) {
      return '';
    }
    const show_info = this.processes?.[this.step_index - 1]?.show_info ?? this._bp_config.ENABLE_SHOWINFO;
    if (!show_info) return '';
    const step_count = this.process_count;
    const stepInfo = step_count > 1 ? `[STEP ${this.step_index}/${step_count}]\n` : '';
    const time = ((Date.now() - this.process_start_time[this.step_index]) / 1000).toFixed(1);

    let call_info = '';
    if (ENV.CALL_INFO) call_info = (this.call_info && (this.call_info + '\n')).replace('$$f_t$$', '');

    let info = stepInfo + call_info + `${this.model} ${time}s`;
    
    if (this.token && this.token.length > 0){
      info += `\nToken: ${this.token.map(Object.values).join('|')}`;
    }
    return info;
  }
  get lastStepHasFile() {
    if (this.step_index === 0) return false;
    return !!(this.file[this.step_index - 1].url || this.file[this.step_index - 1].raw);
  }
  get lastStep() {
    if (this.step_index === 0) {
      return {};
    }
    return {
      type: this.file[this.step_index - 1].type,
      url: this.file[this.step_index - 1].url,
      raw: this.file[this.step_index - 1].raw,
      text: this.file[this.step_index - 1].text,
    };
  }
  get provider() {
    if (this.step_index > 0 && this.processes?.[this.step_index - 1]?.['provider'] ) {
      return this._bp_config.PROVIDERS?.[this.processes[this.step_index - 1]['provider']];
    }
    return null;
  }
  setFile(file, index = this.step_index) {
    this.file[index] = file;
  }
  setCallInfo(message, type = 'f_i') {
    if (type === 'f_t') {
      this.call_info = this.call_info.replace('$$f_t$$', 'f_t: ' + message);
    } else if (type === 'c_t') {
      this.call_info = (this.call_info && (this.call_info + '\n')) + `c_t: ${message} $$f_t$$`;
    } else if (type === 'f_i') {
      this.call_info = (this.call_info && (this.call_info + '\n')) + message;
    } else {
      this.call_info += "\n" + message;
    } 
    
  }
  // 修改mode
  config(name, value = null) {
    if (name === 'mode') {
      this.processes = this._bp_config.MODES[value][this.msg_type];
    } // else this.processes[this.step_index][name] = value;
    else if (name === 'show_info') {
      this.processes[this.step_index - 1][name] = value;
    }
    else if (name === 'model') {
      this.model = value;
    }
  }
  updateStartTime() {
    this.process_start_time[this.step_index] = Date.now();
  }

  initProcess(USER_CONFIG) {
    console.log(`Init step ${this.step_index + 1}.`);

    this.step_index++;
    this.updateStartTime();
    this.call_info = '';
    
    if (this.step_index > 1) {
      USER_CONFIG = this._bp_config;
    }
   
    this.file[this.step_index] = null;
    this.model = this.processes[this.step_index - 1].model;
    this.process_type = this.processes[this.step_index - 1].process_type || `${this.file[this.step_index - 1].type}:text`;
    let chatType = null;
    let ai_provider = USER_CONFIG.AI_PROVIDER;
    if ('silicon' === ai_provider) {
      ai_provider = 'OPENAILIKE';
    }
    switch (this.process_type) {
      case 'text:text':
        chatType = 'CHAT';
        break;
      case 'text:image':
        chatType = 'IMAGE';
        break;
      case 'audio:text':
        chatType = 'STT';
        break;
      case 'image:text':
        chatType = 'VISION';
        break;
      default:
        throw new Error('unsupport type');
    }

    for (const [key, value] of Object.entries(this.processes[this.step_index - 1])) {
      switch (key) {
        case 'agent':
          USER_CONFIG.AI_PROVIDER = this.agent;
          break;
        case 'prompt':
          USER_CONFIG.SYSTEM_INIT_MESSAGE = ENV.PROMPT[value] || value;
          break;
        case 'model':
          if (this.model) {
            USER_CONFIG[`${ai_provider.toUpperCase()}_${chatType}_MODEL`] = this.model;
          }
          break;
        case 'provider':
          if (USER_CONFIG.PROVIDERS[value]) {
            USER_CONFIG[`${ai_provider}_API_BASE`] = USER_CONFIG.PROVIDERS[value]['base_url'];
            USER_CONFIG[`${ai_provider}_API_KEY`] = USER_CONFIG.PROVIDERS[value]['key'];
          }
          break;
        default:
          break;
      }
    }
  }
}
