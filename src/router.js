// Tiny hash router: #/home, #/new, #/build/clear-the-flood ...
const routes = [];
export const route = (pattern, handler) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-z]+)/g, (_, k) => (keys.push(k), '([^/]+)')) + '$');
  routes.push({ re, keys, handler });
};
export const go = (path) => { if (location.hash === '#' + path) render(); else location.hash = path; };
export function currentPath() { return location.hash.replace(/^#/, '') || '/'; }

let onRender = () => {};
export const setRenderer = (fn) => { onRender = fn; };
export function render() {
  const path = currentPath();
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return onRender(r.handler, params, path);
    }
  }
  go('/');
}
export const start = () => { addEventListener('hashchange', render); render(); };
