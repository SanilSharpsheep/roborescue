// The one header used on every screen after login:  [Back]  Title ........ [mute] [profile]
import { icon } from './icons.js';
import { esc } from './util.js';
import { muteHtml } from './mute.js';
import { profileHtml } from './profile.js';

export function topbar({ back = '', backLabel = 'Back', title, sub = '', actions = '', profile = true, h1 = true }) {
  const t = h1 ? `<h1>${esc(title)}</h1>` : `<p class="tbtitle">${esc(title)}</p>`;
  return `<header class="pagehead topbar">${back ? `<a class="roundbtn" href="${back}" aria-label="${esc(backLabel)}">${icon.back}</a>` : ''}
    <div class="tbmain">${t}${sub}</div>
    <div class="tbright">${actions}${muteHtml()}${profile ? profileHtml() : ''}</div></header>`;
}
