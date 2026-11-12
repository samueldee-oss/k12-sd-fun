# Rulebound

A word-rule puzzle game built with Claude on claude.ai. The rules of each level are word blocks on the board (like `PUP IS YOU` or `WALL IS STOP`); pushing the words changes how the world works.

**Systems link:** every level is a small system whose behavior comes from its rules. Students change one rule and watch what the whole system does: which rules are holding the system in place, which one change unlocks it, and which changes cause side effects.

- `index.html` is the whole game (one self-contained page; fonts load from Google Fonts).
- 90 levels in three worlds (Doodle Valley, Frost Hollow, Sunset Canyon), plus a Sandbox with every word block.
- Four heroes to choose from (Biscuit, Doggo, Lady Clucksalot, Noodle).
- Controls: arrows/WASD, Space to wait, Z undo, R restart. Touch: tap a square in line with the hero to walk there (pushing up to 2 word blocks), swipe, or use the on-screen pad.
- Progress is saved in the browser (localStorage).
- Every level was checked solvable with an automatic solver while it was built.
