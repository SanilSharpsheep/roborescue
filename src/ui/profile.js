// Profile menu: tap your face or name to log out or start your adventure over.
import { current, logout, resetProgress } from '../state.js';
import { confirmDialog } from './dialog.js';
import { avatarFace, esc } from './util.js';
import { go, render } from '../router.js';

export async function startOver() {
  const e = current(); if (!e) return;
  if (await confirmDialog({ title: 'Start your adventure over?', text: 'You will lose your stars and badges. This cannot be undone.', keep: 'Keep my stars', yes: 'Start over' })) { resetProgress(e.id); render(); }
}
export function doLogout() { logout(); go('/who'); }

export function mountProfile() {
  addEventListener('click', (ev) => {
    const t = ev.target.closest('.who, .whobtn'); if (!t) return;
    ev.preventDefault();
    const e = current(); if (!e) return;
    const w = document.createElement('div'); w.className = 'leavewrap';
    w.innerHTML = `<div class="leavebox profilebox" role="dialog" aria-modal="true" aria-labelledby="pft">
      <span class="avatar" style="width:5rem;height:5rem;margin:0 auto .4rem;display:block"><img src="${avatarFace(e.avatar)}" alt=""></span>
      <h2 id="pft">${esc(e.name)}</h2>
      <div class="profbtns"><button type="button" class="btn blue" id="pflo">Log out</button>
      <button type="button" class="btn ghost small" id="pfso">Start my adventure over</button>
      <button type="button" class="btn ghost small" id="pfcl">Close</button></div></div>`;
    document.body.appendChild(w);
    const close = () => w.remove();
    w.querySelector('#pflo').onclick = () => { close(); doLogout(); };
    w.querySelector('#pfso').onclick = () => { close(); startOver(); };
    w.querySelector('#pfcl').onclick = close;
    w.addEventListener('keydown', (k) => { if (k.key === 'Escape') close(); });
    w.addEventListener('click', (k) => { if (k.target === w) close(); });
    w.querySelector('#pflo').focus();
  });
}
