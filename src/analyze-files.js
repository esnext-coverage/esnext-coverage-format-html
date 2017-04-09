/* eslint-disable no-sync */

import fs from 'fs';
import path from 'path';
import {metrics, tags, lines} from 'esnext-coverage-analytics';

const requiredTags = [
  'statement',
  'branch',
  'function'
];

const separator = /\\|\//;
function normalizePath(pathString) {
  return pathString.replace(separator, '/');
}

function computeMetrics(coverageLocations) {
  const selectedTags = tags(coverageLocations, requiredTags);
  const selectedMetrics = Object
    .keys(selectedTags)
    .reduce((result, tagName) => {
      result[tagName] = metrics(selectedTags[tagName]);
      return result;
    }, {});
  selectedMetrics.line = metrics(lines(coverageLocations));
  return selectedMetrics;
}

function analyzeFile(filePath, fileCoverageLocations) {
  return {
    name: path.basename(filePath),
    path: normalizePath(filePath),
    contents: fs.readFileSync(filePath, 'utf8'),
    locations: fileCoverageLocations,
    lines: lines(fileCoverageLocations),
    metrics: computeMetrics(fileCoverageLocations)
  };
}

function commonPathReducer(a, b) {
  const result = [];
  const minLength = Math.min(a.length, b.length);
  for (let i = 0; i < minLength; i += 1) {
    if (a[i] !== b[i]) { break; }
    result.push(a[i]);
  }
  return result;
}

function findCommonPath(splitFilePaths = []) {
  return splitFilePaths.length === 1 ?
    splitFilePaths[0].slice(0, -1) :
    splitFilePaths.reduce(commonPathReducer);
}

export default function analyzeFiles(filesCoverage) {
  const filePaths = Object.keys(filesCoverage);
  if (!filePaths.length) { return []; }
  const files = filePaths.map(filePath => analyzeFile(filePath, filesCoverage[filePath]));
  const splitFullFilePaths = files.map(file => file.path.split('/'));
  const commonPath = findCommonPath(splitFullFilePaths).join('/');
  return files.map(file => {
    file.path = file.path.slice(commonPath.length + 1);
    return file;
  });
}
