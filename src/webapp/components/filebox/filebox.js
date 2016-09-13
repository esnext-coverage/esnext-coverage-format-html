import filelist from '../filelist/filelist';
import file from '../file/file';

export default function filebox(subtree) {
  return subtree.type === 'file' ?
    file(subtree) :
    filelist(subtree);
}
