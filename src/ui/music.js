// Soft looping background music made live with the browser's Web Audio (no audio files, nothing to license).
// Starts after the first tap (browsers block sound before that), follows the Music switch in Settings,
// gets quieter during a mission, and pauses when the tab is hidden.
import { settings } from '../state.js';

const BPM = 96, BEAT = 60 / BPM;
const N = (m) => 440 * Math.pow(2, (m - 69) / 12);          // MIDI note -> Hz
// 4 bars, each: [bass note, 8 melody notes (0 = rest)]. C - Am - F - G in C major.
const BARS = [
  [48, [72, 76, 79, 76, 72, 76, 79, 84]],
  [45, [72, 76, 81, 76, 72, 76, 81, 79]],
  [41, [72, 77, 81, 77, 72, 77, 81, 84]],
  [43, [74, 79, 83, 79, 74, 79, 83, 79]],
];
let ctx = null, master = null, timer = 0, nextT = 0, step = 0, started = false;

function note(freq, t, dur, type, gain) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function schedule() {
  while (nextT < ctx.currentTime + 0.6) {
    const bar = BARS[Math.floor(step / 8) % BARS.length], i = step % 8;
    if (i === 0) { note(N(bar[0]), nextT, BEAT * 3.6, 'sine', 0.16); note(N(bar[0] + 12), nextT, BEAT * 3.6, 'sine', 0.05); }
    if (i === 4) note(N(bar[0] + 7), nextT, BEAT * 1.8, 'sine', 0.09);
    const m = bar[1][i]; if (m) note(N(m), nextT, BEAT * 0.9, 'triangle', 0.07);
    nextT += BEAT / 2; step++;
  }
}
function level() { return location.hash.startsWith('#/play') ? 0.35 : 1; }

export function syncMusic() {
  const on = settings().music;
  if (!started) return;
  if (on) {
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); master = ctx.createGain(); master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.setTargetAtTime(0.5 * level(), ctx.currentTime, 0.4);
    if (!timer) { nextT = ctx.currentTime + 0.1; step = 0; timer = setInterval(schedule, 200); }
  } else if (timer) { clearInterval(timer); timer = 0; if (ctx) ctx.suspend(); }
}
export function startMusic() {
  const go = () => { started = true; syncMusic(); removeEventListener('pointerdown', go); removeEventListener('keydown', go); };
  addEventListener('pointerdown', go); addEventListener('keydown', go);
  addEventListener('hashchange', syncMusic);
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !started) return;
    if (document.hidden) ctx.suspend(); else if (settings().music) ctx.resume();
  });
}
