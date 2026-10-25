// The Engineer Report: a kid-friendly look at how you built, tested and learned. Everything is read from this device.
import { shell, pageHead } from '../ui/shell.js';
import { esc, art, emoji } from '../ui/util.js';
import { current, missionState, statsOf, totalStars } from '../state.js';
import { MISSIONS } from '../data/missions.js';
import { BADGES } from '../data/badges.js';

const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

function growth(m, st, done, s) {
  if (st === 'locked') return 'Locked. Finish the mission before it to open this one.';
  if (done) {
    if (s.solvedAfter === 0) return 'Solved on the first try!';
    if (s.solvedAfter > 0) return `Got stuck ${plural(s.solvedAfter, 'time')}, then fixed the bot. That is how engineers learn.`;
    return 'Mission complete!';
  }
  if (s.fails > 0) return `Still working. Stuck ${plural(s.fails, 'time')} so far. Keep going!`;
  return 'Not started yet.';
}

export function report() {
  const e = current(), today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const rows = MISSIONS.map((m) => {
    const st = missionState(e, m), s = statsOf(e, m.id), done = st === 'done', stars = (e.progress[m.id] || {}).stars || 0;
    const star = [1, 2, 3].map((i) => `<span class="${i <= stars ? 'on' : ''}">${emoji('star', '1.2em')}</span>`).join('');
    const quiz = s.quiz ? `${s.quiz.score} of ${s.quiz.total}` : '–';
    const tag = st === 'locked' ? '<span class="pill soon">Locked</span>' : done ? '<span class="pill open">Done</span>' : '<span class="pill lvl">Open</span>';
    return `<article class="card pad repmission ${st === 'locked' ? 'locked' : ''}">
      <img class="repthumb" src="${art('scenes/' + m.scene)}" alt="">
      <div class="repbody"><div class="reptop"><div><span class="pill lvl">${esc(m.level)}</span><h2>${esc(m.title)}</h2></div>${tag}</div>
        <div class="stars">${star}</div>
        <dl class="repstats"><div><dt>Tries</dt><dd>${s.runs}</dd></div><div><dt>Got stuck</dt><dd>${s.fails}</dd></div><div><dt>Quiz, first try</dt><dd>${quiz}</dd></div></dl>
        <p class="repnote">${esc(growth(m, st, done, s))}</p></div></article>`;
  }).join('');
  const doneMissions = MISSIONS.filter((m) => missionState(e, m) === 'done');
  const quizRight = MISSIONS.reduce((n, m) => n + (statsOf(e, m.id).quiz ? statsOf(e, m.id).quiz.score : 0), 0);
  const quizTotal = MISSIONS.reduce((n, m) => n + (statsOf(e, m.id).quiz ? statsOf(e, m.id).quiz.total : 0), 0);
  const animals = doneMissions.map((m) => m.animal && m.animal.name).filter(Boolean);
  return {
    title: 'Engineer Report',
    html: shell('/report', `${pageHead(`${e.name}'s Engineer Report`, 'How you built, tested and learned.', '<button type="button" class="btn ghost small" id="printrep">Print</button>')}
      <div class="repgrid">
        <div class="card pad repsum"><p class="eyebrow">Missions done</p><b>${doneMissions.length} of ${MISSIONS.length}</b></div>
        <div class="card pad repsum"><p class="eyebrow">Stars</p><b>${totalStars(e)} of ${MISSIONS.length * 3}</b></div>
        <div class="card pad repsum"><p class="eyebrow">Badges</p><b>${e.badges.length} of ${BADGES.length}</b></div>
        <div class="card pad repsum"><p class="eyebrow">Quiz, right on first try</p><b>${quizTotal ? `${quizRight} of ${quizTotal}` : '–'}</b></div>
      </div>
      <div class="replist">${rows}</div>
      <div class="card pad repfoot"><p class="eyebrow">What you practiced</p>
        <p>${animals.length ? `You learned how a ${esc(animals.join(', a ').toLowerCase())} moves and used those ideas to build a Rescue Bot.` : 'Finish a mission to see the animal ideas you used.'} You chose a body part, picked sensors and wrote IF/THEN rules, just like a real robot engineer.</p>
        <p class="sm dim">Report for ${esc(e.name)} · ${esc(today)} · Saved only on this device. Print this page to share it with a parent or teacher.</p></div>`),
    mount(root) { const b = root.querySelector('#printrep'); if (b) b.onclick = () => window.print(); },
  };
}
