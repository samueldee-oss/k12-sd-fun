---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Ionuț's Climb added to the repo

## What and why
The owner asked for Ionuț's Climb (made on claude.ai) to live in this repo. It is a 3D parkour game: a hero in Pădureni folk costume climbs across 9 Romanian sites, and each checkpoint shows a short fact about the place.

## Details
- Game: `ionuts-climb/index.html`, plus Home Screen app files (icons, manifest, offline service worker) from `tools/make_home_screen_apps.py` (new line in GAMES).
- Dashboard: new card after Whisker Dash.
- Archive page: `docs/games/ionuts-climb.md`, with a row in the catalog.
- Tested in headless Chrome: all 9 sites load with no errors, all 27 checkpoints hold the player, and climbing, carts and the funicular carry the player. Not played start to finish by a person, and not tried on a real iPad.
- Running the icon tool in this environment redraws every other game's icons with a different font, and it also touched `whisker-dash/index.html`. Those changes were reverted, so only the new game's files changed.
- three.js loads from cdnjs, so offline play only works if the browser has that file cached.
- Commit `2ef8b29` on branch `claude/ionuts-climb`.

## Done when
Decision needed: merge `claude/ionuts-climb` into `main` so the game shows up on GitHub Pages.
