/* global window */

import {createStore} from 'redux';
import parseUrl from './services/parse-url';
import buildTree from './services/build-tree';
import {locationAction} from './actions/location-action';
import reportReducer from './reducers/report-reducer';

let report = '%REPORT%';
report = typeof report === 'string' ? {files: []} : report;

const store = createStore(reportReducer, {
  location: parseUrl(window.location.href),
  files: buildTree(report.files),
  filepaths: report.files.map(f => f.path),
  environment: report.environment,
  thresholds: report.thresholds,
  timestamp: report.timestamp
});

window.addEventListener('hashchange', ({newURL}) => {
  store.dispatch(locationAction(parseUrl(newURL)));
});

export default store;
