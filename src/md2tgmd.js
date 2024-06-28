// Inspired by: https://github.com/yym68686/md2tgmd
function escapeshape(text) {
    return '▎*' + text.trim().split(' ').slice(1).join(' ') + '*\n\n';
}

function splitAndKeepWithIndex(text, regex) {
    const parts = text.split(regex);
    const indices = parts.reduce((acc, part, index) => {
      if (regex.test(part)) {
        acc.push(index);
      }
      return acc;
    }, []);
  
    return { parts, indices };
}
  
function CompleteCodeBlock(text) {
    const codeMatches = text.match(/(\s)```/g);
    const isNeedAdd = (codeMatches ? codeMatches.length : 0) % 2 == 1;
    return isNeedAdd ? text + '\n```' : text;
}

export function escape(text, flag = 0) {
    // 检查代码块是否完整
    text = CompleteCodeBlock(text);
    const codeBlockReg = /(^\s*```[\s\S]+?```)/gm;
    // 代码块的位置
    const result = splitAndKeepWithIndex(text, codeBlockReg);

    result.parts.forEach((v,i) => {
        if (!result.indices.includes(i)) {
            result.parts[i] = v.replace(/\\\[/g, '@->@')
                .replace(/\\([\[\]\(\)\{\}\+\-\.\>\*\#\|\~\=\`])/g, '$1')
                .replace(/\*{2}(.+?)\*{2}/g, '@@@$1@@@')
                .replace(/(\n{1,2})\*\s/g, '$1• ')
                .replace(/\*/g,'\\*')
                .replace(/@{3}(.+?)@{3}/g, '*$1*')
                .replace(/!?\[(.*?)\]\((.*?)\)/g, '@@@$1@@@^^^$2^^^')
                .replace(/@{3}(.*?)@{3}\^{3}(.*?)\^{3}/g, '[$1]($2)')
                .replace(/(^#+\s.+?\n+)/g, escapeshape)
                .replace(/(\n{1,2})(\s*\d{1,2}\.\s)/g, '$1$2')
                .replace(/(\n{1,2})(\s*)-\s/g, '$1$2• ')
                .replace(/`(.+?)`/g, '@@$1@@')
                .replace(/[\^_\-#~=|\(\)\[\]{}\.!\+\>\`]/g, '\\$&')
                .replace(/@{2}([\s\S]+?)@{2}/g, '`$1`')
            
        }
    });
    
    return result.parts.join('');
}