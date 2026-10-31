# Rooftop Flow

- **Genre:** endless runner built around trick combos
- **File:** `rooftop-flow/index.html` (~22 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/rooftop-flow/`
- **Save key:** `rooftopflow.best`
- **Brief:** derived from the code.

## Concept and feel
A stick-figure runner crosses a procedurally generated dusk skyline. The scoring idea is flow: chain tricks within 2.5 s to build a multiplier, so "keep moving and take small risks" beats "play safe".

## Controls
| Input | Action |
|---|---|
| Space / Up / W | Jump (hold = higher; press again in the air = air kick) |
| Down / S | Slide (in the air it drops you fast) |
| Touch | Tap = jump, swipe down > 40 px = slide, plus on-screen JUMP and SLIDE pads |
| Enter / Space on menu | Start / run again |

## Rules and numbers
- Logical height 360; start speed 320 px/s, speed increases over distance.
- Jump velocity -700; air kick -580 (one per jump); slide lasts 0.6 s; coyote time and a 0.13 s jump buffer.
- Buildings: width 320–660, top height clamped 180–300 (changes by -55…+45), gaps `rand(55,115) × min(speedFactor,1.8) + 15`, smaller when the next roof is higher.
- Obstacles: `low` (width 32, jump or vault it) and `duct` (width 66, slide under). Density `min(0.35 + distance/30000, 0.8)`.
- Tricks scored: VAULT (skim an obstacle closely), EDGE (land on the lip of a roof), SLIDE (pass under a duct); each adds points and extends the combo timer (2.5 s). The mid-air second jump is a movement option, not a scored trick.
- Death causes: `wall` (hit a roof's side), `low` (hit a low unit), `duct` (hit a vent while not ducked), `fall`; results show score, tricks and best; best persists.

## Architecture (code map)
`reset` → `mkBld`/`ensure` (endless generation, culls off-screen) → input (`pressJump`, `pressSlide`, swipe) → `update(dt)` with a fixed-style physics step → layered parallax (`drawSky`, `layer`, `drawBuildings`) → `drawObs` → procedural runner animation from limb angles (`drawRunner`) → HUD/overlays.

## Audio
None. This build has no sound at all (no WebAudio code); an easy extension.

## Accessibility and touch
Pads shown only on touch (`hover:none`); keys hint on desktop; safe-area aware.

## Known limits
Random generation can occasionally produce tough sequences; no seed option.

## Re-prompt spec
"A side-scrolling rooftop runner at dusk with procedural buildings, two obstacle types, variable-height jump, one air kick, slide, and a 2.5 s combo timer that multiplies trick points. Best score saved. Touch pads and swipe-down for slide."

## Verification checklist
- [ ] Duct can be passed only by sliding (or a high jump)
- [ ] Combo resets after 2.5 s without a trick
- [ ] Best score persists
- [ ] Gaps never exceed the maximum jump reach at top speed
