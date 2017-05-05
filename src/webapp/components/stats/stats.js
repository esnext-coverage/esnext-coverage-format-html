import h from 'virtual-dom/h';
import findSubtree from '../../services/find-subtree';
import toPercentage from '../../services/to-percentage';
import getMetricTagTitle from '../../services/get-metric-tag-title';

function statThermometer(percent, threshold) {
  const color = percent < threshold ? 'rgb(251, 118, 121)' : 'rgb(81, 203, 118)';
  return h('div', {
    className: 'stat-thermometer',
    style: {
      background: `linear-gradient(
        to top,
        ${color} 0%,
        ${color} ${percent}%,
        #e8edf0 ${percent}%,
        #e8edf0 100%
      )`
    }
  }, []);
}

const regex = /(\d+)(?:\.(\d+))?(%)/;
function percentage(value) {
  const [major, minor, sign] = value.match(regex).slice(1);
  const superscript = minor ? `.${minor}${sign}` : sign;
  return [
    major,
    h('span', {className: 'tag-percentage__superscript'}, superscript)
  ];
}

function generateStats(metrics, thresholds) {
  return Object.keys(metrics).map(tag => {
    const {covered, total} = metrics[tag];
    const ratio = total ? covered / total : 1;
    return h('div', {className: 'stat'}, [
      statThermometer(ratio * 100, thresholds.global[tag]),
      h('div', {className: 'tag-percentage'}, percentage(toPercentage(ratio))),
      h('div', {className: 'tag-count'}, `${covered}/${total}`),
      h('div', {className: 'tag-name'}, getMetricTagTitle(tag))
    ]);
  });
}

export default function stats(state) {
  const subtree = findSubtree(state.files, []);
  return h('div', {
    className: 'stats'
  }, generateStats(subtree.metrics, state.thresholds));
}
