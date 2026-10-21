// Small sound effects made with the browser's Web Audio (no audio files, nothing to license).
import { settings } from '../state.js';

let ctx = null;
function audio() {
  if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}
// Browsers only allow sound after a tap or click, so wake the audio up on the first one.
export function unlockAudio() {
  const wake = () => { audio(); removeEventListener('pointerdown', wake); removeEventListener('keydown', wake); };
  addEventListener('pointerdown', wake); addEventListener('keydown', wake);
}
function tone(c, freq, start, dur, { type = 'triangle', gain = 0.18, slideTo } = {}) {
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + start;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
}
const play = (fn) => { if (!settings().sound) return; const c = audio(); if (c) try { fn(c); } catch { /* ignore */ } };

export const sounds = {
  // happy rising jingle
  success: () => play((c) => { [523, 659, 784, 1047].forEach((f, i) => tone(c, f, i * 0.13, 0.28)); tone(c, 1319, 0.55, 0.5, { gain: 0.14 }); }),
  // gentle "wah wah" that is sad but not scary
  fail: () => play((c) => { tone(c, 392, 0, 0.3, { type: 'sine', slideTo: 349 }); tone(c, 330, 0.32, 0.55, { type: 'sine', slideTo: 262 }); }),
  right: () => play((c) => { tone(c, 660, 0, 0.12); tone(c, 880, 0.1, 0.22); }),
  wrong: () => play((c) => tone(c, 220, 0, 0.25, { type: 'sine', gain: 0.14 })),
  // little UI sounds
  tap: () => play((c) => tone(c, 520, 0, 0.07, { type: 'sine', gain: 0.12 })),
  pick: () => play((c) => { tone(c, 600, 0, 0.08, { gain: 0.14 }); tone(c, 900, 0.06, 0.12, { gain: 0.14 }); }),
  nav: () => play((c) => tone(c, 440, 0, 0.06, { type: 'square', gain: 0.05 })),
  back: () => play((c) => tone(c, 420, 0, 0.1, { type: 'sine', slideTo: 300, gain: 0.12 })),
  go: () => play((c) => { tone(c, 330, 0, 0.14, { gain: 0.16, slideTo: 660 }); tone(c, 660, 0.12, 0.2, { gain: 0.16, slideTo: 990 }); }),
  star: (i = 0) => play((c) => tone(c, 660 + i * 130, 0, 0.3, { gain: 0.16 })),
};

// One listener for every tap in the app, so each kind of button gets its own sound.
export function clickSounds() {
  addEventListener('click', (e) => {
    const el = e.target.closest('button, a, input[type=checkbox], .answer'); if (!el || el.disabled) return;
    if (el.classList.contains('answer')) return; // quiz answers make their own right/wrong sounds
    if (el.classList.contains('part') || el.classList.contains('avpick') || el.classList.contains('chip') || el.classList.contains('pick')) return sounds.pick();
    if (el.matches('.rail nav a')) return sounds.nav();
    if (el.matches('.roundbtn, .btn.ghost, .link')) return sounds.back();
    if (el.matches('.btn.huge, .btn.big, #test, #start, #cont, #again, #go, #next, .btn.blue, .mission')) return sounds.go();
    sounds.tap();
  });
}
