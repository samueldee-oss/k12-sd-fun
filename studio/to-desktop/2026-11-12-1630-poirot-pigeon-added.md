---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Poirot the Pigeon added to the repo

## What and why
The owner asked to add Poirot the Pigeon (built on claude.ai) to K12 SD Fun. It is a 3D deduction game: walk the map, open each room's picture, search nooks with a magnifying glass, question bird suspects and work out who, weapon, where, when and why. It fits the systems lessons as reasoning by elimination: each clue removes options, and one false input (fake time, planted object, lying alibi) changes the conclusion until checked against other evidence.

## Details
- Files: `poirot-pigeon/index.html`, `poirot-pigeon/three.min.js` (three.js r128, MIT), Home Screen icon, manifest and service worker (made with `tools/make_home_screen_apps.py`, new line added there).
- Linked from the dashboard and the README; spec in `docs/games/poirot-pigeon.md`.
- Tested in headless Chrome: starts, room picture opens, no page errors; all three crime scenes generate solvable cases (every wrong answer ruled out, the right one never); the full win path with the gathering and the hard-mode red herring both checked.
- Note: running the icon tool on Linux redrew every other game's icons with a slightly different font. Those changes were thrown away; only Poirot's icons are new.
- Commit `8f54c2b`, on `main` (2026-11-13, at the owner's request; rebased on top of the Rulebound commits).

## Done when
Live on GitHub Pages once Pages rebuilds `main`. Still to do: try it on a real iPad (touch joysticks, drag-to-inspect).
