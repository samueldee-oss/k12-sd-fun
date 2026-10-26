# Whisker Dash tests

Small Node scripts that load `../index.html` and test the game without a person playing it.
They were written by Claude while building the game; run them after any change.

| Script | What it checks | Needs |
|---|---|---|
| `smoke.js` | Loads all levels in solo, co-op and battle and runs a jumping bot on each. Expect `errors 0`. | Node |
| `mechanics.js` | One line per special mechanic (tower climb, lasers and shields, ladders, foam, taxis, unlocks, knighting). Every line should start with `OK`. | Node |
| `fuzz-browser.js` | Plays every level in a real Chromium with random keys and draws every frame. | Node + Playwright |

`harness.js` is the shared fake browser that the Node tests use.

```
cd whisker-dash/tests
node smoke.js
node mechanics.js
```
