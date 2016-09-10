/* eslint complexity: 1, no-nested-ternary: 1 */

import {combineReducers} from 'redux';

function noopReducer(state = {}) {
  return state;
}

function locationReducer(state = {}, action) {
  switch (action.type) {
  case 'LOCATION':
    return action.payload;
  default:
    return state;
  }
}

function searchReducer(state = {}, {type, payload}) {
  switch (type) {
  case 'SEARCH':
    return {query: payload, selected: null};
  case 'SEARCH_SUGGESTIONS_CLEAR':
    return {query: '', selected: null};
  case 'SEARCH_SUGGESTIONS_NAVIGATE_TO':
    return {
      query: state.query,
      selected: payload
    };
  case 'SEARCH_SUGGESTIONS_NAVIGATE':
    return {
      query: state.query,
      selected: typeof state.selected === 'number' ?
        state.selected + payload :
        payload > 0 ? 0 : -1
    };
  default:
    return state;
  }
}

export default combineReducers({
  location: locationReducer,
  search: searchReducer,
  files: noopReducer,
  metrics: noopReducer,
  environment: noopReducer,
  thresholds: noopReducer,
  timestamp: noopReducer
});
