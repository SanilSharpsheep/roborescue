import { icon } from '../ui/icons.js';
import { esc, avatarFace } from '../ui/util.js';
import { addExplorer, explorers } from '../state.js';
import { go } from '../router.js';

const NAMES = ['Sparky', 'Captain Fin', 'Splash', 'Nova', 'Dash'];
const AVATARS = [1, 2, 3, 4];

export function newExplorer() {
  const av = AVATARS.map((n, i) => `<button class="avpick" data-a="${n}" aria-label="Explorer ${n}" aria-pressed="${i === 0}"><img src="${avatarFace(n)}" alt=""></button>`).join('');
  const chips = NAMES.map((n) => `<button class="chip" type="button">${esc(n)}</button>`).join('');
  return {
    title: 'Make your explorer',
    html: `<div class="screen center-screen scroll">${icon.leaves}
      <h1 class="big-title">Make your explorer</h1>
      <div class="newgrid">
        <div class="card pad">
          <label class="eyebrow" for="nm">Your name</label>
          <input id="nm" class="field" maxlength="12" autocomplete="off" placeholder="Type a name" />
          <div class="count"><span id="ct">0</span>/12</div>
          <p class="help">Pick a nickname or your first name. It stays on this device.</p>
          <div class="chips">${chips}</div>
          <p class="eyebrow" style="margin-top:1rem">Pick a face</p>
          <div class="avrow">${av}</div>
        </div>
        <div class="card pad preview"><p class="eyebrow">You will be</p>
          <span class="avatar pv"><img id="pv" src="${avatarFace(1)}" alt=""></span>
          <b id="pn" class="pname">Explorer</b></div>
      </div>
      <button class="btn huge" id="go" disabled>LET'S GO!</button>
      ${explorers().length ? '<a class="link" href="#/who">← Back</a>' : '<a class="link" href="#/">← Back</a>'}</div>`,
    mount(root) {
      let avatar = 1;
      const nm = root.querySelector('#nm'), go_ = root.querySelector('#go');
      const upd = () => {
        const v = nm.value.trim();
        root.querySelector('#ct').textContent = nm.value.length;
        root.querySelector('#pn').textContent = v || 'Explorer';
        go_.disabled = !v;
      };
      nm.oninput = upd;
      root.querySelectorAll('.chip').forEach((c) => (c.onclick = () => { nm.value = c.textContent; upd(); }));
      root.querySelectorAll('.avpick').forEach((b) => (b.onclick = () => {
        avatar = +b.dataset.a;
        root.querySelectorAll('.avpick').forEach((x) => x.setAttribute('aria-pressed', x === b));
        root.querySelector('#pv').src = avatarFace(avatar);
      }));
      go_.onclick = () => { if (nm.value.trim()) { addExplorer(nm.value, avatar); go('/home'); } };
      nm.focus();
    },
  };
}
