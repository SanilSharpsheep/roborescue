// story: one line shown at the top of the world's missions screen (add one when a world opens).
// open: false = the card shows but cannot be entered. Sky is deliberately locked until its missions and Wings part are built.
export const WORLDS = [
  { id: 'land', name: 'LAND', color: '#3f8a1e', art: 'land.jpg', open: false },
  { id: 'sky', name: 'SKY', color: '#1f6fd6', art: 'sky.jpg', open: false, comingSoon: true },
  { id: 'water', name: 'WATER', color: '#1a62b8', art: 'water.jpg', open: true, story: 'Floods hit Texas. Help the town with your Rescue Bot!' },
  { id: 'underground', name: 'UNDERGROUND', color: '#8a5a2b', art: 'underground.jpg', open: false },
  { id: 'wildzone', name: 'WILD ZONE', color: '#d98a0a', art: 'wildzone.jpg', open: false },
];
