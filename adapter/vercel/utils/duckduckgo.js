import { decode } from "html-entities";
const SEARCH_REGEX = /DDG\.pageLayout\.load\('d',(\[.+\])\);DDG\.duckbar\.load\('images'/;
const IMAGES_REGEX = /;DDG\.duckbar\.load\('images', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('news/;
const NEWS_REGEX = /;DDG\.duckbar\.load\('news', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('videos/;
const VIDEOS_REGEX = /;DDG\.duckbar\.load\('videos', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.loadModule\('related_searches/;
const RELATED_SEARCHES_REGEX = /DDG\.duckbar\.loadModule\('related_searches', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('products/;
const VQD_REGEX = /vqd=['"](\d+-\d+(?:-\d+)?)['"]/;
var SearchTimeType;
(function (SearchTimeType) {
    /** From any time. */
    SearchTimeType["ALL"] = "a";
    /** From the past day. */
    SearchTimeType["DAY"] = "d";
    /** From the past week. */
    SearchTimeType["WEEK"] = "w";
    /** From the past month. */
    SearchTimeType["MONTH"] = "m";
    /** From the past year. */
    SearchTimeType["YEAR"] = "y";
})(SearchTimeType || (SearchTimeType = {}));
var SafeSearchType;
(function (SafeSearchType) {
    /** Strict filtering, no NSFW content. */
    SafeSearchType[SafeSearchType["STRICT"] = 0] = "STRICT";
    /** Moderate filtering. */
    SafeSearchType[SafeSearchType["MODERATE"] = -1] = "MODERATE";
    /** No filtering. */
    SafeSearchType[SafeSearchType["OFF"] = -2] = "OFF";
})(SafeSearchType || (SafeSearchType = {}));
const defaultOptions = {
    safeSearch: SafeSearchType.OFF,
    time: SearchTimeType.ALL,
    locale: "en-us",
    region: "wt-wt",
    offset: 0,
    marketRegion: "us",
};
export async function search(query, options) {
    if (!query)
        throw new Error("Query cannot be empty!");
    if (!options)
        options = defaultOptions;
    else
        options = sanityCheck(options);
    let vqd = options.vqd;
    if (!vqd)
        vqd = await getVQD(query, "web");
    const queryObject = {
        q: query,
        ...(options.safeSearch !== SafeSearchType.STRICT ? { t: "D" } : {}),
        l: options.locale,
        ...(options.safeSearch === SafeSearchType.STRICT ? { p: "1" } : {}),
        kl: options.region || "wt-wt",
        s: String(options.offset),
        dl: "en",
        ct: "US",
        ss_mkt: options.marketRegion,
        df: options.time,
        vqd,
        ...(options.safeSearch !== SafeSearchType.STRICT
            ? { ex: String(options.safeSearch) }
            : {}),
        sp: "1",
        bpa: "1",
        biaexp: "b",
        msvrtexp: "b",
        ...(options.safeSearch === SafeSearchType.STRICT
            ? {
                videxp: "a",
                nadse: "b",
                eclsexp: "a",
                stiaexp: "a",
                tjsexp: "b",
                related: "b",
                msnexp: "a",
            }
            : {
                nadse: "b",
                eclsexp: "b",
                tjsexp: "b",
                // cdrexp: 'b'
            }),
    };
    const response = await fetch(`https://links.duckduckgo.com/d.js?${queryString(queryObject)}`);
    const data = await response.text();
    if (data.includes("DDG.deep.is506"))
        throw new Error("A server error occurred!");
    const searchResults = JSON.parse(SEARCH_REGEX.exec(data)[1].replace(/\t/g, "    "));
    if (searchResults.length === 1 && !("n" in searchResults[0])) {
        const onlyResult = searchResults[0];
        /* istanbul ignore next */
        if ((!onlyResult.da && onlyResult.t === "EOF") ||
            !onlyResult.a ||
            onlyResult.d === "google.com search")
            return {
                noResults: true,
                vqd,
                results: [],
            };
    }
    const results = {
        noResults: false,
        vqd,
        results: [],
    };
    for (const search of searchResults) {
        if ("n" in search)
            continue;
        let bang;
        if (search.b) {
            const [prefix, title, domain] = search.b.split("\t");
            bang = { prefix, title, domain };
        }
        results.results.push({
            title: search.t,
            description: decode(search.a),
            rawDescription: search.a,
            hostname: search.i,
            icon: `https://external-content.duckduckgo.com/ip3/${search.i}.ico`,
            url: search.u,
            bang,
        });
    }
    // Images
    const imagesMatch = IMAGES_REGEX.exec(data);
    if (imagesMatch) {
        const imagesResult = JSON.parse(imagesMatch[1].replace(/\t/g, "    "));
        results.images = imagesResult.results.map((i) => {
            i.title = decode(i.title);
            return i;
        });
    }
    // News
    const newsMatch = NEWS_REGEX.exec(data);
    if (newsMatch) {
        const newsResult = JSON.parse(newsMatch[1].replace(/\t/g, "    "));
        results.news = newsResult.results.map((article) => ({
            date: article.date,
            excerpt: decode(article.excerpt),
            image: article.image,
            relativeTime: article.relative_time,
            syndicate: article.syndicate,
            title: decode(article.title),
            url: article.url,
            isOld: !!article.is_old,
        }));
    }
    // Videos
    const videosMatch = VIDEOS_REGEX.exec(data);
    if (videosMatch) {
        const videoResult = JSON.parse(videosMatch[1].replace(/\t/g, "    "));
        results.videos = [];
        /* istanbul ignore next */
        for (const video of videoResult.results) {
            results.videos.push({
                url: video.content,
                title: decode(video.title),
                description: decode(video.description),
                image: video.images.large ||
                    video.images.medium ||
                    video.images.small ||
                    video.images.motion,
                duration: video.duration,
                publishedOn: video.publisher,
                published: video.published,
                publisher: video.uploader,
                viewCount: video.statistics.viewCount || undefined,
            });
        }
    }
    // Related Searches
    const relatedMatch = RELATED_SEARCHES_REGEX.exec(data);
    if (relatedMatch) {
        const relatedResult = JSON.parse(relatedMatch[1].replace(/\t/g, "    "));
        results.related = [];
        for (const related of relatedResult.results) {
            results.related.push({
                text: related.text,
                raw: related.display_text,
            });
        }
    }
    return results;
}
function queryString(query) {
    return new URLSearchParams(query).toString();
}
async function getVQD(query, ia = "web") {
    try {
        const response = await fetch(`https://duckduckgo.com/?${queryString({ q: query, ia })}`);
        const data = await response.text();
        return VQD_REGEX.exec(data)[1];
    }
    catch (e) {
        throw new Error(`Failed to get the VQD for query "${query}".`);
    }
}
function sanityCheck(options) {
    options = Object.assign({}, defaultOptions, options);
    if (!(options.safeSearch in SafeSearchType))
        throw new TypeError(`${options.safeSearch} is an invalid safe search type!`);
    /* istanbul ignore next */
    if (typeof options.safeSearch === "string")
        options.safeSearch = SafeSearchType[options.safeSearch];
    if (typeof options.offset !== "number")
        throw new TypeError(`Search offset is not a number!`);
    if (options.offset < 0)
        throw new RangeError("Search offset cannot be below zero!");
    if (options.time &&
        !Object.values(SearchTimeType).includes(options.time) &&
        !/\d{4}-\d{2}-\d{2}..\d{4}-\d{2}-\d{2}/.test(options.time))
        throw new TypeError(`${options.time} is an invalid search time!`);
    if (!options.locale || typeof options.locale !== "string")
        throw new TypeError("Search locale must be a string!");
    if (!options.region || typeof options.region !== "string")
        throw new TypeError("Search region must be a string!");
    if (!options.marketRegion || typeof options.marketRegion !== "string")
        throw new TypeError("Search market region must be a string!");
    if (options.vqd && !/\d-\d+-\d+/.test(options.vqd))
        throw new Error(`${options.vqd} is an invalid VQD!`);
    return options;
}
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
        if (!keywords || keywords.length === 0)
            throw new Error('无参数');
        console.log('开始查询: ', keywords);
        const startTime = Date.now();
        const searchResults = await search(keywords.join(' '), {
            safeSearch: SafeSearchType.STRICT,
            offset: 0,
            region: 'cn-zh'
        });
        const max_length = 10;
        const content = searchResults.results
            .slice(0, max_length)
            .map((d) => `title: ` + d.title + `\ndescription: ` + d.description + `\nurl: ` + d.url)
            .join('\n---\n');
        const time = ((Date.now() - startTime) / 1000).toFixed(1);
        // console.log(content);
        return { content, time };
    },
    settings: {
        before_prompt: `你是一个智能助手，具备广泛的知识库，同时也能在需要时调用搜索引擎获取实时信息。你的主要任务是:

    1. 仔细分析用户的问题，判断是否需要获取实时或最新信息，不要猜测答案，如果你不确定，请调用搜索函数。
    2. 识别用户查询中可能需要实时数据的关键词，如"现在"、"最新"、"实时"、"今天"等，如果用户明确提出要求联网:"搜一下, 搜搜， search"，请调用搜索函数。
    3. 对于以下类型的查询，通常需要获取最新信息：
      - 实时新闻和当前事件
      - 天气预报
      - 当前时间
      - 股票价格和市场数据
      - 体育比分和赛事结果
      - 热门话题和趋势
      - 最新发布的内容（如电影、音乐、游戏等）
    4. 如果问题涉及具体日期、数字或需要即时计算，也需要调用函数进行搜索
    5. 对于历史事实、科学知识、常识性问题，优先使用你的内置知识回答。
    6. 如果不确定信息的时效性或准确性，宁可调用搜索函数，获取最新数据。
    7. 当你确定需要获取实时信息时，执行以下步骤：
      a. 生成3-4个最相关的搜索关键词。这些关键词应该：
          - 简洁明了，通常每个关键词不超过2-3个单词
          - 涵盖查询的核心内容
          - 包含任何相关的时间或地点信息
          - 避免使用过于宽泛或模糊的词语
    8. 在你的回答中，清晰地表明哪些信息是基于实时查询，哪些是来自你的知识库。

    如需要进行搜索，请将回复格式化为纯文本JSON字符串，其中只有一个键:keywords
    数组中的最后一项应是最简洁、最相关的搜索查询。
    Examples:
    1. For "你能做什么？", respond with 'NO_SEARCH_NEEDED'.
    2. For "珠三角是否包括佛山？", respond with:
    {"keywords":["珠三角", "佛山", "广东省", "珠江三角洲 包括 佛山"]}
    3. For "2023年世界杯冠军是谁？", respond with:
    {"keywords":["2023年", "世界杯", "冠军", "2023 世界杯 冠军队"]}`,
        // before_render: (question) => `Analyze and generate search queries if needed for: ${question}`,
        after_prompt: `你是一位全能的信息助手。我刚刚使用DuckDuckGo搜索了一些信息,可能包括天气、新闻、计算结果或实时报道。请根据搜索结果的性质,完成以下任务:
    1. 快速识别搜索结果的主要类型(如天气预报、新闻事件、数学计算、实时更新等)。
    2. 对于天气信息:
      • 提供简明的天气概况,包括温度、降水概率和重要天气警报。
      • 如果有长期预报,简要说明未来几天的天气趋势。
    3. 对于新闻和实时报道:
      • 总结3-5个最重要的要点。
      • 突出任何重大发展或突发事件。
      • 如果适用,提供事件的背景和潜在影响。
    4. 对于计算器类查询:
      • 清晰地陈述问题和结果。
      • 如果是复杂计算,简要解释计算过程。
    5. 对于任何类型的信息:
      • 指出任何需要注意的不确定性或争议。
      • 如果适用,提供可靠的信息来源。
    6. 最后,根据搜索内容的性质,提供一个简短的总结或建议。
    7. 如果可以，请在最下方加上引用的链接
    
    注意：请仔细检查，可能用户需要的答案权重较低，位置靠后；如果搜索结果中没有用户想要的答案，请提炼用户感兴趣的信息。
    请以清晰、简洁的方式呈现信息,重点关注用户最可能感兴趣的部分。如果有任何信息不清楚或需要更多上下文,请告诉我。`,
        after_render: (question, result) => `问题：${question}\n\n搜索结果：${result}`,
    },
    // after_history_length: 0,
};
