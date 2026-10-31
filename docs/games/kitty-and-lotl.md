# Kitty & Lotl

- **Genre:** gentle catch-the-treats game for very young players (no fail state)
- **File:** `kitty-and-lotl/index.html` (~28 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/kitty-and-lotl/`
- **Save key:** none
- **Brief:** derived from the code. (No details about the intended player are recorded here, per the repo privacy rule.)

## Concept and feel
Mochi the cat and Bubbles the axolotl share a teacup boat. Treats fall; slide your finger to put the boat underneath. Slide all the way left and the pair hop onto the grass; slide right and they hop back into the boat. Four friendly axolotls (Coco, Snowy, Blue, Rosie) swim in the pond and can be tapped for giggles. Nothing is ever lost: a missed treat just splashes.

## Controls
Drag / move the pointer horizontally; arrow keys or A / D; tap the characters for reactions; P or Esc pauses; pause button; sound button. Page auto-pauses when hidden.

## Rules and numbers
- Falling items by chance: fish 30 %, star 27 %, heart 25 %, cloud 10 %, gold 8 %.
- Score: fish/star/heart +1, gold +5, cloud = harmless "splish splash" wobble (no loss).
- Fall speed `(110 + min(score,90) × 1.3) × scale`; spawn interval `max(0.5, 1 - score × 0.005)` s.
- Keyboard speed 420 px/s; movement eases toward the target.
- **Seven surprises** unlock at score 5, 15, 25, 35, 50, 70, 100: party hats; a rainbow; flowers on lily pads; a golden Bubbles; baby axolotl Pip joins; crowns; starry night. A gift counter shows `🎁 n/7`, a banner pops, and fireworks play.

## Architecture (code map)
Audio helpers → state `st` and `surprises` → pond friends → `geo()` (all layout derived from screen size and a scale factor `S`) → input → pause → spawn/score → draw helpers (all characters and items are drawn from canvas paths) → `update` → `draw` → `frame`.

## Audio
Soft synthesized effects only (catch, gold, meow, giggle, blub, fanfare, hop, splash).

## Accessibility and touch
Large pills and buttons (≥ 40 px), cream/ink high-contrast UI, `prefers-reduced-motion` removes bobbing and banner animation, pastel palette on purpose, no timers or fail states.

## Known limits
No persistent progress; no score ceiling.

## Re-prompt spec
"A friendly canvas game: a cat and an axolotl in a teacup boat on a pond. Treats fall; the boat follows the finger. Sliding to the far left puts them on the shore. Seven surprise events at score thresholds 5, 15, 25, 35, 50, 70, 100. Four tappable pond axolotls. No failing, no lives. Pastel visuals, large buttons, gentle sounds."

## Verification checklist
- [ ] Missing a treat has no penalty
- [ ] All 7 surprises appear by score 100
- [ ] Shore hop triggers at the left edge and back
- [ ] Pause works and tab-hide auto-pauses
