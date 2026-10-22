// One round speaker button on every screen: turns all sound (music + effects) off or on.
import { icon } from './icons.js';
import { settings, setSetting } from '../state.js';
import { applySettings } from './apply.js';

export function mountMute() {
  const b = document.createElement('button');
  b.id = 'mute'; b.type = 'button'; b.className = 'mutebtn';
  document.body.appendChild(b);
  const draw = () => {
    const on = settings().sound || settings().music;
    b.innerHTML = on ? icon.speakerOn : icon.speakerOff;
    b.setAttribute('aria-label', on ? 'Sound is on. Tap to turn sound off.' : 'Sound is off. Tap to turn sound on.');
    b.setAttribute('aria-pressed', String(!on));
  };
  b.onclick = (e) => {
    e.stopPropagation();
    const on = settings().sound || settings().music;
    setSetting('sound', !on); setSetting('music', !on);
    applySettings(); draw();
    // keep the Settings switches in step if that screen is open
    document.querySelectorAll('input[data-k="sound"], input[data-k="music"]').forEach((i) => { i.checked = !on; });
  };
  addEventListener('hashchange', draw); draw();
}
