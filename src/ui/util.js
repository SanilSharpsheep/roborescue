export const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const art = (p) => `${import.meta.env.BASE_URL}art/${p}`;
export const emoji = (name, size = '1.5em') => `<img class="emo" src="${art('emoji/' + name + '.svg')}" alt="" width="24" height="24" style="width:${size};height:${size}">`;
export const avatarFace = (n) => art(`avatars/face-${n}.jpg`);
