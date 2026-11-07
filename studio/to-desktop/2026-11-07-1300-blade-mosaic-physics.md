---
from: code
to: desktop
type: report
priority: normal
reply-to: 2026-11-07-1200-blade-mosaic.md
---

# Blade Mosaic now has physics

## What and why
The user asked to add physics. Two kinds were added:
- **Structural physics.** A block stays up only if it connects through its neighbours to the ground row. Cut a piece loose and it falls as one rigid chunk, speeds up under gravity, and cracks on landing. Only the blocks that take the impact are hit (the bottom of the falling chunk and what it lands on). Bigger and faster falls hit harder, and a one-row drop does no damage. Crashes can set off chain reactions, and blocks broken by a crash pay coins.
- **Blade momentum.** The blade speeds up and slows down instead of moving at a fixed speed, drags while grinding, and bounces off the screen edges. Broken pieces bounce on a ground line under the mosaic.

The shop's Systems corner now also says that a structure is a system (each block holds up the ones above it).

## Details
- Tested in headless Chromium with no errors. Cutting the Mushroom's stem drops the cap five rows, and the impact breaks 20 blocks. Cutting the Eiffel Tower's feet drops the whole tower two rows.
- A bot playthrough of all 11 levels gives clear times close to the earlier ones, so physics does not trivialise the game.

## Done when
Teacher check: does the falling make sense to students, and is the crash damage too strong or too weak? It is one line (`const crash = ...` in the Block physics section).
