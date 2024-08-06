/**
 * @description: markdown 转 nodes
 * 简单支持 #标题, 引用, * - 无序列表, 有序列表, 粗体, 斜体, 链接, 分割线, 行内代码块, 跨行代码块
 * @param {string} markdown
 * @return {object[]}
 */
function markdownToTelegraphNodes(markdown) {
  const lines = markdown.split('\n');
  const nodes = [];
  let currentList = null;
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';

  for (let line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // 结束代码块
        nodes.push({
          tag: 'pre',
          children: [
            {
              tag: 'code',
              attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
              children: [codeBlockContent.trim()],
            },
          ],
        });
        inCodeBlock = false;
        codeBlockContent = '';
        codeBlockLanguage = '';
      } else {
        // 开始代码块
        inCodeBlock = true;
        codeBlockLanguage = line.trim().slice(3).trim(); // 获取语言标识符
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    line = line.trim();
    if (!line) continue;

    // 标题
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s*/, '');
      // nodes.push({ tag: `h${level}`, children: processInlineElements(text) });
      nodes.push({ tag: `h${level}`, children: [text] }); // 简化处理
    }
    // 引用
    else if (line.startsWith("> ")) {
      const text = line.slice(2);
      nodes.push({ tag: 'blockquote', children: processInlineElements(text) });
    }
    // 无序列表
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2);
      if (!currentList) {
        currentList = { tag: 'ul', children: [] };
        nodes.push(currentList);
      }
      currentList.children.push({ tag: 'li', children: processInlineElements(text) });
    }
    // 有序列表
    else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, '');
      if (!currentList) {
        currentList = { tag: 'ol', children: [] };
        nodes.push(currentList);
      }
      currentList.children.push({ tag: 'li', children: processInlineElements(text) });
    }
    // 分割线
    else if (line === '---') {
    nodes.push({ tag: "hr" });
    }
    // 段落
    else {
      currentList = null;
      nodes.push({ tag: 'p', children: processInlineElements(line) });
    }
  }

  // 处理可能的未闭合代码块
  if (inCodeBlock) {
    nodes.push({
      tag: 'pre',
      children: [
        {
          tag: 'code',
          attrs: codeBlockLanguage ? { class: `language-${codeBlockLanguage}` } : {},
          children: [codeBlockContent.trim()],
        },
      ],
    });
  }

  return nodes;
}

function processInlineElementsHelper(text) {
  let children = [];

  // 处理粗体与斜体
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /__(.*?)__/g;
  let boldMatch;
  let italicMatch;
  let lastIndex = 0;

  while ((boldMatch = boldRegex.exec(text)) !== null || (italicMatch = italicRegex.exec(text)) !== null) {
    if ((boldMatch || italicMatch).index > lastIndex) {
      children.push(text.slice(lastIndex, (boldMatch || italicMatch).index));
    }
    children.push({
      tag: boldMatch ? 'strong' : 'i',
      children: [(boldMatch||italicMatch)[1]],
    });
    lastIndex = (boldMatch || italicMatch).index + (boldMatch || italicMatch)[0].length;
    
  }

  if (lastIndex < text.length) {
    children.push(text.slice(lastIndex));
  }


  // 处理链接
  children = children.map((child) => {
    if (typeof child === 'string') {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let linkMatch;
      let linkChildren = [];
      let lastLinkIndex = 0;

      while ((linkMatch = linkRegex.exec(child)) !== null) {
        if (linkMatch.index > lastLinkIndex) {
          linkChildren.push(child.slice(lastLinkIndex, linkMatch.index));
        }
        linkChildren.push({
          tag: 'a',
          attrs: { href: linkMatch[2] },
          children: [linkMatch[1]],
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

function processInlineElements(text) {
  let children = [];

  // 处理行内代码块
  const codeRegex = /`([^`]+)`/g;
  let codeMatch;
  let lastIndex = 0;

  while ((codeMatch = codeRegex.exec(text)) !== null) {
    if (codeMatch.index > lastIndex) {
      children.push(...processInlineElementsHelper(text.slice(lastIndex, codeMatch.index)));
    }
    children.push({
      tag: 'code',
      children: [codeMatch[1]],
    });
    lastIndex = codeMatch.index + codeMatch[0].length;
  }

  if (lastIndex < text.length) {
    children.push(...processInlineElementsHelper(text.slice(lastIndex)));
  }

  return children.flat();
}

export default markdownToTelegraphNodes;
