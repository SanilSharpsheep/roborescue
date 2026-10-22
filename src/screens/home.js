import { sayBtn } from '../ui/speak.js';
import { shell } from '../ui/shell.js';
import { esc, art, avatarFace, emoji } from '../ui/util.js';
import { markGuideSeen, current, nextMission, totalStars, levelOf, starsToNext } from '../state.js';
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
      <img class="robot" src="${art('bots/manta-front.webp')}" alt="">
      <div class="mtext"><span class="pill lvl">${esc(m.level)}</span><h2>${esc(m.title)}</h2><p>${esc(m.blurb)}</p>
      <span class="btn blue">START</span></div></a>`
    : `<div class="card pad"><h2>All missions done!</h2><p>New missions are coming soon.</p></div>`;
  return {
    title: 'Home',
    html: shell('/home', `
      <header class="pagehead"><a class="whobtn" href="#/who" aria-label="Profile menu: log out or start over"><span class="avatar" style="width:4.5rem;height:4.5rem"><img src="${avatarFace(e.avatar)}" alt=""></span><small>Profile</small></a>
        <div><h1>Hi, ${esc(e.name)}!</h1><p>Ready to build a rescue robot?</p></div>
        <button type="button" class="btn ghost small" id="howto" style="margin-left:auto;margin-right:3.8rem">How to play</button></header>
      <div class="homegrid">
        ${mission}
        <div class="card pad level"><p class="eyebrow">Your level</p><h2>Level ${levelOf(e)}</h2>
          <div class="bar"><i style="width:${(totalStars(e) % 10) * 10}%"></i></div>
          <p class="sm">${emoji('star', '1.2em')} ${stars} stars · ${starsToNext(e)} to next level</p></div>
        <div class="card pad bcard"><p class="eyebrow">Your badges</p><ul class="badgegrid">${slots}</ul></div>
        <div class="card pad fact"><img src="${art('mascot/think.webp')}" alt=""><div><p class="eyebrow">Did you know?</p><p>${esc(fact)}</p></div></div>
      </div>`),

    mount(root) {
      const STEPS = [
        ['1', 'Pick a mission', 'Tap START on a mission. Each one is a problem to solve after a flood.'],
        ['2', 'Build your Rescue Bot', 'Choose how it moves, what it senses, and what it does. Tap the parts you like.'],
        ['3', 'Test it!', 'Watch your bot try the mission. If it gets stuck, change a part and try again.'],
      ];
      const open = () => {
        let i = 0;
        const w = document.createElement('div'); w.className = 'leavewrap';
        const draw = () => {
          const [n, t, d] = STEPS[i], last = i === STEPS.length - 1;
          w.innerHTML = `<div class="leavebox guidebox" role="dialog" aria-modal="true" aria-labelledby="gt">
            <img src="${art('mascot/point.webp')}" alt="" class="guideimg">
            <p class="eyebrow">Step ${n} of ${STEPS.length}</p><h2 id="gt">${t}</h2><p>${d}</p>${sayBtn('data-say-sel="#gt, #gt + p"')}
            <div class="row"><button type="button" class="btn ghost small" id="gskip">Skip</button><button type="button" class="btn blue" id="gnext">${last ? "LET'S GO!" : 'NEXT'}</button></div></div>`;
          w.querySelector('#gnext').focus();
          w.querySelector('#gnext').onclick = () => { if (last) close(); else { i++; draw(); } };
          w.querySelector('#gskip').onclick = close;
        };
        const close = () => { w.remove(); markGuideSeen(e.id); };
        root.appendChild(w); draw();
      };
      root.querySelector('#howto').onclick = open;
      if (!e.seenGuide) open();
    },
  };
}
