import { shell } from '../ui/shell.js';
import { esc, art, avatarFace, emoji } from '../ui/util.js';
import { current, nextMission, totalStars, levelOf, starsToNext } from '../state.js';
import { BADGES } from '../data/badges.js';

const FACTS = [
  'A manta ray flaps its wide fins like wings to glide through water. Our Manta robot borrows that idea!',
  'A gecko can climb walls because tiny hairs on its toes cling to surfaces.',
  'An octopus has soft arms that squeeze through tiny gaps.',
  'Beavers build dams that slow water down and protect the land.',
];

export function home() {
  const e = current(), m = nextMission(e), stars = totalStars(e);
  const fact = FACTS[(stars + e.name.length) % FACTS.length];
  const slots = BADGES.map((b) => e.badges.includes(b.id)
    ? `<li class="got" title="${b.name}"><span class="bframe"><img src="${art(b.img)}" alt="${b.name} badge"></span></li>`
    : `<li title="Locked"><span class="bframe locked"><img src="${art('emoji/locked.svg')}" alt="Locked badge"></span></li>`).join('');
  const mission = m ? `<a class="card mission" href="#/build/${m.id}">
      <img class="scene" src="${art('scenes/' + m.scene)}" alt="">
      <img class="robot" src="${art('bots/manta-front.png')}" alt="">
      <div class="mtext"><span class="pill lvl">${esc(m.level)}</span><h2>${esc(m.title)}</h2><p>${esc(m.blurb)}</p>
      <span class="btn blue">START</span></div></a>`
    : `<div class="card pad"><h2>All missions done!</h2><p>New missions are coming soon.</p></div>`;
  return {
    title: 'Home',
    html: shell('/home', `
      <header class="pagehead"><span class="avatar" style="width:4.5rem;height:4.5rem"><img src="${avatarFace(e.avatar)}" alt=""></span>
        <div><h1>Hi, ${esc(e.name)}!</h1><p>Ready to build a rescue robot?</p></div></header>
      <div class="homegrid">
        ${mission}
        <div class="card pad level"><p class="eyebrow">Your level</p><h2>Level ${levelOf(e)}</h2>
          <div class="bar"><i style="width:${(totalStars(e) % 10) * 10}%"></i></div>
          <p class="sm">${emoji('star', '1.2em')} ${stars} stars · ${starsToNext(e)} to next level</p></div>
        <div class="card pad bcard"><p class="eyebrow">Your badges</p><ul class="badgegrid">${slots}</ul></div>
        <div class="card pad fact"><img src="${art('mascot/think.png')}" alt=""><div><p class="eyebrow">Did you know?</p><p>${esc(fact)}</p></div></div>
      </div>`),
  };
}
