import {filter} from 'fuzzaldrin';

export default function search(candidates, query, options) {
  return filter(candidates, query, options);
}
