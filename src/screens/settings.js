import { shell, pageHead } from '../ui/shell.js';
import { esc } from '../ui/util.js';
import { settings, setSetting, current, resetProgress, clearAllExplorers } from '../state.js';
import { grownUpDialog } from '../ui/dialog.js';
import { go } from '../router.js';
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
        <div class="card setrow"><span>Not you?<small>Pick a different rescuer on this device.</small></span><a class="btn ghost small" href="#/who">Switch rescuer</a></div>
        <p class="eyebrow" style="margin:1rem 0 .2rem">Grown-ups</p>
        <div class="card setrow"><span>Erase ${esc(current().name)}'s stars and badges<small>Starts this rescuer over.</small></span><button class="btn ghost danger small" id="erase">Erase</button></div>
        <div class="card setrow"><span>Delete a rescuer<small>Removes one rescuer from this device.</small></span><a class="btn ghost danger small" href="#/delete">Delete</a></div>
        <div class="card setrow"><span>Clear everyone<small>Removes all rescuers. Good for a shared classroom device.</small></span><button class="btn ghost danger small" id="clearall">Clear all</button></div>
      </div>`),
    mount(root) {
      root.querySelectorAll('input[data-k]').forEach((i) => (i.onchange = () => { setSetting(i.dataset.k, i.checked); applySettings(); }));
      root.querySelectorAll('[data-size]').forEach((b) => (b.onclick = () => { setSetting('textSize', b.dataset.size); applySettings(); render(); }));
      root.querySelector('#erase').onclick = async () => { if (await grownUpDialog({ title: 'Erase stars and badges?', text: current().name + "'s stars and badges will be removed. This cannot be undone.", yes: 'Erase' })) { resetProgress(current().id); render(); } };
      root.querySelector('#clearall').onclick = async () => { if (await grownUpDialog({ title: 'Clear everyone?', text: 'All rescuers, stars and badges on this device will be removed. This cannot be undone.', yes: 'Clear all' })) { clearAllExplorers(); go('/'); } };
    },
  };
}
