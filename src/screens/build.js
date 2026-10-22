import { shell } from '../ui/shell.js';
import { art, esc } from '../ui/util.js';
import { sayBtn } from '../ui/speak.js';
import { icon } from '../ui/icons.js';
import { current, savedBuild, saveBuild, missionState } from '../state.js';
import { missionById } from '../data/missions.js';
import { MOVES, SENSORS, NEUTRAL_BOT, partById } from '../game/parts.js';
import { defOf } from '../game/registry.js';
import { session } from '../game/session.js';
import { go } from '../router.js';
import { MOVE_HELP, SENSE_HELP, THINK_HELP, MOVE_CLUES, EXPLAIN, HELP_TEXT } from '../data/help.js';

const SEEN_KEY = 'roborescue-help-intro-seen';
const seen = () => { try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; } };
const markSeen = () => { try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked: fine */ } };

const partBtn = (kind, p) => `<button type="button" class="part" data-kind="${kind}" data-id="${p.id}" aria-pressed="false">
  <span class="tick">${icon.check}</span><img src="${art(p.img)}" alt=""><b>${esc(p.name)}</b></button>`;


const MSG = { 1: 'First, choose how your bot will move.', 2: 'Now choose a sensor.', 3: 'Choose what your bot should do.' };
// Complete bot picture for the big preview; falls back to the neutral bot. Sensor sits on the picture's top socket.
function botPreview(mv, se) {
  const bot = (mv && mv.bot) || NEUTRAL_BOT;
  const [x, y] = bot.socket;
  const alt = mv ? `Rescue bot with ${mv.name}${se ? ` and ${se.name} sensor` : ''}` : 'Unfinished rescue bot';
  return `<div class="botstage"><div class="bot-preview"><img class="bot-image" src="${art(bot.img)}" alt="${esc(alt)}">
    ${se ? `<img class="attached-sensor" src="${art(se.img)}" alt="" style="width:${se.id === "water" ? 20 : 30}%;left:${x}%;top:${y}%">` : ''}</div></div>`;
}

export function build({ id }) {
  const m = missionById(id), def = defOf(id), e = current();
  const soon = (msg) => ({ title: 'Coming soon', html: shell('/missions', `<div class="card pad"><h2>${msg}</h2><p style="margin:.6rem 0">Check back soon!</p><a class="btn blue small" href="#/missions">Back to missions</a></div>`) });
  if (!m || !def) return soon('This mission is coming soon');
  if (missionState(e, m) === 'locked') return soon('Finish the mission before this one first');
  // Every visit starts with an empty bot: nothing is preselected (rule values are only fallbacks until the kid picks).
  const b = { ...def.defaultBuild, move: null, sense: [] };
  const touched = {}; // rule keys the kid has actually chosen
  const rules = def.rules.map((r, i) => `<div class="rulebox" data-rule="${i}"></div>`).join('');
  return {
    title: 'Build your bot',
    html: shell('/missions', `
      <header class="pagehead"><a class="roundbtn" href="#/missions" aria-label="Back to missions">${icon.back}</a>
        <div><h1>Build Your Rescue Bot</h1><span class="pill lvl">${esc(m.level)} · ${esc(m.title)}</span></div>
        <ol class="steps" aria-label="Build steps"><li data-step="1"><span class="n blue">1</span>Move</li><li data-step="2"><span class="n green">2</span>Sense</li><li data-step="3"><span class="n purple">3</span>Think</li></ol></header>
      <div class="buildgrid">
        <section class="card previewcard" aria-label="Your bot"><div id="prev"></div></section>
        <div class="partscol">
          <section class="card pad stepcard" data-step="1"><p class="eyebrow"><span class="n blue">1</span> Movement parts</p>
            <div class="partrow">${def.moves.map((x) => partBtn('move', partById(MOVES, x))).join('')}</div></section>
          <section class="card pad stepcard" data-step="2"><p class="eyebrow"><span class="n green">2</span> Sensors${def.maxSense > 1 ? ` <span class="pickn">pick up to ${def.maxSense}</span>` : ''}</p>
            <div class="partrow">${def.sensors.map((x) => partBtn('sense', partById(SENSORS, x))).join('')}</div></section>
          <section class="card pad stepcard think ${def.rules.length > 1 ? 'two' : ''}" data-step="3"><p class="eyebrow thinkhead" data-step-head><span><span class="n purple">3</span> Think</span></p>
            ${rules}</section>
        </div>
      </div>
      <footer class="buildbar"><a class="btn ghost small" href="#/missions">Back</a><span class="readywrap"><span id="ready" aria-live="polite"></span><button type="button" class="helpbtn" id="helpbtn" aria-haspopup="dialog">${esc(HELP_TEXT.button)}</button><div class="helpintro" id="helpintro" hidden><span>${esc(HELP_TEXT.intro)}</span><button type="button" id="introx" aria-label="Close tip">×</button></div></span>
        <button type="button" class="btn blue" id="test" disabled>TEST MY BOT</button></footer>`, { scroll: false }),
    mount(root) {
      const $ = (s) => root.querySelector(s);
      let lastPick = null; // id of the latest movement/sensor pick: only its sentence shows under the bot
      let clueN = 0;
      const stepNow = () => (!b.move ? 1 : !b.sense.length ? 2 : 3);
      const needed = () => def.rules.filter((r) => r.options && (!r.available || r.available(b)));
      const rulesDone = () => needed().every((r) => touched[r.key]);
      const drawRules = () => {
        def.rules.forEach((r, i) => {
          const box = root.querySelector(`[data-rule="${i}"]`);
          const avail = !r.available || r.available(b);
          if (!avail) { box.innerHTML = `<p class="rulelabel">${r.label}</p><p class="sm dim locked">${icon.lock} ${esc(r.lockedText)}</p>`; return; }
          const head = `<div class="rule"><span class="kw">IF</span><span class="slot fixed">${esc(r.ifText(b))}</span><span class="kw">THEN</span>${r.fixedThen ? `<span class="slot fixed">${esc(r.fixedThen)}</span>` : '<span class="slot fixed pickone">pick one:</span>'}</div>`;
          const opts = r.options ? `<div class="thenrow">${r.options.map((o) => `<button type="button" class="part thenopt" data-rule-key="${r.key}" data-then="${o.id}" aria-pressed="${touched[r.key] === o.id}" ${stepNow() < 3 ? 'disabled' : ''}><span class="tick">${icon.check}</span><span class="ico">${o.icon}</span><b>${esc(o.label)}</b><small>${esc(o.note)}</small></button>`).join('')}</div>` : '';
          box.innerHTML = `<p class="rulelabel">${def.rules.length > 1 ? r.label : ''}</p>${head}${opts}`;
          box.querySelectorAll('.thenopt').forEach((x) => (x.onclick = () => { b[x.dataset.ruleKey] = x.dataset.then; touched[x.dataset.ruleKey] = x.dataset.then; draw(); }));
        });
      };
      const draw = () => {
        const mv = partById(MOVES, b.move), ses = b.sense.map((x) => partById(SENSORS, x));
        const step = stepNow(), done = step === 3 && rulesDone();
        $('#prev').innerHTML = botPreview(mv, ses[0]) + `<p class="selnote" aria-live="polite">${esc(EXPLAIN[lastPick] || '')}</p><div class="guide"><img src="${art('mascot/point.webp')}" alt=""><p class="bubble" aria-live="polite">${esc(done ? 'Your bot is ready! Press TEST MY BOT.' : MSG[step])}</p>${sayBtn('data-say-sel=".selnote, .bubble"')}</div>`;
        drawRules();
        $('#test').disabled = !done;
        $('#ready').textContent = done ? `Ready: ${def.summary(b)}` : MSG[step];
        root.querySelectorAll('.part[data-kind]').forEach((x) => {
          const on = x.dataset.kind === 'move' ? b.move === x.dataset.id : b.sense.includes(x.dataset.id);
          x.setAttribute('aria-pressed', on);
          if (x.dataset.kind === 'sense') x.disabled = step < 2;
        });
        root.querySelectorAll('.stepcard').forEach((c) => { const n = +c.dataset.step; c.classList.toggle('muted', n > step); c.classList.toggle('active', n === step); });
        root.querySelectorAll('.steps li').forEach((c) => { const n = +c.dataset.step; c.classList.toggle('active', n === step); c.classList.toggle('muted', n > step); c.classList.toggle('done', n < step); });
        if (done) saveBuild(e, id, b);
      };
      root.querySelectorAll('.part[data-kind]').forEach((x) => (x.onclick = () => {
        if (x.dataset.kind === 'move') { b.move = x.dataset.id; lastPick = b.move; }
        else if (b.sense.includes(x.dataset.id)) { b.sense = b.sense.filter((s) => s !== x.dataset.id); lastPick = b.sense.length ? b.sense[b.sense.length - 1] : b.move; }
        else { b.sense = [...b.sense, x.dataset.id].slice(-def.maxSense); lastPick = x.dataset.id; }
        hideIntro(); draw();
      }));
      // ---- Help me choose: one button, content follows the active step ----
      const hideIntro = () => { if (!$('#helpintro').hidden) { $('#helpintro').hidden = true; } markSeen(); };
      if (!seen()) $('#helpintro').hidden = false;
      $('#introx').onclick = hideIntro;
      const card = (p, picked) => `<li class="hcard"><b>${esc(p.name)}</b><span>${esc(p.description)}</span><span class="best"><em>${esc(HELP_TEXT.bestFor)}</em> ${esc(p.bestFor)}</span></li>`;
      const helpBody = () => {
        const step = stepNow();
        let clue = '', list = '';
        if (step === 1) {
          const clues = MOVE_CLUES[id] || [def.hint];
          clue = clues.slice(0, clueN + 1).slice(-1)[0];
          list = def.moves.map((mid) => MOVE_HELP.find((h) => h.id === mid)).filter(Boolean).map(card).join('');
          return { clue, more: clueN < clues.length - 1, list };
        }
        if (step === 2) {
          list = def.sensors.map((sid) => SENSE_HELP.find((h) => h.id === sid)).filter(Boolean).map(card).join('');
          return { clue: def.hint, more: false, list };
        }
        const multi = def.rules.filter((r) => r.options && (!r.available || r.available(b))).length > 1;
        list = def.rules.filter((r) => r.options && (!r.available || r.available(b))).map((r) => (multi ? `<li class="hgroup">${esc(r.label)}: ${esc(r.ifText(b))}</li>` : '') + r.options.map((o) => `<li class="hcard"><b>${o.icon} ${esc(o.label)}</b><span>${esc(THINK_HELP[o.id] || o.note)}</span></li>`).join('')).join('');
        return { clue: '', more: false, list };
      };
      let opener = null, onKey = null;
      const closeHelp = () => {
        const el = document.getElementById('helpscrim'); if (el) el.remove();
        if (onKey) { document.removeEventListener('keydown', onKey); onKey = null; }
        window.removeEventListener('hashchange', closeHelp);
        if (opener && document.contains(opener)) opener.focus();
      };
      const openHelp = () => {
        closeHelp(); hideIntro(); opener = $('#helpbtn');
        const step = stepNow(), body = helpBody();
        const scrim = document.createElement('div'); scrim.id = 'helpscrim'; scrim.className = 'helpscrim';
        scrim.innerHTML = `<div class="helpsheet" role="dialog" aria-modal="true" aria-labelledby="helptitle">
          <div class="helphead"><h2 id="helptitle">${esc(HELP_TEXT.title[step])}</h2><button type="button" class="helpclose" id="helpclose" aria-label="Close help">×</button></div>
          ${body.clue ? `<div class="clue"><p id="clue">💡 ${esc(body.clue)}</p>${body.more ? `<button type="button" class="link" id="moreclue">${esc(HELP_TEXT.anotherClue)}</button>` : ''}</div>` : ''}
          <ul class="hlist">${body.list}</ul></div>`;
        document.body.appendChild(scrim);
        scrim.onclick = (ev) => { if (ev.target === scrim) closeHelp(); };
        scrim.querySelector('#helpclose').onclick = closeHelp;
        const more = scrim.querySelector('#moreclue');
        if (more) more.onclick = () => { clueN += 1; const nb = helpBody(); scrim.querySelector('#clue').textContent = '💡 ' + nb.clue; if (!nb.more) more.remove(); };
        onKey = (ev) => { if (ev.key === 'Escape') closeHelp(); };
        document.addEventListener('keydown', onKey); window.addEventListener('hashchange', closeHelp);
        scrim.querySelector('#helpclose').focus();
      };
      $('#helpbtn').onclick = openHelp;
      $('#test').onclick = () => { session.missionId = id; session.build = JSON.parse(JSON.stringify(b)); session.outcome = null; go('/play/' + id); };
      draw();
    },
  };
}
