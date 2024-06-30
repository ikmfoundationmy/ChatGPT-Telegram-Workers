const codeBlockReg = /^(\s*```[\s\S]+?^\s*```\s*$)/gm;
const escapeChars = /([\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g;

function CompleteCodeBlock(text) {
  const codeMatches = text.match(/^\s*```/gm);
  return codeMatches && codeMatches.length % 2 === 1 ? text + '\n```' : text;
}

function splitAndKeepWithIndex(text, regex) {
  const parts = text.split(regex);
  let blankLength = 0; // 多个代码块一般冗余空白符长度相当
  let blankReg;
  const indices = [];
  for (let i = 0; i < parts.length; i++) {
    if (regex.test(parts[i])) {
      // 去除代码块中多余空白符
      parts[i] = parts[i].replace(/^\n+/gm, '');
      if (blankLength === 0) blankLength = parts[i].length - parts[i].trimStart().length;
      if (blankLength > 0) {
        if (!blankReg) blankReg = new RegExp(`^\\s{${blankLength}}`, 'gm');
        parts[i] = parts[i].replace(blankReg, '');
      }
      indices.push(i);
    }
  }
  return { parts, indices };
}

export function escape(text) {
  // const codeBlockReg = /^(\s*```[\s\S]+?^\s*```\s*$)/gm;
  // 检查代码块是否完整
  text = CompleteCodeBlock(text);
  const result = splitAndKeepWithIndex(text, codeBlockReg);
  for (let i = 0; i < result.parts.length; i++) {
    if (!result.indices.includes(i)) {
      result.parts[i] = result.parts[i]
        .replace(escapeChars, '\\$1')
        // force all characters that need to be escaped to be escaped once.
        .replace(/\\\*([^(\\\*)].+?[^\\\n])\\\*/g, '*$1*') // bold
        // \\\*(.+?[^\\])\\\*(.*)$
        // \\\*([^(\\\*)])(.+?[^\\])\\\*(\s*)$
        .replace(/\\_\\_(.+?[^\\])\\_\\_/g, '__$1__') // underline
        .replace(/\\_(.+?[^\\])\\_/g, '_$1_') // italic
        .replace(/\\~(.+?[^\\])\\~/g, '~$1~') // strikethrough
        .replace(/\\\|\\\|(.+?[^\\])\\\|\\\|/g, '||$1||') // spoiler
        .replace(/\\\[([^\]]+?)\\\]\\\((.+?)\\\)/g, '[$1]($2)') // url
        .replace(/\\\`(.+?[^\\])\\\`/g, '`$1`') // inline code
        // .replace(/`\\``/g, '```') // code block
        .replace(/\\\\([\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '\\$1') // restore duplicate escapes
        .replace(/^(\s*)\\(>.+\s*)$/gm, '$1$2') // >
        // .replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2') // escape
        .replace(/^((\\#){1,3}\s)(.+)/gm, '$1*$3*'); // #
    } else {
      result.parts[i] = result.parts[i]
        .replace(/(\`)/g, '\\$1') // backtick
        // .replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2') // escape
        .replace(/\\`\\`\\`/g, '```'); // code block
    }
    result.parts[i] = result.parts[i].replace(/([^\\])\\([^\_\*\[\]\(\)\~\`\>\#\+\-\=\|\{\}\.\!])/g, '$1\\\\$2');
  }

  return result.parts.join('');
}
