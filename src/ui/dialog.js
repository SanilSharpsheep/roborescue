// Kid-friendly pop-up that asks a grown-up question (a small sum) before something that cannot be undone.
// Resolves true only if the sum is right and the grown-up taps the red button.
export function grownUpDialog({ title, text, yes }) {
  return new Promise((resolve) => {
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 6);
    const w = document.createElement('div'); w.className = 'leavewrap';
    w.innerHTML = `<div class="leavebox" role="dialog" aria-modal="true" aria-labelledby="gdt">
      <p class="eyebrow">Grown-ups only</p><h2 id="gdt">${title}</h2><p>${text}</p>
      <label class="eyebrow" for="gdans">To continue, what is ${a} + ${b}?</label>
      <input id="gdans" class="field short" inputmode="numeric" autocomplete="off" style="margin:.5rem auto 1rem;display:block">
      <div class="row"><button type="button" class="btn blue" id="gdno">Cancel</button><button type="button" class="btn ghost danger" id="gdyes" disabled>${yes}</button></div></div>`;
    document.body.appendChild(w);
    const ans = w.querySelector('#gdans'), ok = w.querySelector('#gdyes');
    const done = (v) => { w.remove(); resolve(v); };
    ans.oninput = () => { ok.disabled = +ans.value !== a + b; };
    w.querySelector('#gdno').onclick = () => done(false);
    ok.onclick = () => done(true);
    w.addEventListener('keydown', (e) => { if (e.key === 'Escape') done(false); });
    ans.focus();
  });
}

// Simple two-button question for a kid's own choices (no sum). The safe button is big and comes first.
export function confirmDialog({ title, text, keep, yes }) {
  return new Promise((resolve) => {
    const w = document.createElement('div'); w.className = 'leavewrap';
    w.innerHTML = `<div class="leavebox" role="dialog" aria-modal="true" aria-labelledby="cdt"><h2 id="cdt">${title}</h2><p>${text}</p>
      <div class="row"><button type="button" class="btn blue" id="cdkeep">${keep}</button><button type="button" class="btn ghost danger small" id="cdyes">${yes}</button></div></div>`;
    document.body.appendChild(w);
    const done = (v) => { w.remove(); resolve(v); };
    w.querySelector('#cdkeep').onclick = () => done(false);
    w.querySelector('#cdyes').onclick = () => done(true);
    w.addEventListener('keydown', (e) => { if (e.key === 'Escape') done(false); });
    w.querySelector('#cdkeep').focus();
  });
}
