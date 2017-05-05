import h from 'virtual-dom/h';
import findSubtree from '../../services/find-subtree';
import header from '../header/header';
import commandPalette from '../command-palette/command-palette';
import footer from '../footer/footer';
import filebox from '../filebox/filebox';

export default function report(state) {
  const currentPath = state.location.path;
  const currentSubtree = findSubtree(state.files, currentPath);
  return h('div', {
    className: 'report'
  }, [
    header(state, currentSubtree),
    commandPalette(state),
    filebox(state, currentSubtree),
    footer(state)
  ]);
}
