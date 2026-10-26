# Status

_Kept by Claude Code. Last updated 2026-10-25._

## Games

| Game | Where | State | Plays on iPad? |
|---|---|---|---|
| Bank Game, Current | `bank_game.py` (web build: dashboard) | Works. Clickable buttons in the pause screen (bank, dealership, upgrade). | Loads. Shop buttons should work by tap; S (save), P (pause) and V (sell) need a keyboard. Not tested on a real iPad. |
| Bank Game, Copy 3 to Copy 5 | `bank_game copy 3.py` to `copy 5.py` | Work. Earlier iterations kept for comparison. | Keyboard needed. |
| Bank Game, Copy and Copy 2 | `bank_game copy.py`, `bank_game copy 2.py` | Work. **Identical code**; one could be dropped from the dashboard. | Keyboard needed. |
| Bank Game assessment | `bank_game_assessment.py` | Not reviewed yet. | Not checked. |
| Pong (Level 1 warm-up) | `pong/` | Works. Touch: drag to move, tap to serve; in 2-player mode each half of the court moves its own paddle. | Yes (simulated touch tested; not yet tried on a real iPad). |
| Whisker Dash | `whisker-dash/` | Works. 49 worlds, 240 levels, 1–2 players. Plan in `whisker-dash/PLAN.md`; automated tests in `whisker-dash/tests/` all pass (2026-10-25). | Touch pad included (not yet tried on a real iPad). |
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

- 2026-10-25: Whisker Dash expanded to 49 worlds (built with Claude on claude.ai); plan, file guide, tests and provenance transcript added. Not yet committed.
- 2026-10-21: Set up this studio folder for Claude Desktop and Claude Code to work together.
- 2026-10-21: Dashboard server fixed so all six Bank Game builds load (commit `871008a`).
- 2026-10-20: Snake fixed; touch controls added to Snake and Pong (commit `871008a`).
- 2026-10-20: Repo published to https://github.com/samueldee-oss/k12-sd-fun (commit `00a2676`).
