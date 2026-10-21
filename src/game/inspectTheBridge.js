// Mission 2: crawl down the bridge pillars, find cracks, and stay safe when the flood rises.
import { MOVES, SENSORS, partById } from './parts.js';

const RULE2 = [
  { id: 'climb', icon: '🧗', label: 'Climb higher', note: 'Get out of the rising water.' },
  { id: 'work', icon: '🔧', label: 'Keep working', note: 'Stay put and finish the job.' },
];
const stall = (progress, why, hint, question, stats) => ({ ok: false, progress, why, hint, question, ...stats });
const name = (id, fallback) => (partById(SENSORS, id) || { name: fallback }).name;

function evaluate(b) {
  const two = b.sense.length > 1, base = { energy: two ? 4 : 5, safety: 2, time: 55 };
  if (b.move === 'treads') return stall(35, 'Stuck! Treads slip on wet stone', 'Wet stone is slippery for treads.', 'Which animal sticks to walls with tiny hairs on its toes?', base);
  if (b.move === 'fins') return stall(28, 'Stuck! Fins cannot climb', 'Fins are for swimming, not climbing.', 'Which animal climbs walls with sticky feet?', base);
  if (b.move === 'legs') return stall(32, 'Stuck! Springs bounce off the wall', 'Springs need flat ground to push on.', 'Which animal grips walls instead of bouncing?', base);
  if (!b.sense.includes('echo')) return stall(60, 'Lost! Cracks are too small to see', 'Cracks can be tiny. Which sensor uses sound to find them?', 'Which sensor uses sound to find things?', base);
  const water = b.sense.includes('water');
  const safety = water ? (b.then2 === 'climb' ? 5 : 3) : 2;
  const stars = 1 + (base.energy >= 4 ? 1 : 0) + (safety >= 4 ? 1 : 0);
  return { ok: true, energy: base.energy, safety, time: 55, stars, progress: 100, warned: water && b.then2 === 'climb' };
}

export const inspectTheBridge = {
  id: 'inspect-the-bridge',
  scene: 'scenes/inspect-the-bridge.jpg',
  moves: ['treads', 'fins', 'legs', 'gecko'],
  sensors: ['echo', 'heat', 'water'],
  maxSense: 2,
  defaultBuild: { move: null, sense: [], then2: 'work' },
  previewImg: { gecko: 'bots/gecko-three-quarter.png' },
  hint: 'Cracks can be tiny. Which sensor uses sound to find them? And which one warns you if the water rises?',
  rules: [
    { key: 'rule1', label: 'Rule 1', ifText: (b) => `${name(b.sense[0], 'A sensor')} finds a crack`, fixedThen: 'Mark it' },
    {
      key: 'then2', label: 'Rule 2', available: (b) => b.sense.length > 1,
      lockedText: 'Pick a second sensor to open Rule 2.',
      ifText: (b) => (b.sense[1] === 'water' ? 'Water feels the flood rising' : `${name(b.sense[1], 'A sensor')} finds danger`),
      options: RULE2, note: 'Tip: which sensor can tell the water is rising?',
    },
  ],
  evaluate,
  summary: (b) => `${(partById(MOVES, b.move) || { name: '' }).name.toLowerCase()}, ${b.sense.join(' + ')} and ${b.sense.length > 1 ? 2 : 1} rule${b.sense.length > 1 ? 's' : ''}`,
  winBanner: 'You inspected the bridge!', winTitle: 'You inspected the bridge!',
  badgeCopy: 'You found cracks in a bridge with a gecko-inspired robot.',
  tip: (out) => (out.stars === 3 ? 'Perfect! Your robot got out before the flood rose.' : out.safety < 4 ? 'Use the Water sensor and "Climb higher" for the third star.' : 'Try a different build for more stars.'),
  quizTip: 'Next: a quick 2-question quiz about geckos.',
  sprite: (b) => (b.move === 'gecko' ? 'bots/gecko-side.png' : null),
  stuckSprite: 'bots/gecko-stuck.png', spriteWidth: (b) => (b.move === 'gecko' ? 0.1 : 0.08),
  draw: drawBridge,
};


// "Crack marked" pin: an orange map pin with a white check, a soft pulse and a small label, so kids can read it at a glance.
function pin(ctx, x, y, H, sec, reduce) {
  const r = H * .026, pulse = reduce ? 0 : (sec * 1.4) % 1;
  ctx.save(); ctx.textAlign = 'center';
  if (!reduce) { ctx.globalAlpha = .5 * (1 - pulse); ctx.strokeStyle = '#ff8a1f'; ctx.lineWidth = H * .004; ctx.beginPath(); ctx.arc(x, y - r * 1.6, r * (1 + pulse * 1.2), 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.fillStyle = '#ff8a1f'; ctx.strokeStyle = '#fff'; ctx.lineWidth = H * .005; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.arc(x, y - r * 1.6, r, Math.PI * .8, Math.PI * .2, false); ctx.lineTo(x, y); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = H * .007; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - r * .4, y - r * 1.6); ctx.lineTo(x - r * .1, y - r * 1.3); ctx.lineTo(x + r * .45, y - r * 1.95); ctx.stroke();
  const t = 'Crack marked', fs = H * .04; ctx.font = `800 ${fs}px Baloo 2, sans-serif`; const w = ctx.measureText(t).width + fs, lx = x, ly = y - r * 3.1 - fs;
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#ff8a1f'; ctx.lineWidth = H * .004; ctx.beginPath(); ctx.roundRect(lx - w / 2, ly - fs * .8, w, fs * 1.5, fs * .75); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#0f3675'; ctx.fillText(t, lx, ly + fs * .27);
  ctx.restore();
}

// ---- canvas drawing ----
const PATH = [[0, .15, .17], [.18, .36, .18], [.30, .41, .29], [.45, .41, .29], [.52, .41, .19], [.66, .62, .19], [.76, .67, .32], [.88, .67, .32], [1, .67, .32]];
const CRACKS = [[.40, .28, .30, .45], [.66, .30, .76, .88]];
function at(p) {
  for (let i = 1; i < PATH.length; i++) if (p <= PATH[i][0]) { const [t0, x0, y0] = PATH[i - 1], [t1, x1, y1] = PATH[i], k = (p - t0) / (t1 - t0 || 1); return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]; }
  return [PATH[PATH.length - 1][1], PATH[PATH.length - 1][2]];
}
function drawBridge(ctx, W, H, s) {
  const { p, sec, out, b, drawBot, reduce } = s;
  const echo = b.sense.includes('echo');
  // cracks (red lines) and the marks the robot leaves
  CRACKS.forEach(([cx, cy, t0, t1], i) => {
    const marked = out.ok && p > t1 || (out.ok && p >= 1);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = H * .006; ctx.strokeStyle = marked ? '#ffc928' : '#c1352b';
    ctx.beginPath(); ctx.moveTo(W * cx, H * cy); ctx.lineTo(W * (cx + .012), H * (cy + .03)); ctx.lineTo(W * (cx - .006), H * (cy + .05)); ctx.stroke();
    if (marked) { pin(ctx, W * (cx + .035), H * (cy + .045), H, sec, reduce); }
    // echo rings while scanning
    if (echo && out.ok && p > t0 && p < t1) { for (let r = 0; r < 3; r++) { const k = ((sec * 1.2 + r / 3) % 1); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#7fe3ff'; ctx.lineWidth = H * .005; ctx.beginPath(); ctx.arc(W * cx, H * (cy + .02), H * (.02 + k * .09), 0, 7); ctx.stroke(); } }
    ctx.restore();
  });
  // flood rising at the end
  const rise = out.ok ? Math.max(0, (p - .86) / .14) : 0;
  const climbs = out.ok && out.warned;
  if (rise > 0) {
    ctx.save(); ctx.fillStyle = 'rgba(35,123,229,.38)'; const top = H * (1 - .55 * rise); ctx.fillRect(0, top, W, H - top);
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = H * .006; ctx.beginPath(); for (let x = 0; x <= W; x += 12) ctx.lineTo(x, top + Math.sin(x / 40 + sec * 3) * H * .006); ctx.stroke(); ctx.restore();
  }
  let [bx, by] = at(p);
  if (climbs) { const up = Math.min(1, Math.max(0, (p - .88) / .1)); by = .32 + (.19 - .32) * up; }
  if (!out.ok && s.finished) { if (out.progress >= 55) { bx = .5 + .1 * Math.sin(sec * 1.5); by = .19; } }
  drawBot(bx, by, { sink: !out.ok && out.progress < 55 && s.finished, lost: !out.ok && out.progress >= 55, splash: out.ok && !climbs && rise > .6 });
}
