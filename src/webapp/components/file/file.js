import h from 'virtual-dom/h';
import {parse} from 'babylon';

function generateLineCountClassName(line) {
  if (!line.covered) { return 'line-count'; }
  return line.count ? 'line-count--covered' : 'line-count--not-covered';
}

function lineNumberGutter(lines) {
  return h('div', {className: 'gutter-line-number'}, [
    lines.map((line, index) => {
      const className = 'line-number';
      const textContent = index + 1;
      return h('pre', {className}, [textContent]);
    })
  ]);
}

function passCountGutter(lines) {
  return h('div', {className: 'gutter-pass-count'}, [
    lines.map(line => {
      const className = generateLineCountClassName(line);
      const textContent = line.covered ? line.count : '';
      return h('pre', {className}, [textContent]);
    })
  ]);
}

function codeGutter(lines) {
  return h('div', {className: 'gutter-code'}, [
    lines.map(line => h('pre', {className: 'line-text'}, line.elements))
  ]);
}

function locationSorter(a, b) {
  const yd = a[2] - b[2];
  if (yd !== 0) { return yd; }
  return a[1] - b[1];
}

function tokensOnLine(lineNum) {
  return token => token.loc.start.line <= lineNum && token.loc.end.line >= lineNum;
}

function locationsOnLine(lineNum) {
  return token => token[2] <= lineNum && token[4] >= lineNum;
}

function normalizeTokenType(tokenType) {
  if (tokenType === 'CommentBlock' || tokenType === 'CommentLine') { return 'comment'; }
  if (tokenType.keyword) { return 'keyword'; }
  if (tokenType.label) { return tokenType.label; }
  return 'unknown';
}

function generateTokens(lineNum, text, tokens) {
  const result = [];
  let tracker = 0;
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.loc.start.column > tracker) {
      result.push({
        loc: token.loc,
        type: 'whitespace',
        contents: text.slice(tracker, token.loc.start.column)
      });
    }
    const start = token.loc.start.line < lineNum ? 0 : token.loc.start.column;
    const end = token.loc.end.line > lineNum ? text.length : token.loc.end.column;
    result.push({
      loc: token.loc,
      type: normalizeTokenType(token.type),
      contents: text.slice(start, end)
    });
    tracker = token.loc.end.column;
  }
  return result;
}

function isTokenInsideLocation(token, location) {
  return (
    location[2] < token.loc.start.line ||
      location[2] === token.loc.start.line && location[1] <= token.loc.start.column
  ) && (
    location[4] > token.loc.end.line ||
      location[4] === token.loc.end.line && location[3] >= token.loc.end.column
  );
}

function generateLocations(tokens, locations) {
  const result = [];
  for (let i = 0, j = 0; i < tokens.length; i += 1) {
    const location = locations[j];
    let token = tokens[i];
    if (location && isTokenInsideLocation(token, location)) {
      const tokenGroup = [];
      while (token && isTokenInsideLocation(token, location)) {
        tokenGroup.push(token);
        i += 1;
        token = tokens[i];
      }
      i -= 1;
      result.push({
        location,
        children: generateLocations(tokenGroup, locations.slice(j + 1))
      });
      j = locations.findIndex(l => l[2] === location[4] && l[1] > location[3]);
    } else {
      result.push(token);
    }
  }
  return result;
}

function tokenize(lineNum, text, tokens, lineLocations) {
  return generateLocations(generateTokens(lineNum, text, tokens), lineLocations);
}

function tokenTreeAsElements(tokenTree) {
  return tokenTree.children.map(node => {
    if (node.children) {
      const attrs = {};
      if (node.location[0] === 0) {
        attrs.className = 'location--not-covered';
      }
      return h('span', attrs, tokenTreeAsElements(node));
    }
    return node.type === 'whitespace' ?
      node.contents :
      h('span', {className: `token--${node.type}`}, node.contents);
  });
}

export default function file(node) {
  const locations = node.locations;
  const {tokens} = parse(node.contents, {sourceType: 'module'});
  const lines = node.contents.split('\n')
    .map((text, i) => {
      const lineNum = i + 1;
      const lineTokens = tokens.filter(tokensOnLine(lineNum));
      const lineLocations = locations
        .filter(locationsOnLine(lineNum))
        .sort(locationSorter);
      return {
        count: 0,
        covered: false,
        elements: tokenTreeAsElements({
          children: tokenize(lineNum, text, lineTokens, lineLocations)
        })
      };
    });
  node.lines.forEach(line => {
    const lineNumber = line.line - 1;
    lines[lineNumber].covered = true;
    lines[lineNumber].count = line.count;
  });
  return h('div', {
    className: 'file'
  }, [
    lineNumberGutter(lines),
    passCountGutter(lines),
    codeGutter(lines)
  ]);
}
