import filelist from '../filelist/filelist';
import file from '../file/file';

export default function filebox(subtree, state) {
  return subtree.type === 'file' ?
    file(subtree, state) :
    filelist(subtree, state.thresholds);
}
