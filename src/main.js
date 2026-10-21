import './styles/base.css';
import './styles/screens.css';
import { route, setRenderer, start, go } from './router.js';
import { explorers, current } from './state.js';
import { welcome } from './screens/welcome.js';
import { who } from './screens/who.js';
import { newExplorer } from './screens/newExplorer.js';
import { deleteExplorerScreen } from './screens/deleteExplorer.js';
import { build } from './screens/build.js';
import { play } from './screens/play.js';
import { quiz } from './screens/quiz.js';
import { result } from './screens/result.js';
import { home } from './screens/home.js';
import { worlds } from './screens/worlds.js';
import { missions } from './screens/missions.js';
import { badges } from './screens/badges.js';
import { applySettings } from './ui/apply.js';
import { settingsScreen } from './screens/settings.js';


// Screens that need a chosen explorer.
const NEEDS_EXPLORER = (p) => ['/home', '/worlds', '/missions', '/badges', '/settings'].includes(p) || /^\/(build|play|quiz|result)\//.test(p);

function guard(path) {
  if (NEEDS_EXPLORER(path) && !current()) {
    const n = explorers().length;
    return n === 0 ? '/' : n === 1 ? '/home' : '/who';
  }
  return null;
}

const app = document.getElementById('app');
setRenderer((handler, params, path) => {
  const redirect = guard(path);
  if (redirect) return go(redirect);
  applySettings();
  const out = handler(params);
  app.innerHTML = out.html;
  const first = app.firstElementChild; if (first) first.classList.add('enter');
  app.scrollTop = 0;
  window.scrollTo(0, 0);
  if (out.mount) out.mount(app);
  document.title = (out.title ? out.title + ' · ' : '') + 'RoboRescue';
  const h = app.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); }
});

route('/', welcome);
route('/who', who);
route('/new', newExplorer);
route('/delete', deleteExplorerScreen);
route('/home', home);
route('/worlds', worlds);
route('/missions', missions);
route('/badges', badges);
route('/build/:id', build);
route('/play/:id', play);
route('/quiz/:id', quiz);
route('/result/:id', result);
route('/settings', settingsScreen);

import { unlockAudio, clickSounds } from './ui/sound.js';
unlockAudio();
clickSounds();
applySettings();
start();
