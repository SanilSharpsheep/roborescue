import { icon } from './icons.js';
import { esc } from './util.js';
import { topbar } from './topbar.js';
import { current } from '../state.js';

const NAV = [
  ['/home', 'Home', icon.home],
  ['/worlds', 'Worlds', icon.globe],
  ['/missions', 'Missions', icon.pin],
  ['/badges', 'Badges', icon.shield],
  ['/report', 'Report', icon.chart],
  ['/settings', 'Settings', icon.sun],
];

// Wraps a page in the left rail (bottom bar on phones).
export function shell(active, inner, { scroll = true } = {}) {
  const e = current();
  const nav = NAV.map(([href, label, ic]) =>
    `<a href="#${href}" ${href === active ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></a>`).join('');

  return `<div class="screen shell">
    <aside class="rail"><div class="brand">Robo<b>Rescue</b></div><nav aria-label="Main">${nav}</nav></aside>
    <main class="main ${scroll ? 'scroll' : ''}">${inner}</main></div>`;
}

export const pageHead = (title, sub = '', actions = '') => topbar({ title, sub: sub ? `<p>${esc(sub)}</p>` : '', actions });
