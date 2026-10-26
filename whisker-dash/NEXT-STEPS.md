# Whisker Dash: next steps (handover)

_Last updated 2026-10-25, after artifact version 52._

## To continue in a new session

Attach or point Claude to `whisker-dash/index.html` and say:
"Continue Whisker Dash. Read `whisker-dash/PLAN.md` and `whisker-dash/GAME-FILE.md` first, make changes as small patches, and run the tests in `whisker-dash/tests/` before publishing."

## State

- 49 worlds, 240 levels; Iceland is the final world. Everything in [`PLAN.md`](PLAN.md) is built.
- All tests pass (`node tests/smoke.js`, `node tests/mechanics.js`, and the browser fuzz test).

## Fixed in version 50

- "Continue run" jumped back to a level replayed from level select (reported after replaying the Airport). Now it always resumes at the furthest level of the run, which also repairs saves that were already affected.

- Version 51: a "Restore best run" button appears on the title screen when you've beaten levels further than your current run; it rebuilds the run at the furthest level ever beaten.

- Version 52: Restore opens a "Restore your run" picker for powers and skins (powers and card-picked skins are not stored outside a run, so the player chooses them).

## Open items

- One report of the game resetting after a jump (2026-10-25). It could not be reproduced; the main loop now catches errors so the game keeps running. If it happens again, note the world, level and what you did.
- Worlds 32–49 have no world accessory yet.
- Ideas: a bigger ending after Iceland; bumper cars or a log flume at the fair.
