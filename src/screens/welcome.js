import { icon } from '../ui/icons.js';
import { art } from '../ui/util.js';
import { explorers, current } from '../state.js';
import { go } from '../router.js';

export function welcome() {
  return {
    title: 'Welcome',
    html: `<div class="screen welcome" style="background-image:url('${art('ui/cover.jpg')}')">
      <div class="welcome-shade"></div>
      <div class="welcome-in">
        <h1 class="logo">Robo<span>Rescue</span></h1>
        <p class="tag">Join the rescue team! Build a Rescue Bot to help Texas.</p>
        <button class="btn huge" id="play">${icon.play}PLAY</button>
      </div></div>`,
    mount(root) {
      root.querySelector('#play').onclick = () => {
        const list = explorers();
        if (!list.length) go('/new');
        else if (current()) go('/home'); // still logged in on this device
        else go('/who');
      };
    },
  };
}
