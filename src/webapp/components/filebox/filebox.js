import h from 'virtual-dom/h';
import filelist from '../filelist/filelist';
import file from '../file/file';

export default function filebox(state, subtree) {
  const children = subtree.type === 'file' ?
    file(subtree, state) :
    filelist(subtree, state.thresholds);
  return h('div', {className: 'filebox'}, children);
}
