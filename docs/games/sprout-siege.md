# Sprout Siege

- **Genre:** lane-defence strategy (plants vs. slime monsters)
- **File:** `sprout-siege/index.html` (~51 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/sprout-siege/`
- **Save key:** `sproutsiege.unlocked` (highest level unlocked)
- **Brief:** derived from the code.

## Concept and feel
A lawn is split into 3 rows by 12 columns. Monsters ("Gloobs") walk in from the right; you plant defenders using "dew" collected from the sky and from sun plants. Eight levels introduce one new monster type and a few new plants each, so the game teaches itself.

## Controls
| Input | Action |
|---|---|
| Click a seed card, then a lawn cell | Plant (costs dew, then cooldown) |
| Number keys 1..n | Pick the n-th available seed (numbers shown on cards) |
| `S` / Shovel card | Dig up a plant |
| Click falling/produced dew | Collect it |
| Pause, fullscreen buttons | As labelled |

## Rules and numbers
- Board: `COLS=12, ROWS=3, cell 100x110`, grid origin `(80,20)`.
- Dew falls from the sky every 8–11 s; Sunpetal produces every 12 s (Gold Petal doubles).
- Each row has a last-defence unit (`gn`) that starts "ready".
- Cooldown at level start: Sunpetal and Acorn Popper ready; all others start at half cooldown.
- Wave schedule (`makeSched`): first wave at t=16 s; wave *w* has `base + ceil(1.4w)` monsters (+4 on the final wave); spacing `max(1.3, gap - 0.9w) × random(0.6–1.4)` s; final-wave rush spacing 0.7 s; 12 s rest between waves. Rock Gloobs (tank) only from wave 2. Mega Gloobs appear at the end of later levels (and mid-level on level 8).
- Monster mix weights: gloob 5, zip 2, helm 2, hopper 2, splitter 2, tank 1.
- Plants unlock cumulatively by level (ADDS).

## Content tables
**Levels:** (waves, base, gap, starting dew, new monster)
1. 4, 1, 8.5, 150, Gloob · 2. 5, 2, 7.5, 150, Zipper · 3. 5, 2, 7, 150, Pot Gloob · 4. 6, 2, 6.5, 175, Hopper · 5. 6, 3, 6.5, 175, Splitter · 6. 7, 3, 6, 200, Rock Gloob · 7. 8, 3, 5.5, 200, Mega Gloob (1) · 8. 10, 3, 5, 225, mid-level + final Megas (2)

**Plants added per level:** L1 Sunpetal, Puff Cap, Acorn Popper, Boom Seed · L2 Gold Petal, Stump Wall · L3 Frost Fern, Berry Lobber, Gust Puff · L4 Chili Boom, Snap Trap, Chill Cap · L5 Twin Popper, Zap Lily, Tri-Sprout · L6 Thorn Patch, Gourd Hurler, Beam Bean · L7 Kaboom Cap · L8 none.

**Plants (cost / hp / cooldown s):** Sunpetal 50/300/6 · Gold Petal 125/300/15 · Puff Cap 25/200/6 · Acorn Popper 100/300/6 · Twin Popper 175/300/8 · Tri-Sprout 300/300/10 · Beam Bean 200/300/10 · Frost Fern 150/300/10 · Berry Lobber 125/300/8 · Gourd Hurler 275/300/12 · Zap Lily 175/300/10 · Boom Seed 25/300/20 · Chili Boom 125/instant/30 · Kaboom Cap 150/instant/50 (leaves a crater) · Chill Cap 75/instant/35 · Gust Puff 100/instant/25 · Snap Trap 150/300/10 · Stump Wall 50/2400/20 · Thorn Patch 100/n.a./12.

**Monsters (hp / speed / damage):** Gloob 190/16/45 · Zipper 110/34/30 · Pot Gloob 520/14/45 · Hopper 200/22/40 (jumps the first plant; Stump Wall stops it) · Splitter 260/15/40 (splits into 2 Mini Gloobs 70/26/25) · Rock Gloob 1150/10/60 · Mega Gloob 1800/9/120.

## Architecture (code map)
`PL` plants → `EN` enemies → `LEVELS` → `ADDS`/`WEIGHT` → `makeSched` → `newGame` → `update(dt)` (spawning, dew, per-plant behaviours, bullets, lobs, enemies, grid) → drawing helpers (procedural canvas sprites per plant/monster) → UI (tray, shovel, selection, hover) → fullscreen → overlay screens (level select, win, lose).

## Audio
None. This build has no sound (no WebAudio code).

## Accessibility and touch
Seed tray scrolls horizontally on phones; large hit cells; 16px gutters.

## Known limits
Tuning is by hand (no balance tests). Progress is only the highest level unlocked.

## Re-prompt spec
"A 3-row, 12-column lane-defence game. Dew currency from sky and producer plants; seed tray with costs and cooldowns; shovel. 19 plants and 8 monster types as in the tables; 8 levels that unlock plants cumulatively and introduce one monster each; wave generator as described; rows have a last-defence unit; level-select with saved unlock progress in localStorage `sproutsiege.unlocked`; keyboard 1..n selection."

## Verification checklist
- [ ] Level 1 offers exactly 4 plants
- [ ] Hoppers jump one plant but not a Stump Wall
- [ ] Splitters spawn two minis on death
- [ ] Finishing a level unlocks the next after reload
