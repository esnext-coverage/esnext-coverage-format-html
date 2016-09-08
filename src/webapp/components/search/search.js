import h from 'virtual-dom/h';
import store from '../../store';

function suggestionsSelector(state) {
  const current = state.location.path[0];
  return Object
    .keys(state.files.contents)
    .filter(fileName => {
      return state.search && current !== fileName && fileName.includes(state.search);
    });
}

function clearSearch() {
  store.dispatch({
    type: 'SEARCH',
    payload: ''
  });
}

function runSearch(searchText) {
  store.dispatch({
    type: 'SEARCH',
    payload: searchText
  });
}

function searchInput(searchText) {
  return h('input', {
    type: 'text',
    value: searchText,
    placeholder: 'Search for files in the project...',
    className: 'search__input',
    oninput: event => runSearch(event.target.value)
  }, []);
}

function searchSuggestion(suggestion) {
  return h('a', {
    href: `#/${suggestion}`,
    className: 'search__suggestion',
    onclick: clearSearch()
  }, [suggestion]);
}

function searchSuggestionList(suggestions) {
  return h('div', {
    className: suggestions.length ?
      'search__suggestion-list--visible' :
      'search__suggestion-list--hidden'
  }, suggestions.map(searchSuggestion));
}

export default function search(state) {
  return h('div', {
    className: 'search'
  }, [
    searchInput(state.search),
    searchSuggestionList(suggestionsSelector(state))
  ]);
}
