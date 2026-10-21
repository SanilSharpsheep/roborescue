import { shell, pageHead } from '../ui/shell.js';
import { settings, setSetting, current, resetProgress } from '../state.js';
import { applySettings } from '../ui/apply.js';
import { render } from '../router.js';

const TOGGLES = [['sound', 'Sound effects'], ['music', 'Music'], ['readAloud', 'Read aloud'], ['reduceMotion', 'Reduce motion']];

export function settingsScreen() {
  const s = settings();
  const rows = TOGGLES.map(([k, l]) => `<label class="card setrow"><span>${l}</span><input type="checkbox" role="switch" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`).join('');
  const sizes = [['s', 'Small'], ['m', 'Medium'], ['l', 'Large']].map(([v, l]) => `<button class="chip ${s.textSize === v ? 'on' : ''}" data-size="${v}" aria-pressed="${s.textSize === v}">${l}</button>`).join('');
  return {
    title: 'Settings',
    html: shell('/settings', `${pageHead('Settings', 'Make RoboRescue comfy for you.')}
      <div class="setlist">${rows}
        <div class="card setrow"><span>Text size</span><span class="chips">${sizes}</span></div>
        <div class="card setrow"><span>Erase my stars and badges<small>Grown-ups: this cannot be undone.</small></span><button class="btn ghost danger small" id="erase">Erase</button></div>
      </div>`),
    mount(root) {
      root.querySelectorAll('input[data-k]').forEach((i) => (i.onchange = () => { setSetting(i.dataset.k, i.checked); applySettings(); }));
      root.querySelectorAll('[data-size]').forEach((b) => (b.onclick = () => { setSetting('textSize', b.dataset.size); applySettings(); render(); }));
      root.querySelector('#erase').onclick = () => { if (confirm('Erase all stars and badges for ' + current().name + '?')) { resetProgress(current().id); render(); } };
    },
  };
}
