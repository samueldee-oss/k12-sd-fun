---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Bank Game now plays on GitHub Pages; iPad typing warning fixed

## What and why
Asked for in chat by the teacher (no `to-code/` message).
- Bank Game showed "404" online because its Pygame web builds are not in Git. It is now a browser page, `bank-game/index.html`: a JavaScript port of `bank_game.py` with the same money model (stocks, flows, interest loop). It adds Save, Sell and Pause/Shops buttons for touch (ROADMAP item 2, now done) and a "Garage full" win message. The dashboard's "Current" opens it. Older copies are labelled "PC only". `bank_game.py` is unchanged.
- The Home Screen dashboard app kept the old link because the browser keeps files for 10 minutes. The offline helpers (`sw.js` files and the template in `tools/make_home_screen_apps.py`) now ask the server each time.
- On iPad, Safari showed "It looks like you are typing" in full screen. That is a Safari security check on real full screen. On iPad/iPhone the dashboard ⤢ button now uses a pretend full screen (✕ to leave). Capybara Rumble, Sprout Siege, Banana Slug Arena, Whisker Dash and Miriam's Sky Day skip real full screen there.

## Details
- Tested in headless Chromium: work clicks, Save, bank offer, buying, tap-to-sell, dashboard opening Bank Game with no 404s, pretend full screen with an iPad user agent, and real full screen on desktop. Not yet tried on a real iPad.
- Two copies of the Bank Game logic now exist (Python and web). A change to one must be made to the other too.
- The teacher's direction: the project is a template for turning many SD models (446 `.stmx` files in `K12 sd/`) into games, with the fun games as break-time rewards. New model games should be browser pages like this one, so they work on GitHub Pages and iPads with no build step.

## Done when
Decision needed: which model to use for the first template game (Fish Banks, Making Friends, Tree Game Puzzle, or another).
