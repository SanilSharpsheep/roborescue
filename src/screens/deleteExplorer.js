import { esc, avatarFace } from '../ui/util.js';
import { explorers, deleteExplorer } from '../state.js';
import { go } from '../router.js';

export function deleteExplorerScreen() {
  const a = 3 + Math.floor(Math.random() * 5), b = 2 + Math.floor(Math.random() * 6);
  const list = explorers().map((e) => `<label class="card pick delrow"><input type="radio" name="who" value="${e.id}">
    <span class="avatar big-av"><img src="${avatarFace(e.avatar)}" alt=""></span><b>${esc(e.name)}</b></label>`).join('');
  return {
    title: 'Delete an explorer',
    html: `<div class="screen center-screen scroll">
      <h1 class="big-title">Grown-ups only</h1>
      <p class="note">Deleting removes that explorer's stars and badges from this device. It cannot be undone.</p>
      <div class="picks">${list}</div>
      <div class="card pad check"><label for="ans" class="eyebrow">To continue, what is ${a} + ${b}?</label>
        <input id="ans" class="field short" inputmode="numeric" autocomplete="off"></div>
      <button class="btn red" id="del" disabled>Delete explorer</button>
      <a class="link" href="#/who">← Back</a></div>`,
    mount(root) {
      const ans = root.querySelector('#ans'), del = root.querySelector('#del');
      const ok = () => { del.disabled = !(+ans.value === a + b && root.querySelector('input[name=who]:checked')); };
      ans.oninput = ok; root.querySelectorAll('input[name=who]').forEach((r) => (r.onchange = ok));
      del.onclick = () => { deleteExplorer(root.querySelector('input[name=who]:checked').value); go(explorers().length ? '/who' : '/'); };
    },
  };
}
