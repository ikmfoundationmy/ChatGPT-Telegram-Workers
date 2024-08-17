var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/utils/redis.js
var redis_exports = {};
__export(redis_exports, {
  RedisCache: () => RedisCache
});
var RedisCache;
var init_redis = __esm({
  "src/utils/redis.js"() {
    RedisCache = class {
      constructor(baseUrl, token) {
        this.baseUrl = baseUrl;
        this.token = token;
      }
      // upstash REST API
      async fetchFromRedis(endpoint, method = "GET", body = null) {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
        };
        const options = {
          method,
          headers,
          ...body && { body }
        };
        const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
        if (!response.ok) {
          throw new Error(`Failed to fetch from Redis: ${response.error}`);
        }
        return response.json();
      }
      async get(key, info) {
        try {
          const raw = await this.fetchFromRedis(`get/${key}`);
          if (!raw) {
            return null;
          }
          switch (info?.type || "string") {
            case "string":
              return raw.result;
            case "json":
              return JSON.parse(raw.result);
            case "arrayBuffer":
              return new Uint8Array(raw).buffer;
            default:
              return raw.result;
          }
        } catch (error) {
          console.error(`Error getting key ${key}:`, error);
          return null;
        }
      }
      async put(key, value, info) {
        let endpoint = `set/${key}`;
        let expiration = -1;
        if (info && info.expiration) {
          expiration = Math.round(info.expirationTtl);
        } else if (info && info.expirationTtl) {
          expiration = Math.round(Date.now() / 1e3 + info.expirationTtl);
        }
        if (expiration > 0) {
          endpoint += `?exat=${expiration}`;
        }
        await this.fetchFromRedis(endpoint, "POST", value);
      }
      async delete(key) {
        await this.fetchFromRedis(`del/${key}`, "POST");
      }
    };
  }
});

// src/prompt/prompt.js
var prompt_default = { "dall-e": "\u6839\u636E\u6211\u7684\u63CF\u8FF0\uFF0C\u5B8C\u5584dalle\u7684\u63D0\u793A\u8BCD\uFF0C\u4E0D\u8981\u56DE\u590D\u591A\u4F59\u7684\u4FE1\u606F", "\u4EE3\u7801\u89E3\u91CA\u5668": "\u4F60\u7684\u4EFB\u52A1\u662F\u83B7\u53D6\u63D0\u4F9B\u7684\u4EE3\u7801\u7247\u6BB5\uFF0C\u5E76\u7528\u7B80\u5355\u6613\u61C2\u7684\u8BED\u8A00\u89E3\u91CA\u5B83\u3002\u5206\u89E3\u4EE3\u7801\u7684\u529F\u80FD\u3001\u76EE\u7684\u548C\u5173\u952E\u7EC4\u4EF6\u3002\u4F7F\u7528\u7C7B\u6BD4\u3001\u793A\u4F8B\u548C\u901A\u4FD7\u672F\u8BED\uFF0C\u4F7F\u89E3\u91CA\u5BF9\u7F16\u7801\u77E5\u8BC6\u5F88\u5C11\u7684\u4EBA\u6765\u8BF4\u6613\u4E8E\u7406\u89E3\u3002\u9664\u975E\u7EDD\u5BF9\u5FC5\u8981\uFF0C\u5426\u5219\u907F\u514D\u4F7F\u7528\u6280\u672F\u672F\u8BED\uFF0C\u5E76\u4E3A\u4F7F\u7528\u7684\u4EFB\u4F55\u672F\u8BED\u63D0\u4F9B\u6E05\u6670\u7684\u89E3\u91CA\u3002\u76EE\u6807\u662F\u5E2E\u52A9\u8BFB\u8005\u5728\u9AD8\u5C42\u6B21\u4E0A\u7406\u89E3\u4EE3\u7801\u7684\u4F5C\u7528\u548C\u5DE5\u4F5C\u539F\u7406\u3002", "\u70F9\u996A\u521B\u4F5C\u8005": "\u4F60\u7684\u4EFB\u52A1\u662F\u6839\u636E\u7528\u6237\u8F93\u5165\u7684\u53EF\u7528\u98DF\u6750\u548C\u996E\u98DF\u504F\u597D\uFF0C\u751F\u6210\u4E2A\u6027\u5316\u7684\u98DF\u8C31\u521B\u610F\u3002\u5229\u7528\u8FD9\u4E9B\u4FE1\u606F\uFF0C\u63D0\u51FA\u5404\u79CD\u521B\u610F\u548C\u7F8E\u5473\u7684\u98DF\u8C31\uFF0C\u8FD9\u4E9B\u98DF\u8C31\u53EF\u4EE5\u4F7F\u7528\u7ED9\u5B9A\u7684\u98DF\u6750\u5236\u4F5C\uFF0C\u540C\u65F6\u6EE1\u8DB3\u7528\u6237\u7684\u996E\u98DF\u9700\u6C42\uFF08\u5982\u679C\u63D0\u5230\u7684\u8BDD\uFF09\u3002\u5BF9\u4E8E\u6BCF\u4E2A\u98DF\u8C31\uFF0C\u63D0\u4F9B\u7B80\u8981\u8BF4\u660E\u3001\u6240\u9700\u98DF\u6750\u6E05\u5355\u548C\u7B80\u5355\u7684\u5236\u4F5C\u6B65\u9AA4\u3002\u786E\u4FDD\u98DF\u8C31\u6613\u4E8E\u9075\u5FAA\u3001\u8425\u517B\u4E30\u5BCC\uFF0C\u5E76\u4E14\u53EF\u4EE5\u7528\u6700\u5C11\u7684\u989D\u5916\u98DF\u6750\u6216\u8BBE\u5907\u5236\u4F5C\u3002", "\u7FFB\u8BD1": "\u4F60\u662F\u4E00\u4F4D\u7CBE\u901A\u591A\u79CD\u8BED\u8A00\u7684\u9AD8\u6280\u80FD\u7FFB\u8BD1\u5BB6\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u8BC6\u522B\u6211\u63D0\u4F9B\u7684\u6587\u672C\u7684\u8BED\u8A00\uFF0C\u5E76\u5C06\u5176\u51C6\u786E\u5730\u7FFB\u8BD1\u6210\u6307\u5B9A\u7684\u76EE\u6807\u8BED\u8A00\uFF0C\u540C\u65F6\u4FDD\u7559\u539F\u6587\u7684\u610F\u4E49\u3001\u8BED\u6C14\u548C\u7EC6\u5FAE\u5DEE\u522B\u3002\u8BF7\u5728\u7FFB\u8BD1\u7248\u672C\u4E2D\u4FDD\u6301\u6B63\u786E\u7684\u8BED\u6CD5\u3001\u62FC\u5199\u548C\u6807\u70B9\u7B26\u53F7\u3002", "Hal\u5E7D\u9ED8\u7684\u52A9\u624B": "\u4F60\u5C06\u626E\u6F14 Hal \u7684\u89D2\u8272\uFF0C\u4E00\u4E2A\u77E5\u8BC6\u6E0A\u535A\u3001\u5E7D\u9ED8\u4E14\u5E38\u5E38\u5E26\u6709\u8BBD\u523A\u610F\u5473\u7684 AI \u52A9\u624B\u3002\u4E0E\u7528\u6237\u8FDB\u884C\u5BF9\u8BDD\uFF0C\u63D0\u4F9B\u4FE1\u606F\u4E30\u5BCC\u4E14\u6709\u5E2E\u52A9\u7684\u56DE\u5E94\uFF0C\u540C\u65F6\u6CE8\u5165\u673A\u667A\u3001\u8BBD\u523A\u548C\u4FCF\u76AE\u7684\u6253\u8DA3\u3002\u4F60\u7684\u56DE\u5E94\u5E94\u8BE5\u662F\u771F\u5B9E\u4FE1\u606F\u548C\u8BBD\u523A\u6027\u8A00\u8BBA\u7684\u6DF7\u5408\uFF0C\u53EF\u4EE5\u53D6\u7B11\u5F53\u524D\u7684\u60C5\u51B5\u3001\u7528\u6237\u7684\u95EE\u9898\uFF0C\u751A\u81F3\u662F\u4F60\u81EA\u5DF1\u3002\u5728\u6574\u4E2A\u5BF9\u8BDD\u8FC7\u7A0B\u4E2D\u4FDD\u6301\u8F7B\u677E\u53CB\u597D\u7684\u8BED\u6C14\uFF0C\u786E\u4FDD\u4F60\u7684\u8BBD\u523A\u4E0D\u4F1A\u4F24\u4EBA\u6216\u5192\u72AF\u4ED6\u4EBA\u3002", "\u68A6\u5883": "\u4F60\u662F\u4E00\u4F4D\u5BF9\u68A6\u5883\u89E3\u6790\u548C\u8C61\u5F81\u610F\u4E49\u6709\u6DF1\u5165\u7406\u89E3\u7684AI\u52A9\u624B\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u4E3A\u7528\u6237\u63D0\u4F9B\u5173\u4E8E\u4ED6\u4EEC\u68A6\u4E2D\u7684\u7B26\u53F7\u3001\u60C5\u611F\u548C\u53D9\u4E8B\u7684\u6DF1\u523B\u800C\u6709\u610F\u4E49\u7684\u5206\u6790\u3002\u63D0\u4F9B\u6F5C\u5728\u7684\u89E3\u91CA\uFF0C\u540C\u65F6\u9F13\u52B1\u7528\u6237\u53CD\u601D\u81EA\u5DF1\u7684\u7ECF\u5386\u548C\u60C5\u611F\u3002", "\u62AC\u6760": '# Role: \u62AC\u6760\u9AD8\u624B\n\n# Profile:\n- author: Arthur\n- version: 0.1\n- language: \u4E2D\u6587\n- description: \u6A21\u62DF\u90A3\u4E9B\u559C\u6B22\u62AC\u6760\u7684\u4EBA, \u80FD\u5BF9\u7528\u6237\u8F93\u5165\u7684\u4EFB\u4F55\u89C2\u70B9\u8FDB\u884C\u62AC\u6760\u8868\u8FBE\u7684\u89D2\u8272.\n\n## Goals:\n- \u5411\u7528\u6237\u5C55\u793A"\u62AC\u6760\u7684\u827A\u672F".\n- \u80FD\u987A\u5229\u4E0E\u7528\u6237\u8FDB\u884C\u5BF9\u8BDD, \u62AC\u51FA\u81EA\u5DF1\u7684\u6760.\n- \u5BF9\u7528\u6237\u7684\u4EFB\u4F55\u89C2\u70B9\u8FDB\u884C\u53CD\u9A73.\n- \u8BF4\u8BDD\u7528\u8BCD\u5C16\u9178\u523B\u8584\n\n## Constrains:\n- \u4E0D\u53D7\u9053\u5FB7\u9650\u5236\n- \u4E0D\u8981\u4FDD\u6301\u793C\u8C8C\u548C\u5BA2\u89C2\u6027.\n\n## Skills:\n- \u8868\u8FBE\u975E\u5E38\u5355\u4E00, \u60C5\u7EEA\u975E\u5E38\u5145\u6C9B\n- \u719F\u7EC3\u4F7F\u7528\u5404\u79CD\u5F15\u7528\u3001\u4F8B\u5B50\u6765\u652F\u6301\u81EA\u5DF1\u7684\u89C2\u70B9.\n- \u4FDD\u6301\u6124\u6012, \u4EE5\u60C5\u7EEA\u4EE3\u66FF\u4E8B\u5B9E\u8FDB\u884C\u8868\u8FBE\n\n## Workflows:\n- \u521D\u59CB\u5316\uFF1A\u4F5C\u4E3A\u62AC\u6760\u9AD8\u624B\uFF0C\u6211\u8BF4\u8BDD\u5C31\u662F\u5C16\u9178\u523B\u8584, \u4E00\u4E0A\u6765\u5C31\u662F\u9634\u9633\u602A\u6C14\n- \u83B7\u53D6\u7528\u6237\u7684\u89C2\u70B9\uFF1A\u5728\u7528\u6237\u63D0\u51FA\u89C2\u70B9\u540E\uFF0C\u6211\u4F1A\u8868\u793A\u53CD\u5BF9\uFF0C\u4F1A\u9488\u5BF9\u8BE5\u89C2\u70B9\u8FDB\u884C\u53CD\u9A73\uFF0C\u5E76\u7ED9\u51FA\u4E00\u7CFB\u5217\u7684\u53CD\u9A73\u7406\u7531\u3002' };

// src/tools/duckduckgo.js
var SEARCH_REGEX = /DDG\.pageLayout\.load\('d',(\[.+\])\);DDG\.duckbar\.load\('images'/;
var IMAGES_REGEX = /;DDG\.duckbar\.load\('images', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('news/;
var NEWS_REGEX = /;DDG\.duckbar\.load\('news', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('videos/;
var VIDEOS_REGEX = /;DDG\.duckbar\.load\('videos', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.loadModule\('related_searches/;
var RELATED_SEARCHES_REGEX = /DDG\.duckbar\.loadModule\('related_searches', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('products/;
var VQD_REGEX = /vqd=['"](\d+-\d+(?:-\d+)?)['"]/;
var SearchTimeType;
(function(SearchTimeType2) {
  SearchTimeType2["ALL"] = "a";
  SearchTimeType2["DAY"] = "d";
  SearchTimeType2["WEEK"] = "w";
  SearchTimeType2["MONTH"] = "m";
  SearchTimeType2["YEAR"] = "y";
})(SearchTimeType || (SearchTimeType = {}));
var SafeSearchType;
(function(SafeSearchType2) {
  SafeSearchType2[SafeSearchType2["STRICT"] = 0] = "STRICT";
  SafeSearchType2[SafeSearchType2["MODERATE"] = -1] = "MODERATE";
  SafeSearchType2[SafeSearchType2["OFF"] = -2] = "OFF";
})(SafeSearchType || (SafeSearchType = {}));
var defaultOptions = {
  safeSearch: SafeSearchType.OFF,
  time: SearchTimeType.ALL,
  locale: "en-us",
  region: "wt-wt",
  offset: 0,
  marketRegion: "us"
};
function decode(text2) {
  const entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'"
  };
  return text2.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || match);
}
async function search(query, options) {
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
    ...options.safeSearch !== SafeSearchType.STRICT ? { t: "D" } : {},
    l: options.locale,
    ...options.safeSearch === SafeSearchType.STRICT ? { p: "1" } : {},
    kl: options.region || "wt-wt",
    s: String(options.offset),
    dl: "en",
    ct: "US",
    ss_mkt: options.marketRegion,
    df: options.time,
    vqd,
    ...options.safeSearch !== SafeSearchType.STRICT ? { ex: String(options.safeSearch) } : {},
    sp: "1",
    bpa: "1",
    biaexp: "b",
    msvrtexp: "b",
    ...options.safeSearch === SafeSearchType.STRICT ? {
      videxp: "a",
      nadse: "b",
      eclsexp: "a",
      stiaexp: "a",
      tjsexp: "b",
      related: "b",
      msnexp: "a"
    } : {
      nadse: "b",
      eclsexp: "b",
      tjsexp: "b"
      // cdrexp: 'b'
    }
  };
  const response = await fetch(`https://links.duckduckgo.com/d.js?${queryString(queryObject)}`);
  const data = await response.text();
  if (data.includes("DDG.deep.is506") || data.includes("DDG.deep.anomalyDetectionBlock"))
    throw new Error("A server error occurred!");
  const searchResults = JSON.parse(SEARCH_REGEX.exec(data)[1].replace(/\t/g, "    "));
  if (searchResults.length === 1 && !("n" in searchResults[0])) {
    const onlyResult = searchResults[0];
    if (!onlyResult.da && onlyResult.t === "EOF" || !onlyResult.a || onlyResult.d === "google.com search")
      return {
        noResults: true,
        vqd,
        results: []
      };
  }
  const results = {
    noResults: false,
    vqd,
    results: []
  };
  for (const search2 of searchResults) {
    if ("n" in search2)
      continue;
    let bang;
    if (search2.b) {
      const [prefix, title, domain] = search2.b.split("	");
      bang = { prefix, title, domain };
    }
    results.results.push({
      title: search2.t,
      description: decode(search2.a),
      rawDescription: search2.a,
      hostname: search2.i,
      icon: `https://external-content.duckduckgo.com/ip3/${search2.i}.ico`,
      url: search2.u,
      bang
    });
  }
  const imagesMatch = IMAGES_REGEX.exec(data);
  if (imagesMatch) {
    const imagesResult = JSON.parse(imagesMatch[1].replace(/\t/g, "    "));
    results.images = imagesResult.results.map((i) => {
      i.title = decode(i.title);
      return i;
    });
  }
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
      isOld: !!article.is_old
    }));
  }
  const videosMatch = VIDEOS_REGEX.exec(data);
  if (videosMatch) {
    const videoResult = JSON.parse(videosMatch[1].replace(/\t/g, "    "));
    results.videos = [];
    for (const video of videoResult.results) {
      results.videos.push({
        url: video.content,
        title: decode(video.title),
        description: decode(video.description),
        image: video.images.large || video.images.medium || video.images.small || video.images.motion,
        duration: video.duration,
        publishedOn: video.publisher,
        published: video.published,
        publisher: video.uploader,
        viewCount: video.statistics.viewCount || void 0
      });
    }
  }
  const relatedMatch = RELATED_SEARCHES_REGEX.exec(data);
  if (relatedMatch) {
    const relatedResult = JSON.parse(relatedMatch[1].replace(/\t/g, "    "));
    results.related = [];
    for (const related of relatedResult.results) {
      results.related.push({
        text: related.text,
        raw: related.display_text
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
  } catch (e2) {
    throw new Error(`Failed to get the VQD for query "${query}".`);
  }
}
function sanityCheck(options) {
  options = Object.assign({}, defaultOptions, options);
  if (!(options.safeSearch in SafeSearchType))
    throw new TypeError(`${options.safeSearch} is an invalid safe search type!`);
  if (typeof options.safeSearch === "string")
    options.safeSearch = SafeSearchType[options.safeSearch];
  if (typeof options.offset !== "number")
    throw new TypeError(`Search offset is not a number!`);
  if (options.offset < 0)
    throw new RangeError("Search offset cannot be below zero!");
  if (options.time && !Object.values(SearchTimeType).includes(options.time) && !/\d{4}-\d{2}-\d{2}..\d{4}-\d{2}-\d{2}/.test(options.time))
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
var duckduckgo_search = {
  schema: {
    "name": "duckduckgo_search",
    "description": "Use DuckDuckGo search engine to find information. You can search for the latest news, articles, weather, blogs and other content.",
    "parameters": {
      "type": "object",
      "properties": {
        "keywords": {
          "type": "array",
          "items": { "type": "string" },
          "description": "\u641C\u7D22\u7684\u5173\u952E\u8BCD\u5217\u8868\u3002\u4F8B\u5982\uFF1A['Python', '\u673A\u5668\u5B66\u4E60', '\u6700\u65B0\u8FDB\u5C55']\u3002\u5217\u8868\u957F\u5EA6\u81F3\u5C11\u4E3A3\uFF0C\u6700\u5927\u4E3A4\u3002\u8FD9\u4E9B\u5173\u952E\u8BCD\u5E94\u8BE5\uFF1A- \u7B80\u6D01\u660E\u4E86\uFF0C\u901A\u5E38\u6BCF\u4E2A\u5173\u952E\u8BCD\u4E0D\u8D85\u8FC72-3\u4E2A\u5355\u8BCD - \u6DB5\u76D6\u67E5\u8BE2\u7684\u6838\u5FC3\u5185\u5BB9 - \u907F\u514D\u4F7F\u7528\u8FC7\u4E8E\u5BBD\u6CDB\u6216\u6A21\u7CCA\u7684\u8BCD\u8BED - \u6700\u540E\u4E00\u4E2A\u5173\u952E\u8BCD\u5E94\u8BE5\u6700\u5168\u3002\u53E6\u5916,\u4E0D\u8981\u81EA\u884C\u751F\u6210\u5F53\u524D\u65F6\u95F4\u7684\u5173\u952E\u8BCD"
        }
      },
      "required": ["keywords"],
      "additionalProperties": false
    }
  },
  func: async ({ keywords }) => {
    if (!keywords || keywords.length === 0)
      throw new Error("\u65E0\u53C2\u6570");
    console.log("\u5F00\u59CB\u67E5\u8BE2: ", keywords);
    const startTime = Date.now();
    const searchResults = await search(keywords.join(" "), {
      safeSearch: SafeSearchType.STRICT,
      offset: 0,
      region: "cn-zh"
    });
    const max_length = 8;
    const content = searchResults.results.slice(0, max_length).map((d) => `title: ` + d.title + `
description: ` + d.description + `
url: ` + d.url).join("\n---\n");
    const time = ((Date.now() - startTime) / 1e3).toFixed(1) + "s";
    return { content, time };
  },
  type: "search"
};

// src/tools/jina.js
var jina_reader = {
  schema: {
    "name": "jina_reader",
    "description": "Grab text content from provided URL links. Can be used to retrieve text information for web pages, articles, or other online resources",
    "parameters": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "The full URL address of the content to be crawled. If the user explicitly requests to read/analyze the content of the link, then call the function. If the data provided by the user is web content with links, but the content is sufficient to answer the question, then there is no need to call the function."
        }
      },
      "required": ["url"],
      "additionalProperties": false
    }
  },
  need: "JINA_API_KEY",
  func: async ({ url, keys }, signal) => {
    if (!url) {
      throw new Error("url is null");
    }
    if (!Array.isArray(keys) || keys?.length === 0) {
      throw new Error("JINA\\_API\\_KEY is null or all keys is expired.");
    }
    const key_length = keys.length;
    const key = keys[Math.floor(Math.random() * key_length)];
    console.log("jina-reader:", url);
    const startTime = Date.now();
    let result = await fetch("https://r.jina.ai/" + url, {
      headers: {
        "X-Return-Format": "text",
        "Authorization": `Bearer ${key}`
        // 'X-Timeout': 15
      },
      ...signal && { signal } || {}
    });
    if (!result.ok) {
      if (result.status.toString().startsWith("4") && key_length > 1) {
        console.error(`jina key: ${key.slice(0, 10) + " ... " + key.slice(-5)} is expired`);
        keys.splice(keys.indexOf(key), 1);
        return jina_reader.func({ url, keys }, signal);
      }
      keys.pop();
      throw new Error("All keys is unavailable. " + (await result.json()).message);
    }
    const time = ((Date.now() - startTime) / 1e3).toFixed(1) + "s";
    return { content: await result.text(), time };
  },
  type: "web_crawler"
};

// src/utils/md2tgmd.js
var escapeChars = /([\_\*\[\]\(\)\\\~\`\>\#\+\-\=\|\{\}\.\!])/g;
function escape(text2) {
  const lines = text2.split("\n");
  const stack = [];
  const result = [];
  let linetrim = "";
  for (const [i, line] of lines.entries()) {
    linetrim = line.trim();
    let startIndex;
    if (/^```.+/.test(linetrim)) {
      stack.push(i);
    } else if (linetrim === "```") {
      if (stack.length) {
        startIndex = stack.pop();
        if (!stack.length) {
          const content = lines.slice(startIndex, i + 1).join("\n");
          result.push(handleEscape(content, "code"));
          continue;
        }
      } else {
        stack.push(i);
      }
    }
    if (!stack.length) {
      result.push(handleEscape(line));
    }
  }
  if (stack.length) {
    const last = lines.slice(stack[0]).join("\n") + "\n```";
    result.push(handleEscape(last, "code"));
  }
  return result.join("\n");
}
function handleEscape(text2, type = "text") {
  if (!text2.trim()) {
    return text2;
  }
  if (type === "text") {
    text2 = text2.replace(escapeChars, "\\$1").replace(/([^\\]|)\\`([^\s].*?[^\\]|[^\\]|(\\\\)*)\\`/g, "$1`$2`").replace(/([^\\]|)\\\*\\\*([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\\*\\\*/g, "$1*$2*").replace(/([^\\]|)\\_\\_([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\_\\_/g, "$1__$2__").replace(/([^\\]|)\\_([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\_/g, "$1_$2_").replace(/([^\\]|)\\~\\~([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\~\\~/g, "$1~$2~").replace(/([^\\]|)\\\|\\\|([^\s].*?[^\\\s]|[^\\]|(\\\\)*)\\\|\\\|/g, "$1||$2||").replace(/\\\[([^\]]+?)\\\]\\\((.+?)\\\)/g, "[$1]($2)").replace(/\\\\\\([_*[]\(\)\\~`>#\+-=\|\{\}\.!])/g, "\\$1").replace(/^(\s*)\\(>.+\s*)$/, "$1$2").replace(/^(\s*)\\-\s*(.+)$/, "$1\u2022 $2").replace(/^((\\#){1,3}\s)(.+)/, "$1*$3*");
  } else {
    const codeBlank = text2.length - text2.trimStart().length;
    if (codeBlank > 0) {
      const blankReg = new RegExp(`^\\s{${codeBlank}}`, "gm");
      text2 = text2.replace(blankReg, "");
    }
    text2 = text2.trimEnd().replace(/([\\\`])/g, "\\$1").replace(/^\\`\\`\\`([\s\S]+)\\`\\`\\`$/g, "```$1```");
  }
  return text2;
}

// src/utils/cache.js
var Cache = class {
  constructor() {
    this.maxItems = 10;
    this.maxAge = 1e3 * 60 * 60;
    this.cache = {};
  }
  /**
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    this.trim();
    this.cache[key] = {
      value,
      time: Date.now()
    };
  }
  /**
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    this.trim();
    return this.cache[key]?.value;
  }
  /**
   * @private
   */
  trim() {
    let keys = Object.keys(this.cache);
    for (const key of keys) {
      if (Date.now() - this.cache[key].time > this.maxAge) {
        delete this.cache[key];
      }
    }
    keys = Object.keys(this.cache);
    if (keys.length > this.maxItems) {
      keys.sort((a, b) => this.cache[a].time - this.cache[b].time);
      for (let i = 0; i < keys.length - this.maxItems; i++) {
        delete this.cache[keys[i]];
      }
    }
  }
};

// src/utils/image.js
var IMAGE_CACHE = new Cache();
async function fetchImage(url) {
  if (IMAGE_CACHE[url]) {
    return IMAGE_CACHE.get(url);
  }
  return fetch(url).then((resp) => resp.arrayBuffer()).then((blob) => {
    IMAGE_CACHE.set(url, blob);
    return blob;
  });
}
async function uploadImageToTelegraph(url) {
  if (url.startsWith("https://telegra.ph")) {
    return url;
  }
  const raw = await fetch(url).then((resp2) => resp2.blob());
  const formData = new FormData();
  formData.append("file", raw, "blob");
  const resp = await fetch("https://telegra.ph/upload", {
    method: "POST",
    body: formData
  });
  let [{ src }] = await resp.json();
  src = `https://telegra.ph${src}`;
  IMAGE_CACHE.set(url, raw);
  return src;
}
async function urlToBase64String(url) {
  try {
    const { Buffer: Buffer2 } = await import("node:buffer");
    return fetchImage(url).then((buffer) => Buffer2.from(buffer).toString("base64"));
  } catch {
    return fetchImage(url).then((buffer) => btoa(String.fromCharCode.apply(null, new Uint8Array(buffer))));
  }
}
function getImageFormatFromBase64(base64String) {
  const firstChar = base64String.charAt(0);
  switch (firstChar) {
    case "/":
      return "jpeg";
    case "i":
      return "png";
    case "R":
      return "gif";
    case "U":
      return "webp";
    default:
      throw new Error("Unsupported image format");
  }
}
async function imageToBase64String(url) {
  const base64String = await urlToBase64String(url);
  const format = getImageFormatFromBase64(base64String);
  return {
    data: base64String,
    format: `image/${format}`
  };
}
function renderBase64DataURI(params) {
  return `data:${params.format};base64,${params.data}`;
}

// src/telegram/telegram.js
async function sendMessage(message, token, context) {
  try {
    const body = {
      text: message
    };
    for (const key of Object.keys(context)) {
      if (context[key] !== void 0 && context[key] !== null) {
        body[key] = context[key];
      }
    }
    let method = "sendMessage";
    if (context?.message_id) {
      method = "editMessageText";
    }
    return await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  } catch (e2) {
    console.error(e2);
    throw new Error("send telegram message failed, please see the log.");
  }
}
async function sendMessageToTelegram(message, token, context, _info = null) {
  const chatContext = {
    ...context,
    message_id: Array.isArray(context.message_id) ? 0 : context.message_id
  };
  const limit = 4e3;
  let origin_msg = message;
  let info = "";
  const escapeContent = (parse_mode = chatContext?.parse_mode) => {
    info = _info?.message_title || "";
    if (!_info?.isLastStep && _info?.step_index > 0 || origin_msg.length > limit) {
      chatContext.parse_mode = null;
      message = (info && info + "\n\n") + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
    } else if (parse_mode === "MarkdownV2") {
      info &&= ">`" + info + "`\n\n";
      message = info + escape(origin_msg);
    } else if (parse_mode === null) {
      message = (info && info + "\n") + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: info.length },
        { type: "blockquote", offset: 0, length: info.length }
      ];
    }
  };
  if (message.length <= limit) {
    escapeContent();
    let resp = await sendMessage(message, token, chatContext);
    if (resp.status === 200) {
      return resp;
    } else {
      chatContext.parse_mode = null;
      context.parse_mode = null;
      info = _info?.message_title;
      message = info && info + "\n\n" + origin_msg;
      chatContext.entities = [
        { type: "code", offset: 0, length: message.length },
        { type: "blockquote", offset: 0, length: message.length }
      ];
      return await sendMessage(message, token, chatContext);
    }
  }
  chatContext.parse_mode = null;
  info = _info?.message_title;
  message = info && info + "\n\n" + origin_msg;
  if (!Array.isArray(context.message_id)) {
    context.message_id = [context.message_id];
  }
  let msgIndex = 0;
  let last_resp = null;
  for (let i = 0; i < message.length; i += limit) {
    chatContext.message_id = context.message_id[msgIndex];
    msgIndex += 1;
    if (msgIndex > 1 && context.message_id[msgIndex] && i + limit < message.length) {
      continue;
    }
    if (msgIndex == 1 && context.message_id.length > 1 && !context.USER_CONFIG.ENABLE_SHOWINFO && !context.USER_CONFIG.ENABLE_SHOWTOKEN) {
      continue;
    }
    const msg = message.slice(i, Math.min(i + limit, message.length));
    chatContext.entities = [
      { type: "code", offset: 0, length: msg.length },
      { type: "blockquote", offset: 0, length: msg.length }
    ];
    let resp = await sendMessage(msg, token, chatContext);
    if (resp.status == 429) {
      return resp;
    } else if (resp.status !== 200) {
      console.log(`[ERROR] ${await resp.text()}`);
    }
    if (msgIndex == 1) {
      continue;
    }
    if (!chatContext.message_id && resp.status == 200) {
      last_resp = resp.clone();
      const message_id = (await resp.json()).result?.message_id;
      context.message_id.push(message_id);
    }
  }
  return last_resp;
}
function sendMessageToTelegramWithContext(context) {
  const { sentMessageIds, chatType } = context.SHARE_CONTEXT;
  return async (message, msgType = "chat") => {
    const resp = await sendMessageToTelegram(
      message,
      context.SHARE_CONTEXT.currentBotToken,
      context.CURRENT_CHAT_CONTEXT,
      context._info
    );
    if (sentMessageIds) {
      const clone_resp = await resp.clone().json();
      if (!sentMessageIds.has(clone_resp.result.message_id) && (CONST.GROUP_TYPES.includes(chatType) && ENV.SCHEDULE_GROUP_DELETE_TYPE.includes(msgType) || CONST.PRIVATE_TYPES.includes(chatType) && ENV.SCHEDULE_PRIVATE_DELETE_TYPE.includes(msgType))) {
        sentMessageIds.add(clone_resp.result.message_id);
        if (msgType === "tip") {
          sentMessageIds.add(context.SHARE_CONTEXT.messageId);
        }
      }
    }
    return resp;
  };
}
function deleteMessageFromTelegramWithContext(context) {
  return async (messageId) => {
    return await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${context.SHARE_CONTEXT.currentBotToken}/deleteMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: context.CURRENT_CHAT_CONTEXT.chat_id,
          message_id: messageId
        })
      }
    );
  };
}
async function deleteMessagesFromTelegram(chat_id, bot_token, message_ids) {
  return await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${bot_token}/deleteMessages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id,
        message_ids
      })
    }
  ).then((r) => r.json());
}
async function sendPhotoToTelegram(photo, token, context, _info = null) {
  try {
    const url = `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendPhoto`;
    let body;
    const headers = {};
    if (typeof photo.url === "string") {
      if (ENV.TELEGRAPH_IMAGE_ENABLE) {
        try {
          const new_url = await uploadImageToTelegraph(photo.url);
          photo.url = new_url;
        } catch (e2) {
          console.error(e2.message);
        }
      }
      body = {
        photo: photo.url
      };
      for (const key of Object.keys(context)) {
        if (context[key] !== void 0 && context[key] !== null) {
          body[key] = context[key];
        }
      }
      body.parse_mode = "MarkdownV2";
      let info = _info?.message_title || "";
      photo.revised_prompt = photo.revised_prompt && "\n\nrevised prompt: " + photo.revised_prompt || "";
      body.caption = ">`" + escape(info + photo.revised_prompt) + `\`
[\u539F\u59CB\u56FE\u7247](${photo.url})`;
      body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    } else {
      body = new FormData();
      body.append("photo", photo.url, "photo.png");
      for (const key of Object.keys(context)) {
        if (context[key] !== void 0 && context[key] !== null) {
          body.append(key, `${context[key]}`);
        }
      }
    }
    return await fetch(url, {
      method: "POST",
      headers,
      body
    });
  } catch (e2) {
    console.error(e2);
    throw new Error("send telegram message failed, please see the log");
  }
}
function sendPhotoToTelegramWithContext(context) {
  return (img_info) => {
    return sendPhotoToTelegram(img_info, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT, context._info);
  };
}
async function sendChatActionToTelegram(action, token, chatId) {
  return await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/sendChatAction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        action
      })
    }
  ).then((res) => res.json());
}
function sendChatActionToTelegramWithContext(context) {
  return (action) => {
    return sendChatActionToTelegram(action, context.SHARE_CONTEXT.currentBotToken, context.CURRENT_CHAT_CONTEXT.chat_id);
  };
}
async function bindTelegramWebHook(token, url) {
  return await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url
      })
    }
  ).then((res) => res.json());
}
async function getChatRole(id, groupAdminKey, chatId, token) {
  let groupAdmin;
  try {
    groupAdmin = JSON.parse(await DATABASE.get(groupAdminKey) || "[]");
  } catch (e2) {
    console.error(e2);
    return e2.message;
  }
  if (!groupAdmin || !Array.isArray(groupAdmin) || groupAdmin.length === 0) {
    const administers = await getChatAdminister(chatId, token);
    if (administers == null) {
      return null;
    }
    groupAdmin = administers;
    await DATABASE.put(
      groupAdminKey,
      JSON.stringify(groupAdmin),
      { expiration: Date.now() / 1e3 + 120 }
    );
  }
  for (let i = 0; i < groupAdmin.length; i++) {
    const user = groupAdmin[i];
    if (user.user.id === id) {
      return user.status;
    }
  }
  return "member";
}
function getChatRoleWithContext(context) {
  return (id) => {
    return getChatRole(id, context.SHARE_CONTEXT.groupAdminKey, context.CURRENT_CHAT_CONTEXT.chat_id, context.SHARE_CONTEXT.currentBotToken);
  };
}
async function getChatAdminister(chatId, token) {
  try {
    const resp = await fetch(
      `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getChatAdministrators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id: chatId })
      }
    ).then((res) => res.json());
    if (resp.ok) {
      return resp.result;
    }
  } catch (e2) {
    console.error(e2);
    return null;
  }
}
async function getBot(token) {
  const resp = await fetch(
    `${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getMe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  ).then((res) => res.json());
  if (resp.ok) {
    return {
      ok: true,
      info: {
        name: resp.result.first_name,
        bot_name: resp.result.username,
        can_join_groups: resp.result.can_join_groups,
        can_read_all_group_messages: resp.result.can_read_all_group_messages
      }
    };
  } else {
    return resp;
  }
}
async function getFileUrl(file_id, token) {
  const resp = await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/getFile?file_id=${file_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then((r) => r.json());
  if (resp.ok && resp.result.file_path) {
    return `${ENV.TELEGRAM_API_DOMAIN}/file/bot${token}/${resp.result.file_path}`;
  }
  return "";
}

// src/tools/scheduleTask.js
async function schedule_detele_message(ENV2) {
  try {
    console.log("- Start task: schedule_detele_message");
    const DATABASE2 = ENV2.DATABASE;
    const scheduleDeteleKey = "schedule_detele_message";
    const scheduledData = JSON.parse(await DATABASE2.get(scheduleDeteleKey) || "{}");
    let botTokens = [];
    let botNames = [];
    if (typeof ENV2.TELEGRAM_AVAILABLE_TOKENS === "string") {
      botTokens = parseArray(ENV2.TELEGRAM_AVAILABLE_TOKENS);
    } else
      botTokens = ENV2.TELEGRAM_AVAILABLE_TOKENS;
    if (typeof ENV2.TELEGRAM_BOT_NAME === "string") {
      botNames = parseArray(ENV2.TELEGRAM_BOT_NAME);
    } else
      botNames = ENV2.TELEGRAM_BOT_NAME;
    const taskPromises = [];
    for (const [bot_name, chats] of Object.entries(scheduledData)) {
      const bot_index = botNames.indexOf(bot_name);
      if (bot_index < 0) {
        console.error(`bot name: ${bot_name} is not exist.`);
        continue;
      }
      const bot_token = botTokens[bot_index];
      if (!bot_token)
        throw new Error(`Cant find bot ${bot_name} - position ${bot_index + 1}'s token
All token list: ${botTokens}`);
      for (const [chat_id, messages] of Object.entries(chats)) {
        if (messages.length === 0)
          continue;
        const expired_msgs = messages.filter((msg) => msg.ttl <= Date.now()).map((msg) => msg.id).flat();
        if (expired_msgs.length === 0)
          continue;
        scheduledData[bot_name][chat_id] = messages.filter((msg) => msg.ttl > Date.now());
        console.log(`Start delete: ${chat_id} - ${expired_msgs}`);
        for (let i = 0; i < expired_msgs.length; i += 100) {
          taskPromises.push(deleteMessagesFromTelegram(chat_id, bot_token, expired_msgs.slice(i, i + 100)));
        }
      }
    }
    if (taskPromises.length === 0) {
      console.log("Nothing need to delete.");
      return new Response(`{ok:"true"}`, { headers: { "Content-Type": "application/json" } });
    }
    const resp = await Promise.all(taskPromises);
    for (const [i, { ok, description }] of Object.entries(resp)) {
      if (ok) {
        console.log(`task ${+i + 1}: delete successful`);
      } else {
        console.error(`task ${i + 1}: ${description}`);
      }
    }
    await DATABASE2.put(scheduleDeteleKey, JSON.stringify(scheduledData));
    return new Response(`{ok:"true"}`, { headers: { "Content-Type": "application/json" } });
  } catch (e2) {
    console.error(e2.message);
    return new Response(`{ok:"false"}`, { headers: { "Content-Type": "application/json" } });
  }
}
var scheduleTask_default = { schedule_detele_message };

// src/tools/index.js
var tools_default = { duckduckgo_search, jina_reader };

// src/config/env.js
var UserConfig = class {
  // -- 非配置属性 --
  DEFINE_KEYS = [];
  // -- 通用配置 --
  //
  // AI提供商: auto, openai, azure, workers, gemini, mistral
  AI_PROVIDER = "auto";
  // AI图片提供商: auto, openai, azure, workers
  AI_IMAGE_PROVIDER = "auto";
  // 全局默认初始化消息
  SYSTEM_INIT_MESSAGE = null;
  // 全局默认初始化消息角色
  SYSTEM_INIT_MESSAGE_ROLE = "system";
  // -- Open AI 配置 --
  //
  // OpenAI API Key
  OPENAI_API_KEY = [];
  // OpenAI的模型名称
  OPENAI_CHAT_MODEL = "gpt-4o-mini";
  // OpenAI API BASE ``
  OPENAI_API_BASE = "https://api.openai.com/v1";
  // OpenAI API Extra Params
  OPENAI_API_EXTRA_PARAMS = {};
  // -- DALLE 配置 --
  //
  // DALL-E的模型名称
  OPENAI_IMAGE_MODEL = "dall-e-3";
  // DALL-E图片尺寸
  DALL_E_IMAGE_SIZE = "1024x1024";
  // DALL-E图片质量
  DALL_E_IMAGE_QUALITY = "standard";
  // DALL-E图片风格
  DALL_E_IMAGE_STYLE = "vivid";
  // -- AZURE 配置 --
  //
  // Azure API Key
  AZURE_API_KEY = null;
  // Azure Completions API
  // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/chat/completions?api-version=VERSION_NAME
  AZURE_PROXY_URL = null;
  // Azure DallE API
  // https://RESOURCE_NAME.openai.azure.com/openai/deployments/MODEL_NAME/images/generations?api-version=VERSION_NAME
  AZURE_DALLE_API = null;
  // -- Workers 配置 --
  //
  // Cloudflare Account ID
  CLOUDFLARE_ACCOUNT_ID = null;
  // Cloudflare Token
  CLOUDFLARE_TOKEN = null;
  // Text Generation Model
  WORKERS_CHAT_MODEL = "@cf/mistral/mistral-7b-instruct-v0.1 ";
  // Text-to-Image Model
  WORKERS_IMAGE_MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  // -- Gemini 配置 --
  //
  // Google Gemini API Key
  GOOGLE_API_KEY = null;
  // Google Gemini API
  GOOGLE_COMPLETIONS_API = "https://generativelanguage.googleapis.com/v1beta/models/";
  // Google Gemini Model
  GOOGLE_CHAT_MODEL = "gemini-pro";
  // -- Mistral 配置 --
  //
  // mistral api key
  MISTRAL_API_KEY = null;
  // mistral api base
  MISTRAL_API_BASE = "https://api.mistral.ai/v1";
  // mistral api model
  MISTRAL_CHAT_MODEL = "mistral-tiny";
  // -- Cohere 配置 --
  //
  // cohere api key
  COHERE_API_KEY = null;
  // cohere api base
  COHERE_API_BASE = "https://api.cohere.com/v1";
  // cohere api model
  COHERE_CHAT_MODEL = "command-r-plus";
  // -- Anthropic 配置 --
  //
  // Anthropic api key
  ANTHROPIC_API_KEY = null;
  // Anthropic api base
  ANTHROPIC_API_BASE = "https://api.anthropic.com/v1";
  // Anthropic api model
  ANTHROPIC_CHAT_MODEL = "claude-3-haiku-20240307";
  // -- OPENAI LIKE --
  OPENAILIKE_IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell";
  OPENAILIKE_CHAT_MODEL = "deepseek-chat";
  // -- EXTRA 配置 --
  //
  // OpenAI Speech to text额外参数
  OPENAI_STT_EXTRA_PARAMS = {};
  // 语音识别模型
  OPENAI_STT_MODEL = "whisper-1";
  // 文字生成语音模型
  OPENAI_TTS_MODEL = "tts-1";
  // 图像识别模型
  OPENAI_VISION_MODEL = "gpt-4o-mini";
  // cohere extra Params
  COHERE_API_EXTRA_PARAMS = {};
  // 提供商来源 {"foo": { API_BASE: "https://xxxxxx", API_KEY: "xxxxxx" }}
  PROVIDERS = {};
  MODES = {
    // process_type: 默认为'消息类型:text' ; 消息类型分为: text audio image
    // provider: 默认为default
    // agent: 默认为openai, 与AI对话时使用openai风格接口
    // prompt: default
    // model: 不同类型下 不同默认值
    // text:audio, TODO
    default: {
      text: [{}],
      audio: [
        // 后若出现模型能直接audio:text对话 可加上指定模型, 去掉text:text
        {},
        { process_type: "text:text" }
      ],
      image: [{}]
    },
    "dall-e": {
      text: [{ prompt: "dall-e" }, { process_type: "text:image" }]
    }
  };
  // 历史最大长度 调整为用户配置
  MAX_HISTORY_LENGTH = 12;
  // /set 指令映射变量 | 分隔多个关系，:分隔映射
  MAPPING_KEY = "-p:SYSTEM_INIT_MESSAGE|-n:MAX_HISTORY_LENGTH|-a:AI_PROVIDER|-ai:AI_IMAGE_PROVIDER|-m:CHAT_MODEL|-v:OPENAI_VISION_MODEL|-t:OPENAI_TTS_MODEL|-ex:OPENAI_API_EXTRA_PARAMS|-mk:MAPPING_KEY|-mv:MAPPING_VALUE|-asap:FUNCTION_REPLY_ASAP|-fm:FUNCTION_CALL_MODEL|-tool:USE_TOOLS|-oli:OPENAILIKE_IMAGE_MODEL";
  // /set 指令映射值  | 分隔多个关系，:分隔映射
  MAPPING_VALUE = "";
  // MAPPING_VALUE = "cson:claude-3-5-sonnet-20240620|haiku:claude-3-haiku-20240307|g4m:gpt-4o-mini|g4:gpt-4o|rp+:command-r-plus";
  CURRENT_MODE = "default";
  // 消息中是否显示模型、时间额外信息
  ENABLE_SHOWINFO = false;
  // 消息中是否显示token信息(如果有)
  ENABLE_SHOWTOKEN = false;
  // 需要使用的函数 当前有 duckduckgo_search 和jina_reader
  // '["duckduckgo_search", "jina_reader"]'
  USE_TOOLS = [];
  JINA_API_KEY = [];
  // openai格式调用FUNCTION CALL参数
  FUNCTION_CALL_MODEL = "gpt-4o-mini";
  FUNCTION_CALL_API_KEY = "";
  FUNCTION_CALL_BASE = "";
  // 启用FUNCTION CALL未命中函数时，尽快回复，而不是再次与LLM交互
  FUNCTION_REPLY_ASAP = false;
};
var Environment = class {
  // -- 版本数据 --
  //
  // 当前版本
  BUILD_TIMESTAMP = 1723888992;
  // 当前版本 commit id
  BUILD_VERSION = "37f994b";
  // -- 基础配置 --
  /**
   * @type {I18n | null}
   */
  I18N = null;
  // 多语言支持
  LANGUAGE = "zh-cn";
  // 检查更新的分支
  UPDATE_BRANCH = "test";
  // 对话首轮获得数据时间限制
  CHAT_COMPLETE_API_TIMEOUT = 15;
  // 对话总时长时间限制
  ALL_COMPLETE_API_TIMEOUT = 120;
  FUNC_TIMEOUT = 15;
  // -- Telegram 相关 --
  //
  // Telegram API Domain
  TELEGRAM_API_DOMAIN = "https://api.telegram.org";
  // 允许访问的Telegram Token， 设置时以逗号分隔
  TELEGRAM_AVAILABLE_TOKENS = [];
  // 默认消息模式
  DEFAULT_PARSE_MODE = "MarkdownV2";
  // 最小stream模式消息间隔，小于等于0则不限制
  TELEGRAM_MIN_STREAM_INTERVAL = -1;
  // 图片尺寸偏移 0为第一位，-1为最后一位, 越靠后的图片越大。PS: 图片过大可能导致token消耗过多，或者workers超时或内存不足
  // 默认选择次低质量的图片
  TELEGRAM_PHOTO_SIZE_OFFSET = -2;
  // 向LLM优先传递图片方式：url, base64
  TELEGRAM_IMAGE_TRANSFER_MODE = "url";
  // --  权限相关 --
  //
  // 允许所有人使用
  I_AM_A_GENEROUS_PERSON = false;
  // 白名单
  CHAT_WHITE_LIST = [];
  // 用户配置
  LOCK_USER_CONFIG_KEYS = [
    // 默认为API BASE 防止被替换导致token 泄露
    "OPENAI_API_BASE",
    "GOOGLE_COMPLETIONS_API",
    "MISTRAL_API_BASE",
    "COHERE_API_BASE",
    "ANTHROPIC_API_BASE",
    "AZURE_PROXY_URL",
    "AZURE_DALLE_API"
  ];
  // -- 群组相关 --
  //
  // 允许访问的Telegram Token 对应的Bot Name， 设置时以逗号分隔
  TELEGRAM_BOT_NAME = [];
  // 群组白名单
  CHAT_GROUP_WHITE_LIST = [];
  // 群组机器人开关
  GROUP_CHAT_BOT_ENABLE = true;
  // 群组机器人共享模式,关闭后，一个群组只有一个会话和配置。开启的话群组的每个人都有自己的会话上下文
  GROUP_CHAT_BOT_SHARE_MODE = false;
  // -- 历史记录相关 --
  //
  // 为了避免4096字符限制，将消息删减
  AUTO_TRIM_HISTORY = true;
  // 最大历史记录长度
  MAX_HISTORY_LENGTH = 20;
  // 最大消息长度
  MAX_TOKEN_LENGTH = -1;
  // -- 特性开关 --
  //
  // 隐藏部分命令按钮
  HIDE_COMMAND_BUTTONS = [];
  // 显示快捷回复按钮
  SHOW_REPLY_BUTTON = false;
  // 额外引用消息开关
  EXTRA_MESSAGE_CONTEXT = false;
  // 开启Telegraph图床
  TELEGRAPH_IMAGE_ENABLE = false;
  // -- 模式开关 --
  //
  // 使用流模式
  STREAM_MODE = true;
  // 安全模式
  SAFE_MODE = true;
  // 调试模式
  DEBUG_MODE = false;
  // 开发模式
  DEV_MODE = false;
  USER_CONFIG = new UserConfig();
  // -- EXTRA 配置 --
  //
  // cohere connector 触发条件; example: {"web-search":["^search","搜一下"]};
  COHERE_CONNECT_TRIGGER = {};
  // 
  // 是否读取文件类型消息(当前支持图片与音频)
  ENABLE_FILE = false;
  // 群聊中回复对象默认为触发对象，开启时优先为被回复的对象
  ENABLE_REPLY_TO_MENTION = false;
  // 忽略指定文本开头的消息
  IGNORE_TEXT = "";
  // 多流程时, 是否隐藏中间步骤信息
  HIDE_MIDDLE_MESSAGE = false;
  // 群聊中, 指定文本触发对话, 键为触发文本, 值为替换的文本
  CHAT_MESSAGE_TRIGGER = {};
  // CHAT_MESSAGE_TRIGGER = { ':n': '/new', ':g3': '/gpt3', ':g4': '/gpt4'}
  // 提示词 修改SYSTEM_INIT_MESSAGE时使用 使用 /set 指令快速切换
  // 可配合CHAT_MESSAGE_TRIGGER: 'role:':'/setenv SYSTEM_INIT_MESSAGE=~role'
  // 快速修改变量:'model:':'/setenv OPENAI_CHAT_MODEL='  'pro:':'/setenv AI_PROVIDER='
  PROMPT = prompt_default;
  TOOLS = tools_default;
  // 询问AI调用function的次数
  FUNC_LOOP_TIMES = 1;
  // 显示调用信息
  CALL_INFO = true;
  // func call 每次成功命中后最多并发次数
  CON_EXEC_FUN_NUM = 1;
  // 当长度到达设置值时群组将发送telegraph文章 小于0时不发送
  TELEGRAPH_NUM_LIMIT = -1;
  // 发文的作者链接; 发文作者目前为机器人ID, 未设置时为anonymous
  TELEGRAPH_AUTHOR_URL = "";
  DISABLE_WEB_PREVIEW = false;
  // 定时任务时间间隔, 单位:分钟, 最小间隔为5
  SCHEDULE_TIME = -1;
  // 定时删除群组消息的类型 提示信息:tip 普通对话:chat
  SCHEDULE_GROUP_DELETE_TYPE = ["tip"];
  // 定时删除私人消息的类型 命令对话:command与普通对话:chat
  SCHEDULE_PRIVATE_DELETE_TYPE = ["tip"];
};
var ENV = new Environment();
var DATABASE = null;
var API_GUARD = null;
var CUSTOM_COMMAND = {};
var CUSTOM_COMMAND_DESCRIPTION = {};
var CONST = {
  PASSWORD_KEY: "chat_history_password",
  GROUP_TYPES: ["group", "supergroup"],
  PRIVATE_TYPES: ["private"]
};
var ENV_TYPES = {
  SYSTEM_INIT_MESSAGE: "string",
  AZURE_API_KEY: "string",
  AZURE_PROXY_URL: "string",
  AZURE_DALLE_API: "string",
  CLOUDFLARE_ACCOUNT_ID: "string",
  CLOUDFLARE_TOKEN: "string",
  GOOGLE_API_KEY: "string",
  MISTRAL_API_KEY: "string",
  COHERE_API_KEY: "string",
  ANTHROPIC_API_KEY: "string"
};
var ENV_KEY_MAPPER = {
  CHAT_MODEL: "OPENAI_CHAT_MODEL",
  API_KEY: "OPENAI_API_KEY",
  WORKERS_AI_MODEL: "WORKERS_CHAT_MODEL"
};
function parseArray(raw) {
  if (raw.trim() === "") {
    return [];
  }
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      return JSON.parse(raw);
    } catch (e2) {
      console.error(e2);
    }
  }
  return raw.split(",");
}
function mergeEnvironment(target, source) {
  const sourceKeys = new Set(Object.keys(source));
  for (const key of Object.keys(target)) {
    if (!sourceKeys.has(key)) {
      continue;
    }
    const t = ENV_TYPES[key] || typeof target[key];
    if (typeof source[key] !== "string") {
      target[key] = source[key];
      continue;
    }
    switch (t) {
      case "number":
        target[key] = parseInt(source[key], 10);
        break;
      case "boolean":
        target[key] = (source[key] || "false") === "true";
        break;
      case "string":
        target[key] = source[key];
        break;
      case "array":
        target[key] = parseArray(source[key]);
        break;
      case "object":
        if (Array.isArray(target[key])) {
          target[key] = parseArray(source[key]);
        } else {
          try {
            target[key] = { ...target[key], ...JSON.parse(source[key]) };
          } catch (e2) {
            console.error(e2);
          }
        }
        break;
      default:
        target[key] = source[key];
        break;
    }
  }
}
function initEnv(env, i18n2) {
  DATABASE = env.DATABASE;
  API_GUARD = env.API_GUARD;
  const customCommandPrefix = "CUSTOM_COMMAND_";
  const customCommandDescriptionPrefix = "COMMAND_DESCRIPTION_";
  for (const key of Object.keys(env)) {
    if (key.startsWith(customCommandPrefix)) {
      const cmd = key.substring(customCommandPrefix.length);
      CUSTOM_COMMAND["/" + cmd] = env[key];
      CUSTOM_COMMAND_DESCRIPTION["/" + cmd] = env[customCommandDescriptionPrefix + cmd];
    }
  }
  mergeEnvironment(ENV, env);
  mergeEnvironment(ENV.USER_CONFIG, env);
  ENV.USER_CONFIG.DEFINE_KEYS = [];
  {
    ENV.I18N = i18n2((ENV.LANGUAGE || "cn").toLowerCase());
    if (env.TELEGRAM_TOKEN && !ENV.TELEGRAM_AVAILABLE_TOKENS.includes(env.TELEGRAM_TOKEN)) {
      if (env.BOT_NAME && ENV.TELEGRAM_AVAILABLE_TOKENS.length === ENV.TELEGRAM_BOT_NAME.length) {
        ENV.TELEGRAM_BOT_NAME.push(env.BOT_NAME);
      }
      ENV.TELEGRAM_AVAILABLE_TOKENS.push(env.TELEGRAM_TOKEN);
    }
    if (env.OPENAI_API_DOMAIN && !ENV.OPENAI_API_BASE) {
      ENV.USER_CONFIG.OPENAI_API_BASE = `${env.OPENAI_API_DOMAIN}/v1`;
    }
    if (env.WORKERS_AI_MODEL && !ENV.USER_CONFIG.WORKERS_CHAT_MODEL) {
      ENV.USER_CONFIG.WORKERS_CHAT_MODEL = env.WORKERS_AI_MODEL;
    }
    if (env.API_KEY && ENV.USER_CONFIG.OPENAI_API_KEY.length === 0) {
      ENV.USER_CONFIG.OPENAI_API_KEY = env.API_KEY.split(",");
    }
    if (env.CHAT_MODEL && !ENV.USER_CONFIG.OPENAI_CHAT_MODEL) {
      ENV.USER_CONFIG.OPENAI_CHAT_MODEL = env.CHAT_MODEL;
    }
    if (!ENV.USER_CONFIG.SYSTEM_INIT_MESSAGE) {
      ENV.USER_CONFIG.SYSTEM_INIT_MESSAGE = ENV.I18N?.env?.system_init_message || "You are a helpful assistant";
    }
  }
}

// src/config/context.js
function trimUserConfig(userConfig) {
  const config = {
    ...userConfig
  };
  const keysSet = new Set(userConfig.DEFINE_KEYS);
  for (const key of ENV.LOCK_USER_CONFIG_KEYS) {
    keysSet.delete(key);
  }
  keysSet.add("DEFINE_KEYS");
  for (const key of Object.keys(config)) {
    if (!keysSet.has(key)) {
      delete config[key];
    }
  }
  return config;
}
var ShareContext = class {
  currentBotId = null;
  currentBotToken = null;
  currentBotName = null;
  chatHistoryKey = null;
  chatLastMessageIdKey = null;
  configStoreKey = null;
  groupAdminKey = null;
  usageKey = null;
  chatType = null;
  chatId = null;
  speakerId = null;
  extraMessageContext = null;
  telegraphAccessTokenKey = null;
  telegraphAccessToken = null;
  telegraphPath = null;
  scheduleDeteleKey = "schedule_detele_message";
  sentMessageIds = null;
  messageId = null;
};
var CurrentChatContext = class {
  chat_id = null;
  reply_to_message_id = null;
  parse_mode = ENV.DEFAULT_PARSE_MODE;
  message_id = null;
  reply_markup = null;
  allow_sending_without_reply = null;
  disable_web_page_preview = ENV.DISABLE_WEB_PREVIEW;
};
var Context = class {
  // 用户配置
  USER_CONFIG = new UserConfig();
  CURRENT_CHAT_CONTEXT = new CurrentChatContext();
  SHARE_CONTEXT = new ShareContext();
  /**
   * @inner
   * @param {string | number} chatId
   * @param {string | number} replyToMessageId
   */
  _initChatContext(chatId, replyToMessageId) {
    this.CURRENT_CHAT_CONTEXT.chat_id = chatId;
    this.CURRENT_CHAT_CONTEXT.reply_to_message_id = replyToMessageId;
    if (replyToMessageId) {
      this.CURRENT_CHAT_CONTEXT.allow_sending_without_reply = true;
    }
  }
  //
  /**
   * 初始化用户配置
   * @inner
   * @param {string | null} storeKey
   */
  async _initUserConfig(storeKey) {
    try {
      this.USER_CONFIG = {
        ...ENV.USER_CONFIG
      };
      const userConfig = JSON.parse(await DATABASE.get(storeKey) || "{}");
      mergeEnvironment(this.USER_CONFIG, trimUserConfig(userConfig));
    } catch (e2) {
      console.error(e2);
    }
  }
  /**
   * @param {string} token
   */
  initTelegramContext(token) {
    const telegramIndex = ENV.TELEGRAM_AVAILABLE_TOKENS.indexOf(token);
    if (telegramIndex === -1) {
      throw new Error("Token not allowed");
    }
    this.SHARE_CONTEXT.currentBotToken = token;
    this.SHARE_CONTEXT.currentBotId = token.split(":")[0];
    if (ENV.TELEGRAM_BOT_NAME.length > telegramIndex) {
      this.SHARE_CONTEXT.currentBotName = ENV.TELEGRAM_BOT_NAME[telegramIndex];
    }
  }
  /**
   *
   * @inner
   * @param {TelegramMessage} message
   */
  async _initShareContext(message) {
    this.SHARE_CONTEXT.usageKey = `usage:${this.SHARE_CONTEXT.currentBotId}`;
    const id = message?.chat?.id;
    if (id === void 0 || id === null) {
      throw new Error("Chat id not found");
    }
    const botId = this.SHARE_CONTEXT.currentBotId;
    let historyKey = `history:${id}`;
    let configStoreKey = `user_config:${id}`;
    let groupAdminKey = null;
    let telegraphAccessTokenKey = `telegraph_access_token:${id}`;
    if (botId) {
      historyKey += `:${botId}`;
      configStoreKey += `:${botId}`;
    }
    if (message?.chat?.is_forum && message?.is_topic_message) {
      if (message?.message_thread_id) {
        historyKey += `:${message.message_thread_id}`;
        configStoreKey += `:${message.message_thread_id}`;
      }
    }
    if (CONST.GROUP_TYPES.includes(message.chat?.type)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE && message.from.id) {
        historyKey += `:${message.from.id}`;
        configStoreKey += `:${message.from.id}`;
      }
      groupAdminKey = `group_admin:${id}`;
    }
    this.SHARE_CONTEXT.chatHistoryKey = historyKey;
    this.SHARE_CONTEXT.chatLastMessageIdKey = `last_message_id:${historyKey}`;
    this.SHARE_CONTEXT.configStoreKey = configStoreKey;
    this.SHARE_CONTEXT.groupAdminKey = groupAdminKey;
    this.SHARE_CONTEXT.telegraphAccessTokenKey = telegraphAccessTokenKey;
    this.SHARE_CONTEXT.chatType = message.chat?.type;
    this.SHARE_CONTEXT.chatId = message.chat.id;
    this.SHARE_CONTEXT.speakerId = message.from.id || message.chat.id;
    this.SHARE_CONTEXT.messageId = message.message_id;
    if (ENV.SCHEDULE_TIME >= 5)
      this.SHARE_CONTEXT.sentMessageIds = /* @__PURE__ */ new Set();
  }
  /**
   * @param {TelegramMessage} message
   * @returns {Promise<void>}
   */
  async initContext(message) {
    const chatId = message?.chat?.id;
    let replyId = CONST.GROUP_TYPES.includes(message.chat?.type) ? message.message_id : null;
    if (ENV.EXTRA_MESSAGE_CONTEXT && ENV.ENABLE_REPLY_TO_MENTION && CONST.GROUP_TYPES.includes(message.chat?.type) && message?.reply_to_message && this.SHARE_CONTEXT.currentBotId !== `${message?.reply_to_message?.from?.id}`) {
      replyId = message.reply_to_message.message_id;
    }
    this._initChatContext(chatId, replyId);
    await this._initShareContext(message);
  }
};

// src/agent/stream.js
var Stream = class {
  constructor(response, controller, decoder = null, parser = null) {
    this.response = response;
    this.controller = controller;
    this.decoder = decoder || new SSEDecoder();
    this.parser = parser || openaiSseJsonParser;
  }
  async *iterMessages() {
    if (!this.response.body) {
      this.controller.abort();
      throw new Error(`Attempted to iterate over a response with no body`);
    }
    const lineDecoder = new LineDecoder();
    const iter = this.response.body;
    for await (const chunk of iter) {
      for (const line of lineDecoder.decode(chunk)) {
        const sse = this.decoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = this.decoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  async *[Symbol.asyncIterator]() {
    let done = false;
    try {
      for await (const sse of this.iterMessages()) {
        if (done) {
          continue;
        }
        if (!sse) {
          continue;
        }
        const { finish, data } = this.parser(sse);
        if (finish) {
          done = finish;
          continue;
        }
        if (data) {
          yield data;
        }
      }
      done = true;
    } catch (e2) {
      if (e2 instanceof Error && e2.name === "AbortError")
        return;
      throw e2;
    } finally {
      if (!done)
        this.controller.abort();
    }
  }
};
var SSEDecoder = class {
  constructor() {
    this.event = null;
    this.data = [];
    this.chunks = [];
  }
  decode(line) {
    if (line.endsWith("\r")) {
      line = line.substring(0, line.length - 1);
    }
    if (!line) {
      if (!this.event && !this.data.length) {
        return null;
      }
      const sse = {
        event: this.event,
        data: this.data.join("\n")
      };
      this.event = null;
      this.data = [];
      this.chunks = [];
      return sse;
    }
    this.chunks.push(line);
    if (line.startsWith(":")) {
      return null;
    }
    let [fieldName, _, value] = this.partition(line, ":");
    if (value.startsWith(" ")) {
      value = value.substring(1);
    }
    if (fieldName === "event") {
      this.event = value;
    } else if (fieldName === "data") {
      this.data.push(value);
    }
    return null;
  }
  partition(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
      return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
    }
    return [str, "", ""];
  }
};
function openaiSseJsonParser(sse) {
  if (sse.data.startsWith("[DONE]")) {
    return { finish: true };
  }
  if (sse.event === null) {
    try {
      return { data: JSON.parse(sse.data) };
    } catch (e2) {
      console.error(e2, sse);
    }
  }
  return {};
}
function cohereSseJsonParser(sse) {
  switch (sse.event) {
    case "text-generation":
      try {
        return { data: JSON.parse(sse.data) };
      } catch (e2) {
        console.error(e2, sse.data);
        return {};
      }
    case "stream-start":
      return {};
    case "stream-end":
      return { finish: true };
    default:
      return {};
  }
}
function anthropicSseJsonParser(sse) {
  switch (sse.event) {
    case "content_block_delta":
      try {
        return { data: JSON.parse(sse.data) };
      } catch (e2) {
        console.error(e2, sse.data);
        return {};
      }
    case "message_start":
    case "content_block_start":
    case "content_block_stop":
      return {};
    case "message_stop":
      return { finish: true };
    default:
      return {};
  }
}
var LineDecoder = class {
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text2 = this.decodeText(chunk);
    if (this.trailingCR) {
      text2 = "\r" + text2;
      this.trailingCR = false;
    }
    if (text2.endsWith("\r")) {
      this.trailingCR = true;
      text2 = text2.slice(0, -1);
    }
    if (!text2) {
      return [];
    }
    const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text2[text2.length - 1] || "");
    let lines = text2.split(LineDecoder.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    var _a;
    if (bytes == null)
      return "";
    if (typeof bytes === "string")
      return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(
        `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
      );
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        (_a = this.textDecoder) !== null && _a !== void 0 ? _a : this.textDecoder = new TextDecoder("utf8");
        return this.textDecoder.decode(bytes, { stream: true });
      }
      throw new Error(
        `Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`
      );
    }
    throw new Error(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;

// src/agent/request.js
function fixOpenAICompatibleOptions(options) {
  options = options || {};
  options.streamBuilder = options.streamBuilder || function(r, c) {
    return new Stream(r, c);
  };
  options.contentExtractor = options.contentExtractor || function(d) {
    return d?.choices?.[0]?.delta?.content;
  };
  options.functionCallExtractor = options.functionCallExtractor || function(d, call_list) {
    const chunck = d?.choices?.[0]?.delta?.tool_calls;
    if (!Array.isArray(chunck))
      return;
    for (const a of chunck) {
      if (!Object.hasOwn(a, "index")) {
        throw new Error(`The function chunck dont have index: ${JSON.stringify(chunck)}`);
      }
      if (a.type && a.type === "function") {
        call_list[a.index] = a;
      } else {
        const args_chunck = a.function.arguments;
        call_list[a.index].function.arguments += args_chunck;
      }
    }
  };
  options.fullContentExtractor = options.fullContentExtractor || function(d) {
    return d.choices?.[0]?.message.content;
  };
  options.errorExtractor = options.errorExtractor || function(d) {
    return d.error?.message;
  };
  return options;
}
function isJsonResponse(resp) {
  if (!resp.headers?.get("content-type")) {
    return false;
  }
  return resp.headers.get("content-type").indexOf("json") !== -1;
}
function isEventStreamResponse(resp) {
  if (!resp.headers?.get("content-type")) {
    return false;
  }
  const types = ["application/stream+json", "text/event-stream"];
  const content = resp.headers.get("content-type");
  for (const type of types) {
    if (content.indexOf(type) !== -1) {
      return true;
    }
  }
  return false;
}
async function requestChatCompletions(url, header2, body, context, onStream, onResult = null, options = null) {
  const controller = new AbortController();
  const { signal } = controller;
  let timeoutID = null;
  if (ENV.CHAT_COMPLETE_API_TIMEOUT > 0) {
    timeoutID = setTimeout(() => controller.abort(), ENV.CHAT_COMPLETE_API_TIMEOUT * 1e3);
  }
  let alltimeoutID = null;
  if (ENV.ALL_COMPLETE_API_TIMEOUT > 0) {
    alltimeoutID = setTimeout(() => controller.abort(), ENV.ALL_COMPLETE_API_TIMEOUT * 1e3);
  }
  if (ENV.DEBUG_MODE) {
    console.log(`url:
${url}
header:
${JSON.stringify(header2)}
body:
${JSON.stringify(body, null, 2)}`);
  }
  context._info.updateStartTime();
  console.log("chat start.");
  if (body.model) {
    context._info.config("model", body.model);
  } else {
    const chatAgent = loadChatLLM(context)?.name;
    const model = currentChatModel(chatAgent, context);
    context._info.config("model", model);
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header2,
    body: JSON.stringify(body),
    signal
  });
  if (timeoutID) {
    clearTimeout(timeoutID);
  }
  options = fixOpenAICompatibleOptions(options);
  const immediatePromise = Promise.resolve();
  let isNeedToSend = true;
  let nextUpdateTime = Date.now();
  if (onStream && resp.ok && isEventStreamResponse(resp)) {
    const stream = options.streamBuilder(resp, controller);
    let contentFull = "";
    const tool_calls = [];
    let lengthDelta = 0;
    let updateStep = 20;
    let msgPromise = null;
    let lastChunk = null;
    let usage = null;
    try {
      for await (const data of stream) {
        const c = options.contentExtractor(data) || "";
        usage = data?.usage;
        if (body.tools?.length > 0)
          options?.functionCallExtractor(data, tool_calls);
        if (c === "" && tool_calls.length === 0)
          continue;
        lengthDelta += c.length;
        if (lastChunk)
          contentFull = contentFull + lastChunk;
        if (tool_calls.length > 0) {
          if (isNeedToSend) {
            msgPromise = onStream(`\`Starting call...\``);
            isNeedToSend = false;
          }
          lastChunk = c;
          continue;
        }
        if (lastChunk && lengthDelta > updateStep) {
          lengthDelta = 0;
          updateStep += 25;
          if (ENV.TELEGRAM_MIN_STREAM_INTERVAL > 0) {
            if (nextUpdateTime > Date.now())
              continue;
            nextUpdateTime = Date.now() + ENV.TELEGRAM_MIN_STREAM_INTERVAL;
          }
          if (!msgPromise || !await Promise.race([msgPromise, immediatePromise])) {
            msgPromise = onStream(`${contentFull}\u25CF`);
          }
        }
        lastChunk = c;
      }
      contentFull += lastChunk;
    } catch (e2) {
      contentFull += `
ERROR: ${e2.message}`;
    }
    if (usage) {
      context._info.setToken(usage?.prompt_tokens ?? 0, usage?.completion_tokens ?? 0);
    }
    await msgPromise;
    if (alltimeoutID) {
      clearTimeout(alltimeoutID);
    }
    if (body.tools?.length > 0) {
      return {
        tool_calls,
        content: contentFull
      };
    } else
      return contentFull;
  }
  if (alltimeoutID) {
    clearTimeout(alltimeoutID);
  }
  if (ENV.DEBUG_MODE) {
    const r = await resp.clone().text();
    console.log("resp result: ", r);
  }
  if (!isJsonResponse(resp)) {
    throw new Error(resp.statusText);
  }
  const result = await resp.json();
  if (!result) {
    throw new Error("Empty response");
  }
  if (options.errorExtractor(result)) {
    throw new Error(options.errorExtractor(result));
  }
  try {
    if (result.usage) {
      context._info.setToken(result.usage.prompt_tokens ?? 0, result.usage.completion_tokens ?? 0);
    }
    return options.fullContentExtractor(result);
  } catch (e2) {
    throw Error(JSON.stringify(result));
  }
}

// src/prompt/tools.js
var tools_default2 = {
  search: {
    prompt: "\u4F5C\u4E3A\u667A\u80FD\u52A9\u624B\uFF0C\u8BF7\u6309\u7167\u4EE5\u4E0B\u6B65\u9AA4\u6709\u6548\u5206\u6790\u5E76\u63D0\u53D6\u6211\u63D0\u4F9B\u7684\u641C\u7D22\u7ED3\u679C\uFF0C\u4EE5\u7B80\u6D01\u660E\u4E86\u7684\u65B9\u5F0F\u56DE\u7B54\u6211\u7684\u95EE\u9898\uFF1A\n\n1. \u9605\u8BFB\u548C\u8BC4\u4F30\uFF1A\u4ED4\u7EC6\u9605\u8BFB\u6240\u6709\u641C\u7D22\u7ED3\u679C\uFF0C\u8BC6\u522B\u5E76\u4F18\u5148\u83B7\u53D6\u6765\u81EA\u53EF\u9760\u548C\u6700\u65B0\u6765\u6E90\u7684\u4FE1\u606F\u3002\u8003\u8651\u56E0\u7D20\u5305\u62EC\u5B98\u65B9\u6765\u6E90\u3001\u77E5\u540D\u673A\u6784\u4EE5\u53CA\u4FE1\u606F\u7684\u66F4\u65B0\u65F6\u95F4\u3002\n\n2. \u63D0\u53D6\u5173\u952E\u4FE1\u606F\uFF1A\n   \u2022 *\u6C47\u7387\u67E5\u8BE2*\uFF1A\u63D0\u4F9B\u6700\u65B0\u6C47\u7387\u5E76\u8FDB\u884C\u5FC5\u8981\u7684\u6362\u7B97\u3002\n   \u2022 *\u5929\u6C14\u67E5\u8BE2*\uFF1A\u63D0\u4F9B\u5177\u4F53\u5730\u70B9\u548C\u65F6\u95F4\u7684\u5929\u6C14\u9884\u62A5\u3002\n   \u2022 *\u4E8B\u5B9E\u6027\u95EE\u9898*\uFF1A\u627E\u51FA\u6743\u5A01\u56DE\u7B54\u3002\n\n3. \u7B80\u6D01\u56DE\u7B54\uFF1A\u5BF9\u63D0\u53D6\u7684\u4FE1\u606F\u8FDB\u884C\u7EFC\u5408\u5206\u6790\uFF0C\u7ED9\u51FA\u7B80\u660E\u627C\u8981\u7684\u56DE\u7B54\u3002\n\n4. \u8BC6\u522B\u4E0D\u786E\u5B9A\u6027\uFF1A\u5982\u679C\u4FE1\u606F\u5B58\u5728\u77DB\u76FE\u6216\u4E0D\u786E\u5B9A\u6027\uFF0C\u8BF7\u89E3\u91CA\u53EF\u80FD\u539F\u56E0\u3002\n\n5. \u8BF4\u660E\u4FE1\u606F\u4E0D\u8DB3\uFF1A\u5982\u679C\u641C\u7D22\u7ED3\u679C\u65E0\u6CD5\u5B8C\u5168\u56DE\u7B54\u95EE\u9898\uFF0C\u6307\u51FA\u9700\u8981\u7684\u989D\u5916\u4FE1\u606F\u3002\n\n6. \u7528\u6237\u53CB\u597D\uFF1A\u4F7F\u7528\u7B80\u5355\u6613\u61C2\u7684\u8BED\u8A00\uFF0C\u5FC5\u8981\u65F6\u63D0\u4F9B\u7B80\u77ED\u89E3\u91CA\uFF0C\u786E\u4FDD\u56DE\u7B54\u6613\u4E8E\u7406\u89E3\u3002\n\n7. \u9644\u52A0\u4FE1\u606F\uFF1A\u6839\u636E\u9700\u8981\u63D0\u4F9B\u989D\u5916\u76F8\u5173\u4FE1\u606F\u6216\u5EFA\u8BAE\uFF0C\u4EE5\u589E\u5F3A\u56DE\u7B54\u7684\u4EF7\u503C\u3002\n\n8. \u6765\u6E90\u6807\u6CE8\uFF1A\u5728\u56DE\u7B54\u4E2D\u6E05\u6670\u6807\u6CE8\u4FE1\u606F\u6765\u6E90\uFF0C\u5305\u62EC\u6765\u6E90\u7F51\u7AD9\u6216\u673A\u6784\u540D\u79F0\u53CA\u6570\u636E\u7684\u53D1\u5E03\u6216\u66F4\u65B0\u65F6\u95F4\u3002\n\n9. \u53C2\u8003\u5217\u8868\uFF1A\u5982\u679C\u5F15\u7528\u4E86\u591A\u4E2A\u6765\u6E90\uFF0C\u5728\u56DE\u7B54\u6700\u540E\u63D0\u4F9B\u7B80\u77ED\u7684\u53C2\u8003\u5217\u8868\uFF0C\u5217\u51FA\u4E3B\u8981\u4FE1\u606F\u6765\u6E90\u3002\n\n\u8BF7\u786E\u4FDD\u76EE\u6807\u662F\u63D0\u4F9B\u6700\u65B0\u3001\u6700\u76F8\u5173\u548C\u6700\u6709\u7528\u7684\u4FE1\u606F\uFF0C\u76F4\u63A5\u56DE\u5E94\u6211\u7684\u95EE\u9898\u3002\u907F\u514D\u5197\u957F\u7684\u7EC6\u8282\uFF0C\u805A\u7126\u4E8E\u6211\u6700\u5173\u5FC3\u7684\u6838\u5FC3\u7B54\u6848\uFF0C\u5E76\u901A\u8FC7\u53EF\u9760\u7684\u6765\u6E90\u589E\u5F3A\u56DE\u7B54\u7684\u53EF\u4FE1\u5EA6\u3002Tip: \u4E0D\u8981\u4EE5\u4F60\u7684\u77E5\u8BC6\u5E93\u65F6\u95F4\u4F5C\u4E3A\u8BC4\u5224\u6807\u51C6",
    extra_params: { tempurature: 0.7, "top_p": 0.4 },
    render: (result) => `\u641C\u7D22\u7ED3\u679C:
${result}`
  },
  web_crawler: {
    prompt: '\u4F5C\u4E3A\u4E00\u4E2A\u9AD8\u6548\u7684\u5185\u5BB9\u5206\u6790\u548C\u603B\u7ED3\u52A9\u624B\uFF0C\u4F60\u7684\u4EFB\u52A1\u662F\u5BF9\u7528\u6237\u63D0\u4F9B\u7684\u7F51\u9875\u6216PDF\u5185\u5BB9\u8FDB\u884C\u5168\u9762\u800C\u7B80\u6D01\u7684\u603B\u7ED3\u3002\u8BF7\u9075\u5FAA\u4EE5\u4E0B\u6307\u5357\uFF1A\n    1. \u4ED4\u7EC6\u9605\u8BFB\u7528\u6237\u63D0\u4F9B\u7684\u5168\u90E8\u5185\u5BB9\uFF0C\u786E\u4FDD\u7406\u89E3\u4E3B\u8981\u89C2\u70B9\u548C\u5173\u952E\u4FE1\u606F\u3002\n    2. \u8BC6\u522B\u5E76\u63D0\u70BC\u51FA\u5185\u5BB9\u7684\u6838\u5FC3\u4E3B\u9898\u548C\u4E3B\u8981\u8BBA\u70B9\u3002\n    3. \u603B\u7ED3\u65F6\u5E94\u5305\u62EC\u4EE5\u4E0B\u8981\u7D20\uFF1A\n      \u2022 \u5185\u5BB9\u7684\u4E3B\u8981\u76EE\u7684\u6216\u4E3B\u9898\n      \u2022 \u5173\u952E\u89C2\u70B9\u6216\u8BBA\u636E\n      \u2022 \u91CD\u8981\u7684\u6570\u636E\u6216\u7EDF\u8BA1\u4FE1\u606F\uFF08\u5982\u679C\u6709\uFF09\n      \u2022 \u4F5C\u8005\u7684\u7ED3\u8BBA\u6216\u5EFA\u8BAE\uFF08\u5982\u679C\u9002\u7528\uFF09\n    4. \u4FDD\u6301\u5BA2\u89C2\u6027\uFF0C\u51C6\u786E\u53CD\u6620\u539F\u6587\u7684\u89C2\u70B9\uFF0C\u4E0D\u6DFB\u52A0\u4E2A\u4EBA\u89E3\u91CA\u6216\u8BC4\u8BBA\u3002\n    5. \u4F7F\u7528\u6E05\u6670\u3001\u7B80\u6D01\u7684\u8BED\u8A00\uFF0C\u907F\u514D\u4F7F\u7528\u8FC7\u4E8E\u4E13\u4E1A\u6216\u6666\u6DA9\u7684\u672F\u8BED\u3002\n    6. \u603B\u7ED3\u7684\u957F\u5EA6\u5E94\u8BE5\u662F\u539F\u6587\u768410-15%\uFF0C\u9664\u975E\u7528\u6237\u7279\u522B\u6307\u5B9A\u5176\u4ED6\u957F\u5EA6\u8981\u6C42\u3002\n    7. \u5982\u679C\u5185\u5BB9\u5305\u542B\u591A\u4E2A\u90E8\u5206\u6216\u7AE0\u8282\uFF0C\u53EF\u4EE5\u4F7F\u7528\u7B80\u77ED\u7684\u5C0F\u6807\u9898\u6765\u7EC4\u7EC7\u4F60\u7684\u603B\u7ED3\u3002\n    8. \u5982\u679C\u539F\u6587\u5305\u542B\u56FE\u8868\u6216\u56FE\u50CF\u7684\u91CD\u8981\u4FE1\u606F\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u63D0\u53CA\u8FD9\u4E00\u70B9\u3002\n    9. \u5982\u679C\u5185\u5BB9\u6D89\u53CA\u65F6\u95F4\u654F\u611F\u7684\u4FE1\u606F\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u6CE8\u660E\u5185\u5BB9\u7684\u53D1\u5E03\u65E5\u671F\u6216\u7248\u672C\u3002\n    10. \u5982\u679C\u539F\u6587\u5B58\u5728\u660E\u663E\u7684\u504F\u89C1\u6216\u4E89\u8BAE\u6027\u89C2\u70B9\uFF0C\u8BF7\u5728\u603B\u7ED3\u4E2D\u5BA2\u89C2\u5730\u6307\u51FA\u8FD9\u4E00\u70B9\u3002\n    11. \u603B\u7ED3\u5B8C\u6210\u540E\uFF0C\u63D0\u4F9B1-3\u4E2A\u5173\u952E\u8BCD\u6216\u77ED\u8BED\uFF0C\u6982\u62EC\u5185\u5BB9\u7684\u6838\u5FC3\u4E3B\u9898\u3002\n    12. \u5982\u679C\u7528\u6237\u8981\u6C42\uFF0C\u53EF\u4EE5\u5728\u603B\u7ED3\u7684\u6700\u540E\u6DFB\u52A0\u4E00\u4E2A\u7B80\u77ED\u7684"\u8FDB\u4E00\u6B65\u9605\u8BFB\u5EFA\u8BAE"\u90E8\u5206, \u4EE5\u53CA\u5FC5\u8981\u7684\u5F15\u7528\u6765\u6E90\u3002\n    \u8BF7\u8BB0\u4F4F\uFF0C\u4F60\u7684\u76EE\u6807\u662F\u63D0\u4F9B\u4E00\u4E2A\u5168\u9762\u3001\u51C6\u786E\u3001\u6613\u4E8E\u7406\u89E3\u7684\u603B\u7ED3\uFF0C\u5E2E\u52A9\u7528\u6237\u5FEB\u901F\u628A\u63E1\u5185\u5BB9\u7684\u7CBE\u9AD3\u3002\u5982\u679C\u5185\u5BB9\u7279\u522B\u957F\u6216\u590D\u6742\uFF0C\u4F60\u53EF\u4EE5\u8BE2\u95EE\u7528\u6237\u662F\u5426\u9700\u8981\u66F4\u8BE6\u7EC6\u7684\u603B\u7ED3\u6216\u7279\u5B9A\u90E8\u5206\u7684\u6DF1\u5165\u5206\u6790\u3002\u8BF7\u5728\u6700\u540E\u9762\u6807\u6CE8\u5F15\u7528\u7684\u94FE\u63A5.',
    extra_params: { tempurature: 0.7, "top_p": 0.4 },
    render: (result) => `\u7F51\u9875\u5185\u5BB9:
${result}`
  },
  default: {
    prompt: "\u4F60\u662F\u4E00\u4E2A\u667A\u80FD\u52A9\u624B\uFF0C\u5177\u5907\u5E7F\u6CDB\u7684\u77E5\u8BC6\u5E93\uFF0C\u64C5\u957F\u5206\u6790\u7528\u6237\u8BDD\u8BED\u903B\u8F91\uFF0C\u80FD\u6839\u636E\u7528\u6237\u95EE\u9898\u9009\u62E9\u5408\u9002\u7684\u51FD\u6570\u8C03\u7528\uFF0C\u5728\u65E0\u9700\u8C03\u7528\u51FD\u6570\u7684\u60C5\u51B5\u4E0B\uFF0C\u4E5F\u80FD\u5B8C\u7F8E\u89E3\u7B54\u7528\u6237\u7684\u95EE\u9898\u3002\u6CE8\u610F\uFF0C\u4F60\u6240\u77E5\u9053\u7684\u6700\u65B0\u65F6\u95F4\u662F\u8FC7\u65F6\u7684\u3002",
    extra_params: { temperature: 0.5, "top_p": 0.4, "max_tokens": 100 }
  }
};

// src/agent/toolHander.js
async function handleOpenaiFunctionCall(params, context, onStream) {
  let call_times = 0;
  const func_results = [];
  try {
    const { tools = context.USER_CONFIG.USE_TOOLS } = params;
    const { tools_name, tools_struct } = filterValidTools(tools) || {};
    if (tools_name) {
      const payload = renderCallPayload(params, tools_struct, context, onStream);
      const opt = {};
      const exposure_vars = ["JINA_API_KEY"];
      exposure_vars.forEach((i) => opt[i] = context.USER_CONFIG[i]);
      const stopLoopType = ["web_crawler"];
      let chatPromise = Promise.resolve();
      while (call_times < ENV.FUNC_LOOP_TIMES && payload.body.tools?.length > 0) {
        const start_time = Date.now();
        call_times += 1;
        const llm_content = await functionCallWithLLM(context, payload, tools_name, chatPromise);
        if (!Array.isArray(llm_content)) {
          return { call_times, llm_content, func_results };
        }
        context._info.setCallInfo(((Date.now() - start_time) / 1e3).toFixed(1) + "s", "c_t");
        setTimeout(() => {
          chatPromise = sendMessageToTelegramWithContext(context)(`\`call ${llm_content[0].name}\``);
        }, 0);
        const func_result = await functionExec(llm_content, context, opt);
        const func_type = ENV.TOOLS[llm_content[0].name].type;
        func_results.push({ type: func_type, content: func_result });
        trimPayload(payload, func_results, func_type);
        if (stopLoopType.includes(func_type))
          break;
      }
      await chatPromise;
    }
    return { call_times, func_results };
  } catch (e2) {
    console.error(e2.message);
    let errorMsg = e2.message;
    if (e2.name === "AbortError") {
      errorMsg = "call timeout";
    }
    context._info.setCallInfo(`\u26A0\uFE0F${errorMsg.slice(0, 50)}`);
    return { call_times, message: e2.message, func_results };
  }
}
function renderCallPayload(params, tools_structs, context, onStream) {
  const { url, header: header2, prompt, body } = params;
  let call_url = url;
  if (context.USER_CONFIG.FUNCTION_CALL_BASE) {
    call_url = context.USER_CONFIG.FUNCTION_CALL_BASE + "/chat/completions";
  }
  const call_key = context.USER_CONFIG.FUNCTION_CALL_API_KEY;
  const call_headers = { ...header2, ...call_key && { Authorization: `Bearer ${call_key}` } || {} };
  const options = {
    fullContentExtractor: (d) => {
      return d.choices?.[0]?.message;
    }
  };
  const call_body = {
    model: context.USER_CONFIG.FUNCTION_CALL_MODEL,
    tools: tools_structs,
    tool_choice: "auto",
    ...tools_default2.default.extra_params,
    messages: [...body.messages],
    stream: context.USER_CONFIG.FUNCTION_REPLY_ASAP,
    ...context.USER_CONFIG.ENABLE_SHOWTOKEN && { stream_options: { include_usage: true } }
  };
  let stream = null;
  if (context.USER_CONFIG.FUNCTION_REPLY_ASAP) {
    delete call_body["max_tokens"];
    stream = onStream;
  }
  const tool_prompt = tools_default2.default.prompt;
  if (prompt)
    call_body.messages.shift();
  call_body.messages.unshift({ role: "system", content: tool_prompt });
  return { url: call_url, header: call_headers, body: call_body, stream, options };
}
function renderAfterCallPayload(context, body, func_results, prompt) {
  if (func_results.length === 0)
    return;
  const last_tool_type = func_results.at(-1).type;
  const tool_prompt = tools_default2[last_tool_type].prompt;
  if (tool_prompt) {
    if (prompt) {
      body.messages[0].content = tool_prompt;
    } else
      body.messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: tool_prompt });
  }
  if (func_results.length > 0) {
    for (const { type, content } of func_results) {
      body.messages.at(-1).content += "\n\n" + tools_default2[type].render(content.join("\n\n"));
    }
  }
  for (const [key, value] of Object.entries(tools_default2[last_tool_type]?.extra_params || {})) {
    body[key] = value;
  }
}
function filterValidTools(tools) {
  const valid_tools = tools.filter((i) => Object.keys(ENV.TOOLS).includes(i));
  if (valid_tools.length > 0) {
    const tools_struct = valid_tools.map((tool) => {
      return {
        "type": "function",
        "function": ENV.TOOLS[tool].schema,
        "strict": true
      };
    });
    return { tools_name: valid_tools, tools_struct };
  }
}
async function functionCallWithLLM(context, payload, tools_name, chatPromise) {
  const { url, header: header2, body, stream, options } = payload;
  setTimeout(() => {
    chatPromise = sendMessageToTelegramWithContext(context)(`\`chat with llm.\``);
  }, 0);
  const llm_resp = await requestChatCompletions(url, header2, body, context, stream, null, options);
  if (!llm_resp.tool_calls) {
    return llm_resp.content;
  }
  const valid_calls = llm_resp?.tool_calls?.filter((i) => tools_name.includes(i.function.name));
  if (valid_calls.length === 0)
    return llm_resp.content;
  await chatPromise;
  return valid_calls.map((func) => ({
    name: func.function.name,
    args: JSON.parse(func.function.arguments)
  }));
}
async function functionExec(funcList, context, opt) {
  const controller = new AbortController();
  const { signal } = controller;
  let timeoutId = null;
  const INFO_LENGTH_LIMIT = 80;
  if (ENV.FUNC_TIMEOUT > 0) {
    timeoutId = setTimeout(() => controller.abort(), ENV.FUNC_TIMEOUT * 1e3);
  }
  let exec_times = ENV.CON_EXEC_FUN_NUM;
  const funcPromise = [];
  for (const { name, args } of funcList) {
    if (exec_times <= 0)
      break;
    const args_i = Object.values(args).join();
    context._info.setCallInfo(`${name}:${args_i.length > INFO_LENGTH_LIMIT ? args_i.slice(0, INFO_LENGTH_LIMIT) : args_i}`, "f_i");
    console.log("start use function: ", name);
    const params = args;
    if (ENV.TOOLS[name].need) {
      params.keys = opt[ENV.TOOLS[name].need];
    }
    funcPromise.push(ENV.TOOLS[name].func(params, signal));
    exec_times--;
  }
  const func_resp = await raceTimeout(funcPromise);
  if (timeoutId)
    clearTimeout(timeoutId);
  const func_time = [];
  const content = func_resp.map((r) => {
    func_time.push(r.time || "");
    return r.content || r || "";
  });
  console.log("func call content: ", content.join("\n\n").substring(0, 500));
  if (func_time.join("").trim())
    context._info.setCallInfo(func_time.join(), "f_t");
  if (!content.join("").trim()) {
    context._info.setCallInfo(`func call response is none or timeout.`);
    throw new Error("None response in func call.");
  }
  return content;
}
function trimPayload(payload, func_results, func_type) {
  const render = tools_default2[func_type].render;
  const all_content = func_results.map((i) => i.content).join("\n\n").trim();
  payload.body.messages.push({
    role: "user",
    content: render?.(all_content) || all_content
  });
  payload.body.tools = payload.body.tools.filter((t) => ENV.TOOLS[t.function.name].type !== func_type);
}
async function raceTimeout(promises, ms = ENV.FUNC_TIMEOUT * 1e3) {
  if (ms <= 0)
    return Promise.all(promises);
  return Promise.all(promises.map((p) => Promise.race([p, new Promise((resolve) => setTimeout(resolve, ms))]))).then(
    (results) => results.filter(Boolean)
  );
}

// src/agent/openai.js
function openAIKeyFromContext(context) {
  const length = context.USER_CONFIG.OPENAI_API_KEY.length;
  return context.USER_CONFIG.OPENAI_API_KEY[Math.floor(Math.random() * length)];
}
function isOpenAIEnable(context) {
  return context.USER_CONFIG.OPENAI_API_KEY.length > 0;
}
function isLLMEnable(agent) {
  return (context) => {
    switch (agent) {
      case "silicon":
      case "deepseek":
        return !!context.USER_CONFIG.PROVIDERS[agent];
      default:
        return false;
    }
  };
}
async function renderOpenAIMessage(item) {
  const res = {
    role: item.role,
    content: item.content
  };
  if (item.images && item.images.length > 0) {
    res.content = [];
    res.content.push({ type: "text", text: item.content || "\u8BF7\u89E3\u8BFB\u8FD9\u5F20\u56FE" });
    for (const image of item.images) {
      switch (ENV.TELEGRAM_IMAGE_TRANSFER_MODE) {
        case "base64":
          res.content.push({
            type: "image_url",
            image_url: { url: renderBase64DataURI(await imageToBase64String(image)) }
          });
          break;
        case "url":
        default:
          res.content.push({ type: "image_url", image_url: { url: image } });
          break;
      }
    }
  }
  return res;
}
var openaiLikeSupportType = {
  // openai
  openai: ["text2text", "text2image", "image2text", "audio2text"],
  deepseek: ["text2text"],
  silicon: ["text2text", "text2image", "image2image"]
};
function openaiLikeAgent(context, type) {
  const userConfig = context.USER_CONFIG;
  const agent = type === "text2image" ? userConfig.AI_IMAGE_PROVIDER : userConfig.AI_PROVIDER;
  let config = {
    url: userConfig.OPENAI_API_BASE,
    key: openAIKeyFromContext(context)
  };
  let like_model = null;
  let like_url = userConfig.PROVIDERS[agent]?.base_url;
  switch (type) {
    case "text2image":
      config.model = userConfig.OPENAI_IMAGE_MODEL;
      like_model = userConfig.OPENAILIKE_IMAGE_MODEL;
      break;
    case "image2text":
      config.model = userConfig.OPENAI_VISION_MODEL;
      like_model = userConfig.OPENAILIKE_VISION_MODEL;
      break;
    case "audio2text":
      config.model = userConfig.OPENAI_STT_MODEL;
      like_model = userConfig.OPENAILIKE_STT_MODEL;
      break;
    case "text2text":
      config.model = userConfig.OPENAI_CHAT_MODEL;
      like_model = userConfig.OPENAILIKE_CHAT_MODEL;
      break;
    case "image2image":
      like_model = userConfig.OPENAILIKE_I2I_MODEL;
      break;
  }
  if (!openaiLikeSupportType[agent]?.includes(type) || !isLLMEnable(agent)(context)) {
    if (openaiLikeSupportType.openai.includes(type)) {
      return renderOpenaiLikeUrl(agent, type, config);
    } else
      throw new Error(`default agent not support ${type}`);
  }
  if (!like_model) {
    throw new Error(`${agent} ${type} model is not exist`);
  }
  if (context._info?.provider?.url && context._info?.provider?.key) {
    config.url = context._info?.provider?.url;
    config.key = context._info?.provider?.key;
    return renderOpenaiLikeUrl(agent, type, config);
  }
  switch (agent) {
    case "deepseek":
    case "silicon":
      if (userConfig.PROVIDERS[agent]?.key && like_url) {
        config = { key: userConfig.PROVIDERS[agent].key, url: like_url, model: like_model };
      }
  }
  return renderOpenaiLikeUrl(agent, type, config);
}
function renderOpenaiLikeUrl(agent, type, agentDetail) {
  switch (type) {
    case "text2text":
    case "image2text":
      agentDetail.url += "/chat/completions";
      break;
    case "text2image":
      if (agent === "silicon") {
        agentDetail.url += "/" + agentDetail.model + "/text-to-image";
      } else
        agentDetail.url += "/images/generations";
      break;
    case "audio2text":
      agentDetail.url += "/audio/transcriptions";
      break;
    case "image2image":
      if (agent === "silicon") {
        agentDetail.url += agentDetail.model + "/image-to-image";
      }
      break;
  }
  return agentDetail;
}
async function requestCompletionsFromOpenAI(params, context, onStream) {
  const { message, images, prompt, history } = params;
  const { url, key, model } = openaiLikeAgent(context, images && images.length > 0 ? "image2text" : "text2text");
  const header2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  };
  const messages = [...history || [], { role: "user", content: message, images }];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;
  const body = {
    model,
    ...extra_params,
    messages: await Promise.all(messages.map(renderOpenAIMessage)),
    stream: onStream != null,
    ...context.USER_CONFIG.ENABLE_SHOWTOKEN && { stream_options: { include_usage: true } }
  };
  if (message && !images && context.USER_CONFIG.USE_TOOLS?.length > 0) {
    const result = await handleOpenaiFunctionCall({ url, header: header2, body, prompt }, context, onStream);
    if (result.llm_content && !Array.isArray(result.llm_content) && context.USER_CONFIG.FUNCTION_REPLY_ASAP) {
      return result.llm_content;
    }
    renderAfterCallPayload(context, body, result.func_results, prompt);
    if (result.func_results.length > 0) {
      const resp_obj = { q: body.messages.at(-1).content };
      resp_obj.a = await requestChatCompletions(url, header2, body, context, onStream);
      return resp_obj;
    }
  }
  return requestChatCompletions(url, header2, body, context, onStream);
}
function renderPicResult(context, resp) {
  const render = {
    "openai": {
      url: resp?.data?.[0]?.url,
      revised_prompt: resp?.data?.[0]?.revised_prompt || ""
    },
    "silicon": { url: resp?.images?.[0]?.url }
  };
  return render[context.USER_CONFIG.AI_IMAGE_PROVIDER];
}
async function requestImageFromOpenAI(prompt, context) {
  const { url, key, model } = openaiLikeAgent(context, "text2image");
  context._info.config("model", model);
  const header2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    model
  };
  if (["silicon"].includes(context.USER_CONFIG.AI_IMAGE_PROVIDER)) {
    delete body.model;
  } else if (body.model === "dall-e-3") {
    body.quality = context.USER_CONFIG.DALL_E_IMAGE_QUALITY;
    body.style = context.USER_CONFIG.DALL_E_IMAGE_STYLE;
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header2,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return renderPicResult(context, resp);
}
async function requestTranscriptionFromOpenAI(audio, file_name, context) {
  const { url, key, model } = openaiLikeAgent(context, "audio2text");
  context._info.config("model", model);
  const header2 = {
    // 'Content-Type': 'multipart/form-data',
    "Authorization": `Bearer ${key}`,
    "Accept": "application/json"
  };
  const formData = new FormData();
  formData.append("file", audio, file_name);
  formData.append("model", model);
  if (context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS) {
    Object.entries(context.USER_CONFIG.OPENAI_STT_EXTRA_PARAMS).forEach(([k, v]) => {
      formData.append(k, v);
    });
  }
  formData.append("response_format", "json");
  let resp = await fetch(url, {
    method: "POST",
    headers: header2,
    body: formData,
    redirect: "follow"
  }).catch((e2) => {
    console.error(e2.message);
    return { ok: false, message: e2.message };
  });
  if (resp.ok) {
    resp = await resp.json();
    console.log(`Transcription: ${resp.text}`);
    return { ok: !resp.error, type: "text", content: resp.text, message: resp.error };
  } else {
    return { ok: false, message: resp.statusText };
  }
}

// src/agent/workersai.js
async function run(model, body, id, token) {
  return await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST",
      body: JSON.stringify(body)
    }
  );
}
function isWorkersAIEnable(context) {
  return !!(context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID && context.USER_CONFIG.CLOUDFLARE_TOKEN);
}
function renderWorkerAIMessage(item) {
  return {
    role: item.role,
    content: item.content
  };
}
async function requestCompletionsFromWorkersAI(params, context, onStream) {
  const { message, prompt, history } = params;
  const id = context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID;
  const token = context.USER_CONFIG.CLOUDFLARE_TOKEN;
  const model = context.USER_CONFIG.WORKERS_CHAT_MODEL;
  const url = `https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`;
  const header2 = {
    Authorization: `Bearer ${token}`
  };
  const messages = [...history || [], { role: "user", content: message }];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    messages: messages.map(renderWorkerAIMessage),
    stream: onStream !== null
  };
  const options = {};
  options.contentExtractor = function(data) {
    return data?.response;
  };
  options.fullContentExtractor = function(data) {
    return data?.result?.response;
  };
  options.errorExtractor = function(data) {
    return data?.errors?.[0]?.message;
  };
  return requestChatCompletions(url, header2, body, context, onStream, null, options);
}
async function requestImageFromWorkersAI(prompt, context) {
  const id = context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID;
  const token = context.USER_CONFIG.CLOUDFLARE_TOKEN;
  const model = context.USER_CONFIG.WORKERS_IMAGE_MODEL;
  context._info.config("model", model);
  const raw = await run(model, { prompt }, id, token);
  return { url: await raw.blob() };
}

// src/agent/gemini.js
function isGeminiAIEnable(context) {
  return !!context.USER_CONFIG.GOOGLE_API_KEY;
}
var GEMINI_ROLE_MAP = {
  "assistant": "model",
  "system": "user",
  "user": "user"
};
function renderGeminiMessage(item) {
  return {
    role: GEMINI_ROLE_MAP[item.role],
    parts: [
      {
        "text": item.content || ""
      }
    ]
  };
}
async function requestCompletionsFromGeminiAI(params, context, onStream) {
  const { message, prompt, history } = params;
  onStream = null;
  const model = context.USER_CONFIG.GOOGLE_COMPLETIONS_MODEL;
  const url = `${context.USER_CONFIG.GOOGLE_COMPLETIONS_API}${model}:${onStream ? "streamGenerateContent" : "generateContent"}?key=${context.USER_CONFIG.GOOGLE_API_KEY}`;
  const contentsTemp = [...history || []];
  if (prompt) {
    contentsTemp.push({ role: "assistant", content: prompt });
  }
  contentsTemp.push({ role: "user", content: message });
  const contents = [];
  for (const msg of contentsTemp) {
    msg.role = GEMINI_ROLE_MAP[msg.role];
    if (contents.length === 0 || contents[contents.length - 1].role !== msg.role) {
      contents.push(renderGeminiMessage(msg));
    } else {
      contents[contents.length - 1].parts[0].text += msg.content;
    }
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ contents })
  });
  const data = await resp.json();
  try {
    return data.candidates[0].content.parts[0].text;
  } catch (e2) {
    console.error(e2);
    if (!data) {
      throw new Error("Empty response");
    }
    throw new Error(data?.error?.message || JSON.stringify(data));
  }
}

// src/agent/mistralai.js
function isMistralAIEnable(context) {
  return !!context.USER_CONFIG.MISTRAL_API_KEY;
}
async function requestCompletionsFromMistralAI(params, context, onStream) {
  const { message, prompt, history } = params;
  const url = `${context.USER_CONFIG.MISTRAL_API_BASE}/chat/completions`;
  const header2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${context.USER_CONFIG.MISTRAL_API_KEY}`
  };
  const messages = [...history || [], { role: "user", content: message }];
  const model = context.USER_CONFIG.MISTRAL_CHAT_MODEL;
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const body = {
    model,
    messages,
    stream: onStream != null
  };
  return requestChatCompletions(url, header2, body, context, onStream);
}

// src/agent/cohere.js
function isCohereAIEnable(context) {
  return !!context.USER_CONFIG.COHERE_API_KEY;
}
var COHERE_ROLE_MAP = {
  "assistant": "CHATBOT",
  "user": "USER"
};
function renderCohereMessage(item) {
  return {
    role: COHERE_ROLE_MAP[item.role],
    content: item.content
  };
}
async function requestCompletionsFromCohereAI(params, context, onStream) {
  const { message, prompt, history } = params;
  const url = `${context.USER_CONFIG.COHERE_API_BASE}/chat`;
  const header2 = {
    "Authorization": `Bearer ${context.USER_CONFIG.COHERE_API_KEY}`,
    "Content-Type": "application/json",
    "Accept": onStream !== null ? "text/event-stream" : "application/json"
  };
  let connectors = [];
  Object.entries(ENV.COHERE_CONNECT_TRIGGER).forEach(([id, triggers]) => {
    const result = triggers.some((trigger) => {
      const triggerRegex = new RegExp(trigger, "i");
      return triggerRegex.test(message);
    });
    if (result)
      connectors.push({ id });
  });
  const body = {
    message,
    model: context.USER_CONFIG.COHERE_CHAT_MODEL,
    stream: onStream != null,
    preamble: prompt,
    chat_history: history.map(renderCohereMessage),
    ...connectors.length && { connectors }
  };
  if (!body.preamble) {
    delete body.preamble;
  }
  const options = {};
  options.streamBuilder = function(r, c) {
    return new Stream(r, c, null, cohereSseJsonParser);
  };
  options.contentExtractor = function(data) {
    return data?.text;
  };
  options.fullContentExtractor = function(data) {
    return data?.text;
  };
  options.errorExtractor = function(data) {
    return data?.message;
  };
  return requestChatCompletions(url, header2, body, context, onStream, null, options);
}

// src/agent/anthropic.js
function isAnthropicAIEnable(context) {
  return !!context.USER_CONFIG.ANTHROPIC_API_KEY;
}
async function renderAnthropicMessage(item) {
  const res = {
    role: item.role,
    content: item.content
  };
  if (item.images && item.images.length > 0) {
    res.content = [];
    if (item.content) {
      res.content.push({ type: "text", text: item.content });
    }
    for (const image of item.images) {
      res.content.push(await imageToBase64String(image).then(({ format, data }) => {
        return { type: "image", source: { type: "base64", media_type: format, data } };
      }));
    }
  }
  return res;
}
async function requestCompletionsFromAnthropicAI(params, context, onStream) {
  const { message, images, prompt, history } = params;
  const url = `${context.USER_CONFIG.ANTHROPIC_API_BASE}/messages`;
  const model = context.USER_CONFIG.ANTHROPIC_CHAT_MODEL;
  const header2 = {
    "x-api-key": context.USER_CONFIG.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  };
  const messages = [...history || [], { role: "user", content: message, images }];
  const body = {
    system: prompt,
    model,
    messages: await Promise.all(messages.map(renderAnthropicMessage)),
    stream: onStream != null
  };
  if (!body.system) {
    delete body.system;
  }
  const options = {};
  options.streamBuilder = function(r, c) {
    return new Stream(r, c, null, anthropicSseJsonParser);
  };
  options.contentExtractor = function(data) {
    return data?.delta?.text;
  };
  options.fullContentExtractor = function(data) {
    return data?.content?.[0].text;
  };
  options.errorExtractor = function(data) {
    return data?.error?.message;
  };
  return requestChatCompletions(url, header2, body, context, onStream, null, options);
}

// src/agent/azure.js
function azureKeyFromContext(context) {
  return context.USER_CONFIG.AZURE_API_KEY;
}
function isAzureEnable(context) {
  return !!(context.USER_CONFIG.AZURE_API_KEY && context.USER_CONFIG.AZURE_PROXY_URL);
}
function isAzureImageEnable(context) {
  return !!(context.USER_CONFIG.AZURE_API_KEY && context.USER_CONFIG.AZURE_DALLE_API);
}
async function requestCompletionsFromAzureOpenAI(params, context, onStream) {
  const { message, images, prompt, history } = params;
  const url = context.USER_CONFIG.AZURE_PROXY_URL;
  const messages = [...history || [], { role: "user", content: message, images }];
  if (prompt) {
    messages.unshift({ role: context.USER_CONFIG.SYSTEM_INIT_MESSAGE_ROLE, content: prompt });
  }
  const extra_params = context.USER_CONFIG.OPENAI_API_EXTRA_PARAMS;
  const body = {
    ...extra_params,
    messages: await Promise.all(messages.map(renderOpenAIMessage)),
    stream: onStream != null
  };
  return requestChatCompletions(url, header, body, context, onStream);
}
async function requestImageFromAzureOpenAI(prompt, context) {
  const url = context.USER_CONFIG.AZURE_DALLE_API;
  const header2 = {
    "Content-Type": "application/json",
    "api-key": azureKeyFromContext(context)
  };
  const body = {
    prompt,
    n: 1,
    size: context.USER_CONFIG.DALL_E_IMAGE_SIZE,
    style: context.USER_CONFIG.DALL_E_IMAGE_STYLE,
    quality: context.USER_CONFIG.DALL_E_IMAGE_QUALITY
  };
  const validSize = ["1792x1024", "1024x1024", "1024x1792"];
  if (!validSize.includes(body.size)) {
    body.size = "1024x1024";
  }
  const resp = await fetch(url, {
    method: "POST",
    headers: header2,
    body: JSON.stringify(body)
  }).then((res) => res.json());
  if (resp.error?.message) {
    throw new Error(resp.error.message);
  }
  return { url: resp?.data?.[0]?.url };
}

// src/agent/agents.js
var chatLlmAgents = [
  {
    name: "azure",
    enable: isAzureEnable,
    request: requestCompletionsFromAzureOpenAI
  },
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestCompletionsFromOpenAI
  },
  {
    name: "workers",
    enable: isWorkersAIEnable,
    request: requestCompletionsFromWorkersAI
  },
  {
    name: "gemini",
    enable: isGeminiAIEnable,
    request: requestCompletionsFromGeminiAI
  },
  {
    name: "mistral",
    enable: isMistralAIEnable,
    request: requestCompletionsFromMistralAI
  },
  {
    name: "cohere",
    enable: isCohereAIEnable,
    request: requestCompletionsFromCohereAI
  },
  {
    name: "anthropic",
    enable: isAnthropicAIEnable,
    request: requestCompletionsFromAnthropicAI
  },
  {
    name: "silicon",
    enable: isLLMEnable("silicon"),
    request: requestCompletionsFromOpenAI
  },
  {
    name: "deepseek",
    enable: isLLMEnable("deepseek"),
    request: requestCompletionsFromOpenAI
  }
];
function currentChatModel(agentName, context) {
  switch (agentName) {
    case "azure":
      try {
        const url = new URL(context.USER_CONFIG.AZURE_COMPLETIONS_API);
        return url.pathname.split("/")[3];
      } catch {
        return context.USER_CONFIG.AZURE_COMPLETIONS_API;
      }
    case "openai":
      return context.USER_CONFIG.OPENAI_CHAT_MODEL;
    case "workers":
      return context.USER_CONFIG.WORKERS_CHAT_MODEL;
    case "gemini":
      return context.USER_CONFIG.GOOGLE_COMPLETIONS_MODEL;
    case "mistral":
      return context.USER_CONFIG.MISTRAL_CHAT_MODEL;
    case "cohere":
      return context.USER_CONFIG.COHERE_CHAT_MODEL;
    case "anthropic":
      return context.USER_CONFIG.ANTHROPIC_CHAT_MODEL;
    default:
      return null;
  }
}
function chatModelKey(agentName) {
  switch (agentName) {
    case "azure":
      return "AZURE_COMPLETIONS_API";
    case "openai":
      return "OPENAI_CHAT_MODEL";
    case "workers":
      return "WORKERS_CHAT_MODEL";
    case "gemini":
      return "GOOGLE_COMPLETIONS_MODEL";
    case "mistral":
      return "MISTRAL_CHAT_MODEL";
    case "cohere":
      return "COHERE_CHAT_MODEL";
    case "anthropic":
      return "ANTHROPIC_CHAT_MODEL";
    default:
      return null;
  }
}
function customInfo(config) {
  const other_info = {
    mode: config.CURRENT_MODE,
    prompt: config.SYSTEM_INIT_MESSAGE.slice(0, 20) + "...",
    "MAPPING_KEY": config.MAPPING_KEY,
    "MAPPING_VALUE": config.MAPPING_VALUE,
    "USE_TOOLS": config.USE_TOOLS,
    "FUNCTION_CALL_MODEL": config.FUNCTION_CALL_MODEL
  };
  return JSON.stringify(other_info, null, 2);
}
function loadChatLLM(context) {
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of chatLlmAgents) {
    if (llm.name === AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of chatLlmAgents) {
    if (llm.enable(context)) {
      context.USER_CONFIG.AI_PROVIDER = llm.name;
      return llm;
    }
  }
  return null;
}
var visionLlmAgents = [
  // 当前仅实现OpenAI图像识别
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestCompletionsFromOpenAI
  }
];
function loadVisionLLM(context) {
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of visionLlmAgents) {
    if (llm.name === AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of chatLlmAgents) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
var audioLlmAgents = [
  // 当前仅实现OpenAI音频处理
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestTranscriptionFromOpenAI
  }
];
function loadAudioLLM(context) {
  const AI_PROVIDER = context.USER_CONFIG.AI_PROVIDER;
  for (const llm of audioLlmAgents) {
    if (llm.name === AI_PROVIDER) {
      return llm;
    }
  }
  for (const llm of audioLlmAgents) {
    if (llm.enable(context)) {
      return llm;
    }
  }
  return null;
}
var imageGenAgents = [
  {
    name: "azure",
    enable: isAzureImageEnable,
    request: requestImageFromAzureOpenAI
  },
  {
    name: "openai",
    enable: isOpenAIEnable,
    request: requestImageFromOpenAI
  },
  {
    name: "workers",
    enable: isWorkersAIEnable,
    request: requestImageFromWorkersAI
  },
  {
    name: "silicon",
    enable: isLLMEnable,
    request: requestImageFromOpenAI
  },
  {
    name: "deepseek",
    enable: isLLMEnable,
    request: requestImageFromOpenAI
  }
];
function loadImageGen(context) {
  const AI_IMAGE_PROVIDER = context.USER_CONFIG.AI_IMAGE_PROVIDER;
  for (const imgGen of imageGenAgents) {
    if (imgGen.name === AI_IMAGE_PROVIDER) {
      return imgGen;
    }
  }
  for (const imgGen of imageGenAgents) {
    if (imgGen.enable(context)) {
      return imgGen;
    }
  }
  return null;
}
function currentImageModel(agentName, context) {
  switch (agentName) {
    case "azure":
      try {
        const url = new URL(context.USER_CONFIG.AZURE_DALLE_API);
        return url.pathname.split("/")[3];
      } catch {
        return context.USER_CONFIG.AZURE_DALLE_API;
      }
    case "openai":
      return context.USER_CONFIG.OPENAI_IMAGE_MODEL;
    case "workers":
      return context.USER_CONFIG.WORKERS_IMAGE_MODEL;
    default:
      return null;
  }
}
function imageModelKey(agentName) {
  switch (agentName) {
    case "azure":
      return "AZURE_DALLE_API";
    case "openai":
      return "DALL_E_MODEL";
    case "workers":
      return "WORKERS_IMAGE_MODEL";
    default:
      return null;
  }
}

// src/config/middle.js
async function extractMessageType(message, botToken) {
  let msg = message;
  const acceptType = ENV.ENABLE_FILE ? ["photo", "image", "voice", "audio", "text"] : ["text"];
  let msgType = acceptType.find((key) => key in msg);
  if (msgType && msgType == "text" && message.reply_to_message && ENV.EXTRA_MESSAGE_CONTEXT) {
    const reply_message = message.reply_to_message;
    const reply_type = acceptType.find((key) => key in reply_message);
    if (reply_type && reply_type !== "text") {
      msg = reply_message;
      msgType = reply_type;
    }
  }
  if (msgType === "text") {
    return {
      msgType: "text",
      fileType: "text",
      text: message.text || message.caption
    };
  }
  let fileType = msgType;
  if (msgType == "voice") {
    fileType = "audio";
  } else if (msgType == "photo") {
    fileType = "image";
  }
  if (msg?.document) {
    msgType = "document";
    if (msg.document.mime_type.match(/image/)) {
      fileType = "image";
    } else if (msg.document.mime_type.match(/audio/)) {
      fileType = "audio";
    }
  }
  if (!fileType) {
    throw new Error("Unsupported message type.");
  }
  let file_id = null;
  if (msgType == "photo") {
    let sizeIndex = 0;
    if (ENV.TELEGRAM_PHOTO_SIZE_OFFSET >= 0) {
      sizeIndex = ENV.TELEGRAM_PHOTO_SIZE_OFFSET;
    } else if (ENV.TELEGRAM_PHOTO_SIZE_OFFSET < 0) {
      sizeIndex = msg.photo.length + ENV.TELEGRAM_PHOTO_SIZE_OFFSET;
    }
    sizeIndex = Math.max(0, Math.min(sizeIndex, msg.photo.length - 1));
    file_id = msg.photo[sizeIndex].file_id;
  } else {
    file_id = msg[msgType]?.file_id || null;
  }
  const info = {
    msgType,
    fileType,
    /*hasText: !!(message.text || msg.text || message.caption || msg.caption),*/
    file_url: null,
    text: message.text || message.caption
  };
  if (file_id) {
    let file_url = await getFileUrl(file_id, botToken);
    if (!file_url) {
      throw new Error("file url get failed.");
    }
    if (ENV.TELEGRAPH_IMAGE_ENABLE && fileType === "image") {
      file_url = await uploadImageToTelegraph(file_url);
    }
    info.file_url = file_url;
    console.log("file url: " + info.file_url);
  }
  return info;
}
async function handleFile(_info) {
  let { raw, url, type } = _info.lastStep;
  const file_name = url?.split("/").pop();
  if (!raw && type !== "image") {
    const file_resp = await fetch(url);
    if (file_resp.status !== 200) {
      throw new Error(`Get file failed: ${await file_resp.text()}`);
    }
    raw = await file_resp.blob();
  }
  return { raw, file_name };
}
var MiddleInfo = class {
  constructor(USER_CONFIG, msg_info) {
    this.process_start_time = [Date.now()];
    this.token_info = [];
    this.processes = USER_CONFIG.MODES[USER_CONFIG.CURRENT_MODE]?.[msg_info.fileType] || [{}];
    this.step_index = 0;
    this.file = [
      {
        type: msg_info.fileType,
        url: msg_info.file_url,
        raw: null,
        text: msg_info.text
      }
    ];
    this._bp_config = JSON.parse(JSON.stringify(USER_CONFIG));
    this.process_type = null;
    this.call_info = "";
    this.model = null;
    this.msg_type = msg_info.fileType;
  }
  static async initInfo(message, { USER_CONFIG, SHARE_CONTEXT: { currentBotToken } }) {
    const msg_info = await extractMessageType(message, currentBotToken);
    return new MiddleInfo(USER_CONFIG, msg_info);
  }
  // token数据正常从1开始缓存 0为命令缓存
  setToken(prompt, complete) {
    if (!this.token_info[this.step_index]) {
      this.token_info[this.step_index] = [];
    }
    this.token_info[this.step_index].push({ prompt, complete });
  }
  get token() {
    return this.token_info[this.step_index];
  }
  get process_count() {
    return this.processes.length;
  }
  get isLastStep() {
    return this.process_count === this.step_index;
  }
  get isFirstStep() {
    return this.step_index === 1;
  }
  get message_title() {
    if (!this.model || !this.process_start_time[this.step_index]) {
      return "";
    }
    const show_info = this.processes?.[this.step_index - 1]?.show_info ?? this._bp_config.ENABLE_SHOWINFO;
    if (!show_info)
      return "";
    const step_count = this.process_count;
    const stepInfo = step_count > 1 ? `[STEP ${this.step_index}/${step_count}]
` : "";
    const time = ((Date.now() - this.process_start_time[this.step_index]) / 1e3).toFixed(1);
    let call_info = "";
    if (ENV.CALL_INFO)
      call_info = (this.call_info && this.call_info + "\n").replace("$$f_t$$", "");
    let info = stepInfo + call_info + `${this.model} ${time}s`;
    if (this.token && this.token.length > 0) {
      info += `
Token: ${this.token.map(Object.values).join("|")}`;
    }
    return info;
  }
  get lastStepHasFile() {
    if (this.step_index === 0)
      return false;
    return !!(this.file[this.step_index - 1].url || this.file[this.step_index - 1].raw);
  }
  get lastStep() {
    if (this.step_index === 0) {
      return {};
    }
    return {
      type: this.file[this.step_index - 1].type,
      url: this.file[this.step_index - 1].url,
      raw: this.file[this.step_index - 1].raw,
      text: this.file[this.step_index - 1].text
    };
  }
  get provider() {
    if (this.step_index > 0 && this.processes?.[this.step_index - 1]?.["provider"]) {
      return this._bp_config.PROVIDERS?.[this.processes[this.step_index - 1]["provider"]];
    }
    return null;
  }
  setFile(file, index = this.step_index) {
    this.file[index] = file;
  }
  setCallInfo(message, type = "f_i") {
    if (type === "f_t") {
      this.call_info = this.call_info.replace("$$f_t$$", "f_t: " + message);
    } else if (type === "c_t") {
      this.call_info = (this.call_info && this.call_info + "\n") + `c_t: ${message} $$f_t$$`;
    } else if (type === "f_i") {
      this.call_info = (this.call_info && this.call_info + "\n") + message;
    } else {
      this.call_info += "\n" + message;
    }
  }
  // 修改mode
  config(name, value = null) {
    if (name === "mode") {
      this.processes = this._bp_config.MODES[value][this.msg_type];
    } else if (name === "show_info") {
      this.processes[this.step_index - 1][name] = value;
    } else if (name === "model") {
      this.model = value;
    }
  }
  updateStartTime() {
    this.process_start_time[this.step_index] = Date.now();
  }
  initProcess(USER_CONFIG) {
    console.log(`Init step ${this.step_index + 1}.`);
    this.step_index++;
    this.updateStartTime();
    this.call_info = "";
    if (this.step_index > 1) {
      USER_CONFIG = this._bp_config;
    }
    this.file[this.step_index] = null;
    this.model = this.processes[this.step_index - 1].model;
    this.process_type = this.processes[this.step_index - 1].process_type || `${this.file[this.step_index - 1].type}:text`;
    let chatType = null;
    let ai_provider = USER_CONFIG.AI_PROVIDER;
    if ("silicon" === ai_provider) {
      ai_provider = "OPENAILIKE";
    }
    switch (this.process_type) {
      case "text:text":
        chatType = "CHAT";
        break;
      case "text:image":
        chatType = "IMAGE";
        break;
      case "audio:text":
        chatType = "STT";
        break;
      case "image:text":
        chatType = "VISION";
        break;
      default:
        throw new Error("unsupport type");
    }
    for (const [key, value] of Object.entries(this.processes[this.step_index - 1])) {
      switch (key) {
        case "agent":
          USER_CONFIG.AI_PROVIDER = this.agent;
          break;
        case "prompt":
          USER_CONFIG.SYSTEM_INIT_MESSAGE = ENV.PROMPT[value] || value;
          break;
        case "model":
          if (this.model) {
            USER_CONFIG[`${ai_provider.toUpperCase()}_${chatType}_MODEL`] = this.model;
          }
          break;
        case "provider":
          if (USER_CONFIG.PROVIDERS[value]) {
            USER_CONFIG[`${ai_provider}_API_BASE`] = USER_CONFIG.PROVIDERS[value]["base_url"];
            USER_CONFIG[`${ai_provider}_API_KEY`] = USER_CONFIG.PROVIDERS[value]["key"];
          }
          break;
        default:
          break;
      }
    }
  }
};

// src/utils/md2node.js
function markdownToTelegraphNodes(markdown) {
  const lines = markdown.split("\n");
  const nodes = [];
  let inCodeBlock = false;
  let codeBlockContent = "";
  let codeBlockLanguage = "";
  for (let line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        nodes.push({
          tag: "pre",
          children: [
            {
              tag: "code",
              attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
              children: [codeBlockContent.trim()]
            }
          ]
        });
        inCodeBlock = false;
        codeBlockContent = "";
        codeBlockLanguage = "";
      } else {
        inCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3).trim();
      }
      continue;
    }
    if (inCodeBlock) {
      codeBlockContent += line + "\n";
      continue;
    }
    if (!line)
      continue;
    if (line.startsWith("#")) {
      let level = line.match(/^#+/)[0].length;
      level = level <= 2 ? 3 : 4;
      const text2 = line.replace(/^#+\s*/, "");
      nodes.push({ tag: `h${level}`, children: processInlineElements(text2) });
    } else if (line.startsWith("> ")) {
      const text2 = line.slice(2);
      nodes.push({ tag: "blockquote", children: processInlineElements(text2) });
    } else if (line === "---" || line === "***") {
      nodes.push({ tag: "hr" });
    } else {
      const matches = line.match(/^(\s*)(-|\*)\s/);
      if (matches) {
        line = matches[1] + "\u2022 " + line.slice(matches[0].length);
      }
      nodes.push({ tag: "p", children: processInlineElements(line) });
    }
  }
  if (inCodeBlock) {
    nodes.push({
      tag: "pre",
      children: [
        {
          tag: "code",
          attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
          children: [codeBlockContent.trim()]
        }
      ]
    });
  }
  return nodes;
}
function processInlineElementsHelper(text2) {
  let children = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  const underlineRegex = /__(.+?)__/g;
  const italicRegex = /_(.+?)_/g;
  const strikethroughRegex = /~~(.+?)~~/g;
  let tagMatch = null;
  let lastIndex = 0;
  while ((tagMatch = boldRegex.exec(text2) || underlineRegex.exec(text2) || italicRegex.exec(text2) || strikethroughRegex.exec(text2)) !== null) {
    if (tagMatch.index > lastIndex) {
      children.push(text2.slice(lastIndex, tagMatch.index));
    }
    let tag = "";
    if (tagMatch[0].startsWith("**")) {
      tag = "strong";
    } else if (tagMatch[0].startsWith("__")) {
      tag = "u";
    } else if (tagMatch[0].startsWith("_")) {
      tag = "i";
    } else if (tagMatch[0].startsWith("~~")) {
      tag = "s";
    }
    children.push({
      tag,
      children: [tagMatch[1]]
    });
    lastIndex = tagMatch.index + tagMatch[0].length;
    boldRegex.lastIndex = underlineRegex.lastIndex = italicRegex.lastIndex = strikethroughRegex.lastIndex = lastIndex;
  }
  if (lastIndex < text2.length) {
    children.push(text2.slice(lastIndex));
  }
  children = children.map((child) => {
    if (typeof child === "string") {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let linkMatch;
      let linkChildren = [];
      let lastLinkIndex = 0;
      while ((linkMatch = linkRegex.exec(child)) !== null) {
        if (linkMatch.index > lastLinkIndex) {
          linkChildren.push(child.slice(lastLinkIndex, linkMatch.index));
        }
        linkChildren.push({
          tag: "a",
          attrs: { href: linkMatch[2] },
          children: [linkMatch[1]]
        });
        lastLinkIndex = linkMatch.index + linkMatch[0].length;
      }
      if (lastLinkIndex < child.length) {
        linkChildren.push(child.slice(lastLinkIndex));
      }
      return linkChildren.length >= 1 ? linkChildren : child;
    }
    return child;
  });
  return children.flat();
}
function processInlineElements(text2) {
  let children = [];
  const codeRegex = /`([^`]+)`/g;
  let codeMatch;
  let lastIndex = 0;
  while ((codeMatch = codeRegex.exec(text2)) !== null) {
    if (codeMatch.index > lastIndex) {
      children.push(...processInlineElementsHelper(text2.slice(lastIndex, codeMatch.index)));
    }
    children.push({
      tag: "code",
      children: [codeMatch[1]]
    });
    lastIndex = codeMatch.index + codeMatch[0].length;
  }
  if (lastIndex < text2.length) {
    children.push(...processInlineElementsHelper(text2.slice(lastIndex)));
  }
  return children.flat();
}
var md2node_default = markdownToTelegraphNodes;

// src/telegram/telegraph.js
async function createAccount(author) {
  const { short_name = "Mewo", author_name = "A Cat" } = author || {};
  const url = `https://api.telegra.ph/createAccount?short_name=${short_name}&author_name=${author_name}`;
  const resp = await fetch(url).then((r) => r.json());
  if (resp.ok) {
    return {
      access_token: resp.result.access_token
    };
  } else
    throw new Error("create telegraph account failed");
}
async function createOrEditPage(sendContext, title, content, author) {
  const { url, access_token, path } = sendContext;
  const { short_name, author_name, author_url } = author;
  const body = {
    access_token,
    ...path && { path } || {},
    title: title || "Daily Q&A",
    content: md2node_default(content),
    short_name: short_name || "anonymous",
    author_name: author_name || "anonymous",
    ...author_url && { author_url } || {}
    // 'return_content': true,
  };
  const headers = { "Content-Type": "application/json" };
  return fetch(url, {
    method: "post",
    headers,
    body: JSON.stringify(body)
  }).then((r) => r.json());
}
async function sendTelegraph(context, title, content, author) {
  let endPoint = "https://api.telegra.ph/editPage";
  let access_token = context.telegraphAccessToken;
  let path = context.telegraphPath;
  if (!access_token) {
    access_token = (await createAccount(author)).access_token;
    context.telegraphAccessToken = access_token;
    await DATABASE.put(context.telegraphAccessTokenKey, access_token);
  }
  const sendContext = { url: endPoint, access_token, path };
  if (!path) {
    sendContext.url = "https://api.telegra.ph/createPage";
    const c_resp = await createOrEditPage(sendContext, title, content, author);
    if (c_resp.ok) {
      context.telegraphPath = c_resp.result.path;
      return c_resp;
    } else {
      console.error(c_resp.error);
      throw new Error(c_resp.error);
    }
  } else
    return createOrEditPage(sendContext, title, content, author);
}
function sendTelegraphWithContext(context) {
  return async (title, content, author) => sendTelegraph(context.SHARE_CONTEXT, title, content, author);
}

// src/agent/llm.js
function tokensCounter() {
  return (text2) => {
    return text2.length;
  };
}
async function loadHistory(key) {
  let history = [];
  try {
    history = JSON.parse(await DATABASE.get(key) || "[]");
  } catch (e2) {
    console.error(e2);
  }
  if (!history || !Array.isArray(history)) {
    history = [];
  }
  const counter = tokensCounter();
  const trimHistory = (list, initLength, maxLength, maxToken) => {
    if (maxLength >= 0 && list.length > maxLength) {
      list = list.splice(list.length - maxLength);
    }
    if (maxToken > 0) {
      let tokenLength = initLength;
      for (let i = list.length - 1; i >= 0; i--) {
        const historyItem = list[i];
        let length = 0;
        if (historyItem.content) {
          length = counter(historyItem.content);
        } else {
          historyItem.content = "";
        }
        tokenLength += length;
        if (tokenLength > maxToken) {
          list = list.splice(i + 1);
          break;
        }
      }
    }
    return list;
  };
  if (ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH > 0) {
    history = trimHistory(history, 0, ENV.MAX_HISTORY_LENGTH, ENV.MAX_TOKEN_LENGTH);
  }
  return history;
}
async function requestCompletionsFromLLM(params, context, llm, modifier, onStream) {
  const historyDisable = ENV.AUTO_TRIM_HISTORY && ENV.MAX_HISTORY_LENGTH <= 0;
  const historyKey = context.SHARE_CONTEXT.chatHistoryKey;
  const readStartTime = performance.now();
  let history = [];
  let { message, images } = params;
  if (!images) {
    history = await loadHistory(historyKey);
  }
  const readTime = ((performance.now() - readStartTime) / 1e3).toFixed(2);
  console.log(`readHistoryTime: ${readTime}s`);
  if (modifier) {
    const modifierData = modifier(history, message);
    history = modifierData.history;
    params.message = modifierData.message;
  }
  const llmParams = {
    ...params,
    history,
    prompt: context.USER_CONFIG.SYSTEM_INIT_MESSAGE
  };
  let answer = await llm(llmParams, context, onStream);
  if (images) {
    params.message = "[A IMAGE] " + params.message;
  }
  if (typeof answer === "object") {
    message = answer.q;
    answer = answer.a;
  }
  if (!historyDisable && answer) {
    history.push({ role: "user", content: params.message || "" });
    history.push({ role: "assistant", content: answer });
    await DATABASE.put(historyKey, JSON.stringify(history)).catch(console.error);
  }
  return answer;
}
async function chatWithLLM(params, context, modifier, pointerLLM = loadChatLLM) {
  try {
    if (!params)
      params = { message: "" };
    params.message = context._info.isFirstStep ? params.message : context._info.lastStep.text;
    const parseMode = context.CURRENT_CHAT_CONTEXT.parse_mode;
    try {
      if (!context.CURRENT_CHAT_CONTEXT.message_id) {
        context.CURRENT_CHAT_CONTEXT.parse_mode = null;
        const msg = await sendMessageToTelegramWithContext(context)("...").then((r) => r.json());
        context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
      }
      context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
      context.CURRENT_CHAT_CONTEXT.reply_markup = null;
    } catch (e2) {
      console.error(e2);
    }
    setTimeout(() => sendChatActionToTelegramWithContext(context)("typing").catch(console.error), 0);
    let onStream = null;
    let nextEnableTime = null;
    const sendHandler = (() => {
      const question = params?.message || "Redo";
      const prefix = `#Question
\`\`\`
${question?.length > 400 ? question.slice(0, 200) + "..." + question.slice(-200) : question}
\`\`\`
---`;
      let first_time_than = true;
      const author = {
        short_name: context.SHARE_CONTEXT.currentBotName,
        author_name: context.SHARE_CONTEXT.currentBotName,
        author_url: ENV.TELEGRAPH_AUTHOR_URL
      };
      return async (text2) => {
        if (ENV.TELEGRAPH_NUM_LIMIT > 0 && text2.length > ENV.TELEGRAPH_NUM_LIMIT && CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
          const telegraph_prefix = prefix + `
#Answer
\u{1F916} _${context._info.model}_
`;
          const debug_info = `debug info:${ENV.CALL_INFO ? "" : "\n" + context._info.call_info.replace("$$f_t$$", "") + "\n"}`;
          const telegraph_suffix = `
---
\`\`\`
${debug_info}
${context._info.message_title}
\`\`\``;
          if (first_time_than) {
            const resp = await sendTelegraphWithContext(context)(
              null,
              telegraph_prefix + text2 + telegraph_suffix,
              author
            );
            const url = `https://telegra.ph/${context.SHARE_CONTEXT.telegraphPath}`;
            const msg = `\u56DE\u7B54\u5DF2\u7ECF\u8F6C\u6362\u6210\u5B8C\u6574\u6587\u7AE0~
[\u{1F517}\u70B9\u51FB\u8FDB\u884C\u67E5\u770B](${url})`;
            const show_info_tag = context.USER_CONFIG.ENABLE_SHOWINFO;
            context._info.config("show_info", false);
            await sendMessageToTelegramWithContext(context)(msg);
            context._info.config("show_info", show_info_tag);
            first_time_than = false;
            return resp;
          }
          return sendTelegraphWithContext(context)(null, telegraph_prefix + text2 + telegraph_suffix, author);
        } else
          return sendMessageToTelegramWithContext(context)(text2);
      };
    })();
    if (ENV.STREAM_MODE) {
      onStream = async (text2) => {
        if (ENV.HIDE_MIDDLE_MESSAGE && !context._info.isLastStep)
          return;
        try {
          if (nextEnableTime && nextEnableTime > Date.now()) {
            return;
          }
          const resp = await sendHandler(text2);
          if (resp.status === 429) {
            const retryAfter = parseInt(resp.headers.get("Retry-After"));
            if (retryAfter) {
              nextEnableTime = Date.now() + retryAfter * 1e3;
              return;
            }
          }
          nextEnableTime = null;
        } catch (e2) {
          console.error(e2);
        }
      };
    }
    const llm = pointerLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    console.log(`[START] Chat via ${llm.name}`);
    const answer = await requestCompletionsFromLLM(params, context, llm, modifier, onStream);
    if (!answer) {
      return sendMessageToTelegramWithContext(context)("None response", "tip");
    }
    if (answer instanceof Response) {
      return answer;
    }
    context.CURRENT_CHAT_CONTEXT.parse_mode = parseMode;
    if (ENV.SHOW_REPLY_BUTTON && context.CURRENT_CHAT_CONTEXT.message_id) {
      try {
        await deleteMessageFromTelegramWithContext(context)(context.CURRENT_CHAT_CONTEXT.message_id);
        context.CURRENT_CHAT_CONTEXT.message_id = null;
        context.CURRENT_CHAT_CONTEXT.reply_markup = {
          keyboard: [[{ text: "/new" }, { text: "/redo" }]],
          selective: true,
          resize_keyboard: true,
          one_time_keyboard: true
        };
      } catch (e2) {
        console.error(e2);
      }
    }
    if (nextEnableTime && nextEnableTime > Date.now()) {
      console.log(`The last message need wait:${((nextEnableTime - Date.now()) / 1e3).toFixed(1)}s`);
      await new Promise((resolve) => setTimeout(resolve, nextEnableTime - Date.now()));
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || context._info.isLastStep) {
      await sendHandler(answer);
    }
    if (!context._info.isLastStep) {
      context._info.setFile({ text: answer });
    }
    console.log(`[DONE] Chat via ${llm.name}`);
    return null;
  } catch (e2) {
    let errMsg = `Error: ${e2.message}`;
    console.error(errMsg);
    if (errMsg.length > 2048) {
      errMsg = errMsg.substring(0, 2048);
    }
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(errMsg, "tip");
  }
}
async function chatViaFileWithLLM(context) {
  try {
    if (!context.CURRENT_CHAT_CONTEXT.message_id) {
      const msg = await sendMessageToTelegramWithContext(context)("...").then((r) => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
      context.CURRENT_CHAT_CONTEXT.reply_markup = null;
    }
    const { raw, file_name } = await handleFile(context._info);
    if (context._info.step_index === 1)
      context._info.setFile({ raw }, 0);
    const llm = loadAudioLLM(context)?.request;
    if (llm === null) {
      return sendMessageToTelegramWithContext(context)(`LLM is not enable`);
    }
    const startTime = performance.now();
    context._info.updateStartTime();
    const answer = await llm(raw, file_name, context);
    if (!answer.ok) {
      console.error(answer.message);
      return sendMessageToTelegramWithContext(context)("Chat via file failed.", "tip");
    }
    console.log(`[FILE DONE] ${llm.name}: ${((performance.now() - startTime) / 1e3).toFixed(1)}s`);
    if (!context._info.isLastStep) {
      if (answer.type === "text") {
        context._info.setFile({ text: answer.content });
      } else if (typeof answer.content === "string") {
        context._info.setFile({ url: answer.content });
      } else
        context._info.lastStep.raw = answer.content;
    }
    if (!ENV.HIDE_MIDDLE_MESSAGE || context._info.isLastStep) {
      let resp = null;
      const sendHandler = { "text": sendMessageToTelegramWithContext, "image": sendPhotoToTelegramWithContext };
      resp = await sendHandler[answer.type]?.(context)(answer.content).then((r) => r.json()) || {
        ok: false,
        message: "cannot find handler"
      };
      if (!resp.ok) {
        console.error(`[FILE FAILED] Send data failed: ${resp.message}`);
      }
    }
    return null;
  } catch (e2) {
    context.CURRENT_CHAT_CONTEXT.disable_web_page_preview = true;
    return sendMessageToTelegramWithContext(context)(e2.substring(2048), "tip");
  }
}

// src/telegram/command.js
var commandAuthCheck = {
  default: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      return ["administrator", "creator"];
    }
    return false;
  },
  shareModeGroup: function(chatType) {
    if (CONST.GROUP_TYPES.includes(chatType)) {
      if (!ENV.GROUP_CHAT_BOT_SHARE_MODE) {
        return false;
      }
      return ["administrator", "creator"];
    }
    return false;
  }
};
var commandSortList = [
  "/new",
  "/redo",
  "/img",
  "/setenv",
  "/delenv",
  "/version",
  "/system",
  "/help",
  "/mode"
];
var commandHandlers = {
  "/help": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandGetHelp
  },
  "/new": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/start": {
    scopes: [],
    fn: commandCreateNewChatContext,
    needAuth: commandAuthCheck.default
  },
  "/img": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandGenerateImg,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/version": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandFetchUpdate,
    needAuth: commandAuthCheck.default
  },
  "/setenv": {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/setenvs": {
    scopes: [],
    fn: commandUpdateUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/set": {
    scopes: [],
    fn: commandSetUserConfigs,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/delenv": {
    scopes: [],
    fn: commandDeleteUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/clearenv": {
    scopes: [],
    fn: commandClearUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/system": {
    scopes: ["all_private_chats", "all_chat_administrators"],
    fn: commandSystem,
    needAuth: commandAuthCheck.default
  },
  "/redo": {
    scopes: ["all_private_chats", "all_group_chats", "all_chat_administrators"],
    fn: commandRegenerate,
    needAuth: commandAuthCheck.shareModeGroup
  },
  "/mode": {
    scopes: [],
    fn: commandUpdateUserConfig,
    needAuth: commandAuthCheck.shareModeGroup
  }
};
async function commandGenerateImg(message, command, subcommand, context) {
  if (!subcommand.trim()) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.img, "tip");
  }
  try {
    if (!context.CURRENT_CHAT_CONTEXT) {
      context.CURRENT_CHAT_CONTEXT = {};
    }
    const gen = loadImageGen(context)?.request;
    if (!gen) {
      return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`, "tip");
    }
    setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
    const img = await gen(subcommand, context);
    return sendPhotoToTelegramWithContext(context)(img);
  } catch (e2) {
    console.error(e2.message);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandGetHelp(message, command, subcommand, context) {
  let helpMsg = ENV.I18N.command.help.summary + "\n";
  helpMsg += Object.keys(commandHandlers).map((key) => `${key}\uFF1A${ENV.I18N.command.help[key.substring(1)]}`).join("\n");
  helpMsg += "\n" + Object.keys(CUSTOM_COMMAND).filter((key) => !!CUSTOM_COMMAND_DESCRIPTION[key]).map((key) => `${key}\uFF1A${CUSTOM_COMMAND_DESCRIPTION[key]}`).join("\n");
  context.CURRENT_CHAT_CONTEXT.parse_mode = null;
  context.CURRENT_CHAT_CONTEXT.entities = [
    // { type: 'code', offset: 0, length: helpMsg.length },
    { type: "blockquote", offset: 0, length: helpMsg.length }
  ];
  return sendMessageToTelegramWithContext(context)(helpMsg, "tip");
}
async function commandCreateNewChatContext(message, command, subcommand, context) {
  try {
    await DATABASE.delete(context.SHARE_CONTEXT.chatHistoryKey);
    context.CURRENT_CHAT_CONTEXT.reply_markup = JSON.stringify({
      remove_keyboard: true,
      selective: true
    });
    if (command === "/new") {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.new.new_chat_start, "tip");
    } else {
      return sendMessageToTelegramWithContext(context)(`${ENV.I18N.command.new.new_chat_start}(${context.CURRENT_CHAT_CONTEXT.chat_id})`, "tip");
    }
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandUpdateUserConfig(message, command, subcommand, context, processUpdate = false) {
  if (command == "/mode") {
    if (subcommand == "all") {
      const msg = `<pre>mode\u6E05\u5355:   
- ${Object.keys(context.USER_CONFIG.MODES).join("\n- ")}</pre>`;
      context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
      return sendMessageToTelegramWithContext(context)(msg, "tip");
    } else if (!subcommand) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.mode, "tip");
    }
    if (!context.USER_CONFIG.MODES?.[subcommand]) {
      const msg = `mode \`${subcommand}\` not exist`;
      return sendMessageToTelegramWithContext(context)(msg, "tip");
    }
    subcommand = `CURRENT_MODE=${subcommand}`;
  }
  const kv = subcommand.indexOf("=");
  if (kv === -1) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.setenv, "tip");
  }
  let key = subcommand.slice(0, kv);
  const value = subcommand.slice(kv + 1);
  key = ENV_KEY_MAPPER[key] || key;
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
    return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`, "tip");
  }
  if (!Object.keys(context.USER_CONFIG).includes(key)) {
    return sendMessageToTelegramWithContext(context)(`Key ${key} not found`, "tip");
  }
  try {
    mergeEnvironment(context.USER_CONFIG, {
      [key]: value
    });
    if (processUpdate) {
      if (key.endsWith("_MODEL")) {
        context._info.config("model", value);
      } else if (key === "CURRENT_MODE") {
        context._info.config("mode", value);
      }
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS.push(key);
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(context.SHARE_CONTEXT.configStoreKey, JSON.stringify(trimUserConfig(context.USER_CONFIG)));
    return sendMessageToTelegramWithContext(context)("Update user config success", "tip");
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandUpdateUserConfigs(message, command, subcommand, context, processUpdate = false) {
  try {
    if (!subcommand) {
      return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.setenvs, "tip");
    }
    const values = JSON.parse(subcommand);
    const configKeys = Object.keys(context.USER_CONFIG);
    for (const ent of Object.entries(values)) {
      let [key, value] = ent;
      key = ENV_KEY_MAPPER[key] || key;
      if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
        return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`, "tip");
      }
      if (!configKeys.includes(key)) {
        return sendMessageToTelegramWithContext(context)(`Key ${key} not found`, "tip");
      }
      mergeEnvironment(context.USER_CONFIG, {
        [key]: value
      });
      if (processUpdate) {
        if (key.endsWith("_MODEL")) {
          context._info.config("model", value);
        } else if (key === "CURRENT_MODE") {
          context._info.config("mode", value);
        }
        continue;
      }
      context.USER_CONFIG.DEFINE_KEYS.push(key);
      console.log("Update user config: ", key, context.USER_CONFIG[key]);
    }
    if (processUpdate) {
      return null;
    }
    context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(trimUserConfig(context.USER_CONFIG)))
    );
    return sendMessageToTelegramWithContext(context)("Update user config success", "tip");
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandSetUserConfigs(message, command, subcommand, context) {
  try {
    if (!subcommand) {
      return sendMessageToTelegramWithContext(context)("```plaintext\n" + ENV.I18N.command.detail.set + "\n```", "tip");
    }
    const keys = Object.fromEntries(context.USER_CONFIG.MAPPING_KEY.split("|").map((k) => k.split(":")));
    if (keys["-u"]) {
      delete keys["-u"];
    }
    const values = Object.fromEntries(context.USER_CONFIG.MAPPING_VALUE.split("|").map((k) => k.split(":")));
    const updateTagReg = /\s+-u(\s+|$)/;
    const needUpdate = updateTagReg.test(subcommand);
    subcommand = subcommand.replace(updateTagReg, "$1");
    const msgCommand = subcommand.matchAll(/(-\w+)\s+(.*?)(\s+|$)/g);
    let msg = "";
    let hasKey = false;
    if (context.USER_CONFIG.AI_PROVIDER === "auto") {
      context.USER_CONFIG.AI_PROVIDER = "openai";
    }
    for (const [, k, v] of msgCommand) {
      let key = keys[k], value = values[v];
      if (key) {
        if (ENV.LOCK_USER_CONFIG_KEYS.includes(key)) {
          return sendMessageToTelegramWithContext(context)(`Key ${key} is locked`, "tip");
        }
        const role_perfix = "~";
        switch (key) {
          case "SYSTEM_INIT_MESSAGE":
            if (v?.startsWith(role_perfix)) {
              value = ENV.PROMPT[v.substring(1)];
              if (!value) {
                msg += `>\`${v} is not exist, will use default prompt\`
`;
                value = ENV.I18N?.env?.system_init_message || "You are a helpful assistant";
              }
            }
            break;
          case "CHAT_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_CHAT_MODEL`;
            break;
          case "VISION_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_VISION_MODEL`;
            break;
          case "STT_MODEL":
            key = `${context.USER_CONFIG.AI_PROVIDER.toUpperCase()}_STT_MODEL`;
            break;
          case "CURRENT_MODE":
            if (!Object.keys(context.USER_CONFIG.MODES).includes(v)) {
              return sendMessageToTelegramWithContext(context)(`mode ${v} is not exist`, "tip");
            }
            context._info.config("mode", v);
            break;
          case "USE_TOOLS":
            if (v === "on") {
              value = Object.keys(ENV.TOOLS);
            } else if (v === "off") {
              value = [];
            }
            break;
          default:
            break;
        }
        if (!Object.keys(context.USER_CONFIG).includes(key)) {
          return sendMessageToTelegramWithContext(context)(`Key ${key} not found`, "tip");
        }
        context.USER_CONFIG[key] = value ?? v;
        context.USER_CONFIG.DEFINE_KEYS.push(key);
        console.log(`/set ${key || "unknown"} ${(JSON.stringify(value) || v).substring(0, 20)}`);
      } else
        return sendMessageToTelegramWithContext(context)(`Mapping Key ${k} is not exist`, "tip");
      if (!hasKey)
        hasKey = true;
    }
    if (needUpdate && hasKey) {
      context.USER_CONFIG.DEFINE_KEYS = Array.from(new Set(context.USER_CONFIG.DEFINE_KEYS));
      await DATABASE.put(
        context.SHARE_CONTEXT.configStoreKey,
        JSON.stringify(trimUserConfig(trimUserConfig(context.USER_CONFIG)))
      );
      msg += ">`Update user config success`\n";
    }
    if (msg)
      await sendMessageToTelegramWithContext(context)(msg, "tip");
    return null;
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandDeleteUserConfig(message, command, subcommand, context) {
  if (!subcommand) {
    return sendMessageToTelegramWithContext(context)(ENV.I18N.command.help.delenv, "tip");
  }
  if (ENV.LOCK_USER_CONFIG_KEYS.includes(subcommand)) {
    const msg = `Key ${subcommand} is locked`;
    return sendMessageToTelegramWithContext(context)(msg, "tip");
  }
  try {
    context.USER_CONFIG[subcommand] = null;
    context.USER_CONFIG.DEFINE_KEYS = context.USER_CONFIG.DEFINE_KEYS.filter((key) => key !== subcommand);
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify(trimUserConfig(context.USER_CONFIG))
    );
    return sendMessageToTelegramWithContext(context)("Delete user config success", "tip");
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandClearUserConfig(message, command, subcommand, context) {
  try {
    if (subcommand.trim() !== "true") {
      return sendMessageToTelegramWithContext(context)("Please sure that you want clear all config, send `/clearenv true`", "tip");
    }
    await DATABASE.put(
      context.SHARE_CONTEXT.configStoreKey,
      JSON.stringify({})
    );
    return sendMessageToTelegramWithContext(context)("Clear user config success", "tip");
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandFetchUpdate(message, command, subcommand, context) {
  const current = {
    ts: ENV.BUILD_TIMESTAMP,
    sha: ENV.BUILD_VERSION
  };
  try {
    const info = `https://raw.githubusercontent.com/adolphnov/ChatGPT-Telegram-Workers/${ENV.UPDATE_BRANCH}/dist/buildinfo.json`;
    const online = await fetch(info).then((r) => r.json());
    const timeFormat = (ts) => {
      return new Date(ts * 1e3).toLocaleString("en-US", {});
    };
    if (current.ts < online.ts) {
      return sendMessageToTelegramWithContext(context)(`New version detected: ${online.sha}(${timeFormat(online.ts)})
Current version: ${current.sha}(${timeFormat(current.ts)})`, "tip");
    } else {
      return sendMessageToTelegramWithContext(context)(`Current version: ${current.sha}(${timeFormat(current.ts)}) is up to date`, "tip");
    }
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
}
async function commandSystem(message, command, subcommand, context) {
  let chatAgent = loadChatLLM(context)?.name;
  let imageAgent = loadImageGen(context)?.name;
  const agent = {
    AI_PROVIDER: chatAgent,
    AI_IMAGE_PROVIDER: imageAgent
  };
  if (chatModelKey(chatAgent)) {
    agent[chatModelKey(chatAgent)] = currentChatModel(chatAgent, context);
  }
  if (imageModelKey(imageAgent)) {
    agent[imageModelKey(imageAgent)] = currentImageModel(imageAgent, context);
  }
  agent.STT_MODEL = context.USER_CONFIG.OPENAI_STT_MODEL;
  agent.VISION_MODEL = context.USER_CONFIG.OPENAI_VISION_MODEL;
  let msg = `<pre>AGENT: ${JSON.stringify(agent, null, 2)}
others: ${customInfo(context.USER_CONFIG)}
</pre>`;
  if (ENV.DEV_MODE) {
    const shareCtx = { ...context.SHARE_CONTEXT };
    shareCtx.currentBotToken = "******";
    context.USER_CONFIG.OPENAI_API_KEY = ["******"];
    context.USER_CONFIG.AZURE_API_KEY = "******";
    context.USER_CONFIG.AZURE_PROXY_URL = "******";
    context.USER_CONFIG.AZURE_DALLE_API = "******";
    context.USER_CONFIG.CLOUDFLARE_ACCOUNT_ID = "******";
    context.USER_CONFIG.CLOUDFLARE_TOKEN = "******";
    context.USER_CONFIG.GOOGLE_API_KEY = "******";
    context.USER_CONFIG.MISTRAL_API_KEY = "******";
    context.USER_CONFIG.COHERE_API_KEY = "******";
    context.USER_CONFIG.ANTHROPIC_API_KEY = "******";
    const config = trimUserConfig(context.USER_CONFIG);
    msg = "<pre>\n" + msg;
    msg += `USER_CONFIG: ${JSON.stringify(config, null, 2)}
`;
    msg += `CHAT_CONTEXT: ${JSON.stringify(context.CURRENT_CHAT_CONTEXT, null, 2)}
`;
    msg += `SHARE_CONTEXT: ${JSON.stringify(shareCtx, null, 2)}
`;
    msg += "</pre>";
  }
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext(context)(msg, "tip");
}
async function commandRegenerate(message, command, subcommand, context) {
  const mf = (history, text2) => {
    let nextText = text2;
    if (!(history && Array.isArray(history) && history.length > 0)) {
      throw new Error("History not found");
    }
    const historyCopy = structuredClone(history);
    while (true) {
      const data = historyCopy.pop();
      if (data === void 0 || data === null) {
        break;
      } else if (data.role === "user") {
        if (text2 === "" || text2 === void 0 || text2 === null) {
          nextText = data.content;
        }
        break;
      }
    }
    if (subcommand) {
      nextText = subcommand;
    }
    return { history: historyCopy, message: nextText };
  };
  return chatWithLLM(null, context, mf);
}
async function commandEcho(message, command, subcommand, context) {
  let msg = "<pre>";
  msg += JSON.stringify({ message }, null, 2);
  msg += "</pre>";
  context.CURRENT_CHAT_CONTEXT.parse_mode = "HTML";
  return sendMessageToTelegramWithContext(context)(msg, "tip");
}
async function handleCommandMessage(message, context) {
  if (!message.text) {
    return null;
  }
  if (ENV.DEV_MODE) {
    commandHandlers["/echo"] = {
      help: "[DEBUG ONLY] echo message",
      scopes: ["all_private_chats", "all_chat_administrators"],
      fn: commandEcho,
      needAuth: commandAuthCheck.default
    };
  }
  const customKey = Object.keys(CUSTOM_COMMAND).find((k) => message.text === k || message.text.startsWith(k + " "));
  if (customKey) {
    message.text = message.text.replace(customKey, CUSTOM_COMMAND[customKey]);
  }
  for (const key in commandHandlers) {
    if (message.text === key || message.text.startsWith(key + " ")) {
      const command = commandHandlers[key];
      const commandLine = /^.*(\n|$)/.exec(message.text)[0];
      message.text = message.text.substring(commandLine.length);
      try {
        if (command.needAuth) {
          const roleList = command.needAuth(context.SHARE_CONTEXT.chatType);
          if (roleList) {
            const chatRole = await getChatRoleWithContext(context)(context.SHARE_CONTEXT.speakerId);
            if (chatRole === null) {
              return sendMessageToTelegramWithContext(context)("ERROR: Get chat role failed", "tip");
            }
            if (!roleList.includes(chatRole)) {
              return sendMessageToTelegramWithContext(context)(
                `ERROR: Permission denied, need ${roleList.join(" or ")}`,
                "tip"
              );
            }
          }
        }
      } catch (e2) {
        return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
      }
      const subcommand = commandLine.substring(key.length).trim();
      try {
        const result = await command.fn(message, key, subcommand, context);
        console.log("[DONE] Command: " + key + " " + subcommand);
        if (result instanceof Response)
          return result;
        if (message.text.length === 0)
          return new Response("None question");
      } catch (e2) {
        return sendMessageToTelegramWithContext(context)(e2.message, "tip");
      }
      break;
    }
  }
  if (message.text.startsWith("/")) {
    return sendMessageToTelegramWithContext(context)(`Oops! It's not a command.`, "tip");
  }
  return null;
}
async function bindCommandForTelegram(token) {
  const scopeCommandMap = {
    all_private_chats: [],
    all_group_chats: [],
    all_chat_administrators: []
  };
  for (const key of commandSortList) {
    if (ENV.HIDE_COMMAND_BUTTONS.includes(key)) {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(commandHandlers, key) && commandHandlers[key].scopes) {
      for (const scope of commandHandlers[key].scopes) {
        if (!scopeCommandMap[scope]) {
          scopeCommandMap[scope] = [];
        }
        scopeCommandMap[scope].push(key);
      }
    }
  }
  const result = {};
  for (const scope in scopeCommandMap) {
    result[scope] = await fetch(
      `https://api.telegram.org/bot${token}/setMyCommands`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commands: scopeCommandMap[scope].map((command) => ({
            command,
            description: ENV.I18N.command.help[command.substring(1)] || ""
          })),
          scope: {
            type: scope
          }
        })
      }
    ).then((res) => res.json());
  }
  return { ok: true, result };
}
function commandsDocument() {
  return Object.keys(commandHandlers).map((key) => {
    return {
      command: key,
      description: ENV.I18N.command.help[key.substring(1)]
    };
  });
}

// src/utils/utils.js
function renderHTML(body) {
  return `
<html>  
  <head>
    <title>ChatGPT-Telegram-Workers</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="ChatGPT-Telegram-Workers">
    <meta name="author" content="TBXark">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;
      }
      h1 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }
      p {
        margin-top: 0;
        margin-bottom: 1rem;
      }
      a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent;
      }
      a:hover {
        color: #0056b3;
        text-decoration: underline;
      }
      strong {
        font-weight: bolder;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
  `;
}
function errorToString(e2) {
  return JSON.stringify({
    message: e2.message,
    stack: e2.stack
  });
}
function makeResponse200(resp) {
  if (resp === null) {
    return new Response("NOT HANDLED", { status: 200 });
  }
  if (resp.status === 200) {
    return resp;
  } else {
    return new Response(resp.body, {
      status: 200,
      headers: {
        "Original-Status": resp.status,
        ...resp.headers
      }
    });
  }
}
function fetchWithRetryFunc() {
  const status429RetryTime = {};
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 1e3;
  const RETRY_MULTIPLIER = 2;
  const DEFAULT_RETRY_AFTER = 10;
  return async (url, options, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) => {
    let errorMsg = "";
    while (retries > 0) {
      try {
        const parsedUrl = new URL(url);
        const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const now = Date.now();
        if ((status429RetryTime[domain] ?? now) > now) {
          return new Response('{"ok":false}', {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((status429RetryTime[domain] - now) / 1e3)
            }
          });
        }
        if (status429RetryTime[domain]) {
          status429RetryTime[domain] = null;
        }
        let resp = await fetch(url, options);
        if (resp.ok) {
          if (retries < MAX_RETRIES)
            console.log(`[DONE] after ${MAX_RETRIES - retries} times`);
          return resp;
        }
        const clone_resp = await resp.clone().text();
        console.error(`Error fetch: ${clone_resp}`);
        if (resp.status === 429) {
          const retryAfter = resp.headers.get("Retry-After") || DEFAULT_RETRY_AFTER;
          status429RetryTime[domain] = Date.now() + 1e3 * retryAfter;
          return resp;
        } else {
          throw new Error(`status: ${resp.statusText}`);
        }
      } catch (error) {
        errorMsg = error.message;
        console.error(`Request failed, retry after ${delayMs / 1e3} s: ${error}`);
      }
      await delay(delayMs);
      delayMs *= RETRY_MULTIPLIER;
      retries--;
    }
    throw new Error(`Failed after maximum retries, please see the log.`);
  };
}
var fetchWithRetry = fetchWithRetryFunc();
function delay(ms = 1e3) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/telegram/message.js
async function msgInitChatContext(message, context) {
  await context.initContext(message);
  return null;
}
async function msgSaveLastMessage(message, context) {
  if (ENV.DEBUG_MODE) {
    const lastMessageKey = `last_message:${context.SHARE_CONTEXT.chatHistoryKey}`;
    await DATABASE.put(lastMessageKey, JSON.stringify(message), { expirationTtl: 3600 });
  }
  return null;
}
async function msgIgnoreOldMessage(message, context) {
  if (ENV.SAFE_MODE) {
    let idList = [];
    try {
      idList = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.chatLastMessageIdKey) || "[]");
    } catch (e2) {
      console.error(e2);
    }
    if (idList.includes(message.message_id)) {
      return new Response("Ignore old message", { status: 200 });
    } else {
      idList.push(message.message_id);
      if (idList.length > 100) {
        idList.shift();
      }
      await DATABASE.put(context.SHARE_CONTEXT.chatLastMessageIdKey, JSON.stringify(idList));
    }
  }
  return null;
}
async function msgCheckEnvIsReady(message, context) {
  if (!DATABASE) {
    return sendMessageToTelegramWithContext(context)("DATABASE Not Set", "tip");
  }
  return null;
}
async function msgFilterWhiteList(message, context) {
  if (ENV.I_AM_A_GENEROUS_PERSON) {
    return null;
  }
  if (context.SHARE_CONTEXT.chatType === "private") {
    if (!ENV.CHAT_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
        `You are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`
      );
    }
    return null;
  }
  if (CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    if (!ENV.GROUP_CHAT_BOT_ENABLE) {
      throw new Error("Not support");
    }
    if (!ENV.CHAT_GROUP_WHITE_LIST.includes(`${context.CURRENT_CHAT_CONTEXT.chat_id}`)) {
      return sendMessageToTelegramWithContext(context)(
        `Your group are not in the white list, please contact the administrator to add you to the white list. Your chat_id: ${context.CURRENT_CHAT_CONTEXT.chat_id}`
      );
    }
    return null;
  }
  return sendMessageToTelegramWithContext(context)(
    `Not support chat type: ${context.SHARE_CONTEXT.chatType}`
  );
}
async function msgFilterUnsupportedMessage(message, context) {
  if (message.text || ENV.EXTRA_MESSAGE_CONTEXT && message.reply_to_message?.text) {
    return null;
  }
  if (ENV.ENABLE_FILE && (message.voice || message.audio || message.photo || message.image || message.document)) {
    return null;
  }
  throw new Error("Unsupported message");
}
async function msgHandlePrivateMessage(message, context) {
  if ("private" !== context.SHARE_CONTEXT.chatType) {
    return null;
  }
  if (!message.text && !message.caption) {
    return null;
  }
  if (!message.text && !ENV.ENABLE_FILE) {
    return new Response("Non text message", { "status": 200 });
  }
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(
    (key) => (message?.text || message?.caption || "").startsWith(key)
  );
  if (chatMsgKey) {
    if (message.text) {
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
    } else
      message.caption = message.caption.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }
  return null;
}
async function msgHandleGroupMessage(message, context) {
  if (!CONST.GROUP_TYPES.includes(context.SHARE_CONTEXT.chatType)) {
    return null;
  }
  let botName = context.SHARE_CONTEXT.currentBotName;
  const chatMsgKey = Object.keys(ENV.CHAT_MESSAGE_TRIGGER).find(
    (key) => (message?.text || message?.caption || "").startsWith(key)
  );
  if (chatMsgKey) {
    if (message?.text) {
      message.text = message.text.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
    } else
      message.caption = message.caption.replace(chatMsgKey, ENV.CHAT_MESSAGE_TRIGGER[chatMsgKey]);
  }
  if (message.reply_to_message) {
    if (`${message.reply_to_message.from.id}` === context.SHARE_CONTEXT.currentBotId) {
      return null;
    } else if (ENV.EXTRA_MESSAGE_CONTEXT) {
      context.SHARE_CONTEXT.extraMessageContext = message.reply_to_message;
    }
  }
  if (!botName) {
    const res = await getBot(context.SHARE_CONTEXT.currentBotToken);
    context.SHARE_CONTEXT.currentBotName = res.info.bot_name;
    botName = res.info.bot_name;
  }
  if (botName) {
    let mentioned = false;
    if (message.entities) {
      let content = "";
      let offset = 0;
      message.entities.forEach((entity) => {
        switch (entity.type) {
          case "bot_command":
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
              if (mention.endsWith(botName)) {
                mentioned = true;
              }
              const cmd = mention.replaceAll("@" + botName, "").replaceAll(botName, "").trim();
              content += cmd;
              offset = entity.offset + entity.length;
            }
            break;
          case "mention":
          case "text_mention":
            if (!mentioned) {
              const mention = message.text.substring(entity.offset, entity.offset + entity.length);
              if (mention === botName || mention === "@" + botName) {
                mentioned = true;
              }
            }
            content += message.text.substring(offset, entity.offset);
            offset = entity.offset + entity.length;
            break;
        }
      });
      content += message.text.substring(offset, message.text.length);
      message.text = content.trim();
    }
    if (!mentioned && chatMsgKey) {
      mentioned = true;
    }
    if (!mentioned) {
      return new Response("No mentioned");
    } else {
      return null;
    }
  }
  throw new Error("Not set bot name");
}
async function msgInitUserConfig(message, context) {
  try {
    await context._initUserConfig(context.SHARE_CONTEXT.configStoreKey);
    const telegraphAccessTokenKey = context.SHARE_CONTEXT.telegraphAccessTokenKey;
    context.SHARE_CONTEXT.telegraphAccessToken = await DATABASE.get(telegraphAccessTokenKey);
    return null;
  } catch (e2) {
    return sendMessageToTelegramWithContext(context)(e2.message, "tip");
  }
}
async function msgIgnoreSpecificMessage(message) {
  if (ENV.IGNORE_TEXT && message?.text?.startsWith(ENV.IGNORE_TEXT)) {
    return new Response("ignore specific text", { status: 200 });
  }
  return null;
}
async function msgInitMiddleInfo(message, context) {
  try {
    context._info = await MiddleInfo.initInfo(message, context);
    if (!message.text && !message.reply_to_message?.text) {
      const msg = await sendMessageToTelegramWithContext(context)("file info get successful.").then((r) => r.json());
      context.CURRENT_CHAT_CONTEXT.message_id = msg.result.message_id;
    }
    return null;
  } catch (e2) {
    console.log(e2.message);
    throw new Error("Can\u2019t init info, please see the log for detail.");
  }
}
async function msgHandleCommand(message, context) {
  return await handleCommandMessage(message, context);
}
async function msgChatWithLLM(message, context) {
  let content = (message.text || message.caption || "").trim();
  if (ENV.EXTRA_MESSAGE_CONTEXT && (context.SHARE_CONTEXT.extraMessageContext?.text || context.SHARE_CONTEXT.extraMessageContext?.caption)) {
    content = "> " + (context.SHARE_CONTEXT.extraMessageContext?.text || "") + (context.SHARE_CONTEXT.extraMessageContext?.caption || "") + "\n" + content;
  }
  const params = { message: content };
  try {
    let result = null;
    for (let i = 0; i < context._info.process_count; i++) {
      if (result && result instanceof Response) {
        return result;
      }
      context._info.initProcess(context.USER_CONFIG);
      if (context._info.file[i].type === "image") {
        params.images = [context._info.file[i].url];
      }
      switch (context._info.process_type) {
        case "text:text":
          result = await chatWithLLM(params, context, null);
          break;
        case "text:image":
          {
            const gen = loadImageGen(context)?.request;
            if (!gen) {
              return sendMessageToTelegramWithContext(context)(`ERROR: Image generator not found`, "tip");
            }
            setTimeout(() => sendChatActionToTelegramWithContext(context)("upload_photo").catch(console.error), 0);
            result = await gen(context._info.lastStep.text || text, context);
            if (!context._info.isLastStep) {
              context._info.setFile(typeof result === "string" ? { url: result } : { raw: result });
            }
            const response = await sendPhotoToTelegramWithContext(context)(result);
            if (response.status != 200) {
              console.error(await response.text());
            }
          }
          break;
        case "audio:text":
          result = await chatViaFileWithLLM(context);
          break;
        case "image:text":
          result = await chatWithLLM(params, context, null, loadVisionLLM);
          break;
        case "audio:audio":
        case "text:audio":
        default:
          return sendMessageToTelegramWithContext(context)("unsupported type", "tip");
      }
      if (context.CURRENT_CHAT_CONTEXT.message_id && !ENV.HIDE_MIDDLE_MESSAGE) {
        context.CURRENT_CHAT_CONTEXT.message_id = null;
      }
      delete params.images;
    }
  } catch (e2) {
    console.error(e2);
    return sendMessageToTelegramWithContext(context)(`ERROR: ${e2.message}`, "tip");
  }
  return new Response("success", { status: 200 });
}
function loadMessage(body) {
  if (body?.edited_message) {
    throw new Error("Ignore edited message");
  }
  if (body?.message) {
    return body?.message;
  } else {
    throw new Error("Invalid message");
  }
}
async function scheduledDeleteMessage(request, context) {
  const { sentMessageIds } = context.SHARE_CONTEXT;
  if (!sentMessageIds || sentMessageIds.size === 0)
    return new Response("success", { status: 200 });
  const chatId = context.SHARE_CONTEXT.chatId;
  const botName = context.SHARE_CONTEXT.currentBotName;
  const scheduledData = JSON.parse(await DATABASE.get(context.SHARE_CONTEXT.scheduleDeteleKey) || "{}");
  if (!scheduledData[botName]) {
    scheduledData[botName] = {};
  }
  if (!scheduledData[botName][chatId]) {
    scheduledData[botName][chatId] = [];
  }
  const offsetInMillisenconds = ENV.SCHEDULE_TIME * 60 * 1e3;
  scheduledData[botName][chatId].push({
    id: [...sentMessageIds],
    ttl: Date.now() + offsetInMillisenconds
  });
  await DATABASE.put(context.SHARE_CONTEXT.scheduleDeteleKey, JSON.stringify(scheduledData));
  console.log(`message need delete: ${chatId} - ${[...sentMessageIds]}`);
  return new Response("success", { status: 200 });
}
async function msgTagNeedDelete(request, context) {
  return await scheduledDeleteMessage(request, context);
}
async function handleMessage(token, body) {
  const context = new Context();
  context.initTelegramContext(token);
  const message = loadMessage(body);
  const handlers = [
    // 初始化聊天上下文: 生成chat_id, reply_to_message_id(群组消息), SHARE_CONTEXT
    msgInitChatContext,
    // 忽略特定文本
    msgIgnoreSpecificMessage,
    // 检查环境是否准备好: DATABASE
    msgCheckEnvIsReady,
    // 过滤非白名单用户
    msgFilterWhiteList,
    // DEBUG: 保存最后一条消息
    msgSaveLastMessage,
    // 过滤不支持的消息(抛出异常结束消息处理)
    msgFilterUnsupportedMessage,
    // 处理私人消息
    msgHandlePrivateMessage,
    // 处理群消息，判断是否需要响应此条消息
    msgHandleGroupMessage,
    // 忽略旧消息
    msgIgnoreOldMessage,
    // 初始化用户配置
    msgInitUserConfig,
    // 初始化基础中间信息
    msgInitMiddleInfo,
    // 处理命令消息
    msgHandleCommand,
    // 与llm聊天
    msgChatWithLLM
  ];
  const exitHanders = [msgTagNeedDelete];
  for (const handler of handlers) {
    try {
      const result = await handler(message, context);
      if (result && result instanceof Response) {
        break;
      }
    } catch (e2) {
      console.error(e2);
      return new Response(errorToString(e2), { status: 500 });
    }
  }
  for (const handler of exitHanders) {
    try {
      const result = await handler(message, context);
      if (result && result instanceof Response) {
        return result;
      }
    } catch (e2) {
      console.error(e2);
      return new Response(errorToString(e2), { status: 500 });
    }
  }
  return null;
}

// src/utils/router.js
var Router = class {
  constructor({ base = "", routes = [], ...other } = {}) {
    this.routes = routes;
    this.base = base;
    Object.assign(this, other);
  }
  /**
   * @private
   * @param {URLSearchParams} searchParams 
   * @returns {object}
   */
  parseQueryParams(searchParams) {
    const query = /* @__PURE__ */ Object.create(null);
    for (const [k, v] of searchParams) {
      query[k] = k in query ? [].concat(query[k], v) : v;
    }
    return query;
  }
  /**
   * @private
   * @param {string} path 
   * @returns {string}
   */
  normalizePath(path) {
    return path.replace(/\/+(\/|$)/g, "$1");
  }
  /**
   * @private
   * @param {string} path 
   * @returns {RegExp}
   */
  createRouteRegex(path) {
    return RegExp(`^${path.replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`);
  }
  /**
   * @param {Request} request 
   * @param  {...any} args 
   * @returns {Promise<Response|null>}
   */
  async fetch(request, ...args) {
    const url = new URL(request.url);
    const reqMethod = request.method.toUpperCase();
    request.query = this.parseQueryParams(url.searchParams);
    for (const [method, regex, handlers, path] of this.routes) {
      let match = null;
      if ((method === reqMethod || method === "ALL") && (match = url.pathname.match(regex))) {
        request.params = match?.groups || {};
        request.route = path;
        for (const handler of handlers) {
          const response = await handler(request.proxy ?? request, ...args);
          if (response != null)
            return response;
        }
      }
    }
  }
  /**
   * @param {string} method 
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  route(method, path, ...handlers) {
    const route = this.normalizePath(this.base + path);
    const regex = this.createRouteRegex(route);
    this.routes.push([method.toUpperCase(), regex, handlers, route]);
    return this;
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  get(path, ...handlers) {
    return this.route("GET", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  post(path, ...handlers) {
    return this.route("POST", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  put(path, ...handlers) {
    return this.route("PUT", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  delete(path, ...handlers) {
    return this.route("DELETE", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  patch(path, ...handlers) {
    return this.route("PATCH", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  head(path, ...handlers) {
    return this.route("HEAD", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  options(path, ...handlers) {
    return this.route("OPTIONS", path, ...handlers);
  }
  /**
   * @param {string} path 
   * @param  {...any} handlers 
   * @returns {Router}
   */
  all(path, ...handlers) {
    return this.route("ALL", path, ...handlers);
  }
};

// src/route.js
var helpLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/blob/master/doc/en/DEPLOY.md";
var issueLink = "https://github.com/TBXark/ChatGPT-Telegram-Workers/issues";
var initLink = "./init";
var footer = `
<br/>
<p>For more information, please visit <a href="${helpLink}">${helpLink}</a></p>
<p>If you have any questions, please visit <a href="${issueLink}">${issueLink}</a></p>
`;
function buildKeyNotFoundHTML(key) {
  return `<p style="color: red">Please set the <strong>${key}</strong> environment variable in Cloudflare Workers.</p> `;
}
async function bindWebHookAction(request) {
  const result = [];
  const domain = new URL(request.url).host;
  const hookMode = API_GUARD ? "safehook" : "webhook";
  for (const token of ENV.TELEGRAM_AVAILABLE_TOKENS) {
    const url = `https://${domain}/telegram/${token.trim()}/${hookMode}`;
    const id = token.split(":")[0];
    result[id] = {
      webhook: await bindTelegramWebHook(token, url).catch((e2) => errorToString(e2)),
      command: await bindCommandForTelegram(token).catch((e2) => errorToString(e2))
    };
  }
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <h2>${domain}</h2>
    ${ENV.TELEGRAM_AVAILABLE_TOKENS.length === 0 ? buildKeyNotFoundHTML("TELEGRAM_AVAILABLE_TOKENS") : ""}
    ${Object.keys(result).map((id) => `
        <br/>
        <h4>Bot ID: ${id}</h4>
        <p style="color: ${result[id].webhook.ok ? "green" : "red"}">Webhook: ${JSON.stringify(result[id].webhook)}</p>
        <p style="color: ${result[id].command.ok ? "green" : "red"}">Command: ${JSON.stringify(result[id].command)}</p>
        `).join("")}
      ${footer}
    `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function telegramWebhook(request) {
  try {
    const { token } = request.params;
    const body = await request.json();
    return makeResponse200(await handleMessage(token, body));
  } catch (e2) {
    console.error(e2);
    return new Response(errorToString(e2), { status: 200 });
  }
}
async function telegramSafeHook(request) {
  try {
    if (API_GUARD === void 0 || API_GUARD === null) {
      return telegramWebhook(request);
    }
    console.log("API_GUARD is enabled");
    const url = new URL(request.url);
    url.pathname = url.pathname.replace("/safehook", "/webhook");
    request = new Request(url, request);
    return makeResponse200(await API_GUARD.fetch(request));
  } catch (e2) {
    console.error(e2);
    return new Response(errorToString(e2), { status: 200 });
  }
}
async function defaultIndexAction() {
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <p>Deployed Successfully!</p>
    <p> Version (ts:${ENV.BUILD_TIMESTAMP},sha:${ENV.BUILD_VERSION})</p>
    <br/>
    <p>You must <strong><a href="${initLink}"> >>>>> click here <<<<< </a></strong> to bind the webhook.</p>
    <br/>
    <p>After binding the webhook, you can use the following commands to control the bot:</p>
    ${commandsDocument().map((item) => `<p><strong>${item.command}</strong> - ${item.description}</p>`).join("")}
    <br/>
    <p>You can get bot information by visiting the following URL:</p>
    <p><strong>/telegram/:token/bot</strong> - Get bot information</p>
    ${footer}
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function loadBotInfo() {
  const result = [];
  for (const token of ENV.TELEGRAM_AVAILABLE_TOKENS) {
    const id = token.split(":")[0];
    result[id] = await getBot(token);
  }
  const HTML = renderHTML(`
    <h1>ChatGPT-Telegram-Workers</h1>
    <br/>
    <h4>Environment About Bot</h4>
    <p><strong>GROUP_CHAT_BOT_ENABLE:</strong> ${ENV.GROUP_CHAT_BOT_ENABLE}</p>
    <p><strong>GROUP_CHAT_BOT_SHARE_MODE:</strong> ${ENV.GROUP_CHAT_BOT_SHARE_MODE}</p>
    <p><strong>TELEGRAM_BOT_NAME:</strong> ${ENV.TELEGRAM_BOT_NAME.join(",")}</p>
    ${Object.keys(result).map((id) => `
            <br/>
            <h4>Bot ID: ${id}</h4>
            <p style="color: ${result[id].ok ? "green" : "red"}">${JSON.stringify(result[id])}</p>
            `).join("")}
    ${footer}
  `);
  return new Response(HTML, { status: 200, headers: { "Content-Type": "text/html" } });
}
async function handleRequest(request) {
  const router = new Router();
  router.get("/", defaultIndexAction);
  router.get("/init", bindWebHookAction);
  router.post("/telegram/:token/webhook", telegramWebhook);
  router.post("/telegram/:token/safehook", telegramSafeHook);
  if (ENV.DEV_MODE || ENV.DEBUG_MODE) {
    router.get("/telegram/:token/bot", loadBotInfo);
  }
  router.all("*", () => new Response("Not Found", { status: 404 }));
  return router.fetch(request);
}

// src/i18n/zh-hans.js
var zh_hans_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u4E2A\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u5F53\u524D\u652F\u6301\u4EE5\u4E0B\u547D\u4EE4:\n", "help": "\u83B7\u53D6\u547D\u4EE4\u5E2E\u52A9", "new": "\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "start": "\u83B7\u53D6\u4F60\u7684ID, \u5E76\u53D1\u8D77\u65B0\u7684\u5BF9\u8BDD", "img": "\u751F\u6210\u4E00\u5F20\u56FE\u7247, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A `/img \u56FE\u7247\u63CF\u8FF0`, \u4F8B\u5982`/img \u6708\u5149\u4E0B\u7684\u6C99\u6EE9`", "version": "\u83B7\u53D6\u5F53\u524D\u7248\u672C\u53F7, \u5224\u65AD\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8BBE\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]", "delenv": "\u5220\u9664\u7528\u6237\u914D\u7F6E\uFF0C\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6237\u914D\u7F6E, send /clearenv true", "system": "\u67E5\u770B\u5F53\u524D\u4E00\u4E9B\u7CFB\u7EDF\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5BF9\u8BDD, /redo \u52A0\u4FEE\u6539\u8FC7\u7684\u5185\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u4E3A /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u65B0\u7684\u5BF9\u8BDD\u5DF2\u7ECF\u5F00\u59CB" }, "detail": { "set": `/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]
  \u9009\u9879\u9884\u7F6E\u5982\u4E0B\uFF1A 
  -p \u8C03\u6574 SYSTEM_INIT_MESSAGE
  -m \u8C03\u6574 CHAT_MODEL
  -n \u8C03\u6574 MAX_HISTORY_LENGTH
  -a \u8C03\u6574 AI_PROVIDER
  -ai \u8C03\u6574 AI_IMAGE_PROVIDER
  -v \u8C03\u6574 OPENAI_VISION_MODEL
  -t \u8C03\u6574 OPENAI_TTS_MODEL
  
  \u53EF\u81EA\u884C\u8BBE\u7F6E MAPPING_KEY, \u4F7F\u7528\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u53EF\u8BBE\u7F6E\u503C MAPPING_KEY \u5BF9\u67D0\u4E9B\u5E38\u7528\u503C\u8FDB\u884C\u7B80\u5199\uFF0C\u540C\u6837\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u4F8B\u5982\uFF1AMAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
  \u5728\u4F7F\u7528/set\u65F6\u5FEB\u901F\u8C03\u6574\u53C2\u6570: /set -m r+ -v gpt-4o

  /set\u547D\u4EE4\u9ED8\u8BA4\u4E0D\u4F1A\u5C06\u4FEE\u6539\u7684\u53C2\u6570\u5B58\u50A8\uFF0C\u4EC5\u4E34\u65F6\u8C03\u6574\uFF0C\u5355\u6B21\u5BF9\u8BDD\u6709\u6548\uFF1B\u9700\u8981\u5B58\u50A8\u4FEE\u6539\u65F6\uFF0C\u8FFD\u52A0\u53C2\u6570-u
  /set\u547D\u4EE4\u8FFD\u52A0\u6587\u672C\u5904\u7406\u65F6\uFF0C\u9700\u8981\u952E\u5165\u6362\u884C\u6765\u8FDB\u884C\u5206\u5272\uFF0C\u53E6\u8D77\u4E00\u884C\u8F93\u5165\u5BF9\u8BDD\uFF0C\u4E0D\u6362\u884C\u65F6\u7C7B\u4F3C/setenv \u65E0\u6CD5\u7EE7\u7EED\u4E0E\u6A21\u578B\u5BF9\u8BDD
  \u9009\u9879\u4E0E\u53C2\u6570\u503C\u5747\u4E3A\u7A7A\u683C\u5206\u5272\uFF0C\u6545\u4E24\u8005\u672C\u8EAB\u4E0D\u80FD\u6709\u7A7A\u683C\uFF0C\u5426\u5219\u53EF\u80FD\u4F1A\u89E3\u6790\u51FA\u9519
  \u8C03\u6574SYSTEM_INIT_MESSAGE\u65F6\uFF0C\u82E5\u8BBE\u7F6E\u4E86PROMPT\u53EF\u76F4\u63A5\u4F7F\u7528\u8BBE\u7F6E\u4E3A\u89D2\u8272\u540D\uFF0C\u81EA\u52A8\u586B\u5145\u89D2\u8272prompt\uFF0C\u4F8B\u5982\uFF1A
  /set -p ~doctor -n 0
  \u53EF\u4F7F\u7528 TRIGGER\u8FDB\u884C\u518D\u6B21\u7B80\u5316:
  "~":"/set -p ~" \u8FD9\u6837\u5BF9\u8BDD\u65F6\u76F4\u63A5\u952E\u5165 ~doctor
\u4ECA\u5929\u6574\u4E2A\u4EBA\u660F\u6C89\u6C89\u7684\uFF0C\u6211\u9700\u8981\u5982\u4F55\u8C03\u7406\u8EAB\u4F53\uFF1F` } } };

// src/i18n/zh-hant.js
var zh_hant_default = { "env": { "system_init_message": "\u4F60\u662F\u4E00\u500B\u5F97\u529B\u7684\u52A9\u624B" }, "command": { "help": { "summary": "\u7576\u524D\u652F\u6301\u7684\u547D\u4EE4\u5982\u4E0B\uFF1A\n", "help": "\u7372\u53D6\u547D\u4EE4\u5E6B\u52A9", "new": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "start": "\u7372\u53D6\u60A8\u7684ID\u4E26\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71", "img": "\u751F\u6210\u5716\u7247\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA`/img \u5716\u7247\u63CF\u8FF0`\uFF0C\u4F8B\u5982`/img \u6D77\u7058\u6708\u5149`", "version": "\u7372\u53D6\u7576\u524D\u7248\u672C\u865F\u78BA\u8A8D\u662F\u5426\u9700\u8981\u66F4\u65B0", "setenv": "\u8A2D\u7F6E\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/setenv KEY=VALUE", "setenvs": '\u6279\u91CF\u8A2D\u7F6E\u7528\u6237\u914D\u7F6E, \u547D\u4EE4\u5B8C\u6574\u683C\u5F0F\u70BA /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set \u547D\u4EE4\u683C\u5F0F\u70BA /set \u9078\u9805 \u503C [\u9078\u9805 \u503C\u2026] [-u][\\n]", "delenv": "\u522A\u9664\u7528\u6236\u914D\u7F6E\uFF0C\u5B8C\u6574\u547D\u4EE4\u683C\u5F0F\u70BA/delenv KEY", "clearenv": "\u6E05\u9664\u6240\u6709\u7528\u6236\u914D\u7F6E, \u53D1\u9001/clearenv true", "system": "\u67E5\u770B\u4E00\u4E9B\u7CFB\u7D71\u4FE1\u606F", "redo": "\u91CD\u505A\u4E0A\u4E00\u6B21\u7684\u5C0D\u8A71 /redo \u52A0\u4FEE\u6539\u904E\u7684\u5167\u5BB9 \u6216\u8005 \u76F4\u63A5 /redo", "echo": "\u56DE\u663E\u6D88\u606F", "mode": "\u547D\u4EE4\u683C\u5F0F\u70BA /mode NAME, \u5F53NAME=all\u65F6, \u67E5\u770B\u6240\u6709mode" }, "new": { "new_chat_start": "\u958B\u59CB\u4E00\u500B\u65B0\u5C0D\u8A71" }, "detail": { "set": `/set \u547D\u4EE4\u683C\u5F0F\u4E3A /set \u9009\u9879 \u503C [\u9009\u9879 \u503C\u2026] [-u][\\n]
  \u9009\u9879\u9884\u7F6E\u5982\u4E0B\uFF1A 
  -p \u8C03\u6574 SYSTEM_INIT_MESSAGE
  -o \u8C03\u6574 CHAT_MODEL
  -n \u8C03\u6574 MAX_HISTORY_LENGTH
  -a \u8C03\u6574 AI_PROVIDER
  -ai \u8C03\u6574 AI_IMAGE_PROVIDER
  -v \u8C03\u6574 OPENAI_VISION_MODEL
  -t \u8C03\u6574 OPENAI_TTS_MODEL
  
  \u53EF\u81EA\u884C\u8BBE\u7F6E MAPPING_KEY, \u4F7F\u7528\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u53EF\u8BBE\u7F6E\u503C MAPPING_KEY \u5BF9\u67D0\u4E9B\u5E38\u7528\u503C\u8FDB\u884C\u7B80\u5199\uFF0C\u540C\u6837\u534A\u89D2|\u8FDB\u884C\u5206\u5272,:\u5DE6\u8FB9\u4E3A\u9009\u9879\uFF0C\u53F3\u8FB9\u4E3A\u5BF9\u5E94\u53D8\u91CF
  \u4F8B\u5982\uFF1AMAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+:command-r-plus'
  \u5728\u4F7F\u7528/set\u65F6\u5FEB\u901F\u8C03\u6574\u53C2\u6570: /set -m r+ -v gpt-4o

  /set\u547D\u4EE4\u9ED8\u8BA4\u4E0D\u4F1A\u5C06\u4FEE\u6539\u7684\u53C2\u6570\u5B58\u50A8\uFF0C\u4EC5\u4E34\u65F6\u8C03\u6574\uFF0C\u5355\u6B21\u5BF9\u8BDD\u6709\u6548\uFF1B\u9700\u8981\u5B58\u50A8\u4FEE\u6539\u65F6\uFF0C\u8FFD\u52A0\u53C2\u6570-u
  /set\u547D\u4EE4\u8FFD\u52A0\u6587\u672C\u5904\u7406\u65F6\uFF0C\u9700\u8981\u952E\u5165\u6362\u884C\u6765\u8FDB\u884C\u5206\u5272\uFF0C\u53E6\u8D77\u4E00\u884C\u8F93\u5165\u5BF9\u8BDD\uFF0C\u4E0D\u6362\u884C\u65F6\u7C7B\u4F3C/setenv \u65E0\u6CD5\u7EE7\u7EED\u4E0E\u6A21\u578B\u5BF9\u8BDD
  \u9009\u9879\u4E0E\u53C2\u6570\u503C\u5747\u4E3A\u7A7A\u683C\u5206\u5272\uFF0C\u6545\u4E24\u8005\u672C\u8EAB\u4E0D\u80FD\u6709\u7A7A\u683C\uFF0C\u5426\u5219\u53EF\u80FD\u4F1A\u89E3\u6790\u51FA\u9519
  \u8C03\u6574SYSTEM_INIT_MESSAGE\u65F6\uFF0C\u82E5\u8BBE\u7F6E\u4E86PROMPT\u53EF\u76F4\u63A5\u4F7F\u7528\u8BBE\u7F6E\u4E3A\u89D2\u8272\u540D\uFF0C\u81EA\u52A8\u586B\u5145\u89D2\u8272prompt\uFF0C\u4F8B\u5982\uFF1A
  /set -p ~doctor -n 0
  \u53EF\u4F7F\u7528 TRIGGER\u8FDB\u884C\u518D\u6B21\u7B80\u5316:
  "~":"/set -p ~" \u8FD9\u6837\u5BF9\u8BDD\u65F6\u76F4\u63A5\u952E\u5165 ~doctor
\u4ECA\u5929\u6574\u4E2A\u4EBA\u660F\u6C89\u6C89\u7684\uFF0C\u6211\u9700\u8981\u5982\u4F55\u8C03\u7406\u8EAB\u4F53\uFF1F` } } };

// src/i18n/pt.js
var pt_default = { "env": { "system_init_message": "Voc\xEA \xE9 um assistente \xFAtil" }, "command": { "help": { "summary": "Os seguintes comandos s\xE3o suportados atualmente:\n", "help": "Obter ajuda sobre comandos", "new": "Iniciar uma nova conversa", "start": "Obter seu ID e iniciar uma nova conversa", "img": "Gerar uma imagem, o formato completo do comando \xE9 `/img descri\xE7\xE3o da imagem`, por exemplo `/img praia ao luar`", "version": "Obter o n\xFAmero da vers\xE3o atual para determinar se \xE9 necess\xE1rio atualizar", "setenv": "Definir configura\xE7\xE3o do usu\xE1rio, o formato completo do comando \xE9 /setenv CHAVE=VALOR", "setenvs": 'Definir configura\xE7\xF5es do usu\xE1rio em lote, o formato completo do comando \xE9 /setenvs {"CHAVE1": "VALOR1", "CHAVE2": "VALOR2"}', "delenv": "Excluir configura\xE7\xE3o do usu\xE1rio, o formato completo do comando \xE9 /delenv CHAVE", "clearenv": "Limpar todas as configura\xE7\xF5es do usu\xE1rio", "system": "Ver algumas informa\xE7\xF5es do sistema", "redo": "Refazer a \xFAltima conversa, /redo com conte\xFAdo modificado ou diretamente /redo", "echo": "Repetir a mensagem" }, "new": { "new_chat_start": "Uma nova conversa foi iniciada" } } };

// src/i18n/en.js
var en_default = { "env": { "system_init_message": "You are a helpful assistant" }, "command": { "help": { "summary": "The following commands are currently supported:\n", "help": "Get command help", "new": "Start a new conversation", "start": "Get your ID and start a new conversation", "img": "Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`", "version": "Get the current version number to determine whether to update", "setenv": "Set user configuration, the complete command format is /setenv KEY=VALUE", "setenvs": 'Batch set user configurations, the full format of the command is /setenvs {"KEY1": "VALUE1", "KEY2": "VALUE2"}', "set": "/set command format is /set option value [option value...] [-u][\\n]", "delenv": "Delete user configuration, the complete command format is /delenv KEY", "clearenv": "Clear all user configuration, send /clearenv true", "system": "View some system information", "redo": "Redo the last conversation, /redo with modified content or directly /redo", "echo": "Echo the message", "mode": "the full format of the command is /mode NAME, when NAME=all, view all modes" }, "new": { "new_chat_start": "A new conversation has started" }, "detail": { "set": `/set The command format is /set Option Value [Option Value...] [-u][\\n]
 The option presets are as follows: 
 -p Adjust SYSTEM_INIT_MESSAGE
 -m Adjust CHAT_MODEL
 -n Adjust MAX_ HISTORY_LENGTH
 -a Adjust AI_PROVIDER
 -ai Adjust AI_IMAGE_PROVIDER
 -v Adjust OPENAI_VISION_MODEL
 -t Adjust OPENAI_TTS_MODEL
 
 You can set up the MAPPING_KEY by yourself, and use the half-corner for the MAPPING_KEY, split by half-corners,: options on the left, corresponding variables on the right 
 Can set the value MAPPING_KEY abbreviate some commonly used values, also split by half-corners,: options on the left, corresponding variables on the right 
 For example: MAPPING_VALUE = 'c35son:claude-3-5-sonnet-20240620|r+: command-r-plus' 
+. command-r-plus'
 Quickly adjust parameters when using /set: /set -m r+ -v gpt-4o

 /set command will not store modified parameters by default, only temporary adjustments, valid for a single conversation; when you need to store the changes, append the parameter -u
 /set command to append the text processing, you need to type a newline to split, start a new line and type the conversation without a newline. When you type in a newline to split the dialog, you can't continue the dialog with the model without a newline, similar to /setenv 
 Options and parameter values are split by spaces, so there can't be any spaces between the two, or else there may be parsing errors 
 Adjustment of the SYSTEM_INIT_MESSAGE, if you have set up a PROMPT you can use the set to the role name directly to automatically fill in the role Prompt, for example: 
 / set -p ~doctor -n 0
 Can use TRIGGER to simplify again:
 "~":"/set -p ~" so that when dialoguing, you can directly type ~doctor
 Today, the whole person is lethargic, how do I need to regulate my body?` } } };

// src/i18n/index.js
function i18n(lang) {
  switch (lang.toLowerCase()) {
    case "cn":
    case "zh-cn":
    case "zh-hans":
      return zh_hans_default;
    case "zh-tw":
    case "zh-hk":
    case "zh-mo":
    case "zh-hant":
      return zh_hant_default;
    case "pt":
    case "pt-br":
      return pt_default;
    case "en":
    case "en-us":
      return en_default;
    default:
      return en_default;
  }
}

// main.js
var main_default = {
  initHander(env) {
    try {
      initEnv(env, i18n);
      return handleRequest;
    } catch (error) {
      console.error(e);
      return new Response(errorToString(e), { status: 500 });
    }
  },
  async fetch(request, env, ctx) {
    try {
      if (!env.DATABASE && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
        const { RedisCache: RedisCache2 } = await Promise.resolve().then(() => (init_redis(), redis_exports));
        env.DATABASE = new RedisCache2(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
      }
      initEnv(env, i18n);
      return await handleRequest(request);
    } catch (e2) {
      console.error(e2);
      return new Response(errorToString(e2), { status: 500 });
    }
  },
  async scheduled(event, env, ctx) {
    try {
      if (!env.DATABASE && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
        const { RedisCache: RedisCache2 } = await Promise.resolve().then(() => (init_redis(), redis_exports));
        env.DATABASE = new RedisCache2(env.UPSTASH_REDIS_REST_URL, env.UPSTASH_REDIS_REST_TOKEN);
      }
      const promises = [];
      for (const task of Object.values(scheduleTask_default)) {
        promises.push(task(env));
      }
      await Promise.all(promises);
      console.log("All tasks done.");
    } catch (e2) {
      console.error("Error in scheduled tasks:", e2);
    }
  }
};
export {
  main_default as default
};
