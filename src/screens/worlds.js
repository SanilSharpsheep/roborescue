import { shell, pageHead } from '../ui/shell.js';
import { art, esc } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { WORLDS } from '../data/worlds.js';

export function worlds() {
  const cards = WORLDS.map((w) => w.open
    ? `<a class="card world" href="#/missions" style="--wc:${w.color}"><img src="${art('worlds/' + w.art)}" alt=""><b>${w.name}</b><span class="pill open">Open</span></a>`
    : `<div class="card world locked" aria-disabled="true" style="--wc:${w.color}"><img src="${art('worlds/' + w.art)}" alt=""><b>${w.name}</b><span class="pill soon">${icon.lock} Coming Soon</span></div>`).join('');
  return { title: 'Worlds', html: shell('/worlds', `${pageHead('Worlds', 'Pick where your robot will help.')}<div class="worldrow">${cards}</div>`) };
}
