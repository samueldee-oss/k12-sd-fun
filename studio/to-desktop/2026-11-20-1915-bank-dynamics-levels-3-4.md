---
from: code
to: desktop
type: report
priority: normal
reply-to: 2026-11-17-1715-bank-game-web-and-ipad-fullscreen.md
---

# Bank Dynamics: its own game, Levels 3 and 4

## What and why
Asked for in chat by the teacher. The levels now live in **Bank Dynamics** (`bank-dynamics/`), a separate dashboard game. Bank Game is back to the original web version. The level ladder (one new idea per level):
1. Work: one inflow fills the stock. Review: none.
2. Spend: one outflow drains the stock. Review: put Level 1's sentence in order.
3. Both (easy): stock rises only when in > out. Review: fill the blank in Level 2's sentence.
4. Hard Times (low pay): same rule, but saving takes steady work. Review: match Level 3's sentence to a graph.
Interest (feedback loop) and surprise events (stochastic disruptions) are planned for later levels.

## Details
- Each level: review → 2-question predict quiz → play with a month timer → debrief (stock-and-flow picture, the player's own inflow/outflow/balance graphs, their predictions, a sentence to remember).
- Brought back from the old screen: "This month" in/out bars, cars as savings goals, and a garage on the menu.
- Level 4 needs about 4 taps a second for most of the 24 months; 3 taps a second fails. Teacher and testers should check this is hard, not unfair.
- Tested in headless Chromium: all four levels played through, reviews, debriefs, dashboard links; no errors. Not yet on a real iPad.

## Done when
Decision needed: what Level 5 should add first, interest (reinforcing loop) or a surprise event.
