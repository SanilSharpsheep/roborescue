import { shell, pageHead } from '../ui/shell.js';
import { art, esc } from '../ui/util.js';
import { current } from '../state.js';
import { BADGES } from '../data/badges.js';

export function badges() {
  const e = current();
  const cells = BADGES.map((b) => {
    const got = e.badges.includes(b.id);
    return `<li class="card bcell ${got ? 'got' : ''}"><span class="bframe ${got ? '' : 'locked'}"><img src="${art(got ? b.img : 'emoji/locked.svg')}" alt=""></span><b>${got ? esc(b.name) : '???'}</b><small>${esc(b.from)}</small></li>`;
  }).join('');
  return { title: 'Badges', html: shell('/badges', `${pageHead('Badges', `${e.badges.length} of ${BADGES.length} collected`)}<ul class="badgewall">${cells}</ul>`) };
}
