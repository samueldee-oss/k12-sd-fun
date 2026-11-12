# Status

_Kept by Claude Code. Last updated 2026-11-07._

## Games

| Game | Where | State | Plays on iPad? |
|---|---|---|---|
| Bank Game, Current | `bank_game.py` (web build: dashboard) | Works. Clickable buttons in the pause screen (bank, dealership, upgrade). | Loads. Shop buttons should work by tap; S (save), P (pause) and V (sell) need a keyboard. Not tested on a real iPad. |
| Bank Game, Copy 3 to Copy 5 | `bank_game copy 3.py` to `copy 5.py` | Work. Earlier iterations kept for comparison. | Keyboard needed. |
| Bank Game, Copy and Copy 2 | `bank_game copy.py`, `bank_game copy 2.py` | Work. **Identical code**; one could be dropped from the dashboard. | Keyboard needed. |
| Bank Game assessment | `bank_game_assessment.py` | Not reviewed yet. | Not checked. |
| Pong (Level 1 warm-up) | `pong/` | Works. Touch: drag to move, tap to serve; in 2-player mode each half of the court moves its own paddle. | Yes (simulated touch tested; not yet tried on a real iPad). |
| Whisker Dash | `whisker-dash/` | Works. 49 worlds, 240 levels, 1–2 players. Plan in `whisker-dash/PLAN.md`; automated tests in `whisker-dash/tests/` all pass (2026-10-25). | Touch pad included (not yet tried on a real iPad). |
| Blade Mosaic | `blade-mosaic/` | New 2026-11-07. You are a spinning blade grinding 51 block mosaics (heart, Eiffel Tower, castle, food, animals, landmarks, space, treasure); 8-blade shop; heat meter as a balancing loop; physics (cut-loose pieces fall and crack on landing, blade has momentum); 3D view (three.js) with a 3D/2D button, falls back to 2D offline; Zen Tower endless relaxing mode; soft ASMR-style generated sound, a falling whoosh, and lo-fi music on every screen with Sound/Music switches (M mutes). Balance tuned with a bot, not yet with students. | Yes: drag anywhere moves the blade (simulated touch tested; not yet tried on a real iPad). |
| Snake (side project) | `experiments/snake-blender-mode/` | Works. Fixed 2026-10-20: body was invisible and the game "auto-ended" around 60-70 points. Swipe to steer. | Yes (simulated touch tested; not yet tried on a real iPad). |

A comparison of the Bank Game versions (features, fun, systems lessons) is in `to-desktop/2026-10-21-1600-bank-game-version-comparison.md`.

## Running the games

- `tools/serve_dashboard.ps1` serves the repo at `http://localhost:8000/dashboard/`, and on the home network at `http://192.168.1.25:8000/` (the PC's address can change).
- It runs `tools/serve_dashboard.py`, which forwards the Pygame web runtime requests (`/cdn/...`) to the Pygbag CDN. Without that, the Bank Game builds never finish loading.
- The web builds (`dashboard/web_builds/`, `web_sources/*/build/`) are not in Git; rebuild with `tools/build_web_games.ps1`.

## Known issues and limits

- Bank Game has no touch controls for its keyboard-only actions (S, P, V).
- Publishing on GitHub Pages would need the builds to load the runtime straight from the CDN (the same `/cdn/` problem), and the builds would need to stop being ignored by Git.
- Snake is not linked from the dashboard yet.

## Recent changes

- 2026-11-12: Blade Mosaic: 20 more levels (51 in all): Pineapple, Cherries, Grapes, Taco, Sushi, Cookie, Frog, Bunny, Owl, Octopus, Turtle, Ladybug, Sunflower, Pine Tree, Hot Air Balloon, Sailboat, UFO, Saturn, Crown, Treasure Chest. All checked to stand on the ground; bot clears all of them.
- 2026-11-11: Blade Mosaic: 20 new levels (31 in all): Watermelon, Strawberry, Banana, Donut, Cupcake, Burger, Cat, Penguin, Ghost, Pumpkin, Snowman, Lighthouse, Clock Tower, Pyramid, Volcano, Robot, Dinosaur, Butterfly, Rainbow, Planet Earth. Toughness grows more slowly after level 11; bot run clears all 31 and affords the Galaxy Vortex by the last level.
- 2026-11-11: Blade Mosaic mosaics are 3x larger each way (about 9x the blocks, e.g. Eiffel Tower 45x63), with per-tile shade variation. Blade reach and speed, gravity, crash damage, coins and combos scale with it; 3-star times loosened.
- 2026-11-09: Blade Mosaic music made lo-fier: darker filter, tape wow and flutter, stronger saturation with light bit-crush, softer drums and guitar, more crackle, deeper pumping.
- 2026-11-09: Blade Mosaic music rebuilt to the user's brief: 70 bpm steady head-nod beat, fingerpicked acoustic guitar loop with an original melody, slow mellow bass, old-record filter, vinyl crackle and hiss, gentle rain, distant city noise. Zen Tower now has the drums too.
- 2026-11-09: Blade Mosaic: falling whoosh that swells with speed; lo-fi music everywhere (swung drums, tape-wobble chords, flute melody, vinyl crackle, tape hiss; no piano), drumless in Zen Tower.
- 2026-11-07: Blade Mosaic: piano removed from the music; richer ASMR cutting sounds (a scritch on every bite, crackles on nearly-broken blocks, three-layer sanding texture, sandy trickle after each break, debris ticks), also in Zen Tower.
- 2026-11-07: Blade Mosaic sound made ASMR-style: grain-based crunches panned by block position, wooden knocks, airy blade whoosh and sanding, steam hiss, room echo; lo-fi music with vinyl crackle replaces the drum beat.
- 2026-11-07: Blade Mosaic sound: generated music (workshop beat for levels, ambient pad for menus and Zen Tower), blade motor and grind, combo-pitched block pops, crash booms, overheat sizzle, coin jingle, star dings; Sound/Music switches.
- 2026-11-07: Zen Tower layers fall about twice as fast, and several can be in the air at once.
- 2026-11-07: Blade Mosaic Zen Tower: endless pastel tower, soft ASMR sounds, no timer or heat (commit `b4f98ac`).
- 2026-11-07: Blade Mosaic 3D view: lit cubes with shadows, 3D blades and debris; V or the HUD button switches to 2D (commit `03eb2e9`).
- 2026-11-07: Blade Mosaic physics: falling pieces with crash damage, blade momentum and edge bounce, bouncing debris (commit `3b35d41`).
- 2026-11-07: Blade Mosaic added and linked from the dashboard (commit `79a02bc`).
- 2026-10-25: Whisker Dash expanded to 49 worlds (built with Claude on claude.ai); plan, file guide, tests and provenance transcript added. Not yet committed.
- 2026-10-21: Set up this studio folder for Claude Desktop and Claude Code to work together.
- 2026-10-21: Dashboard server fixed so all six Bank Game builds load (commit `871008a`).
- 2026-10-20: Snake fixed; touch controls added to Snake and Pong (commit `871008a`).
- 2026-10-20: Repo published to https://github.com/samueldee-oss/k12-sd-fun (commit `00a2676`).
