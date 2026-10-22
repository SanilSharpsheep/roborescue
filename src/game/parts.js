// Movement parts are plain data: the builder maps over this list, so adding a part never needs new layout code.
//   id, name      – what the code and the card call it
//   img           – isolated equipment picture for the selection card (never a whole robot)
//   bot           – { img, socket } complete robot picture for the big preview; socket = [x%, y%] of its empty sensor socket
//   sprites       – optional { side, stuck } pictures used inside the mission simulation
// Which parts a mission offers is set by `moves: [...]` in that mission's file.
export const NEUTRAL_BOT = { img: 'bots/builder-bot-neutral.webp', socket: [50.6, 10.6] };
export const MOVES = [
  { id: 'treads', name: 'Treads', img: 'parts/treads.webp', bot: { img: 'bots/builder-bot-treads.webp', socket: [50.0, 7.3] } },
  { id: 'fins', name: 'Fins', img: 'parts/fins.webp', bot: { img: 'bots/builder-bot-fins.webp', socket: [52.4, 24.8] } },
  { id: 'legs', name: 'Spring legs', img: 'parts/legs.webp', bot: { img: 'bots/builder-bot-spring-legs.webp', socket: [49.2, 6.2] },
    sprites: { side: 'bots/frog-side.webp', stuck: 'bots/frog-stuck.webp' } },
  { id: 'worm', name: 'Worm body', img: 'parts/worm.webp', bot: { img: 'bots/builder-bot-worm-body.webp', socket: [50.1, 20.3] },
    sprites: { side: 'bots/worm-side.webp', stuck: 'bots/worm-stuck.webp' } },
  // Mission-specific parts:
  { id: 'gecko', name: 'Gecko feet', img: 'parts/gecko.webp', bot: { img: 'bots/builder-bot-gecko-feet.webp', socket: [50.7, 6.9] } },
  { id: 'octo', name: 'Soft arms', img: 'parts/octo.webp', bot: { img: 'bots/builder-bot-soft-arms.webp', socket: [51.4, 15.5] } },
  // Future Sky World part. Add it here and put 'wings' in a Sky mission's `moves` list when Sky opens:
  // { id: 'wings', name: 'Wings', img: 'parts/wings.webp', bot: { img: 'bots/builder-bot-wings.webp', socket: [50, 15] },
  //   sprites: { side: 'bots/dragonfly-side.webp', stuck: 'bots/dragonfly-stuck.webp' } },
];
// Gas is kept here for the Land and Underground worlds; no Water World mission offers it (see each mission's sensors list).
export const SENSORS = [
  { id: 'echo', name: 'Echo', img: 'parts/echo.webp', does: 'sound' },
  { id: 'heat', name: 'Heat', img: 'parts/heat.webp', does: 'warmth' },
  { id: 'water', name: 'Water', img: 'parts/water.webp', does: 'depth' },
  { id: 'gas', name: 'Gas', img: 'parts/gas.webp', does: 'smell' },
];
export const partById = (list, id) => list.find((p) => p.id === id);

// Derived for the simulation screen: { side, stuck } per part that has full art.
export const BOT_ART = Object.fromEntries(MOVES.filter((m) => m.sprites).map((m) => [m.id, m.sprites]));
