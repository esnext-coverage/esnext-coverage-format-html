import h from 'virtual-dom/h';
import toPercentage from '../../services/to-percentage';

function filelistItemMetricClassName(ratio, threshold) {
  if (!threshold) {
    return 'filelist-item__metric';
  }
  return Math.floor(ratio * 100) >= threshold ?
    'filelist-item__metric--passed' :
    'filelist-item__metric--failed';
}

function generateMetricsCells(metrics, thresholds = {}) {
  return Object.keys(metrics).map(tagName => {
    const {covered, total} = metrics[tagName];
    const ratio = total ? covered / total : 1;
    const threshold = thresholds.global ? thresholds.global[tagName] : null;
    return h('div', {
      className: filelistItemMetricClassName(ratio, threshold)
    }, [
      h('span', {className: 'filelist-item__metric__percentage'}, [toPercentage(ratio)]),
      h('span', {className: 'filelist-item__metric__counts'}, [`${covered}/${total}`])
    ]);
  });
}

export default function filelistItem(file, thresholds) {
  return h('a', {
    className: 'filelist-item',
    href: `#/${file.path}`
  }, [
    h('div', {className: 'filelist-item__name'}, [file.name]),
    ...generateMetricsCells(file.metrics, thresholds)
  ]);
}
