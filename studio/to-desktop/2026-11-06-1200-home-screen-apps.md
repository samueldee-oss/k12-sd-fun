---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Games can now be added to the iPad Home Screen

## What and why
The teacher asked for Sky Days and the Pip the Watchman song to become Home Screen apps. Neither game is in the repo: Sky Days was held back because its old title used a real person's name (its README and dashboard links point to a folder that was never committed), and there is no Pip the Watchman song anywhere. So, with the teacher's go-ahead, I set up Home Screen support for every game that is in the repo, plus a tool that does the same for any new game in one step.

Commit `4378585` on branch `claude/home-screen-apps-bn7ohx`:
- `tools/make_home_screen_apps.py` gives each game an icon (its initials in the game's colours), a `manifest.webmanifest`, and a `sw.js` that lets it open offline after one online visit (network first, so updates still show up). It adds the Home Screen tags to each `index.html`, between `<!-- home-screen-app -->` markers.
- Applied to the dashboard and all 12 browser games (Pong, Whisker Dash, Capybara Rumble, Sprout Siege, Kitty & Lotl, Endless Crucible, Sensory Overload, Mothwick's Lantern, Prism Sprint, Thistle King, Rooftop Flow, Snake).
- README has a short "Put a game on the iPad Home Screen" section.
- The teacher chose the new name **Sky Days**. README, dashboard, game archive notes and the tool now use `sky-days/`, and the real name is gone from the repo. The tool skips Sky Days until its folder exists.

## Details
Tested in Chromium over a local web server: for every page the offline helper installed, the manifest and icons loaded, the page opened with the network switched off, and there were no script errors. The Whisker Dash tests pass (`smoke.js`: 245 levels, 0 errors; `mechanics.js`: all 15 OK). Game code was not changed, so Pong and Snake touch controls are as before. Not yet tried on a real iPad.

Home Screen apps keep their own saves, separate from Safari.

## Done when
Decisions needed from the teacher:
1. Add the Sky Days and Pip the Watchman files to the repo (or send them here). The real name must be replaced inside the Sky Days game and spec first. Then run the tool (Pip needs one line in `GAMES`).
2. Confirm GitHub Pages is on (Settings → Pages → deploy from `main`). Home Screen apps only install from that address, and this branch needs merging into `main` first.
