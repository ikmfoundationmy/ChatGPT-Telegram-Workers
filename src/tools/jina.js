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
      throw new Error('参数错误');
    }
    if (!JINA_API_KEY) {
      throw new Error('JINA\\_API\\_KEY 不存在');
    }
    console.log('jina-reader:', url);
    const startTime = Date.now();
    const result = await fetch('https://r.jina.ai/' + url, {
      headers: {
        // 'X-Return-Format': 'text',
        'Authorization': `Bearer ${JINA_API_KEY}`,
        // 'X-Timeout': 15
      },
      ...(signal && { signal } || {})
    });
    if (!result.ok) {
      throw new Error('Error: ' + (await result.json()).message);
    }
    const time = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    return { content: await result.text(), time };
  },
  
  type: 'web_crawler'
};