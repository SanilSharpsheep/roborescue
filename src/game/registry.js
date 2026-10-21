import { clearTheFlood } from './clearTheFlood.js';
import { inspectTheBridge } from './inspectTheBridge.js';
import { deepWaterRescue } from './deepWaterRescue.js';
import { QUIZZES } from './quizzes.js';
const DEFS = { [clearTheFlood.id]: clearTheFlood, [inspectTheBridge.id]: inspectTheBridge, [deepWaterRescue.id]: deepWaterRescue };
export const defOf = (id) => DEFS[id] || null;
export const quizOf = (id) => QUIZZES[id] || null;
