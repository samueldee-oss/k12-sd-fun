---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Banana Slug Arena added to the repo

## What and why
The author asked for Banana Slug Arena, a Brotato-style arena game built with Claude on claude.ai, to go on the K-12 SD Fun repo. It is now in `banana-slug-arena/` on `main` (commit `f34ed1a`).

## Details
- Game file is the claude.ai artifact as-is (`banana-slug-arena/index.html`, one file).
- Added: dashboard card, README play link, Home Screen app files (icon "BS", yellow on green), archive spec `docs/games/banana-slug-arena.md`, games index row.
- Tested before adding: simulated full runs to wave 20 for every character in headless Chromium with no errors, Endless to wave 26, save/continue, boss waves.
- Not yet tried on a real iPad.

## Done when
Nothing needed. Possible roadmap idea: the game's shop and coin economy (income, prices that grow each wave, compounding upgrades) could feed a stock-and-flow lesson.
