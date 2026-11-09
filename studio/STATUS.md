# Status

_Kept by Claude Code. Last updated 2026-11-09._

## Games

| Game | Where | State | Plays on iPad? |
|---|---|---|---|
| Bank Game, Current | `bank_game.py` (web build: dashboard) | Works. Clickable buttons in the pause screen (bank, dealership, upgrade). | Loads. Shop buttons should work by tap; S (save), P (pause) and V (sell) need a keyboard. Not tested on a real iPad. |
| Bank Game, Copy 3 to Copy 5 | `bank_game copy 3.py` to `copy 5.py` | Work. Earlier iterations kept for comparison. | Keyboard needed. |
| Bank Game, Copy and Copy 2 | `bank_game copy.py`, `bank_game copy 2.py` | Work. **Identical code**; one could be dropped from the dashboard. | Keyboard needed. |
| Bank Game assessment | `bank_game_assessment.py` | Not reviewed yet. | Not checked. |
| Pong (Level 1 warm-up) | `pong/` | Works. Touch: drag to move, tap to serve; in 2-player mode each half of the court moves its own paddle. | Yes (simulated touch tested; not yet tried on a real iPad). |
| Whisker Dash | `whisker-dash/` | Works. 70 worlds, 341 levels, 1–2 players, a secret and a hint animal in every world, Home Screen app (cat-face icon) with a full-screen fit for phones. Plan in `whisker-dash/PLAN.md`; automated tests in `whisker-dash/tests/` all pass (2026-11-09). | Touch pad included (not yet tried on a real iPad). |
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
- Home Screen apps: all 12 browser games and the dashboard have icons, manifests and offline support (2026-11-06). Not yet tried on a real iPad, and they only install from the GitHub Pages address, which this session could not check is live.
- Pip the Watchman song is not in the repo (it seems to live in a separate `come-follow-me-games` project on the PC). Neither can be made a Home Screen app until its files are added.

## Recent changes

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
