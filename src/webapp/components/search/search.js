import h from 'virtual-dom/h';
import store from '../../store';
import search from '../../services/search';

function suggestionsSelector(state) {
  const {query, selected} = state.search;
  if (!query) { return []; }
  const currentLocation = state.location.path[0];
  const candidates = Object
    .keys(state.files.contents)
    .filter(fileName => fileName !== currentLocation);
  const results = search(candidates, query, {maxResults: 7});
  const selectedSuggestionIndex = typeof selected === 'number' ?
    selected % results.length :
    null;
  return results.map((suggestion, index) => ({
    value: suggestion,
    isSelected: selectedSuggestionIndex === index
  }));
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

function navigateToSuggestion(index) {
  store.dispatch({
    type: 'SEARCH_SUGGESTIONS_NAVIGATE_TO',
    payload: index
  });
}

function navigateSuggestions(offset) {
  store.dispatch({
    type: 'SEARCH_SUGGESTIONS_NAVIGATE',
    payload: offset
  });
}

function selectSuggestion(suggestion) {
  // TODO: use a different approach
  window.location.hash = `#${suggestion}`;
  clearSearch();
}

function searchInput(searchText, suggestions) {
  // TODO: avoid nesting this function
  function handleSearchInputKeydown(event) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      navigateSuggestions(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      navigateSuggestions(1);
    } else if (event.key === 'Enter') {
      const suggestion = suggestions.find(s => s.isSelected);
      event.preventDefault();
      if (suggestion) {
        selectSuggestion(suggestion.value);
      }
    }
  }

  return h('input', {
    type: 'text',
    value: searchText,
    placeholder: 'Search for files in the project...',
    className: 'search__input',
    oninput: event => runSearch(event.target.value),
    onkeydown: handleSearchInputKeydown
  }, []);
}

function searchSuggestion({value, isSelected}, index) {
  const className = isSelected ?
    'search__suggestion--selected' :
    'search__suggestion';
  return h('a', {
    href: `#/${value}`,
    className,
    onclick: clearSearch,
    onmouseover: () => navigateToSuggestion(index)
  }, [value]);
}

function searchSuggestionList(suggestions) {
  return h('div', {
    className: suggestions.length ?
      'search__suggestion-list--visible' :
      'search__suggestion-list--hidden'
  }, suggestions.map(searchSuggestion));
}

export default function searchComponent(state) {
  const suggestions = suggestionsSelector(state);
  return h('div', {
    className: 'search'
  }, [
    searchInput(state.search.query, suggestions),
    searchSuggestionList(suggestions)
  ]);
}
