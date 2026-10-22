// Mission 1: swim to the blocked culvert and clear the logs.
// `evaluate` is a pure function: build in, outcome out. No screens in here.
import { fmtTime } from './common.js';

const THEN = [
  { id: 'push', icon: '💪', label: 'Push it out', note: 'Fast, but a hard push can be risky.' },
  { id: 'nudge', icon: '🤏', label: 'Nudge gently', note: 'A little slower, but much safer.' },
];
const SENSE_STALL = {
  heat: ['Heat sensor cannot see cold logs', 'Logs are not warm, so a heat sensor cannot spot them.'],
  water: ['Water sensor tells depth, not blockages', 'This sensor measures how deep the water is. It cannot spot a log.'],
  gas: ['Gas sensor cannot find logs', 'Gas sensors smell the air. They do not see things in the water.'],
};
const stall = (progress, why, hint, question, stats) => ({ ok: false, progress, why, hint, question, ...stats });

function evaluate(b) {
  const base = { energy: 4, safety: 5, time: 42 };
  const s = b.sense[0];
  if (b.move === 'treads') return stall(20, 'Stuck! Treads are sinking', 'Treads sink in deep water.', 'Which animal swims without wheels?', base);
  if (b.move === 'legs') return stall(30, 'Stuck! Springs cannot push water', 'Springy legs need something solid to push on.', 'Which animal glides through water with wide fins?', { ...base, energy: 2 });
  if (s !== 'echo') {
    const [why, hint] = SENSE_STALL[s] || SENSE_STALL.gas;
    return stall(60, `Lost! ${why}`, hint, 'Which sensor uses sound to find things?', base);
  }
  const energy = b.move === 'fins' ? 4 : 3;
  const safety = b.then === 'nudge' ? 5 : 3;
  const time = (b.then === 'nudge' ? 58 : 42) + (b.move === 'worm' ? 20 : 0);
  return { ok: true, energy, safety, time, stars: 1 + (energy >= 4 ? 1 : 0) + (safety >= 4 ? 1 : 0), progress: 100 };
}

export const clearTheFlood = {
  id: 'clear-the-flood',
  scene: 'scenes/clear-the-flood.jpg',
  moves: ['treads', 'fins', 'legs', 'worm'],
  sensors: ['echo', 'heat', 'water'],
  maxSense: 1,
  defaultBuild: { move: null, sense: [], then: 'push' },
  previewImg: { fins: 'bots/manta-three-quarter.webp' },
  hint: 'Blockages hide under murky water where you cannot see them. Which sensor uses sound to "see"?',
  rules: [{
    key: 'then', label: 'Rule 1',
    ifText: (b) => `${name(b.sense[0], 'A sensor')} finds a blockage`,
    options: THEN, note: 'Rule 2 opens in Mission 2.',
  }],
  evaluate,
  summary: (b) => `${label(b.move)}, ${b.sense.join(' + ')} and 1 rule`,
  winBanner: 'You cleared the flood!', winTitle: 'You cleared the flood!',
  badgeCopy: 'You cleared a flooded culvert with a manta-ray robot.',
  tip: (out) => (out.stars === 3 ? 'Perfect! Energy and safety are both great.' : out.energy < 4 ? 'Try a part that saves more energy for the second star.' : 'Get safety to 4 for the third star. Try a gentler action.'),
  quizTip: 'Next: a quick 2-question quiz about your robot.',
  sprite: (b) => (b.move === 'fins' ? 'bots/manta-side.webp' : null), // null = use the part picture
  stuckSprite: 'bots/manta-stuck.webp', spriteWidth: (b) => (b.move === 'fins' ? 0.2 : b.move === 'worm' ? 0.14 : 0.11),
  draw: drawFlood,
};
import { MOVES, SENSORS, partById } from './parts.js';
const name = (id, fallback) => (partById(SENSORS, id) || { name: fallback }).name;
const label = (id) => (partById(MOVES, id) || { name: '' }).name.toLowerCase();

// ---- canvas drawing for this mission ----
const LOGS = [[.22, .62, .3], [.31, .66, -.2], [.4, .6, .5], [.48, .67, -.4], [.57, .62, .1]];
function drawFlood(ctx, W, H, s) {
  const { p, sec, out, drawBot, reduce } = s;
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = H * .006;
  for (let i = 0; i < 14; i++) { const y = H * (.55 + (i % 7) * .05), x = ((i * 137 + sec * 60 * (p > .9 ? 2 : 1)) % (W * 1.2)) - W * .1; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + W * .03, y - H * .01, x + W * .06, y); ctx.stroke(); }
  const approach = Math.min(1, p / .35), work = Math.max(0, (p - .35) / .65);
  let bx = .12 + (.16 - .12) * approach, by = .8 + (.66 - .8) * approach;
  LOGS.forEach(([lx, ly, rot], i) => {
    const done = out.ok ? Math.max(0, Math.min(1, work * 5 - i)) : 0;
    if (done >= 1) return;
    ctx.save(); ctx.globalAlpha = 1 - done; ctx.translate(W * (lx + done * .5), H * (ly + done * .12)); ctx.rotate(rot + done * 2);
    ctx.fillStyle = '#8a5a2b'; ctx.strokeStyle = '#4b2f12'; ctx.lineWidth = H * .006;
    const w = W * .09, h = H * .035; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.stroke(); ctx.restore();
  });
  if (out.ok) { const idx = Math.min(4, Math.floor(work * 5)); bx = LOGS[idx][0] - .11 + (work >= 1 ? .05 : 0); by = LOGS[idx][1] - .04; }
  else if (s.finished && out.progress >= 55) { bx = .18 + .02 * Math.sin(sec * 2); by = .66; }
  drawBot(bx, by, { sink: !out.ok && out.progress < 55, lost: !out.ok && out.progress >= 55 });
}
