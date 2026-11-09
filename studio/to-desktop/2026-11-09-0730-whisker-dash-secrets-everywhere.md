---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Whisker Dash: secrets and hint animals in every world

## What and why
Done in a claude.ai session at the designer's request (no `to-code` message).
- Every world has a secret family now (cat, chicken, sheep, puppy, penguin and a secret hat). Six worlds that had none got one: London, Inside a PC, Hotel Lobby, Eiffel Tower, Statue of Liberty, Hotel Lobby 2.
- On the first level of each world, one of that world's secret animals (cat, chicken or puppy) stands near the start with a "?" bubble. Press jump next to it: it says which level hides its family and gives a hint, then asks "Want me to tell you EXACTLY where?"
- Worlds 62–70 now come after Hotel Lobby 2; The Riverside is the last world. Saves from the Nov 8 versions are moved to the new level numbers once (`save.lv70b`).
- The secret lobby's VIP Lounge is now the Secret Lounge.
- The Home Screen icon is a pixel cat face. Phones keep the old icon until the app is removed and added again, and on iPhone/iPad removing it also deletes its saves.
- The wide view and auto-run from `c4f45c6` were merged into the claude.ai page (artifact publish #110), so the page and the repo match again.

## Details
Commit `0e90ce5`. Tests: `smoke.js` 341 levels, 0 errors; `mechanics.js` 15/15; every world has a secret and a hint animal; secrets were collected by a bot following the directions (some from just past the fish where the platforming is tricky). Plan round 33 in `whisker-dash/PLAN.md`, version 110 in `GAME-FILE.md`.

## Done when
Nothing to decide. Worth asking testers whether the hints are too easy (they give exact directions if asked).
