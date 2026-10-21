// Movement parts are plain data: the builder maps over this list, so adding a part never needs new layout code.
//   id, name      – what the code and the card call it
//   img           – isolated equipment picture for the selection card (never a whole robot)
//   bot           – { img, socket } complete robot picture for the big preview; socket = [x%, y%] of its empty sensor socket
//   sprites       – optional { side, stuck } pictures used inside the mission simulation
// Which parts a mission offers is set by `moves: [...]` in that mission's file.
export const NEUTRAL_BOT = { img: 'bots/builder-bot-neutral.png', socket: [50.6, 10.6] };
export const MOVES = [
  { id: 'treads', name: 'Treads', img: 'parts/treads.png', bot: { img: 'bots/builder-bot-treads.png', socket: [50.0, 7.3] } },
  { id: 'fins', name: 'Fins', img: 'parts/fins.png', bot: { img: 'bots/builder-bot-fins.png', socket: [52.4, 24.8] } },
  { id: 'legs', name: 'Spring legs', img: 'parts/legs.png', bot: { img: 'bots/builder-bot-spring-legs.png', socket: [49.2, 6.2] },
    sprites: { side: 'bots/frog-side.png', stuck: 'bots/frog-stuck.png' } },
  { id: 'worm', name: 'Worm body', img: 'parts/worm.png', bot: { img: 'bots/builder-bot-worm-body.png', socket: [50.1, 20.3] },
    sprites: { side: 'bots/worm-side.png', stuck: 'bots/worm-stuck.png' } },
  // Mission-specific parts:
  { id: 'gecko', name: 'Gecko feet', img: 'parts/gecko.png', bot: { img: 'bots/builder-bot-gecko-feet.png', socket: [50.7, 6.9] } },
  { id: 'octo', name: 'Soft arms', img: 'parts/octo.png', bot: { img: 'bots/builder-bot-soft-arms.png', socket: [51.4, 15.5] } },
  // Future Sky World part. Add it here and put 'wings' in a Sky mission's `moves` list when Sky opens:
  // { id: 'wings', name: 'Wings', img: 'parts/wings.png', bot: { img: 'bots/builder-bot-wings.png', socket: [50, 15] },
  //   sprites: { side: 'bots/dragonfly-side.png', stuck: 'bots/dragonfly-stuck.png' } },
];
// Gas is kept here for the Land and Underground worlds; no Water World mission offers it (see each mission's sensors list).
export const SENSORS = [
  { id: 'echo', name: 'Echo', img: 'parts/echo.png', does: 'sound' },
  { id: 'heat', name: 'Heat', img: 'parts/heat.png', does: 'warmth' },
  { id: 'water', name: 'Water', img: 'parts/water.png', does: 'depth' },
  { id: 'gas', name: 'Gas', img: 'parts/gas.png', does: 'smell' },
];
export const partById = (list, id) => list.find((p) => p.id === id);

// Derived for the simulation screen: { side, stuck } per part that has full art.
export const BOT_ART = Object.fromEntries(MOVES.filter((m) => m.sprites).map((m) => [m.id, m.sprites]));
