// Speaker button: turns all sound (music + effects) off or on. It sits in the top bar; screens without a top bar get a floating one.
import { icon } from './icons.js';
import { settings, setSetting } from '../state.js';
import { applySettings } from './apply.js';

const isOn = () => settings().sound || settings().music;
const label = () => (isOn() ? 'Sound is on. Tap to turn sound off.' : 'Sound is off. Tap to turn sound on.');
export const muteHtml = (cls = '') => `<button type="button" class="mutebtn ${cls}" aria-label="${label()}" aria-pressed="${!isOn()}">${isOn() ? icon.speakerOn : icon.speakerOff}</button>`;

function refreshMute() {
  document.querySelectorAll('.mutebtn').forEach((b) => {
    b.innerHTML = isOn() ? icon.speakerOn : icon.speakerOff;
    b.setAttribute('aria-label', label()); b.setAttribute('aria-pressed', String(!isOn()));
  });
}
// After each screen is drawn: make sure there is exactly one speaker button (floating if the screen has no top bar).
export function ensureMute() {
  document.querySelectorAll('.mutebtn.float').forEach((b) => b.remove());
  if (!document.querySelector('#app .topbar .mutebtn')) document.body.insertAdjacentHTML('beforeend', muteHtml('float'));
}
export function mountMute() {
  addEventListener('click', (e) => {
    const b = e.target.closest('.mutebtn'); if (!b) return;
    e.stopPropagation();
    const on = isOn();
    setSetting('sound', !on); setSetting('music', !on);
    applySettings(); refreshMute();
    document.querySelectorAll('input[data-k="sound"], input[data-k="music"]').forEach((i) => { i.checked = !on; });
  });
}
