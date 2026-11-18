# Status

_Kept by Claude Code. Last updated 2026-11-16._

## Games

| Game | Where | State | Plays on iPad? |
|---|---|---|---|
| Bank Game, Current | `bank_game.py`; browser version `bank-game/index.html` (dashboard uses this) | Works. Browser version is a JavaScript port with the same money model; plays on GitHub Pages with no PC server. | Save, Sell and Pause/Shops buttons on screen; tap anywhere to work, tap a garage slot to pick it (simulated touch tested; not yet tried on a real iPad). |
| Bank Game, Copy 3 to Copy 5 | `bank_game copy 3.py` to `copy 5.py` | Work. Earlier iterations kept for comparison. | Keyboard needed. |
| Bank Game, Copy and Copy 2 | `bank_game copy.py`, `bank_game copy 2.py` | Work. **Identical code**; one could be dropped from the dashboard. | Keyboard needed. |
| Bank Game assessment | `bank_game_assessment.py` | Not reviewed yet. | Not checked. |
| Pong (Level 1 warm-up) | `pong/` | Works. Touch: drag to move, tap to serve; in 2-player mode each half of the court moves its own paddle. | Yes (simulated touch tested; not yet tried on a real iPad). |
| Whisker Dash | `whisker-dash/` | Works. 70 worlds, 341 levels, 1–2 players, a secret and a hint animal in every world, Home Screen app (cat-face icon) with a full-screen fit for phones. Plan in `whisker-dash/PLAN.md`; automated tests in `whisker-dash/tests/` all pass (2026-11-09). | Touch pad included (not yet tried on a real iPad). |
| Rulebound | `rulebound/` | Works. Word-rule puzzle game (Baba Is You-style): 90 levels in 3 worlds plus a Sandbox, 4 heroes, every level checked solvable by a solver. Built on claude.ai and added as-is. | Touch: tap a square to walk there, swipe, or on-screen pad (simulated touch tested; not yet tried on a real iPad). |
| Poirot the Pigeon | `poirot-pigeon/` | Works. 3D whodunit: 3 themed crime scenes (manor, Orient Express, Nile steamer), room pictures searched with magnifying glasses, Poirot-book tricks, easy/hard, 1–2 players. Every case checked solvable by script. Spec in `docs/games/poirot-pigeon.md`. | Touch joysticks and drag-to-inspect included (not yet tried on a real iPad). Needs WebGL. |
| Banana Slug Arena | `banana-slug-arena/` | Works. Brotato-style arena: Banana Slug, Frog or Pigeon vs bugs and swamp critters, 20 waves with hordes and 3 bosses, 46 characters, 24 weapons, pets, hats, Danger 0–5, Endless, achievements, run saves. Built on claude.ai and added as-is. Spec in `docs/games/banana-slug-arena.md`. | Touch joystick included (simulated runs tested; not yet tried on a real iPad). |
| Ships & Villagers | `ships-and-villagers/` | Works. World 1 of a storybook village sim (Stardew-style): castle village, 4 playable villagers, 5 village jobs, one star each. Built on claude.ai and added as-is. Spec in `docs/games/ships-and-villagers.md`. | Tap to walk and a "Do it" button (simulated runs tested; not yet tried on a real iPad). |
| Tiny Realms | `tiny-realms/` | Works. Polytopia-style tribe strategy, 15 tribes, pass-and-play. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Bounce Pit: Skyward | `bounce-pit/` | Works. Ball x Pit-style ball roguelite with town building. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Blade Mosaic | `blade-mosaic/` | Works. Spinning-blade 3D block demolition, 51 mosaics plus Zen Tower. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Mochi's Star Quest | `mochi-star-quest/` | Works. Story reading-fluency game; repo copy starts with an empty save. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Slice Flip 3D | `slice-flip-3d/` | Works. 3D knife-flipping (Slice Master-style). Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Only Up: Blip's Climb Home | `blips-climb/` | Works. 3D Only Up-style climb with Blip the alien. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Dropper 3D | `dropper-3d/` | Works. 3D falling game: steer a ball down shafts. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Ionuț's Climb: Through Romania | `ionuts-climb/` | Works. 3D parkour across nine Romanian sites. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Spark Burst | `spark-burst/` | Works. Satisfying chain-reaction orb popper. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Supernova Run | `supernova-run/` | Works. 3D track runner close to the Poki original. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Underglow: A Fungal Network Game | `underglow/` | Works. Mycelarium-style fungal network idle game. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Pal Island 3D | `pal-island/` | Works. Tomodachi Life-style island life sim. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Hypernova 3D | `hypernova-3d/` | Works. Operius-style 3D tunnel flight, 7 trials. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Wanderleaf | `wanderleaf/` | Works. Hand-drawn silkie chicken platformer. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Chameleon Hide & Seek | `chameleon-hide-seek/` | Works. Hide by copying colors; map with levels. Built on claude.ai and added as-is (3D games use a local copy of three.js so they play offline). | Not yet tried on a real iPad. |
| Snake (side project) | `experiments/snake-blender-mode/` | Works. Fixed 2026-10-20: body was invisible and the game "auto-ended" around 60-70 points. Swipe to steer. | Yes (simulated touch tested; not yet tried on a real iPad). |

A comparison of the Bank Game versions (features, fun, systems lessons) is in `to-desktop/2026-10-21-1600-bank-game-version-comparison.md`.

## Running the games

- `tools/serve_dashboard.ps1` serves the repo at `http://localhost:8000/dashboard/`, and on the home network at `http://192.168.1.25:8000/` (the PC's address can change).
- It runs `tools/serve_dashboard.py`, which forwards the Pygame web runtime requests (`/cdn/...`) to the Pygbag CDN. Without that, the Bank Game builds never finish loading.
- The web builds (`dashboard/web_builds/`, `web_sources/*/build/`) are not in Git; rebuild with `tools/build_web_games.ps1`.

## Known issues and limits

- Bank Game: the browser version (`bank-game/`) is a separate copy of `bank_game.py`'s logic. A change to one must be made to the other too. The older Bank Game copies still need the PC server.
- Publishing on GitHub Pages would need the builds to load the runtime straight from the CDN (the same `/cdn/` problem), and the builds would need to stop being ignored by Git.
- Dashboard "Save for airplane" (offline) tested in desktop Chrome with the network switched off; not yet tried on a real iPad. Google Fonts could not be reached from the test machine, so offline font saving is untested (games fall back to a plain font if it fails).
- Home Screen apps: all 15 browser games and the dashboard have picture icons, manifests and offline support (2026-11-06). Not yet tried on a real iPad, and they only install from the GitHub Pages address, which this session could not check is live.
- Poirot the Pigeon uses a copied three.js file (`poirot-pigeon/three.min.js`, ~600 KB), unlike the other single-file games; it needs WebGL.
- Pip the Watchman song is not in the repo (it seems to live in a separate `come-follow-me-games` project on the PC). Neither can be made a Home Screen app until its files are added.

## Recent changes

- 2026-11-17: Bank Game converted from Pygame to a browser page (`bank-game/index.html`) so it plays on GitHub Pages and iPads (it showed 404 online before). Same model; adds Save/Sell/Pause touch buttons and a "Garage full" win message. Dashboard "Current" now opens it; older copies marked "PC only". `bank_game.py` unchanged. Commit `8f032b7`.
- 2026-11-17: Miriam's Sky Day: Miriam's eyes are blue now (the eye pixel in her sprite). Same change as the claude.ai link. Commit `ea9cfbf`.
- 2026-11-17: Dashboard GIFs for 10 of the new games sped up (some held each picture 2–12 seconds, so they looked like still pictures); dashboard now asks for fresh GIFs (`?v=3`). Miriam's Sky Day is in `miriams-sky-day/` with a Home Screen icon but stays off the dashboard; the scripture game also stays off the dashboard (owner's choice).
- 2026-11-16: Added 15 more of John's claude.ai games to the repo, dashboard, Home Screen tool, README and offline list: Tiny Realms, Bounce Pit: Skyward, Blade Mosaic, Mochi's Star Quest (empty save in the repo copy), Slice Flip 3D, Only Up: Blip's Climb Home, Dropper 3D, Ionuț's Climb, Spark Burst, Supernova Run, Underglow, Pal Island 3D, Hypernova 3D, Wanderleaf, Chameleon Hide & Seek. Each has a recorded first-level icon. Left out on purpose: Miriam's Sky Day and the two Puffling games (personal gift), and the scripture games (not asked about yet). Commit `3e405f7`.
- 2026-11-16: Mothwick's Lantern icon now shows the mercy route (MERCY → Spare → "You spared MOTHWICK" → YOU WON) instead of FIGHT. Commit `881553e`.
- 2026-11-16: Dashboard and Home Screen icons are now recordings of each game's real first level (`tools/capture_icons.py`); Whisker Dash and Endless Crucible keep their drawn GIFs (owner's choice), Bank Game stays drawn. Poirot's icon is the real Grand Hall search with John's pigeon from Banana Slug Arena. Dashboard shows each game's full name (Snake is "Blender Mode Snake"); Home Screen names are full names too. Ships & Villagers' Home Screen icon is now its gameplay still (the starry-sky art is still in `tools/`). Commit `4efee58`.
- 2026-11-15: Dashboard redesigned as a phone-style grid of animated picture icons (one per game, drawn by `tools/game_icons.py`); the same pictures are now every game's Home Screen icon. Notes and Copy link moved to the ⓘ button; Bank Game versions are one icon with a version menu; Snake and Rulebound added to the dashboard/Home Screen tool. New "⬇ Save for airplane" button saves every game for offline play (root `sw.js`, `dashboard/offline-files.json`); game service workers now keep Google Fonts offline. Commit `3adc92b`.
- 2026-11-15: Ships & Villagers sheep pen: the gate won't close while you're inside (Greta tells you to step out), and after the job it opens and closes with E so you can't get trapped; the sheep stay in. Commit `c4dc2c0`.
- 2026-11-15: Ships & Villagers walking easier on phones: a quick tap walks only a few steps (about 64 px), holding a finger keeps walking toward it, and letting go (or releasing a key) stops within a step thanks to gentle easing. Commit `34500be`.
- 2026-11-15: Home Screen tool now adds a version tag (`?v=`) to icon links so iPads fetch a changed icon instead of a cached one; applied to Ships & Villagers only (other games pick it up next time the tool is run on the PC). Commit `ddb7a9d`.
- 2026-11-15: Ships & Villagers: John Taylor's pincushion moved down to sit on his shoulder. Commit `a19c3c0`.
- 2026-11-15: Ships & Villagers: John Taylor's pincushion made eye-sized with thin pins (game and Home Screen icon). Commit `f4f297e`.
- 2026-11-15: Ships & Villagers: Home Screen icon is now Joseph and John Taylor on a starry sky (art drawn with the game's own code, `tools/ships_and_villagers_icon.py`); short-hair tuft tidied so it no longer looks like an eye patch. Commit `5ae9917`.
- 2026-11-15: New game Ships & Villagers (World 1) added (folder, dashboard card, README link, Home Screen icon, archive spec), commit `b64fcb4`, on `main`. Same file as the claude.ai artifact.
- 2026-11-13: New game Banana Slug Arena added (folder, dashboard card, README link, Home Screen icon, archive spec), commit `f34ed1a`, on `main`. Same file as the claude.ai artifact.
- 2026-11-12: Rulebound added (`rulebound/`): word-rule puzzle game, 90 levels in 3 worlds plus a Sandbox, listed on the dashboard and in the README. Commit `a550bcf`.
- 2026-11-12: New game Poirot the Pigeon added (folder, dashboard card, README link, Home Screen icon, archive spec), commit `8f54c2b`, on `main`. Same as the claude.ai artifact except three.js loads from the folder instead of a CDN.
- 2026-11-09: Whisker Dash: on touch screens (1 player), tapping the right 30% of the screen jumps (hold for higher), commit `4aa590e`. Repo copy only.
- 2026-11-09: Whisker Dash: a secret family and a hint animal in every world (ask it and it tells you exactly where), worlds 62–70 moved after Hotel Lobby 2, VIP Lounge renamed Secret Lounge, cat-face Home Screen icon; the wide view and auto-run from `c4f45c6` are now in the claude.ai page too (artifact publish #110). Commit `0e90ce5`.
- 2026-11-09: Whisker Dash: full screen and the Home Screen app widen the view to the screen (climbing levels stay 480), new AUTO run button (hold down/tiptoe to stop), NOISE/WIND/GRAV meters moved to the top-right clear of touch buttons (commit `c4f45c6`). All tests pass, plus a wide-view sweep of all 296 levels. Repo copy only; not yet in the claude.ai artifact.
- 2026-11-08: Whisker Dash: luggage carts, hay wagon and mine cart sprites replace wrong shopping carts; secret cats moved into the secret lobby, each with its own lines; game updated to 70 worlds (918339f).
- 2026-11-08: Whisker Dash on phones: no text highlight on press-and-hold, menus fit upright phones (Resume visible), full-screen menus keep EXIT/music/sound reachable, pinch zoom off (commits `0cd0f46`, `37b551b`). Node test harness updated for the new version. These fixes are in the repo copy only, not yet in the claude.ai artifact.
- 2026-11-07: Whisker Dash updated to the latest claude.ai version (61 worlds, VIP lobby, Lore Book) and the ⛶ FULL button now fits a landscape phone screen.
- 2026-11-07: The sky game is a personal gift, not a K12 game: removed from the dashboard, README, game archive notes and Home Screen tool. The family plays it from a private, unlisted link.
- 2026-11-07: History of `main`, `claude/home-screen-apps-bn7ohx` and `claude/spinning-blade-game-yo9uzv` rewritten to take a real person's name out of every past version (owner's request). Old clones, including the PC copy, must be re-downloaded or reset before pushing.
- 2026-11-06: Browser games and dashboard made installable as iPad Home Screen apps; generator in `tools/make_home_screen_apps.py` (commit `4378585`).
- 2026-10-25: Whisker Dash expanded to 49 worlds (built with Claude on claude.ai); plan, file guide, tests and provenance transcript added. Not yet committed.
- 2026-10-21: Set up this studio folder for Claude Desktop and Claude Code to work together.
- 2026-10-21: Dashboard server fixed so all six Bank Game builds load (commit `871008a`).
- 2026-10-20: Snake fixed; touch controls added to Snake and Pong (commit `871008a`).
- 2026-10-20: Repo published to https://github.com/samueldee-oss/k12-sd-fun (commit `00a2676`).
