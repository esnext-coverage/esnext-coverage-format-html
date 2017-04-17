import {metrics, tags, lines} from 'esnext-coverage-analytics';

const requiredTags = [
  'statement',
  'branch',
  'function'
];

export default function computeMetrics(coverage) {
  const selectedTags = tags(coverage, requiredTags);
  const selectedMetrics = Object
    .keys(selectedTags)
    .reduce((result, tagName) => {
      result[tagName] = metrics(selectedTags[tagName]);
      return result;
    }, {});
  selectedMetrics.line = metrics(lines(coverage));
  return selectedMetrics;
}
