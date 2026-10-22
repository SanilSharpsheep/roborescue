// Saved progress. Everything stays in this browser (localStorage). No accounts, no network.
import { MISSIONS } from './data/missions.js';

const KEY = 'roborescue-save-v1';
const DEFAULTS = () => ({
  v: 1,
  current: null,
  explorers: [],
  settings: { sound: true, music: true, readAloud: true, textSize: 'm', reduceMotion: false, research: false },
  researchLog: [],
});

let memory = null; // used if localStorage is blocked
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS();
    const data = JSON.parse(raw);
    const st = { ...DEFAULTS().settings, ...(data.settings || {}) };
    if (!st.musicTouched) st.music = true; // music was never switched by the player, so use the new default (on)
    return { ...DEFAULTS(), ...data, settings: st };
  } catch {
    return memory || DEFAULTS();
  }
}
function save() {
  memory = state;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: keep in memory */ }
}
const uid = () => Math.random().toString(36).slice(2, 10);

export const getState = () => state;
export const settings = () => state.settings;
export function markGuideSeen(id) { const e = explorerById(id); if (e) { e.seenGuide = true; save(); } }
export function setSetting(key, value) { state.settings[key] = value; if (key === 'music') state.settings.musicTouched = true; save(); }

export const explorers = () => state.explorers;
export const current = () => state.explorers.find((e) => e.id === state.current) || null;
export const explorerById = (id) => state.explorers.find((e) => e.id === id) || null;

export function addExplorer(name, avatar) {
  const e = { id: uid(), name: name.trim().slice(0, 12), avatar, created: Date.now(), progress: {}, badges: [], builds: {} };
  state.explorers.push(e);
  state.current = e.id;
  save();
  return e;
}
export function selectExplorer(id) { if (explorerById(id)) { state.current = id; save(); } }
export function deleteExplorer(id) {
  state.explorers = state.explorers.filter((e) => e.id !== id);
  if (state.current === id) state.current = null;
  save();
}
export function clearAllExplorers() { state.explorers = []; state.current = null; save(); }
export function resetProgress(id) {
  const e = explorerById(id);
  if (e) { e.progress = {}; e.badges = []; save(); }
}

// ----- progress helpers -----
export const totalStars = (e) => Object.values(e.progress).reduce((n, p) => n + (p.stars || 0), 0);
export const levelOf = (e) => 1 + Math.floor(totalStars(e) / 10);
export const starsToNext = (e) => 10 - (totalStars(e) % 10);
export const isDone = (e, id) => !!(e.progress[id] && e.progress[id].done);
export function missionState(e, m) {
  if (isDone(e, m.id)) return 'done';
  const prev = MISSIONS.find((x) => x.order === m.order - 1);
  return !prev || isDone(e, prev.id) ? 'open' : 'locked';
}
export const nextMission = (e) => MISSIONS.find((m) => !isDone(e, m.id)) || null;
export function recordResult(e, missionId, result) {
  const old = e.progress[missionId] || { stars: 0 };
  e.progress[missionId] = { ...old, ...result, done: true, stars: Math.max(old.stars || 0, result.stars) };
  const m = MISSIONS.find((x) => x.id === missionId);
  if (m && !e.badges.includes(m.badge)) e.badges.push(m.badge);
  save();
}

export function saveBuild(e, missionId, build) { (e.builds ||= {})[missionId] = { ...build }; save(); }
export const savedBuild = (e, missionId) => (e.builds || {})[missionId] || null;
