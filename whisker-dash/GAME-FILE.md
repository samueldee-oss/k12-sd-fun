# Whisker Dash: the game file

Everything is in one file, [`index.html`](index.html) (HTML, CSS and JavaScript; no build step, no libraries, no images).
The only outside resource is two Google Fonts (Press Start 2P and VT323); without internet it falls back to a monospace font.
This guide explains how the file is organized, how it changed over time, and how to check or rebuild it.

**Current file:** published as claude.ai artifact version 1794197392-7fa5 (publish #108) on 2026-11-08; 70 worlds, 341 levels.
Line numbers in the map below are from version 53 and have shifted; search for the names instead.
The artifact page and this repo copy contain the same game; the repo copy adds a small `<!doctype html>` wrapper around it.

## 1. How to recreate the exact game

1. **Exact copy:** `index.html` *is* the game. Copy it anywhere and open it in a browser. Nothing else is needed.
2. **Check it still works:** run the tests in [`tests/`](tests/README.md) (`node smoke.js`, `node mechanics.js`).
3. **Continue in a new session:** give Claude `index.html`, [`PLAN.md`](PLAN.md) and this file, and ask it to read `PLAN.md` first.
   Ask it to make changes with small find-and-replace patches (not by retyping the file), then run the tests.
4. **Rebuild from nothing (if the file were lost):** the plan, the world table and the mechanics list in `PLAN.md`, plus the
   architecture below, describe the game well enough to rebuild a close copy, but not a byte-identical one. Keep `index.html` safe in git.

## 2. Map of the file

| Lines (approx.) | Section | What is there |
|---|---|---|
| 1–120 | Page | `<style>` (layout, HUD, overlay screens, touch pad) and the HTML: HUD, canvas `#c` (480×288), overlay `#ov`, touch pad. |
| 121–220 | Level builder and world data | `build(segs)` turns segment codes into a 12-row tile grid. `WORLDS` (names), `WORDER` (play order), `LASTW` (final world), hand-built levels for worlds 1–4, `B1` and `PHYS` (physics and quirk flags per world), `HINT`. |
| 222–312 | Level generator | `genSegs(world, level, style)` makes levels from styles (walk, spikes, gaps, bridge, bounce, cave, movers, hazard, finale, climb, allmovers, rafts, vert, lobby), tuned to each world's jump reach. `NAMES` lists every level with its style and extra flags. |
| 313–369 | Tuning and story text | Overrides for some levels, `WSIZE`, `WARP` (world transition text), `PAGEBG`. |
| 370–547 | Upgrades and skins | `UPGRADES` (power and skin cards), `SKINS` (palettes; `spr` picks the animal sprite), `FISHCOL`, `DUST`. |
| 548–562 | Saving | `save` object in `localStorage` key `whiskerdash`; `persist()`, `runData()`. |
| 563–619 | Sprites | `SPR` pixel art (12×8 letters, two frames `a`/`b`), `sprite()` with a cache of pre-drawn pictures for speed. |
| 620–714 | Audio | Sound effects and `genTrack()` music generated per world (`TRACKS`). |
| 715–735 | Input | Keyboard maps for 1 and 2 players (`PK`). |
| 736–965 | Game state and physics | `loadLevel()`, `update()`, `stepCat()` (movement, jumping, ladders, swimming, foam, dancing), `collide()`, `solidRect()`, hazards, `hurt()` and `die()`, `win()`. |
| 966–1039 | Ambient particles | Rain, snow, leaves, motes, gulls (`AMB`). |
| 1040–1132 | Screens | Title, level clear (upgrade cards, skin and accessory pickers with previews), pause, level select, final screen. |
| 1133–1353 | Backgrounds | One `bgXxx()` per world, listed in `BG[]`; vertical-level backgrounds in `BGX`. Theme colors per world in `TH`. |
| 1354–1529 | Library, guards and story | Noise meter and chase (`lib`), lobby NPC lines `LINES` and questions `ASK`, talk system (`openTalk`, `updTalk`, `drawTalk`), Tower of London (lasers, fog machines, mouse chase, Queen Purrcilla), `decorateLevel()` (redwood trees and ladders, foam, taxis), lobby portal, snowball. |
| 1530–1820 | Worlds 24–28 and the lobby | Lab, PC, Digital World, Antarctica; lobby fair: Ferris wheel `WHEEL`, clock tower `TOWER`, rides `RIDES` and coaster, chicken party, pool and bounce house, food court and Ring Toss, fetch and hide-and-seek. |
| 1821–1992 | End-of-world scenes | `CUTS[world]` vehicles and transitions, `CUTSFX`, knighting overlay. |
| 1993–2083 | Tiles and animal layout | `drawTile()` and `drawThemed()`; `HEADS`, `EYES`, `NECK` say where each animal's head, eyes and neck are, so hats and glasses fit. |
| 2084–2229 | Accessories | `ACC` (id → icon, name, world), `SLOT` (hat, face, neck, held), `drawAcc()` for each accessory, wearing rules. |
| 2230–2271 | Display and start-up | Pixel-snapping renderer (`fitRes`, wrapped `fillRect`), touch pad, fullscreen, pause, old-save recovery, the main `loop()` (guarded so an error never freezes the game). |

## 3. Key conventions inside the code

- **Grid:** tiles are 24 px; levels are 12 rows (`ROWS`). Vertical levels use a taller grid in `LEVELS[i].vg`. The lobby adds 16 rows above (`LOFF`).
- **Tile letters:** `#` ground, `=` platform, `^` spikes, `v` ceiling spikes, `C` checkpoint, `F` fish/goal, `B` bounce pad, `J` bounce-house floor,
  `S` mover anchor, `d` drip pipe, `G` geyser, `A` gator, `k` cannon, `P` portal, `b` bell, `H` ladder, `O` foam, `X` cave ceiling.
- **A new world needs an entry in:** `WORLDS`, `WORDER`, `PHYS`, `HINT`, `NAMES`, `WARP`, `PAGEBG`, `FISHCOL`, `DUST`, `TRACKS`, `MOVK`, `AMB`, `TH`, `BG`, and optionally `CUTS`, `ACC`.
- **A new skin needs:** a `SKINS` entry (and a `SPR` sprite if it is a new animal, plus `HEADS`, `EYES`, `NECK`), an `UPGRADES` card or an unlock rule, and lobby `LINES`/`ASK`.
- **Drawing:** the game draws at 480×288 game pixels; `fitRes()` scales to the screen (capped at 3×) and every rectangle snaps to whole screen pixels.

## 4. How the file changed (iterations)

The game was published as one claude.ai artifact that was updated in place. Each publish is a version.
The rounds match the plan iterations in [`PLAN.md`](PLAN.md#7-plan-iterations).

| Versions | Date | Plan rounds | Size of change |
|---|---|---|---|
| 1–26 | 2026-10-23 to 10-24 | Rounds 1–15: first game through accessories and the fair | Grew from a 5-level game to 31 worlds. The per-version detail of these early versions was not recorded. |
| 27 | 2026-10-24 | 15 | Rideable Ferris wheel. |
| 28 | 2026-10-24 | 16 | Clock tower at the fair, puffin. |
| 29–30 | 2026-10-24 | 16–17 | Shades redrawn, rides, taller tower (29 was a backup publish before the session limit). |
| 31 | 2026-10-24 | 17 | Sun fix, 18 skins. |
| 32 | 2026-10-25 | 18 | Transition screen fix and countdown (also fixed gradient drawing everywhere). |
| 33 | 2026-10-25 | 18 | Goal changes with skin. |
| 34 | 2026-10-25 | 19 | Royal Mouser story and Tower of London (world 32). |
| 35–36 | 2026-10-25 | 20 | Answerable dialogue; puppy, chickens, sweater. |
| 37 | 2026-10-25 | 20 | Chicken party, fetch, hide-and-seek. |
| 38 | 2026-10-25 | 21 | Lag fix (sprite cache), bounce house and pool. |
| 39–40 | 2026-10-25 | 21 | Food stands and Ring Toss; parentheses lines acted out. |
| 41 | 2026-10-25 | 21 | Pool and bounce animals, same-breed greetings. |
| 42–43 | 2026-10-25 | 21 | Snowball quest; umbrella accessory. |
| 44 | 2026-10-25 | 22 | Lobby portal, accessory slots. |
| 45–47 | 2026-10-25 | 22 | Dance, guards gated, rafts `noAir`, Castle Guard lines. |
| 48 | 2026-10-25 | 23 | Laser Corridor, 2-damage lasers, knighting. |
| 49 | 2026-10-25 | 24 | 17 new worlds (33–49), ladders, foam, taxis, darkness, deer, Icelandic sheep, skin previews, accessory catch-up, error guard. |
| 50 | 2026-10-25 | 25 | Save fix: replaying a level from level select no longer moves "Continue run" back to that level; Continue always resumes at the run's furthest level (this also repairs saves already affected). |
| 51 | 2026-10-25 | 25 | "Restore best run" button on the title screen: rebuilds a run at the furthest level ever beaten (from `save.beaten`), for when a run was replaced by a new one. |
| 52 | 2026-10-25 | 25 | Restore now opens a picker: animals earned by playing come back automatically, and you choose your powers (up to 10) and skins. Runs restored by version 51 get the button once more. |
| 53 | 2026-10-25 | 25 | "Continue + pick powers & skins" on the title screen and "Pick powers & skins" in the pause menu, once per run, for any saved run that never picked (new runs count as picked). |
| 54–100 | 2026-10-26 to 11-02 | 26 | Made in other Claude sessions: worlds 50–61, save slots (`whiskerdash`, `whiskerdash2`…5, chosen slot in `whiskerdash_slot`), secret skins/accessories per world (`sx`, `sxc`, `sxs`, `sxd`, `sxp` + `sa`), Tiny Mode, Hand-Drawn mode, Lucky Cat, owner restore (`OWNER_RESTORE`). Per-version detail not recorded here. |
| 101 | 2026-11-04 | 28 | Secret lobby in Lobby 2 (`buildSRoom`, `srCam`, `updSRoom`, `drawSRoom`, fake-wall tile `W`); Rat King → Bubble Bath. Checked: all 296 levels load with no errors; the room was walked into, skins collected and saved. |
| 102 | 2026-11-05 | – | Another session: Lore Book (📖 button, `LORE`, `save.lore`). |
| 103 | 2026-11-06 | 29 | VIP secret lobby (no skin unlocks); Lobby 2 floor +40 tiles (gelato/ball-pit fix). All levels load with no errors. |
| 105 | 2026-11-07 | 30 | `fitFull()`: in full-screen mode the stage width is computed from the real visible height (minus HUD, safe areas) so the whole game fits a landscape phone; choice saved in `whiskerdash_full`. |
| 106–108 | 2026-11-08 | 31 | Other session: worlds 62–70. Then: `luggage`, `wagon`, `minecart` mover sprites (`MOVK` 27, 61, 62, 63); secret cats moved into the secret lobby with unique lines (`SRL`, `SR_LW` sizes the lounge); repo phone fixes merged in. Tests: smoke (341 levels, 0 errors) and mechanics all OK. |

## 5. How it was tested

Every change was checked by Node scripts that load the game without a browser and drive the cat with a "bot",
and by Playwright screenshots in a real Chromium. The reusable versions are in [`tests/`](tests/README.md). At version 49:
all 240 levels load with no errors, a random-input bot plays every level in a real browser with no errors, and all
15 mechanic checks pass.

## 5b. Making the class (release) copy and the Home Screen app

1. Start from the published (development) file and change `const OWNER_RESTORE=1;` to `const OWNER_RESTORE=0;`.
2. `python whisker-dash/release/build_release.py <that file> whisker-dash/WhiskerDash.html` swaps the Google Fonts link for the two fonts embedded in the file (SIL OFL, in `release/fonts/`) and checks no outside links remain. Copy the result to `whisker-dash/site/index.html` too.
3. `whisker-dash/index.html` (what GitHub Pages and the Home Screen app open) is `WhiskerDash.html` plus the `<!-- home-screen-app -->` … `<!-- /home-screen-app -->` block (manifest, icons, service worker) made by `tools/make_home_screen_apps.py`. Re-run that tool, or carry the block over by hand right after the first `</style>`.
4. Send `WhiskerDash.html` to the designer for the class.

## 6. Known limits

- Saves live in one browser only (`localStorage`); clearing site data loses progress.
- The two Google Fonts need internet (the release copy has none); without them the text uses a fallback font.
- Replaying levels from level select does not change the story run's position (fixed in version 50).
- Old saves keep level numbers, so adding levels in the middle shifts where an old run resumes (noted when world 32 was added).
