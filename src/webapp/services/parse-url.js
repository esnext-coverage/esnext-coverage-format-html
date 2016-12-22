import parse from 'url-parse';

export default function parseUrl(urlString) {
  const hash = parse(urlString).hash.replace(/^#\/?/, '/') || '/';
  const {pathname, query} = parse(hash, true);
  const path = pathname === '/' ? [] : pathname.split('/').slice(1);
  return {path, query};
}
