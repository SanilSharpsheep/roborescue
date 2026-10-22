import { shell } from '../ui/shell.js';
import { esc, art, emoji } from '../ui/util.js';
import { current, recordResult, isDone } from '../state.js';
import { missionById, MISSIONS } from '../data/missions.js';
import { BADGES } from '../data/badges.js';
import { session } from '../game/session.js';
import { sounds } from '../ui/sound.js';
import { fmtTime } from '../game/common.js';
import { defOf } from '../game/registry.js';

export function result({ id }) {
  const e = current(), m = missionById(id), out = session.outcome, def = defOf(id);
  if (!m || !out || !out.ok) return { title: 'Result', html: '<div class="screen center-screen"><a class="btn blue" href="#/missions">Pick a mission</a></div>' };
  const first = !e.badges.includes(m.badge);
  if (session.recorded !== out) { recordResult(e, id, { stars: out.stars, energy: out.energy, safety: out.safety, time: out.time }); session.recorded = out; }
  const badge = BADGES.find((x) => x.id === m.badge), next = MISSIONS.find((x) => x.order === m.order + 1);
  const stars = [1, 2, 3].map((i) => `<span class="rs ${i <= out.stars ? 'on' : ''}">${emoji('star', '4rem')}</span>`).join('');
  const tip = def.tip(out);
  setTimeout(() => { for (let i = 0; i < out.stars; i++) setTimeout(() => sounds.star(i), i * 250 + 200); }, 50);
  return {
    title: 'Great job!',
    html: shell('/missions', `<div class="resultgrid">
      <section class="card pad resmain"><img class="mascot" src="${art('mascot/cheer.webp')}" alt="">
        <h1>Great job!</h1><p class="lead">${esc(def.winTitle)}</p><div class="rstars" aria-label="${out.stars} of 3 stars">${stars}</div><p class="sm">${esc(tip)}</p>
        <div class="stats"><div><span class="eyebrow">Energy</span><b>${out.energy} of 5</b></div><div><span class="eyebrow">Safety</span><b>${out.safety} of 5</b></div><div><span class="eyebrow">Time</span><b>${fmtTime(out.time)}</b></div></div>
        <p class="sm dim">Time is just for fun. It does not change your stars.</p>
        ${m.animal ? `<div class="animalnote"><img src="${art(m.animal.img)}" alt=""><p class="sm"><b>Inspired by the ${esc(m.animal.name.toLowerCase())}.</b> ${esc(m.animal.fact)}</p></div>` : ''}</section>
      <section class="card pad resside">
        ${first ? '<p class="eyebrow">New badge!</p>' : '<p class="eyebrow">Your badge</p>'}<span class="bframe big"><img src="${art(badge.img)}" alt=""></span><h2>${esc(badge.name)} Badge</h2>
        <p class="sm">${esc(def.badgeCopy)}</p>
        ${next ? `<p class="pill open">${esc(next.title)} is now open</p>` : '<p class="pill open">You finished Water World!</p>'}
        <a class="btn blue" href="#/missions">CONTINUE</a><a class="link" href="#/build/${id}">${out.stars < 3 ? 'Replay for 3 stars' : 'Replay'}</a></section></div>`),
  };
}
