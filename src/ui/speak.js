// "Read it to me": a small speaker button next to instructions. Uses the device's own voice (no files).
// Any button with data-say="text" or data-say-sel="#a, #b" reads that text aloud when tapped.
import { settings } from '../state.js';
import { icon } from './icons.js';

export const canSpeak = () => settings().readAloud && 'speechSynthesis' in window;
export const sayBtn = (attrs, label = 'Read it to me') =>
  canSpeak() ? `<button type="button" class="saybtn" ${attrs} aria-label="${label}" title="${label}">${icon.speakerOn}</button>` : '';

export function mountSpeak() {
  addEventListener('click', (e) => {
    const b = e.target.closest('.saybtn'); if (!b || !canSpeak()) return;
    let text = b.dataset.say || '';
    if (b.dataset.saySel) text = b.dataset.saySel.split(',').map((s) => (document.querySelector(s.trim()) || {}).textContent || '').join('. ');
    text = text.replace(/\s+/g, ' ').trim(); if (!text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; u.lang = 'en-US';
    speechSynthesis.speak(u);
  });
  addEventListener('hashchange', () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); });
}
