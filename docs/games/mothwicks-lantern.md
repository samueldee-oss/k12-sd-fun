# Mothwick's Lantern

- **Genre:** box-dodging boss fight with a "spare or fight" choice, followed by a short walk
- **File:** `mothwicks-lantern/index.html` (~49 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/mothwicks-lantern/`
- **Save key:** none
- **Brief:** derived from the code.

## Concept and feel
A pixel (4:3, 8-bit font) encounter with Mothwick, a moth keeper of a lantern. Turn-based menu (FIGHT / ACT / ITEM / MERCY), then you steer a small heart inside a shrinking box while attacks fall. Kindness is a real route: ACT three times to calm the boss, SPARE it, and the game continues into an explore section, "the walk to the old camp", where Mothwick talks, you pick up food, and cross thornvine and roots.

## Controls
| Key | Action |
|---|---|
| Arrows / WASD | Move heart; menu selection |
| Z / Enter / Space | Confirm |
| X / Shift / Backspace | Back |
| On-screen d-pad and buttons | Touch equivalents |
| Toggle at top | Sound |

## Rules and numbers
- Player: 20 HP, items `Ember Tart` (+12) ×2 and `Moon Loaf` (+20).
- Boss: 160 HP, `spare` counter 0–3, ACT options: Check, Cup the flame, Hum softly. Reaching `spare>=3` makes MERCY → Spare available (highlighted gold) and ends the fight peacefully; otherwise "mercy" only hesitates.
- Attack length `DUR=7` s. Rate scales with boss damage and mercy: `(1 + (1-hp/max)×0.6) × (1 - spare×0.15)`.
- Patterns: **drip** (fall every 0.22 s), **moths** (wavy homing every 0.55 s), **beams** (telegraphed 0.7 s then 0.35 s lethal, every 0.85 s), **spiral** (5-ember fan every 0.38 s), **finale** (drip + beams).
- Bullet damage: drip 3, moth 4, beam 5, ember 3.
- Invulnerability frames after a hit; the battle box resizes per pattern (`BOXES`).
- Boss dialogue lines escalate (`LINES`); flavour text rotates (`FLAVOR`).

## Content tables
**Explore section:** level is a 160×15 tile grid, tile 16 px; five foods (Wild Berries, Sweet Root, Glow Mushroom, Honeycomb, Moon Loaf) at fixed positions; nine scripted talk points along the route; ends at the old camp.

## Architecture (code map)
Input → sound and four songs (`SONGS`, synthesized) → content → state/`reset` → state machine (`text`, `menu`, `sub`, `fight`, bullets, `end`) → attacks/patterns → update → drawing (pixel font, heart sprite) → `buildLevel` and explore loop → main loop.

## Audio
Synthesized chip music with song switching (`calm` after spare).

## Accessibility and touch
Large on-screen pad on touch devices; `touch-action:none` canvas; image-rendering: pixelated.

## Known limits
No saves; reload restarts. Fight route ends and returns to the start.

## Re-prompt spec
"A 4:3 pixel boss encounter. Menu FIGHT/ACT/ITEM/MERCY. Dodge phase with five attack patterns in a resizing box. ACT three times to calm the boss, then Spare ends the fight and begins a side-scrolling walk with items and scripted talk. Boss HP 160, player HP 20. Original chiptune songs."

## Verification checklist
- [ ] Spare is not offered until three successful ACTs
- [ ] Beams are telegraphed before they hurt
- [ ] Healing items cap at max HP
- [ ] The explore section is reachable and finishable
