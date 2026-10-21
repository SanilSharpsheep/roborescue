import { settings } from '../state.js';
import { syncMusic } from './music.js';
export function applySettings() {
  const s = settings();
  document.documentElement.dataset.text = s.textSize;
  document.documentElement.classList.toggle('no-motion', !!s.reduceMotion);
  syncMusic();
}
