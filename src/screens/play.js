import { art, esc, emoji } from '../ui/util.js';
import { icon } from '../ui/icons.js';
import { settings } from '../state.js';
import { missionById } from '../data/missions.js';
import { MOVES, SENSORS, NEUTRAL_BOT, partById } from '../game/parts.js';
import { defOf } from '../game/registry.js';
import { session } from '../game/session.js';
import { go } from '../router.js';
import { sounds } from '../ui/sound.js';

const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
let raf = 0;

export function play({ id }) {
  const m = missionById(id), b = session.build;
  if (!b || session.missionId !== id) return { title: 'Play', html: '<div class="screen center-screen"><a class="btn blue" href="#/missions">Pick a mission</a></div>' };
  const def = defOf(id), out = def.evaluate(b); session.outcome = out;
  const mv = partById(MOVES, b.move);
  return {
    title: 'Test your bot',
    html: `<div class="screen playscreen">
      <div class="playmain"><header class="playbar"><a class="btn ghost small" href="#/missions">Leave mission</a><b>Mission: ${esc(m.title)}</b></header>
        <div class="stage card"><canvas id="cv" aria-label="Your robot trying the mission" role="img"></canvas><canvas id="fx" aria-hidden="true"></canvas><div id="banner" class="banner" hidden></div></div></div>
      <aside class="playside">
        <div class="card pad meters"><div class="meter"><span>Energy</span><div class="bar"><i id="e" style="width:0"></i></div><b id="et">${out.energy} of 5</b></div>
          <div class="meter"><span>Safety</span><div class="bar"><i id="s" style="width:0;background:linear-gradient(180deg,#6cb8ff,#237be5)"></i></div><b id="st">${out.safety} of 5</b></div>
          <div class="meter"><span>Mission progress</span><div class="bar"><i id="p" style="width:0;background:linear-gradient(180deg,#ffe066,#f2ae0e)"></i></div><b id="pt">0%</b></div></div>
        <div class="card pad wincard" id="wincard" hidden><p class="eyebrow">Mission complete!</p><h2>Nice work, explorer!</h2>
          <p class="sm">${esc(def.quizTip)}</p><button class="btn blue" id="cont">CONTINUE</button></div>
        <div class="card pad hintcard" id="hintcard" hidden>
          <p class="eyebrow">Hint</p><h2 id="hh"></h2><p id="hq" class="hq"></p>
          <p class="eyebrow" style="margin-top:.8rem">Your build</p><p class="sm">${esc(mv ? mv.name : '')} · ${esc(b.sense.join(' + '))} · ${b.sense.length > 1 && def.rules.length > 1 ? 2 : 1} rule${b.sense.length > 1 && def.rules.length > 1 ? 's' : ''}</p>
          <p class="sm dim">Your choices are saved. Change one and try again.</p>
          <div class="hintbtns"><a class="btn ghost small" href="#/build/${id}">CHANGE PARTS</a><button class="btn blue small" id="again">TRY AGAIN</button></div></div>
      </aside></div>`,
    mount(root) { run(root, id, b, out, def); },
  };
}

async function run(root, id, b, out, def) {
  cancelAnimationFrame(raf);
  const cv = root.querySelector('#cv'), ctx = cv.getContext('2d');
  // Same robot the kid built: the picture for the chosen movement part, with the sensor on its socket.
  const mvPart = partById(MOVES, b.move), sensePart = partById(SENSORS, b.sense[0]);
  const spritePath = (mvPart && mvPart.bot ? mvPart.bot : NEUTRAL_BOT).img;
  const [scene, sprite, sensorImg, stuckImg] = await Promise.all([load(art(def.scene)), load(art(spritePath)), sensePart ? load(art(sensePart.img)) : null, load(art(spritePath.replace('.png', '-stuck.png')))]);
  const stuck = stuckImg || sprite, onSocket = true; // stuck = the same robot with a worried face
  const images = {}; await Promise.all((def.extraImages || []).map(async (x) => { images[x] = await load(art(x)); }));
  const reduce = settings().reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s) => root.querySelector(s);
  const fit = () => {
    const r = cv.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
    cv.width = Math.max(320, r.width * d); cv.height = Math.max(180, r.height * d);
  };
  fit(); addEventListener('resize', fit);
  const DUR = reduce ? 1200 : 9000;
  const goal = out.ok ? 1 : out.progress / 100;
  let t0 = null, finished = false;
  const setMeters = (p) => {
    $('#p').style.width = Math.round(p * 100) + '%'; $('#pt').textContent = Math.round(p * 100) + '%';
    $('#e').style.width = out.energy * 20 + '%'; $('#s').style.width = out.safety * 20 + '%';
  };
  function frame(now) {
    if (!cv.isConnected) { removeEventListener('resize', fit); return; }
    if (!t0) t0 = now;
    const k = Math.min(1, (now - t0) / DUR), p = k * goal, W = cv.width, H = cv.height, sec = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    if (scene) { const s = Math.max(W / scene.width, H / scene.height); ctx.drawImage(scene, (W - scene.width * s) / 2, (H - scene.height * s) / 2, scene.width * s, scene.height * s); }
    const settled = !out.ok && k >= 1;
    // The mission draws its own props and calls drawBot(x, y, look) once.
    const drawBot = (bx, by, look = {}) => {
      let img = sprite, sw = W * .23, alpha = 1, dy = 0;
      if (settled && look.sink) { const sink = Math.min(1, (now - t0 - DUR) / 1200); dy = sink * H * .04; alpha = 1 - sink * .12; }
      
      if (settled && !out.ok) { img = stuck; sw *= 1.2; }
      const wob = reduce ? 0 : Math.sin(sec * 3) * H * .008;
      if (img) { const sh = sw * img.height / img.width; ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, W * bx - sw / 2, H * by - sh / 2 + wob + dy, sw, sh);
        if (onSocket && sensorImg) { const iw = sw * (sensePart && sensePart.id === "water" ? .2 : .3), ih = iw * sensorImg.height / sensorImg.width, [sx, sy] = (mvPart && mvPart.bot ? mvPart.bot : NEUTRAL_BOT).socket; ctx.drawImage(sensorImg, W * bx - sw / 2 + sw * sx / 100 - iw / 2, H * by - sh / 2 + wob + dy + sh * sy / 100 - ih * .92, iw, ih); }
        ctx.restore(); }
      if (look.splash && !reduce) { ctx.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(W * bx + Math.cos(i * 1.1 + sec * 4) * W * .04, H * by + Math.sin(i * 1.7 + sec * 5) * H * .03, H * .008, 0, 7); ctx.fill(); } }
      if (settled && look.lost) { ctx.fillStyle = '#fff'; ctx.font = `800 ${H * .08}px Baloo 2, sans-serif`; ctx.strokeStyle = '#0f3675'; ctx.lineWidth = H * .012; ctx.strokeText('?', W * bx + W * .07, H * by - H * .08); ctx.fillText('?', W * bx + W * .07, H * by - H * .08); }
    };
    def.draw(ctx, W, H, { p, sec, k, out, b, drawBot, reduce, finished: settled, images });
    setMeters(p);
    if (k >= 1 && !finished) { finished = true; done(); }
    if (!finished || !out.ok) raf = requestAnimationFrame(frame);
  }
  function done() {
    const bn = $('#banner'); bn.hidden = false;
    if (out.ok) {
      bn.textContent = def.winBanner; bn.className = 'banner good'; sounds.success();
      $('#wincard').hidden = false; $('#cont').onclick = () => go('/quiz/' + id); $('#cont').focus();
      if (!reduce) confetti(root.querySelector('#fx'));
    } else {
      bn.textContent = out.why; bn.className = 'banner bad'; sounds.fail();
      $('#hh').textContent = out.hint; $('#hq').textContent = out.question; $('#hintcard').hidden = false;
      $('#again').onclick = () => go('/play/' + id);
      $('#again').focus();
    }
  }
  raf = requestAnimationFrame(frame);
}

// A short burst of confetti on the win. Stops by itself after about 3 seconds.
function confetti(cv) {
  const r = cv.parentElement.getBoundingClientRect(), d = devicePixelRatio || 1;
  cv.width = r.width * d; cv.height = r.height * d;
  const c = cv.getContext('2d'), colors = ['#ffc928', '#f15b49', '#5ebc2e', '#237be5', '#8b5ca9', '#fff'];
  const bits = Array.from({ length: 90 }, () => ({ x: cv.width * (.2 + Math.random() * .6), y: -Math.random() * cv.height * .4, vx: (Math.random() - .5) * 4 * d, vy: (2 + Math.random() * 4) * d, s: (6 + Math.random() * 8) * d, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, col: colors[(Math.random() * colors.length) | 0] }));
  const t0 = performance.now();
  (function tick(now) {
    if (!cv.isConnected) return;
    const k = (now - t0) / 3000; c.clearRect(0, 0, cv.width, cv.height);
    if (k >= 1) return;
    c.globalAlpha = Math.min(1, 2.5 * (1 - k));
    bits.forEach((b) => { b.x += b.vx; b.y += b.vy; b.rot += b.vr; c.save(); c.translate(b.x, b.y); c.rotate(b.rot); c.fillStyle = b.col; c.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); c.restore(); });
    requestAnimationFrame(tick);
  })(t0);
}
