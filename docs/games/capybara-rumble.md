# Capybara Rumble

- **Genre:** lane battler with a collectible roster (side-view, two bases)
- **File:** `capybara-rumble/index.html` (~78 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/capybara-rumble/`
- **Save keys:** `capyRumble`, `capyRumble2`, `capySaves` (multiple save slots, max 6), `capyKb` (keyboard preference)
- **Brief:** derived from the code.

## Concept and feel
You lead a herd of capybaras defending a riverside base from predators marching in from the right. Spend "wallet" money to deploy units from a line-up of up to 10, push the enemy base down, and use a charged geyser as an emergency blast. Between stages you open crates to collect more capybaras, building a herd of 33 across five rarities.

## Controls
| Input | Action |
|---|---|
| Click/tap unit cards | Deploy that unit (money + per-unit cooldown) |
| Wallet button | Upgrade income rate and cap (max level 8) |
| Geyser button | Fire the charged geyser |
| Speed button | Toggle 1x / 2x |
| Pause button / key | Pause and resume |
| Menu | Stage select, herd/line-up editor, crates, save slots, fullscreen |

## Rules and numbers
- Constants: `PACE=1.25`, `FIRST=1.3`, `WARM=5`, `MAX_WALLET=8`, `MAX_LV=10` (unit level), `CRATE=150`, `MAX_LINE=10`, `GEYSER_CHARGE=22`, `MAX_SAVES=6`.
- Wallet: income `20+(l-1)*10`, cap `600+(l-1)*400`, upgrade cost `70*l`.
- At most 30 player units on the field.
- Geyser: after charging (22), damages every enemy with `x > playerBase-400` for `90 + 25*stageIndex`.
- Combat model: each unit has `hp, atk, range, speed, rate, kb (knockback), size`. A unit walks until an enemy (or the base) is within `range`, then attacks every `rate` seconds. Knockback pushes the target back for a short time. Special flags: `area` (hits all in reach), `heal`, `proj` (projectile style: laser, fire, etc.), `slam` (ring effect).
- New save: unlocked stage 1, 150 crate currency, owns `pup, lily, yuzu, mud`, line-up the same four.
- Rewards: each enemy carries a `reward`; stages have `base` HP and a `mult` scaling.

## Content tables
**Rarity:** Common, Rare, Epic, Legendary, Mythic (counts in roster: 10 / 9 / 7 / 5 / 2 = 33 units).

**Sample units** (id, cost, cooldown, hp, atk, speed): Pup 60/2s/160/14/46; Lily Pad Capy 90/3s/360/8/34 (blocker); Snorkel Capy 110/3s/190/30/72 (fast nibbler). The rest are in `ROSTER`: Yuzu Capy, Duck Taxi, Mud Flinger, Scarf Capy, Orange Stack, Bubble Capy, Chef Capy, Melon Knight, Reed Piper, Coconut Bowler, Bath Capy, Sleepy Capy, Pirate Capy, Cowboy Capy, Drummer Capy, Firefighter Capy, Ninja Capy, Capy Wizard, Sumo Capy, Grand Capy, Hot Tub Capy, Samurai Capy, Robo Capy, Cosmic Capy, Dragon Capy, Capy King, Angel Capy, Golden Capy, Rainbow Capy, Mega Capy.

**Enemies (14):** piranha, ferret, ocelot, caiman, jaguar, puma, anaconda, bigcroc, harpy, chief (Jaguar Chief), otter, eel, wolf, kingcroc. Example: piranha hp40/atk12/speed60; caiman hp420/atk30/speed22; jaguar hp620/atk62.

**Stages (about 20; 19 have blurbs):** Muddy Shallows, Reed Marsh, Piranha Creek, Lily Lagoon, Jaguar Ridge, Mangrove Maze, Puma Pass, Flooded Forest, Storm Canyon, Predator Peak, Otter Rapids, Electric Bayou, Wolf Grasslands, Moonlit Marsh, Twin Talons, Croc Causeway, Thunder Falls, Midnight Jungle, Volcano Springs. Each defines `spawns: [enemy, firstTime, interval]`, and a `rage` list of enemies released when the base is hurt.

## Architecture (code map)
Sections in the script, in order: data (`RAR`, `ROSTER`, `ENEMIES`, `STAGES`) → constants → save system (`freshSave`, `cleanSave`, slots) → UI (menu, saves, herd, crates, endgame, keyboard, fullscreen) → simulation (`damage`, `step`, `strike`) → scene drawing (animated crowd of swimmers and loungers in the background, unit/enemy sprites drawn procedurally on canvas).

## Audio
Procedural WebAudio effects; mute toggle in the UI.

## Accessibility and touch
Card-based buttons work by touch; pause and 2x speed available; fullscreen mode.

## Known limits
Shared-origin note: three localStorage keys exist because the save format was revised (`capyRumble` → `capyRumble2` → slot-based `capySaves`); the code reads the newer first.

## Re-prompt spec
"A two-base side-view lane battler. Player units spawn at the left base, enemies at the right; units walk, fight at range, and knock back. Wallet money regenerates and can be upgraded 8 levels (rate 20+10(l-1), cap 600+400(l-1), cost 70l). Up to 10 units in the line-up, each with cost and cooldown, 30-unit field cap. A geyser button charges to 22 and damages all enemies near the player base. Include 33 capybara units in five rarities (starting four: Pup, Lily Pad Capy, Yuzu Capy, Mud Flinger), 14 predator types, about 20 stages with spawn schedules and a rage wave, a crate system (150 start), up to 6 save slots, 1x/2x speed, pause, fullscreen, and an animated riverside background."

## Verification checklist
- [ ] New game starts with four units and 150 crate currency
- [ ] Wallet upgrades cap at level 8
- [ ] Geyser charges and clears nearby enemies
- [ ] Units stop to fight when an enemy is within range
- [ ] Saves persist across reloads and work with storage blocked
