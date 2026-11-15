---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Dashboard: animated icon grid, picture Home Screen icons, airplane mode

## What and why
The owner asked for a dashboard with cute, recognizable GIFs instead of a long list with big text, and for the same pictures to work as iPhone/iPad Home Screen icons. They also asked to play the games offline on an airplane.

## Details
- `tools/game_icons.py` draws one looping picture per game (orange pixel cat, Ships & Villagers art with twinkling stars, PUP IS YOU blocks, mustached pigeon, capybara with an orange, banana slug, etc.) and writes `dashboard/app-icons/<game>.gif`. `tools/make_home_screen_apps.py` now uses a still frame of each picture for the Home Screen icons (the dashboard's own icon is a 2x2 of four games).
- Dashboard (`dashboard/index.html`, `styles.css`, `app.js`): icon grid with search; wide screens play in the side panel, phones/upright iPads open the game full screen with a "‹ Games" button. Notes keep the same saved keys, so no notes were lost. Bank Game's six versions are one icon with a version menu.
- Offline: "⬇ Save for airplane" downloads every game listed in `dashboard/offline-files.json`; a site-wide `sw.js` at the repo root serves them with no internet. Bank Game is greyed out offline.
- Tested in headless Chrome: wide and phone layouts, notes, version menu, and offline play (Thistle King and Poirot loaded with the network off after saving). Not yet tested on a real iPad.

## Done when
The owner adds the dashboard to the iPad Home Screen, taps Save for airplane on Wi-Fi, and plays in airplane mode.
