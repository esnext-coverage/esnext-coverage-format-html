import h from 'virtual-dom/h';
import stats from '../stats/stats';

function headerTitle() {
  return h('div', {
    className: 'header-title'
  }, 'My awesome project');
}

export default function header(state) {
  return h('div', {
    className: 'header'
  }, [
    h('div', {className: 'header-logo'}, []),
    headerTitle(),
    h('div', {className: 'header-stats'}, stats(state))
  ]);
}
