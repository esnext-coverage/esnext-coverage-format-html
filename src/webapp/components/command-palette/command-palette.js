import h from 'virtual-dom/h';
import breadcrumbs from '../breadcrumbs/breadcrumbs';
import search from '../search/search';

export default function commandPalette(state) {
  return h('div', {className: 'command-palette'}, [
    breadcrumbs(state),
    search(state)
  ]);
}
