import {initEnv} from './src/config/env.js';
import {handleRequest} from './src/route.js';
import {errorToString} from './src/utils/utils.js';
import i18n from './src/i18n/index.js';
import tools from "./src/tools/index.js";
import tasks from "./src/tools/scheduleTask.js";


export default {
  async fetch(request, env, ctx) {
    try {
      env.tools = tools;
      initEnv(env, i18n);
      return await handleRequest(request);
    } catch (e) {
      console.error(e);
      return new Response(errorToString(e), {status: 500});
    }
  },

  async scheduled(event, env, ctx) {
    try {
      const promises = [];
      for (const task of Object.values(tasks)) {
        promises.push(task(env));
      }
      await Promise.all(promises);
      console.log('All tasks done.');
    } catch (e) {
      console.error('Error in scheduled tasks:', e);
    }
  }
};

