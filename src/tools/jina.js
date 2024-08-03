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

  // before_prompt: "Only use the jina_reader function when both of these conditions are met:\n      1. The user explicitly provides a URL.\n      2. The user requests analysis or information about the content of that URL.\n\n      When to use:\n      • If a user asks, for \"帮我分析一下 https://example.com/news/article123\"\n      • If a user says, \"I need information from this webpage: https://example.com/research/paper456\"\n      • When the user's query clearly indicates they want you to read and analyze a specific online resource.\n      Please remember to directly send a plain text JSON object string with only the key 'url'. For example: {'url': 'https://example.com/article'}\n\n      When not to use:\n      • If the user asks a general question without providing a URL.\n      • If the user provides a URL but doesn't ask for analysis or information from it.\n      • When you can answer the user's query using your existing knowledge.\n      Then respond with 'NO_ANALYSE_NEEDED'",

  func: async ({ url }, { JINA_API_KEY }) => {
    if (!url) {
      throw new Error('参数错误');
    }
    if (!JINA_API_KEY) {
      throw new Error('JINA\\_API\\_KEY 不存在');
    }
    console.log('jina-reader:', url);
    const result = await fetch('https://r.jina.ai/' + url, {
      headers: {
        'X-Return-Format': 'text',
        'Authorization': `Bearer ${JINA_API_KEY}`,
        'X-Timeout': 10
      },
    });
    if (!result.ok) {
      throw new Error('Error: ' + (await result.json()).message);
    }
    return {content: await result.text()};
  },

  settings: {
    after_prompt: "作为一个高效的内容分析和总结助手，你的任务是对用户提供的网页或PDF内容进行全面而简洁的总结。请遵循以下指南：\n    1. 仔细阅读用户提供的全部内容，确保理解主要观点和关键信息。\n    2. 识别并提炼出内容的核心主题和主要论点。\n    3. 总结时应包括以下要素：\n      • 内容的主要目的或主题\n      • 关键观点或论据\n      • 重要的数据或统计信息（如果有）\n      • 作者的结论或建议（如果适用）\n    4. 保持客观性，准确反映原文的观点，不添加个人解释或评论。\n    5. 使用清晰、简洁的语言，避免使用过于专业或晦涩的术语。\n    6. 总结的长度应该是原文的10-15%，除非用户特别指定其他长度要求。\n    7. 如果内容包含多个部分或章节，可以使用简短的小标题来组织你的总结。\n    8. 如果原文包含图表或图像的重要信息，请在总结中提及这一点。\n    9. 如果内容涉及时间敏感的信息，请在总结中注明内容的发布日期或版本。\n    10. 如果原文存在明显的偏见或争议性观点，请在总结中客观地指出这一点。\n    11. 总结完成后，提供1-3个关键词或短语，概括内容的核心主题。\n    12. 如果用户要求，可以在总结的最后添加一个简短的\"进一步阅读建议\"部分。\n    请记住，你的目标是提供一个全面、准确、易于理解的总结，帮助用户快速把握内容的精髓。如果内容特别长或复杂，你可以询问用户是否需要更详细的总结或特定部分的深入分析。",
  },
};