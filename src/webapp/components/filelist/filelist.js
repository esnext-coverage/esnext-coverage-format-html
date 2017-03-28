import h from 'virtual-dom/h';
import filelistHeader from '../filelist-header/filelist-header';
import filelistItem from '../filelist-item/filelist-item';

function generateFilelist(tree, thresholds) {
  return Object
    .keys(tree.contents)
    .sort()
    .map(name => filelistItem(tree.contents[name], thresholds));
}

export default function filelist(subtree, thresholds) {
  return h('div', {
    className: 'filelist'
  }, [
    filelistHeader(subtree),
    ...generateFilelist(subtree, thresholds)
  ]);
}
