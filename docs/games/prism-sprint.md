# Prism Sprint

- **Genre:** rhythm auto-runner (one-button cube)
- **File:** `prism-sprint/index.html` (~39 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/prism-sprint/`
- **Save keys:** `ps-best` (best % per level), `ps-music`, `ps-sfx`, `ps-muted`
- **Brief:** derived from the code.

## Concept and feel
Your cube runs automatically; you only decide when it jumps. Neon colours, a unique synthesized soundtrack per level, and instant respawn so failing costs seconds. Progress is shown as a percentage bar and an attempt counter.

## Controls
Tap, hold, Space or Up to jump; holding keeps jumping on landing; pressing in mid-air near a yellow orb triggers a boost jump. Pause button; separate music and effects volume sliders; mute.

## Rules and numbers (deterministic physics)
Fixed timestep `1/240 s`. Constants: gravity 95, jump 20.2, pad 28.5, orb 19.8, max fall -38. Jump input buffer 0.15 s. Horizontal speed is constant per level.

Objects (grid units): spike `s` (small hitbox), block `b` (land on top safely, side hit kills), pad `p` (auto-bounce), orb `o` (needs a press in range).

## Content tables
| # | Level | Difficulty | Speed | BPM |
|---|---|---|---|---|
| 1 | Neon Steps | Easy | 10.4 | 128 |
| 2 | Glow Garden | Normal | 10.4 | 124 |
| 3 | Bass Drop | Normal | 11.2 | 132 |
| 4 | Voltage | Hard | 12.4 | 142 |
| 5 | Overdrive | Harder | 13.4 | 150 |
| 6 | Starfall | Insane | 12.4 | 146 |

Levels are written as short programs (`build(a => { a.s(18); a.b(57,0,3,1); … })`) that place objects at positions, so level design is a handful of lines.

## Architecture (code map)
`//#PHYS-START … //#PHYS-END` block holds `PH`, `build`, `step` so physics can be copied into tests. Then `LEVEL_DEFS` → compiled `LEVELS` → storage helpers → music engine (`SCALES`, `SONGS`, `playStep`, kick/noise/pad voices) → SFX → UI (level cards with best %, pause, win) → input → update/draw/frame.

## Audio
Per-level songs from scale degrees (minor / major / dorian) with 64-step lead patterns; a menu theme; synthesized kick, pad, noise; die/win/boost jingles.

## Accessibility and touch
Whole screen is the touch target; volume controls; `prefers-reduced-motion` handled for card hover; safe-area padding.

## Known limits
Hit boxes are forgiving but fixed; no practice mode or checkpoints.

## Re-prompt spec
"A one-button auto-running cube game with six levels (name, difficulty, speed, BPM as in the table) built from spikes, blocks, jump pads and orbs; deterministic fixed-step physics; instant respawn; percent progress; attempt counter; saved best percent; per-level synthesized music; separate music/SFX volumes."

## Verification checklist
- [ ] Same inputs always give the same result (deterministic)
- [ ] Holding jump keeps hopping spikes
- [ ] Best % and volumes persist
- [ ] Every level can be completed
