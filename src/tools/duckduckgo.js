import DDG from 'duck-duck-scrape';

export const duckduckgo_search = {
  schema: {
    'name': 'duckduckgo_search',
    'description': 'Use DuckDuckGo search engine to find information. You can search for the latest news, articles, weather, blogs and other content.',
    'parameters': {
      'type': 'object',
      'properties': {
        'keywords': {
          'type': 'array',
          "items": { 'type': "string" },
          'description': "搜索的关键词列表。例如：['Python', '机器学习', '最新进展']。列表长度至少为3，最大为4。这些关键词应该：- 简洁明了，通常每个关键词不超过2-3个单词 - 涵盖查询的核心内容 - 避免使用过于宽泛或模糊的词语 - 最后一个关键词应该最全面",
        },
      },
      'required': ['keywords'],
      "additionalProperties": false
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
    // console.log(content);

    return { content, time };
  },

  type: 'search'
};