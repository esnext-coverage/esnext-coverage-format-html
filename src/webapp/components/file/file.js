import h from 'virtual-dom/h';
import store from '../../store';
import fileHeader from '../file-header/file-header';
import filePanel from '../file-panel/file-panel';

function inspectLocation(path, id) {
  store.dispatch({
    type: 'INSPECTION_LOCATION',
    payload: {path, id}
  });
}

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
  return h('div', {
    className: 'gutter-code',
    onmouseleave() { inspectLocation(null, null); }
  }, [
    lines.map(line => h('pre', {className: 'line-text'}, line.elements))
  ]);
}

function locationSorter(a, b) {
  const yd = a.loc.start.line - b.loc.start.line;
  if (yd !== 0) { return yd; }
  return a.loc.start.column - b.loc.start.column;
}

function locatablesOnLine(locatable, lineNum) {
  return locatable.loc.start.line <= lineNum && locatable.loc.end.line >= lineNum;
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
      type: token.type,
      contents: text.slice(start, end)
    });
    tracker = token.loc.end.column;
  }
  return result;
}

function isTokenInsideLocation(token, {loc}) {
  return (
    loc.start.line < token.loc.start.line ||
      loc.start.line === token.loc.start.line && loc.start.column <= token.loc.start.column
  ) && (
    loc.end.line > token.loc.end.line ||
      loc.end.line === token.loc.end.line && loc.end.column >= token.loc.end.column
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
      j = locations.findIndex(
        ({loc}) => loc.start.line === location.loc.end.line && loc.start.column > location.loc.end.column
      );
    } else {
      result.push(token);
    }
  }
  return result;
}

function tokenize(lineNum, text, tokens, lineLocations) {
  return generateLocations(generateTokens(lineNum, text, tokens), lineLocations);
}

function tokenTreeAsElements(tokenTree, node, state) {
  const locationId = state.inspection.path === node.path ? state.inspection.id : null;
  return tokenTree.children.map(tokenSubtree => {
    if (tokenSubtree.children) {
      const attrs = {};
      if (tokenSubtree.location.count === 0) {
        attrs.className = 'location--not-covered';
      } else if (locationId === tokenSubtree.location.id) {
        attrs.className = 'location--inspected';
      }
      attrs.onmouseover = event => {
        event.stopPropagation();
        inspectLocation(node.path, tokenSubtree.location.id);
      };
      return h('span', attrs, tokenTreeAsElements(tokenSubtree, node, state));
    }
    if (tokenSubtree.type === 'whitespace') {
      return tokenSubtree.contents;
    }
    return h('span', {className: `token--${tokenSubtree.type}`}, tokenSubtree.contents);
  });
}

export default function file(node, state) {
  const locations = node.coverage.locations;
  const tokens = node.coverage.tokens;
  const lines = node.contents.split('\n')
    .map((text, lineNumOffset) => {
      const lineNum = lineNumOffset + 1;

      // Avoiding filter here for performance reasons:
      const lineTokens = [];
      for (let i = 0; i < tokens.length; i += 1) {
        if (locatablesOnLine(tokens[i], lineNum)) {
          lineTokens.push(tokens[i]);
        }
      }

      // Avoiding filter here for performance reasons:
      let lineLocations = [];
      for (let i = 0; i < locations.length; i += 1) {
        if (locatablesOnLine(locations[i], lineNum)) {
          lineLocations.push(locations[i]);
        }
      }
      lineLocations = lineLocations.sort(locationSorter);

      return {
        count: 0,
        covered: false,
        elements: tokenTreeAsElements({
          children: tokenize(lineNum, text, lineTokens, lineLocations)
        }, node, state)
      };
    });

  node.lines.forEach(line => {
    const lineNumber = line.line - 1;
    lines[lineNumber].covered = true;
    lines[lineNumber].count = line.count;
  });

  return h('div', {className: 'file-container'}, [
    fileHeader(),
    h('div', {className: 'file'}, [
      lineNumberGutter(lines),
      passCountGutter(lines),
      codeGutter(lines),
      filePanel(node, state)
    ])
  ]);
}
