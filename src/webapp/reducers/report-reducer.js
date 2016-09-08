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

function searchReducer(state = '', action) {
  switch (action.type) {
  case 'SEARCH':
    return action.payload;
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
