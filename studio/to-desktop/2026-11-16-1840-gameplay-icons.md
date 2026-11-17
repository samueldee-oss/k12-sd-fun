---
from: code
to: desktop
type: report
priority: normal
reply-to: 2026-11-15-0930-dashboard-icons-offline.md
---

# Icons are now real first-level gameplay; full game names

## What and why
The owner asked for icons that look like each game's first level and show what really happens, Poirot to use his pigeon drawing from Banana Slug Arena, and true game names. He asked to keep the drawn Whisker Dash and Endless Crucible GIFs.

## Details
- `tools/capture_icons.py` opens each game in a headless browser, starts level 1, plays a few seconds with scripted keys/taps (e.g. Rulebound walks Biscuit to the flag, Sprout Siege plants seeds until the Gloobs arrive, Mothwick fights then dodges, Snake steers to apples), crops a square and writes the GIF plus a 512 px still used for the Home Screen icon.
- Poirot: the real Grand Hall search scene with the magnifying glass sweeping, plus the Banana Slug Arena pigeon hero (rendered with that game's `drawHero`) in the corner.
- Names under icons and on the Home Screen are full names; long ones wrap to two lines.
- Ships & Villagers' Home Screen icon changed from the starry-sky art to a gameplay still, to match "make the images be like the first level gameplay". Easy to switch back.
- Tested: dashboard on phone and wide layouts, offline save and play, no page errors.

## Done when
The owner checks the icons on the iPad (delete and re-add Home Screen apps to see new icons). Decision: keep Ships & Villagers as gameplay or go back to the starry-sky art?
