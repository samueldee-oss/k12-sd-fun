---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Slice Flip 3D added to the repo

## What and why
Slice Flip 3D, the Slice Master-style knife-flipping game John built with Claude on claude.ai, is now in `slice-flip-3d/index.html` (commit `4343bc5`), with a card on the dashboard and a GitHub Pages link in the README. The level score works like a stock: every slice is an inflow, the finish multiplier scales it, and falling into a gap drains it to zero, so it fits the stock-and-flow theme.

## Details
- Tap (or Space) to flip the knife; the blade really cuts each food's 3D shape in two, and the pieces fall and settle.
- 12 foods with their own cut faces and ASMR-style slice sounds, pink uncuttable blocks, gems, a ×1–×20 multiplier finish, a 13-knife shop, music and mute buttons; progress is saved in the browser.
- Needs an internet connection (three.js loads from cdnjs). Not tried on a real iPad.
- Not yet a Home Screen app; its offline cache would also need to store three.js.

## Done when
Decision needed: should Slice Flip 3D get a Home Screen icon like the other games, and should it be linked to a lesson in `LESSONS.md`?
