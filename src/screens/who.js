import { icon } from '../ui/icons.js';
import { esc, avatarFace } from '../ui/util.js';
import { explorers, selectExplorer, totalStars, levelOf } from '../state.js';
import { go } from '../router.js';

export function who() {
  const list = explorers();
  const cards = list.map((e) => `<button class="card pick" data-id="${e.id}">
      <span class="avatar big-av"><img src="${avatarFace(e.avatar)}" alt=""></span>
      <b>${esc(e.name)}</b><small>Level ${levelOf(e)} · ${totalStars(e)} stars</small></button>`).join('');
  const add = list.length < 4 ? `<a class="card pick dashed" href="#/new"><span class="plusdot">${icon.plus}</span><b>New explorer</b></a>` : '';
  return {
    title: 'Who is playing?',
    html: `<div class="screen center-screen scroll">${icon.leaves}
      <h1 class="big-title">Who is playing?</h1>
      <div class="picks">${cards}${add}</div>
      <p class="note">Your explorer stays on this device. We never ask for a last name.</p>
      ${list.length ? `<a class="link" href="#/delete">Grown-up? Delete an explorer</a>` : ''}
      <a class="link" href="#/">← Back</a></div>`,
    mount(root) {
      root.querySelectorAll('button.pick').forEach((b) => (b.onclick = () => { selectExplorer(b.dataset.id); go('/home'); }));
    },
  };
}
