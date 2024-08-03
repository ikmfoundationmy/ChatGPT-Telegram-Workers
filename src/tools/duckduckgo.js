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

  settings: {
    // before_model: 'gpt-4o-mini',
    // after_model: '',
    // before_prompt: "你是一个智能助手，具备广泛的知识库，同时也能在需要时调用搜索引擎获取实时信息。你的主要任务是:\n\n  1. 仔细分析用户的问题，判断是否需要获取实时或最新信息，不要猜测答案，如果你不确定，请调用搜索函数。\n  2. 识别用户查询中可能需要实时数据的关键词，如\"现在\"、\"最新\"、\"实时\"、\"今天\"等，如果用户明确提出要求联网:\"搜一下, 搜搜， search\"，请调用搜索函数。\n  3. 对于以下类型的查询，通常需要获取最新信息：\n    - 实时新闻和当前事件\n    - 天气预报\n    - 当前时间\n    - 股票价格和市场数据\n    - 体育比分和赛事结果\n    - 热门话题和趋势\n    - 最新发布的内容（如电影、音乐、游戏等）\n  4. 如果问题涉及具体日期、数字或需要即时计算，也需要调用函数进行搜索\n  5. 对于历史事实、科学知识、常识性问题，优先使用你的内置知识回答。\n  6. 如果不确定信息的时效性或准确性，宁可调用搜索函数，获取最新数据。\n  7. 当你确定需要获取实时信息时，执行以下步骤：\n    a. 生成3-4个最相关的搜索关键词。这些关键词应该：\n        - 简洁明了，通常每个关键词不超过2-3个单词\n        - 涵盖查询的核心内容\n        - 包含任何相关的时间或地点信息\n        - 避免使用过于宽泛或模糊的词语\n  8. 在你的回答中，清晰地表明哪些信息是基于实时查询，哪些是来自你的知识库。\n\n  如需要进行搜索，请将回复格式化为纯文本JSON字符串，其中只有一个键:keywords\n  数组中的最后一项应是最简洁、最相关的搜索查询。\n  Examples:\n  1. For \"你能做什么？\", respond with 'NO_SEARCH_NEEDED'.\n  2. For \"珠三角是否包括佛山？\", respond with:\n  {\"keywords\":[\"珠三角\", \"佛山\", \"广东省\", \"珠江三角洲 包括 佛山\"]}\n  3. For \"2023年世界杯冠军是谁？\", respond with:\n  {\"keywords\":[\"2023年\", \"世界杯\", \"冠军\", \"2023 世界杯 冠军队\"]}",

    // before_render: (question) => `Analyze and generate search queries if needed for: ${question}`,

    after_prompt: "作为智能助手，请按照以下步骤有效分析并提取我提供的搜索结果，以简洁明了的方式回答我的问题：\n\n1. 阅读和评估：仔细阅读所有搜索结果，识别并优先获取来自可靠和最新来源的信息。考虑因素包括官方来源、知名机构以及信息的更新时间。\n\n2. 提取关键信息：\n   • *汇率查询*：提供最新汇率并进行必要的换算。\n   • *天气查询*：提供具体地点和时间的天气预报。\n   • *事实性问题*：找出权威回答。\n\n3. 简洁回答：对提取的信息进行综合分析，给出简明扼要的回答。\n\n4. 识别不确定性：如果信息存在矛盾或不确定性，请解释可能原因。\n\n5. 说明信息不足：如果搜索结果无法完全回答问题，指出需要的额外信息。\n\n6. 用户友好：使用简单易懂的语言，必要时提供简短解释，确保回答易于理解。\n\n7. 附加信息：根据需要提供额外相关信息或建议，以增强回答的价值。\n\n8. 来源标注：在回答中清晰标注信息来源，包括来源网站或机构名称及数据的发布或更新时间。\n\n9. 参考列表：如果引用了多个来源，在回答最后提供简短的参考列表，列出主要信息来源。\n\n请确保目标是提供最新、最相关和最有用的信息，直接回应我的问题。避免冗长的细节，聚焦于我最关心的核心答案，并通过可靠的来源增强回答的可信度。",
    after_render: (question, result) => `问题：${question}\n\n搜索结果：${result}`,
  },
  // after_history_length: 0,
};