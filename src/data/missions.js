// The three Water World missions. Each one gives one badge.
export const MISSIONS = [
  { id: 'clear-the-flood', order: 1, title: 'Clear the Flood', blurb: 'Help water flow again!', level: 'Explorer', badge: 'manta', scene: 'clear-the-flood.jpg', animal: { name: 'Manta ray', img: 'bots/manta-front.png', fact: 'Wide fins push water, so it glides without sinking.' } },
  { id: 'inspect-the-bridge', order: 2, title: 'Inspect the Bridge', blurb: 'Check for blockages!', level: 'Inventor', badge: 'gecko', scene: 'inspect-the-bridge.jpg', animal: { name: 'Gecko', img: 'bots/gecko-front.png', fact: 'Tiny hairs on its toes help it stick to walls.' } },
  { id: 'deep-water-rescue', order: 3, title: 'Deep Water Rescue', blurb: 'Help an animal in trouble!', level: 'Expert', badge: 'octopus', scene: 'deep-water-rescue.jpg', animal: { name: 'Octopus', img: 'bots/octopus-front.png', fact: 'Soft arms can hold things gently and squeeze through tiny gaps.' } },
];
export const missionById = (id) => MISSIONS.find((m) => m.id === id);
