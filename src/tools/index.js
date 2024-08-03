import {duckduckgo_search} from "./duckduckgo.js";
import {jina_reader} from "./jina.js";
export default { duckduckgo_search, jina_reader };


// export class Chains{
//   constructor (question, { tool:{func, messages, settings} }) {
//     // this.question = question;
//     this.settings = {
//       before_model: settings.before_model,
//       after_model: settings.after_model,
//       before_prompt: settings.prompt,
//       after_history_length: settings.after_history_length
//     };
//     this.func = func;
//     messages[1] += 'question';
//     this.messages = messages;
//     this.initChain();
//   }

//   initChain() {
//     // TODO

//   }
// }