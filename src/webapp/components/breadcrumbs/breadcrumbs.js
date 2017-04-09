import h from 'virtual-dom/h';

function generateBreadcrumb(name, path) {
  return h('a', {
    className: 'breadcrumb',
    href: `#/${path}`
  }, [name]);
}

function generateBreadcrumbSeparator() {
  return h('span', {className: 'breadcrumb-separator'}, ['...']);
}

function generateBreadcrumbList(path) {
  const breadcrumbElements = path.map((dir, index) => {
    const href = path.slice(0, index + 1).join('/');
    return generateBreadcrumb(dir, href);
  });
  return breadcrumbElements.length > 3 ? [
    generateBreadcrumbSeparator(),
    ...breadcrumbElements.slice(-3)
  ] : breadcrumbElements;
}

export default function breadcrumbs({location}) {
  return h('div', {
    className: 'breadcrumbs'
  }, [
    generateBreadcrumb('all files', ''),
    ...generateBreadcrumbList(location.path || [])
  ]);
}
