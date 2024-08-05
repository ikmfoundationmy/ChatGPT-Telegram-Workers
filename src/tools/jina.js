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
            "The full URL address of the content to be crawled. Please remember to directly send a plain text JSON object string with only the key 'url'. For example: {'url': 'https://example.com/article'}",
        },
      },
      'required': ['url'],
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
        'X-Return-Format': 'text',
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'X-Timeout': 10
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