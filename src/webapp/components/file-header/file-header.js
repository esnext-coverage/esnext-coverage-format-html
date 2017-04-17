import h from 'virtual-dom/h';

export default function fileHeader() {
  return h('div', {
    className: 'file-header'
  }, [
    h('div', {className: 'file-header__line'}, 'Line'),
    h('div', {className: 'file-header__count'}, 'Count'),
    h('div', {className: 'file-header__source-code'}, 'Source code')
  ]);
}
