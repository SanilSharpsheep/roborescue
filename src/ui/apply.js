import { settings } from '../state.js';
export function applySettings() {
  const s = settings();
  document.documentElement.dataset.text = s.textSize;
  document.documentElement.classList.toggle('no-motion', !!s.reduceMotion);
}
