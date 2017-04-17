import h from 'virtual-dom/h';
import store from '../../store';

function getStackItemTags(tags) {
  if (tags.includes('expression')) {
    return [
      h('span', {className: 'stack-annotation'}, 'evaluated '),
      'expression'
    ];
  }
  if (tags.includes('statement')) {
    return [
      h('span', {className: 'stack-annotation'}, 'executed '),
      'statement'
    ];
  }
  if (tags.includes('branch')) {
    return [
      h('span', {className: 'stack-annotation'}, 'took '),
      'branch'
    ];
  }
  if (tags.includes('function')) {
    return [
      h('span', {className: 'stack-annotation'}, 'entered '),
      'function',
      h('span', {className: 'stack-annotation'}, ' body ')
    ];
  }
  return tags.join(' ');
}

function getCodeAtPosition(lines, {start, end}) {
  const code = [];
  for (let i = start.line - 1; i < end.line; i += 1) {
    const startColumn = i === start.line - 1 ? start.column : 0;
    const endColumn = i === end.line - 1 ? end.column : lines[i].length;
    code.push(lines[i].slice(startColumn, endColumn).trim());
  }
  return code.join(' ');
}

function inspectLocation(path, id) {
  store.dispatch({
    type: 'INSPECTION_LOCATION',
    payload: {path, id}
  });
}

function stackItems({path, contents, coverage}, {inspection}) {
  const lines = contents.split('\n');
  return coverage.stack.map(id => {
    const {tags, loc} = coverage.locations[id];
    const codeAtPosition = getCodeAtPosition(lines, loc);
    return h('div', {
      className: inspection.path === path && inspection.id === id ? 'stack-item--inspected' : 'stack-item',
      onmouseover() { inspectLocation(path, id); }
    }, [
      h('div', {className: 'stack-item__tags'}, getStackItemTags(tags)),
      h('pre', {
        className: 'stack-item__name',
        title: codeAtPosition
      }, codeAtPosition),
      h('div', {className: 'stack-item__source-line'}, [
        h('span', {className: 'stack-annotation'}, 'on line '),
        loc.start.line
      ])
    ]);
  });
}

export default function filePanel(node, state) {
  return h('div', {className: 'file-panel-container'}, [
    h('div', {className: 'file-panel-header'}, 'Stack'),
    h('div', {
      className: 'file-panel',
      onmouseleave() { inspectLocation(null, null); }
    }, stackItems(node, state))
  ]);
}
