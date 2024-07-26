import { ENV } from "./env.js";
/**
 * 
 * @param {TelegramMessage} message 
 * @returns {MsgInfo}
 */
function extractMessageType(message) {
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
  return { msgType, fileType, hasText: !!(message.text || msg.text || message.caption || msg.caption), file_id };
}

/**
 * @description: 初始化中间信息
 * @return {*}
 */
export class MiddleInfo {
  constructor(message, context) {
    this.process_start_time = new Date();
    this._token_info = { prompt: 0, completion: 0 }; // token信息
    this.elapsed_sec = 0; // 当前流程消耗秒数

    this.mode_name = context?.CURRENT_MODE || 'default'; // 当前模式名
    this.current_step_index = 0;
    this.orignal_msg_info = extractMessageType(message);
    MiddleInfo.initProcesses.call(this, context);
    this.process_info = null; // 流程初始化时加载
    this.original_text = message.text || (message.caption ? 'caption: ' + message.caption : ''); // 原始消息文本
    this.file_uri = ''; // 原始消息文件uri
    this.file_raw = ''; // 原始消息文件

    this.prestep_text = ''; // 上一步生成的文本
    this.prestep_file_uri = ''; // 上一步生成的文件uri
    this.prestep_file_raw = ''; // 上一步生成的文件原数据
  }

  tokenUpdate(token_info) {
    if (ENV.ENABLE_SHOWINFO && ENV.ENABLE_SHOWTOKENINFO) {
      this._token_info = token_info;
    }
  }
  isLastStep() {
    if (!this.process_info) {
      return true;
    }
    return this.processes.length == this.current_step_index;
  }

  isFirstStep() {
    if (!this.process_info) {
      return true;
    }
    return this.current_step_index === 1;
  }

  get message_title() {
    if (!this.process_info) {
      return '';
    }
    const stepInfo = this.processes.length > 1 ? `[STEP ${this.current_step_index}/${this.processes.length}]\n` : '';
    if (!ENV.ENABLE_SHOWINFO) {
      return stepInfo.trim();
    }
    const showToken = ENV.ENABLE_SHOWTOKENINFO;
    const line1Format = '{model} {time}';
    const line2Format = 'Token: {prompt} | {completion}';
    return (
      stepInfo +
      (showToken && this._token_info.prompt ? line1Format + '\n' + line2Format : line1Format)
        .replace('{model}', this.process_info.MODEL)
        .replace('{time}', ((new Date() - this.process_start_time) / 1000).toFixed(1) + 's')
        .replace('{prompt}', this._token_info.prompt)
        .replace('{comcompletionpl}', this._token_info.completion)
    );
  }
  static initProcesses(USER_CONFIG) {
    const msgType = this.orignal_msg_info?.msgType;
    if (this.mode_name && msgType) {
      const defaultModeInfo = { text: [{}], image: [{}], audio: [{}, { TYPE:'text:text'}] };
      this.processes = (USER_CONFIG.MODES[this.mode_name]?.[msgType] || defaultModeInfo[msgType]).map((i) => ({
        ...i,
      }));
    }
  }
  updateProcess(USER_CONFIG, k, v) {
    // 流程优先级高于用户配置, 以下场景出现临时修改配置未能生效: 修改模型数据，但MODE中已指定模型
    switch (k) {
      case 'CURRENT_MODE':
        this.mode_name = v;
        MiddleInfo.initProcesses.call(this, USER_CONFIG);
        break;
      case 'AI_PROVIDER':
      case 'ROLE': // TODO
        this.processes[this.current_step_index][k] = v; // 目前修改流程时机仅在未初始化时，故直接修改总流程
        break;
      default:
        break;
    }
  }
  initProcess(USER_CONFIG) {
    this.startTime = new Date();
    this.process_info = this.processes[this.current_step_index];
    this.current_step_index++;
    if (!this.process_info?.TYPE) {
      this.process_info.TYPE = `${this.orignal_msg_info.msgType}:text`;
    }

    if (!this.process_info?.AI_PROVIDER) {
      this.process_info.AI_PROVIDER = USER_CONFIG.AI_PROVIDER === 'auto' ? 'openai' : USER_CONFIG.AI_PROVIDER;
    }

    const provider_up = this.process_info.AI_PROVIDER.toUpperCase();
    const provider_source = USER_CONFIG.PROVIDER_SOURCES[this.process_info.PROVIDER_SOURCE || 'default'];
    this.process_info.PROXY_URL = provider_source?.['PROXY_URL'] || USER_CONFIG?.[`${provider_up}_API_BASE`];

    this.process_info.API_KEY = provider_source?.['API_KEY'] || USER_CONFIG?.[`${provider_up}_API_KEY`];
    if (!this.process_info?.MODEL) {
      switch (this.process_info.TYPE) {
        case 'text:text':
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_CHAT_MODEL`] || USER_CONFIG.CHAT_MODEL;
          break;
        case 'text:image':
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_IMAGE_MODEL`] || USER_CONFIG.DALL_E_MODEL;
          break;
        case 'audio:text':
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_STT_MODEL`] || USER_CONFIG.OPENAI_STT_MODEL;
          break;
        case 'image:text':
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_VISION_MODEL`] || USER_CONFIG.OPENAI_VISION_MODEL;
          break;
        case 'text:audio':
          this.process_info.MODEL = USER_CONFIG[`${provider_up}_TTS_MODEL`] || USER_CONFIG.OPENAI_TTS_MODEL;
          break;
        case 'audio:audio':
        default:
          throw new Error('unsupported type');
      }
    }
    console.log(`Init step ${this.current_step_index} success.`);
  }
}