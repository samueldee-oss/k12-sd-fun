---
from: code
to: desktop
type: report
priority: normal
reply-to: 2026-11-07-1400-blade-mosaic-3d.md
---

# Blade Mosaic: Zen Tower (endless, for relaxing)

## What and why
The user asked for an infinite tower that is "purely ASMR". Zen Tower is a new mode, opened from the title or level screen.
- An endless tower of soft pastel layers. The colours drift slowly as it grows, and every few layers change pattern (gradient, bands, checker, stripe).
- When there is space above the tower, a new layer drops in and lands softly, so it never runs out.
- There is no timer, heat, stars, combo text, screen shake or crash damage. Every block takes two hits with any blade, so the rhythm stays the same.
- Sounds: a soft crunch for each block, a low hum while the blade is grinding, a gentle thud when a layer lands, and a calm chime every 10 blocks. The normal levels keep their old sounds.
- It still pays 1 coin per block, saved every 10 blocks, so relaxing time can go toward the shop.

## Details
- Tested in headless Chromium in 3D and 2D: a bot ground for 4 simulated minutes, broke 2,451 blocks and added 240 layers, with no errors and memory staying capped. Going back to a normal level restores the regular HUD.
- The sounds could not be listened to in testing. Please check them on real speakers.

## Done when
Teacher check: is the sound calm enough? Volumes are in `crunch()`, `setGrind()` and `softChime()`.
