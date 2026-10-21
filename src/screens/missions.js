import { shell, pageHead } from '../ui/shell.js';
import { art, esc, emoji } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { current, missionState } from '../state.js';
import { MISSIONS } from '../data/missions.js';

export function missions() {
  const e = current();
  const rows = MISSIONS.map((m) => {
    const st = missionState(e, m), stars = (e.progress[m.id] || {}).stars || 0;
    const star = [1, 2, 3].map((i) => `<span class="${i <= stars ? 'on' : ''}">${emoji('star', '1.3em')}</span>`).join('');
    const tag = st === 'locked' ? `<span class="pill soon">${icon.lock} Locked</span>` : st === 'done' ? `<span class="pill open">${icon.check} Done</span>` : '';
    const inner = `<img class="scene" src="${art('scenes/' + m.scene)}" alt=""><div class="mtext"><span class="pill lvl">${esc(m.level)}</span>
      <h2>${esc(m.title)}</h2><p>${esc(m.blurb)}</p><div class="stars">${star}</div>${tag}</div>`;
    return st === 'locked' ? `<div class="card mrow locked">${inner}</div>` : `<a class="card mrow" href="#/build/${m.id}">${inner}</a>`;
  }).join('');
  return { title: 'Missions', html: shell('/missions', `${pageHead('Water World', 'Three missions. Each one earns a badge!')}<div class="mlist">${rows}</div>
    `) };
}
