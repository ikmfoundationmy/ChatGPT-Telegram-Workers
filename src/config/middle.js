import { ENV } from "./env.js";
import { getFileInfo } from "../telegram/telegram.js";

/**
 * 
 * @param {TelegramMessage} message 
 * @returns {MsgInfo}
 */
async function extractMessageType(message, botToken) {
  let msg = message;
  const acceptType = ['photo', 'image', 'voice', 'audio', 'text'];
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
  const fileType = msg?.document || msgType;
  if (!fileType) {
    throw new Error("Can't extractMessageType");
  }
  if (msg?.document) {
    if (msg.document.mime_type.match(/image/)) {
      msgType = 'image';
    } else if (msg.document.mime_type.match(/audio/)) {
      msgType = 'audio';
    } else {
      throw new Error('Unsupported File type');
    }
  }
  if (msgType == 'voice') {
    msgType = 'audio';
  } else if (msgType == 'photo') {
    msgType = 'image';
  }
  let file_id = null;
  if (fileType == 'photo') {
    const photoLength = msg[fileType].length;
    // 取最后一个文件，像素最高
    file_id = msg[fileType]?.[photoLength - 1]?.file_id || msg[fileType]?.file_id;
  } else {
    file_id = msg[fileType]?.file_id || null;
  }
  const info = { msgType, fileType, /*hasText: !!(message.text || msg.text || message.caption || msg.caption),*/ file_url: null, msgText: message.text || message.caption }
  if (file_id) {
    const file_info = await getFileInfo(file_id, botToken);
    if (!file_info.file_path) {
      console.log('[FILE FAILED]: ' + msgType);
      throw new Error("file url get failed.");
    }
    info.file_url = `${ENV.TELEGRAM_API_DOMAIN}/file/bot${botToken}/${file_info.file_path}`;
  }
  // console.log('file url:', file_url);
  return info;
}

/**
 * @description: 初始化中间信息
 * @return {*}
 */
export class MiddleInfo {
  constructor (USER_CONFIG, msg_info) {
    this.process_start_time = [new Date()];
    this.token_info = [];
    this.process_info = {};
    this.step_index = 0;
    // const msg_info = await extractMessageType(message, currentBotToken);
    this.file = [{
      type: msg_info.fileType,
      url: msg_info.file_url,
      raw: null,
      text: msg_info.text,
    }];
    this.msg_type = msg_info.msgType; // tg消息类型 text audio image
    this._bp_config = { ...USER_CONFIG }; // 备份用户配置
    this.mode_name = USER_CONFIG.CURRENT_MODE;
    this.model = null;
  }

  static async initInfo(message, { USER_CONFIG, SHARE_CONTEXT: { currentBotToken } }) {
    const msg_info = await extractMessageType(message, currentBotToken);
    return new MiddleInfo(USER_CONFIG, msg_info);
  }

  setToken(prompt, complete) {
    this.token_info[this.step_index] = { prompt, complete };
  }

  get process_count() {
    return this._bp_config.MODES?.[this.mode_name]?.[this.msg_type]?.length ?? 1;
  }

  get isLastStep() {
    return this.process_count === this.step_index;
  }

  get isFirstStep() {
    return this.step_index === 1;
  }

  get message_title() {
    if (!this.model || this.step_index === 0) {
      return '';
    }
    const step_count = this.process_count;
    const stepInfo = step_count > 1 ? `[STEP ${this.step_index}/${step_count}]\n` : '';
    if (!ENV.ENABLE_SHOWINFO) {
      return stepInfo.trim();
    }
    const time = ((new Date() - this.process_start_time[this.step_index]) / 1000).toFixed(1);
    let info = stepInfo + `${this.model} ${time}s`
    if (ENV.ENABLE_SHOWTOKENINFO && this.token_info[this.step_index]) {
      info += `\nToken: ${Object.values(this.token_info[this.step_index]).join(' | ')}`;
    }
    return info;
  }
  get lastStepHasFile() {
    return !!(this.file[this.step_index - 1].url || this.file[this.step_index - 1].raw);
  }
  get lastStep() {
    return {
      url: this.file[this.step_index - 1].url,
      raw: this.file[this.step_index - 1].raw,
      text: this.file[this.step_index - 1].text,
    }
  }
  get provider() {
    return this._bp_config.PROVIDERS?.[this.process_info['PROVIDER']] || null;
  }
  setFile(file, index = this.step_index) {
    this.file[index] = file;
  }

  // 仅缓存model信息 为后续info提供数据
  config(name, value = null) {
    switch (name) {
      case 'model':
        if (this.step_index === 0 || !this.model) this.model = value;
        return this.model;
        break;
      case 'mode':
        this.mode_name = value;
        return this.mode_name;
        break;
      case 'prompt':
        return ENV.PROMPT[this.process_info?.PROMPT] || value;
      default:
        return this.process_info[name] || value;
        break;
    }
  }

  // recoverUserConfig(user_config) {
  //   user_config = { ...(this._bp_config) };
  // }

  initProcess() {
    this.process_start_time.push(new Date());
    this.step_index++;
    this.token_info[this.current_step_index] = null;
    this.process_info = { ...(this._bp_config.MODES?.[this.mode_name]?.[this.msg_type]?.[this.step_index - 1] || {}) }
    // 为第一个流程且模型参数被修改则使用现有模型
    this.model = (this.current_step_index == 1 && this.model) ? this.model : this.process_info.MODEL;
    console.log(`Init step ${this.step_index} success.`);
  }
}