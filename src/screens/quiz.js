import { topbar } from '../ui/topbar.js';
import { esc, art } from '../ui/util.js';
import { settings, current, recordQuiz } from '../state.js';
import { quizOf } from '../game/registry.js';
import { session } from '../game/session.js';
import { go } from '../router.js';
import { sounds } from '../ui/sound.js';

export function quiz({ id }) {
  const qz = quizOf(id);
  if (!qz || !session.outcome || !session.outcome.ok) return { title: 'Quiz', html: '<div class="screen center-screen"><a class="btn blue" href="#/missions">Pick a mission</a></div>' };
  return {
    title: 'Quick quiz',
    html: `<div class="screen center-screen scroll"><div class="quizwrap">${topbar({ back: '#/missions', backLabel: 'Leave quiz', title: 'Quick quiz', h1: false, profile: false })}</div><div class="quizbox card pad intro" id="intro">
      <img class="mascot" src="${art('mascot/point.webp')}" alt=""><h1 class="qtitle">Quick quiz time!</h1>
      <p class="lead">Two easy questions about your robot. No stars are at risk!</p>
      <button class="btn blue" id="start">LET'S GO!</button><a class="link" href="#/result/${id}">Skip quiz</a></div>
      <div class="quizbox card pad" id="qbox" hidden>
      <div class="quiztop"><a class="link" href="#/result/${id}" id="skip">Skip quiz</a></div>
      <h1 class="qtitle">Quick quiz</h1><p class="eyebrow" id="qn"></p><p class="eyebrow" style="color:var(--blue-dark)">ABOUT ${esc(qz.topic)}</p>
      <h2 id="qq" class="qq"></h2>
      ${settings().readAloud && 'speechSynthesis' in window ? '<button class="btn ghost small" id="read">🔊 Read it to me</button>' : ''}
      <div id="ans" class="answers"></div><p id="fb" class="feedback" aria-live="polite"></p>
      <button class="btn blue" id="next" hidden>NEXT QUESTION</button></div></div>`,
    mount(root) {
      let i = 0, score = 0, missed = false;
      const $ = (s) => root.querySelector(s);
      session.quizScore = null;
      const show = () => {
        const q = qz.questions[i];
        $('#qn').textContent = `Question ${i + 1} of ${qz.questions.length}`; $('#qq').textContent = q.q;
        $('#fb').textContent = ''; $('#next').hidden = true; missed = false;
        $('#ans').innerHTML = q.a.map((t, n) => `<button class="answer" data-n="${n}"><span class="letter">${'ABC'[n]}</span>${esc(t)}</button>`).join('');
        $('#next').textContent = i === qz.questions.length - 1 ? 'SEE MY RESULT' : 'NEXT QUESTION';
        root.querySelectorAll('.answer').forEach((btn) => (btn.onclick = () => {
          const n = +btn.dataset.n, right = n === q.right;
          if (right) { sounds.right(); if (!missed) score++; btn.classList.add('right'); root.querySelectorAll('.answer').forEach((x) => (x.disabled = true)); $('#fb').innerHTML = `<b>You got it!</b> ${esc(q.why)}`; $('#next').hidden = false; $('#next').focus(); }
          else { sounds.wrong(); missed = true; btn.classList.add('wrong'); btn.disabled = true; $('#fb').innerHTML = '<b>Not quite.</b> Try another one!'; }
        }));
      };
      $('#next').onclick = () => { if (++i >= qz.questions.length) { session.quizScore = score; recordQuiz(current(), id, score, qz.questions.length); go('/result/' + id); } else show(); };
      const rd = $('#read'); if (rd) rd.onclick = () => { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance($('#qq').textContent)); };
      $('#start').onclick = () => { $('#intro').hidden = true; $('#qbox').hidden = false; $('#qbox').classList.add('enter'); show(); };
      $('#start').focus();
    },
  };
}
