import { NEUTRAL_BOT } from '../game/parts.js';
import { icon } from '../ui/icons.js';
import { esc, avatarFace, art } from '../ui/util.js';
import { addExplorer, explorers } from '../state.js';
import { go } from '../router.js';

const NAMES = ['Sparky', 'Captain Fin', 'Splash', 'Nova', 'Dash'];
const AVATARS = [1, 2, 3, 4];

export function newExplorer() {
  const av = AVATARS.map((n, i) => `<button class="avpick" data-a="${n}" aria-label="Rescuer face ${n}" aria-pressed="${i === 0}"><img src="${avatarFace(n)}" alt=""></button>`).join('');
  const chips = NAMES.map((n) => `<button class="chip" type="button">${esc(n)}</button>`).join('');
  return {
    title: 'Join the Rescue Team',
    html: `<div class="screen center-screen scroll">${icon.leaves}
      <h1 class="big-title">Join the Rescue Team!</h1><p class="note" style="margin-top:-.4rem">Pick a name and face, then build a Rescue Bot to help!</p>
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
        <div class="card pad preview"><p class="eyebrow">You are a Rescuer</p>
          <span class="avatar pv"><img id="pv" src="${avatarFace(1)}" alt=""></span>
          <b id="pn" class="pname">Rescuer</b>
          <div class="botintro"><img src="${art(NEUTRAL_BOT.img)}" alt=""><p>Meet your <b>Rescue Bot</b>! You will give it parts to save the day.</p></div></div>
      </div>
      <button class="btn huge" id="go" disabled>LET'S GO!</button>
      ${explorers().length ? '<a class="link" href="#/who">← Back</a>' : '<a class="link" href="#/">← Back</a>'}</div>`,
    mount(root) {
      let avatar = 1;
      const nm = root.querySelector('#nm'), go_ = root.querySelector('#go');
      const upd = () => {
        const v = nm.value.trim();
        root.querySelector('#ct').textContent = nm.value.length;
        root.querySelector('#pn').textContent = v || 'Rescuer';
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
