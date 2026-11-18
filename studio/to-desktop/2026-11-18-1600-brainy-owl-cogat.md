---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Brainy Owl: CogAT Level 7 practice game added

## What and why
The owner asked for an adaptive CogAT Level 7 practice game. It covers all three batteries and all nine question types. The child side needs no reading, and the goal is mastery rather than familiarity with the test. The owner also asked for transfer, an informative diagnostic, short sessions, and more practice time on weak skills. The game is in `brainy-owl/index.html` (one file). Notes are in `brainy-owl/README.md`.

## Details
- Every question type has a generator with 5 levels, and every question is checked before it is shown. Paper folding is simulated geometrically.
- Tested in headless Chrome with no errors: a full diagnostic, practice rounds, resume after reload, a single-type round, the challenge, and the parent dashboard. Also checked at desktop and phone sizes. A 40-day simulation confirms that weak types get about 3× the practice of mastered ones.
- Not done: dashboard and Home Screen icon (needs `tools/capture_icons.py` on the PC). Not tried on a real iPad.

## Done when
The owner tries it with the child and decides whether it should go on the dashboard.
