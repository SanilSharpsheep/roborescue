# RoboRescue

A browser game for kids ages 6 to 12 where players (Rescuers) build one friendly Rescue Bot, give it animal-inspired parts (biomimicry), and use it on Texas flood missions. Built for the Congressional App Challenge.

Works on iPad, Chromebook, laptop and phone. Water World has 3 missions (Level 1 Clear the Flood, Level 2 Inspect the Bridge, Level 3 Deep Water Rescue); other worlds are coming soon.

## Play
Pick a Rescuer, then build the Rescue Bot in three steps: **Move** (animal-inspired part), **Sense** (Echo, Heat or Water) and **Think** (IF/THEN rules). Test it on the mission, take a short quiz, and earn an animal badge.

## Run it
```
npm install
npm run dev
```
Build for the web with `npm run build` (output in `dist/`). `npm run preview` serves the build locally.

## Publish (GitHub Pages)
A workflow in `.github/workflows/pages.yml` builds and publishes on every push to `main`. In the repository, open Settings → Pages and set Source to **GitHub Actions** once.

## How it works
Vite + plain JavaScript modules. Canvas 2D draws each mission's test run, Web Audio makes the sound effects and soft background music (no audio files), and the browser reads text aloud. Progress is saved in the browser (localStorage). No accounts, no data collected, no outside services: fonts are bundled and pictures are WebP.

```
src/screens   one file per screen (welcome, who, home, missions, build, play, quiz, result, badges, settings)
src/game      one file per mission (rules, scoring, drawing) plus parts and sensors
src/data      missions, worlds, badges, help text
src/ui        top bar, profile menu, dialogs, sound, music, read aloud
src/styles    tokens, base and screen CSS
public/art    pictures (WebP, plus JPG scenes)
docs          kid test script
```

To add a mission or world, see the RoboRescue Builder Guide.

## Credits and AI disclosure
See [CREDITS.md](CREDITS.md).
