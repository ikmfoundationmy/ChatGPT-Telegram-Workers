import DDG from 'duck-duck-scrape';

export const duckduckgo_search = {
  schema: {
    'name': 'duckduckgo_search',
    'description': 'Use DuckDuckGo search engine to find information. You can search for the latest news, articles, blogs and other content.',
    'parameters': {
      'type': 'object',
      'properties': {
        'keywords': {
          'type': 'array',
          "items": { 'type': "string" },
          'description': "搜索的关键词列表。例如：['Python', '机器学习', '最新进展']。",
        },
      },
      'required': ['keywords'],
    },
  },

  func: async ({ keywords }) => {
    if (!keywords || keywords.length === 0 ) throw new Error('无参数');
    console.log('开始查询: ', keywords);
    const startTime = Date.now();
    const searchResults = await DDG.search(keywords.join(' '), {
      safeSearch: DDG.SafeSearchType.STRICT,
      offset: 0,
      region: 'cn-zh'
    });

    const max_length = 8;
    const content = searchResults.results
      .slice(0, max_length)
      .map((d) => `title: ` + d.title + `\ndescription: ` + d.description + `\nurl: ` + d.url)
      .join('\n---\n');

    const time = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    console.log(content);

    return { content, time };
  },

  type: 'search'
};