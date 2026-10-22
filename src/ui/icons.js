// Interface icons drawn like Lucide (ISC license): simple strokes.
const s = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
export const icon = {
  home: s('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
  globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
  pin: s('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  shield: s('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
  speakerOn: s('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
  speakerOff: s('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m17 9 5 6M22 9l-5 6"/>'),
  sun: s('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  back: s('<path d="M15 5l-7 7 7 7"/>'),
  plus: s('<path d="M12 5v14M5 12h14"/>', 'stroke-width="3"'),
  lock: s('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="3"'),
  leaf: '<svg viewBox="0 0 24 24" fill="#5EBC2E" aria-hidden="true"><path d="M20 4C10 4 4 9 4 16c0 1.6.5 3 1.3 4C6 13 11 9 17 8 12 11 9 15 8 20c1 .3 2 .5 3 .5C18 20.5 21 14 20 4z"/></svg>',
  leaves: '<svg class="leaf" viewBox="0 0 150 120" aria-hidden="true"><path d="M150 0v110c-30 6-60-8-70-40S100 6 150 0z" fill="#5EBC2E" opacity="0.55"/><path d="M150 0v70c-20 4-40-6-46-26S124 2 150 0z" fill="#3F9A1E" opacity="0.7"/></svg>',
};
