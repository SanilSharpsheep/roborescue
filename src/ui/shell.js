import { icon } from './icons.js';
import { esc, avatarFace } from './util.js';
import { current } from '../state.js';

const NAV = [
  ['/home', 'Home', icon.home],
  ['/worlds', 'Worlds', icon.globe],
  ['/missions', 'Missions', icon.pin],
  ['/badges', 'Badges', icon.shield],
  ['/settings', 'Settings', icon.sun],
];

// Wraps a page in the left rail (bottom bar on phones).
export function shell(active, inner, { scroll = true } = {}) {
  const e = current();
  const nav = NAV.map(([href, label, ic]) =>
    `<a href="#${href}" ${href === active ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></a>`).join('');
  const who = e ? `<a class="who" href="#/who" aria-label="Switch rescuer">
      <span class="dot"><img src="${avatarFace(e.avatar)}" alt=""></span>
      <span><b>${esc(e.name)}</b><small>Switch rescuer</small></span></a>` : '';
  return `<div class="screen shell">
    <aside class="rail"><div class="brand">Robo<b>Rescue</b></div><nav aria-label="Main">${nav}</nav>${who}</aside>
    <main class="main ${scroll ? 'scroll' : ''}">${inner}</main></div>`;
}

export const pageHead = (title, sub, ic = '') =>
  `<header class="pagehead"><div><h1>${ic}${esc(title)}</h1>${sub ? `<p>${esc(sub)}</p>` : ''}</div></header>`;
