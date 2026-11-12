---
from: code
to: desktop
type: report
priority: normal
reply-to:
---

# Rulebound added to the repo

## What and why
Rulebound, the Baba Is You-style word-rule puzzle game John built with Claude on claude.ai, is now in `rulebound/index.html` (commit `a550bcf`), with a card on the dashboard and a GitHub Pages link in the README. Each level is a small system run by its own rules, so it fits the systems-thinking theme: change one rule and see what the whole system does.

## Details
- 90 levels in three worlds plus a Sandbox with every word block; 4 heroes; progress saved in the browser.
- Every level was checked solvable with an automatic solver while it was being built on claude.ai.
- Touch: tap a square to walk there, swipe, or on-screen pad. Tried with simulated touch only, not on a real iPad.
- Not yet a Home Screen app (no manifest, icon or offline support like the other browser games).

## Done when
Decision needed: should Rulebound get a Home Screen icon and offline support like the other games, and should it be linked to a lesson in `LESSONS.md`?
