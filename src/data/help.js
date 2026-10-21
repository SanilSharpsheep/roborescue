// All wording for the "Help me choose" panel lives here, so it can be edited without touching the screen code.
// Plain language for ages 8-11. Keys are the part ids used in src/game/parts.js.

export const MOVE_HELP = [
  { id: 'treads', name: 'Treads', description: 'Rolls across rough ground and pushes heavy debris.', bestFor: 'Mud, rocks and broken paths.' },
  { id: 'fins', name: 'Fins', description: 'Helps your bot swim and steer through water.', bestFor: 'Floods, rivers and underwater missions.' },
  { id: 'legs', name: 'Spring Legs', description: 'Jumps over gaps, obstacles and sticky ground.', bestFor: 'Broken bridges, debris and deep mud.' },
  { id: 'worm', name: 'Worm Body', description: 'Crawls through narrow tunnels and tight spaces.', bestFor: 'Underground passages and small openings.' },
  { id: 'gecko', name: 'Gecko Grip Feet', description: 'Grips slippery surfaces and climbs steep walls.', bestFor: 'Cliffs, wet rocks, cave walls and trees.' },
  { id: 'octo', name: 'Soft Arms', description: 'Bends and holds things gently, like an octopus.', bestFor: 'Rescuing animals and fragile things.' },
];

export const SENSE_HELP = [
  { id: 'echo', name: 'Echo', description: 'Uses sound to find objects you cannot see.', bestFor: 'Dark caves, murky water and hidden obstacles.' },
  { id: 'heat', name: 'Heat', description: 'Finds fires, hot objects and warm animals.', bestFor: 'Fire, hot machinery and animal rescue.' },
  { id: 'water', name: 'Water', description: 'Detects water, leaks, depth and strong flow.', bestFor: 'Floods, broken pipes and rising water.' },
  { id: 'gas', name: 'Gas', description: 'Detects smoke, pollution and unsafe gases.', bestFor: 'Gas leaks, smoke and polluted areas.' },
];

// Think actions. Anything not listed here falls back to the short note written on the card itself.
export const THINK_HELP = {
  push: 'Fast, but a strong push can be risky.',
  nudge: 'Slower, but safer around animals and fragile objects.',
};

// Clues for the Move step, from a gentle nudge to a strong hint. The last one may name the part.
export const MOVE_CLUES = {
  'clear-the-flood': [
    'Think about how your bot will move through deep, rushing water.',
    'Which movement part helps a robot swim and steer?',
    'Fins may be a good choice for this mission.',
  ],
  'inspect-the-bridge': [
    'Think about how your bot can get close to cracks on a wet, slippery bridge.',
    'Which animal can stick to walls and climb?',
    'Gecko Grip Feet may be a good choice for this mission.',
  ],
  'deep-water-rescue': [
    'Think about how your bot can free a trapped turtle without hurting it.',
    'Which sea animal has soft, bendy arms that hold things gently?',
    'Soft Arms may be a good choice for this mission.',
  ],
};

// One short sentence under the bot picture after a pick.
export const EXPLAIN = {
  treads: 'Treads are great for rough ground and heavy debris.',
  fins: 'Fins are great for swimming and steering.',
  legs: 'Spring Legs are great for jumping over obstacles.',
  worm: 'Worm Body is great for crawling through tight spaces.',
  gecko: 'Gecko Grip Feet are great for climbing slippery surfaces.',
  octo: 'Soft Arms are great for holding things gently.',
  echo: 'Echo uses sound to locate hidden objects.',
  heat: 'Heat finds fires, hot objects and warm animals.',
  water: 'Water detects floods, leaks and water depth.',
  gas: 'Gas detects smoke, pollution and unsafe air.',
};

export const HELP_TEXT = {
  button: '? Help me choose',
  title: { 1: 'Choosing how your bot moves', 2: 'Choosing a sensor', 3: 'Choosing what your bot does' },
  anotherClue: 'Show another clue',
  intro: 'Not sure which part to choose? Try Help me choose!',
  bestFor: 'Best for:',
};
