export const jina_reader = {
  schema: {
    'name': 'jina_reader',
    'description':
      'Grab text content from provided URL links. Can be used to retrieve text information for web pages, articles, or other online resources',
    'parameters': {
      'type': 'object',
      'properties': {
        'url': {
          'type': 'string',
          'description':
            "The full URL address of the content to be crawled. If the user explicitly requests to read/analyze the content of the link, then call the function. If the data provided by the user is web content with links, but the content is sufficient to answer the question, then there is no need to call the function.",
        },
      },
      'required': ['url'],
      "additionalProperties": false
    },
  },

  func: async ({ url }, { JINA_API_KEY }, signal) => {
    if (!url) {
      throw new Error('url is null');
    }
    if (!Array.isArray(JINA_API_KEY) || JINA_API_KEY?.length === 0) {
      throw new Error('JINA\\_API\\_KEY is null');
    }
    const key_length = JINA_API_KEY.length;
    const key = JINA_API_KEY[Math.floor(Math.random() * key_length)];
    console.log('jina-reader:', url);
    const startTime = Date.now();
    let result = await fetch('https://r.jina.ai/' + url, {
      headers: {
        // 'X-Return-Format': 'text',
        'Authorization': `Bearer ${key}`,
        // 'X-Timeout': 15
      },
      ...(signal && { signal } || {})
    });
    if (!result.ok) {
      if (result.status.toString().startsWith('4') && key_length > 1) {
        console.error(`jina key: ${key.slice(0, 10) + ' ... ' + key.slice(-5)} is expired`); 
        return jina_reader.func({ url }, { JINA_API_KEY: JINA_API_KEY.filter(i => i !== key) }, signal);
      }
      throw new Error('All key has occured: ' + (await result.json()).message);
    }
    const time = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    return { content: await result.text(), time };
  },
  
  type: 'web_crawler'
};