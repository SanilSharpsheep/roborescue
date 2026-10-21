// Mission 3: dive into the dark, find a trapped sea turtle and free it gently.
import { MOVES, SENSORS, partById } from './parts.js';

const FREE = [
  { id: 'gentle', icon: '🤲', label: 'Free it gently', note: 'Untangle the net with soft arms.' },
  { id: 'pull', icon: '💥', label: 'Pull it free', note: 'Fast, but it could hurt the animal.' },
];
const DEPTH = [
  { id: 'up', icon: '⬆️', label: 'Swim up a bit', note: 'Stay in safer water.' },
  { id: 'dive', icon: '⬇️', label: 'Dive deeper', note: 'Uses more energy.' },
];
const stall = (progress, why, hint, question, stats) => ({ ok: false, progress, why, hint, question, ...stats });
const name = (id, fallback) => (partById(SENSORS, id) || { name: fallback }).name;

function evaluate(b) {
  const water = b.sense.includes('water');
  const swimsUp = water && b.then2 === 'up';
  const diveCost = water && b.then2 === 'dive' ? 1 : 0;
  const energy = Math.max(1, 5 - (b.sense.length - 1) - diveCost);
  const safety = Math.min(5, (b.then === 'gentle' ? 3 : 1) + (swimsUp ? 2 : 0));
  const base = { energy, safety, time: 70 };
  if (b.move === 'treads') return stall(15, 'Stuck! Treads sink to the bottom', 'Treads sink in deep water.', 'Which sea animal has soft arms that can hold things?', base);
  if (b.move === 'legs') return stall(20, 'Stuck! Springs cannot push water', 'Springy legs need something solid to push on.', 'Which sea animal has eight soft arms?', base);
  if (!b.sense.includes('echo')) return stall(50, 'Lost! It is too dark to see', 'It is dark and murky down here. Which sensor uses sound to see?', 'Which sensor uses sound to find things?', base);
  if (b.move === 'fins') return stall(70, 'Stuck! Fins cannot untangle the net', 'Fins are great for swimming, but they cannot hold things gently.', 'Which sea animal has eight soft arms?', base);
  return { ok: true, energy, safety, time: 70, stars: 1 + (energy >= 4 ? 1 : 0) + (safety >= 4 ? 1 : 0), progress: 100, warned: swimsUp };
}

export const deepWaterRescue = {
  id: 'deep-water-rescue',
  scene: 'scenes/deep-water-rescue.jpg',
  moves: ['treads', 'fins', 'legs', 'octo'],
  sensors: ['echo', 'heat', 'water'],
  maxSense: 2,
  defaultBuild: { move: null, sense: [], then: 'pull', then2: 'dive' },
  previewImg: { fins: 'bots/manta-three-quarter.png', octo: 'bots/builder-bot-soft-arms.png' },
  hint: 'It is dark and deep. One sensor uses sound to find things. Another can tell when the water gets too deep. And how would you hold a scared animal?',
  rules: [
    { key: 'then', label: 'Rule 1', ifText: (b) => `${name(b.sense[0], 'A sensor')} finds the trapped animal`, options: FREE },
    {
      key: 'then2', label: 'Rule 2', available: (b) => b.sense.length > 1, lockedText: 'Pick a second sensor to open Rule 2.',
      ifText: (b) => (b.sense[1] === 'water' ? 'Water says it is too deep' : `${name(b.sense[1], 'A sensor')} finds danger`), options: DEPTH,
    },
  ],
  evaluate,
  summary: (b) => `${(partById(MOVES, b.move) || { name: '' }).name.toLowerCase()}, ${b.sense.join(' + ')} and ${b.sense.length > 1 ? 2 : 1} rule${b.sense.length > 1 ? 's' : ''}`,
  winBanner: 'You freed the turtle!', winTitle: 'You freed the turtle!',
  badgeCopy: 'You freed a trapped sea turtle with an octopus-inspired robot.',
  tip: (out) => (out.stars === 3 ? 'Perfect! Gentle, safe and full of energy.' : out.safety < 4 ? 'Free it gently and swim up when the water is too deep for the third star.' : 'Try to save energy for the second star.'),
  quizTip: 'Next: a quick 2-question quiz about octopuses.',
  sprite: (b) => (b.move === 'octo' ? 'bots/builder-bot-soft-arms.png' : b.move === 'fins' ? 'bots/manta-side.png' : null),
  stuckSprite: 'bots/manta-stuck.png', spriteWidth: (b) => (b.move === 'octo' ? 0.13 : b.move === 'fins' ? 0.17 : 0.08),
  extraImages: ['emoji/turtle.svg'],
  draw: drawDeep,
};

const PATH = [[0, .15, .25], [.4, .42, .5], [.55, .55, .68], [.62, .56, .72], [1, .56, .72]];
function at(p) {
  for (let i = 1; i < PATH.length; i++) if (p <= PATH[i][0]) { const [t0, x0, y0] = PATH[i - 1], [t1, x1, y1] = PATH[i], k = (p - t0) / (t1 - t0 || 1); return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]; }
  const l = PATH[PATH.length - 1]; return [l[1], l[2]];
}
function drawDeep(ctx, W, H, s) {
  const { p, sec, out, b, drawBot, reduce, images } = s;
  const turtle = images && images['emoji/turtle.svg'];
  const echo = b.sense.includes('echo'), water = b.sense.includes('water');
  const freeK = out.ok ? Math.min(1, Math.max(0, (p - .62) / .28)) : 0;
  const away = out.ok ? Math.min(1, Math.max(0, (p - .92) / .08)) : 0;
  const gentle = b.then === 'gentle';
  // trapped turtle and net
  let tx = .66 + away * .2, ty = .78 - away * .3;
  const wig = reduce || freeK >= 1 ? 0 : Math.sin(sec * (gentle ? 3 : 9)) * H * .004;
  if (turtle) { const ts = W * .08; ctx.drawImage(turtle, W * tx - ts / 2, H * ty - ts / 2 + wig, ts, ts); }
  if (freeK < 1) {
    ctx.save(); ctx.globalAlpha = 1 - freeK; ctx.strokeStyle = '#e8d9a8'; ctx.lineWidth = H * .004;
    const nx = W * .66, ny = H * .78, rx = W * .07, ry = H * .07;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(nx + i * rx / 3, ny - ry); ctx.lineTo(nx + i * rx / 3, ny + ry); ctx.stroke(); ctx.beginPath(); ctx.moveTo(nx - rx, ny + i * ry / 3); ctx.lineTo(nx + rx, ny + i * ry / 3); ctx.stroke(); }
    ctx.restore();
  }
  // echo rings around the animal while scanning
  if (echo && out.ok && p > .5 && p < .64) for (let r = 0; r < 3; r++) { const k = (sec * 1.2 + r / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#7fe3ff'; ctx.lineWidth = H * .005; ctx.beginPath(); ctx.arc(W * .66, H * .78, H * (.04 + k * .12), 0, 7); ctx.stroke(); ctx.restore(); }
  // rescue feedback: hearts when gentle, alarm marks when pulled
  if (out.ok && freeK > 0 && freeK < 1) {
    ctx.save(); ctx.textAlign = 'center'; ctx.font = `800 ${H * .05}px sans-serif`;
    if (gentle) { ctx.globalAlpha = .9; ctx.fillStyle = '#ff6b8b'; ctx.fillText('♥', W * (.7 + Math.sin(sec * 2) * .01), H * (.66 - freeK * .05)); }
    else { ctx.fillStyle = '#ffc928'; ctx.strokeStyle = '#0f3675'; ctx.lineWidth = H * .006; ctx.strokeText('!', W * .7, H * .68); ctx.fillText('!', W * .7, H * .68); }
    ctx.restore();
  }
  let [bx, by] = at(p), dx = 0, dy = 0;
  // depth check with the water sensor
  const depthWin = out.ok && water && p > .26 && p < .42;
  if (depthWin) { const up = b.then2 === 'up'; dy = up ? -.05 : .02; dx = up ? 0 : (reduce ? 0 : Math.sin(sec * 30) * .003);
    ctx.save(); ctx.font = `800 ${H * .032}px sans-serif`; ctx.textAlign = 'center'; const label = up ? 'Too deep! Swimming up' : 'Too deep! Diving on...'; const w = ctx.measureText(label).width + H * .04;
    ctx.fillStyle = up ? '#5ebc2e' : '#f15b49'; ctx.beginPath(); ctx.roundRect(W * bx - w / 2, H * (by - .19), w, H * .05, H * .025); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(label, W * bx, H * (by - .19) + H * .036); ctx.restore(); }
  if (!out.ok && s.finished && out.progress === 70) dx = Math.sin(sec * 6) * .006;
  drawBot(bx + dx, by + dy, { sink: !out.ok && out.progress < 30 && s.finished, lost: !out.ok && out.progress === 50 });
}
