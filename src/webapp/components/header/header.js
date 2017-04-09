import h from 'virtual-dom/h';
import breadcrumbs from '../breadcrumbs/breadcrumbs';
import search from '../search/search';

function headerTitle() {
  return h('div', {
    className: 'header-title'
  }, ['Code coverage report for']);
}

export default function header(state) {
  return h('div', {
    className: 'header'
  }, [
    h('div', {className: 'header-logo'}, []),
    h('div', {className: 'header-contents'}, [
      h('div', {className: 'header-title-container'}, [
        headerTitle(),
        breadcrumbs(state)
      ]),
      h('div', {className: 'header-search-container'}, [
        search(state)
      ])
    ])
  ]);
}
