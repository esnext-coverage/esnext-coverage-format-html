import filelist from '../filelist/filelist';
import file from '../file/file';

export default function filebox(subtree, thresholds) {
  return subtree.type === 'file' ?
    file(subtree) :
    filelist(subtree, thresholds);
}
