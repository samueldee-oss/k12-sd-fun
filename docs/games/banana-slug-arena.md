# Banana Slug Arena

- **Genre:** Arena survival roguelite (Brotato-style auto-shooter)
- **File:** `banana-slug-arena/index.html` (about 130 KB, single file; Fredoka font from Google Fonts)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/banana-slug-arena/`
- **Save key(s):** `avoSave2` (unlocks, achievements, wins, best wave, saved run); `avoBest` (old best-wave key, read only)
- **Claude artifact:** "Banana Slug Arena" on claude.ai (started as "Avo Arena")

## Brief
Built with Claude on claude.ai over many requests from the author. It started as "a Brotato-like game with a food as the character" (an avocado) and grew into a banana slug, drawn from the author's own picture, fighting derpy bugs and swamp critters. Later requests, in the author's words: hordes "like the og", characters and items "that the base game has", "achievements that unlock you new guys", difficulty levels, items that show on you ("pocket factory ... would give ur guy a pocket"), pets ("catling gun, bonk dog, that caterpillar one, ratzilla"), the frog as a huge boss, critters of your own kind that "dont attack you ... just follow you around", and content "from Dlc".

## Concept and feel
Top-down arena. You only move; weapons, pets and turrets aim and fire on their own. A wave lasts 15–60 seconds on a timer that runs 1.3× real time; survive it, then spend coins in a shop and pick level-up upgrades. Wave 20 ends with the Giant Frog King. Art is drawn in code in the author's style: thick black outlines, flat colours, big derpy eyes.

## Controls
| Input | Action |
|---|---|
| WASD / arrow keys | Move |
| Drag anywhere (touch) | Floating joystick |
| P / Esc / ⏸ | Pause (stats, sound, 🏠 Main Menu) |
| ⛶ | Fullscreen (not available on iPhone) |
| Tap cards in shop / level-up / crate screens | Buy, lock, reroll, combine, sell, take/recycle |

## Rules and numbers
- 20 waves; wave length `min(60, 15 + 5×wave)` timer seconds (timer ticks 1.3× real time). Boss waves (10, 15) keep going past zero until the boss dies; wave 20 has no timer.
- Each wave picks 3 random enemy types (4 from wave 10) from those unlocked by that wave, always at least two hostile types.
- Spawn interval `max(0.2, 1.9 × 0.86^(wave−1))` s; group size grows with the wave; swarms from wave 4, ring swarms from wave 8; horde waves 7, 11, 14, 17, 19 (more on Danger 3+). Enemy cap 230 (270 in hordes).
- Enemy HP/damage grow per wave and get +5%/+4% per wave after wave 5; Danger 0–5 multiplies HP and damage (0.8× to 1.55×) and adds elites (Danger 2+) and a second final boss (Danger 5).
- XP to level: `(level+3)²`; coins = XP. Shop prices rise 10% per wave.
- Same-kind critters (frogs for the Frog hero, pigeons for the Pigeon) are friends: they follow you and never attack; each friendly spawn also spawns a hostile one (max 30 friends).
- Curse (DLC-style): chance of cursed enemies (+80% HP, +30% damage, double coins).

## Content tables
- **Heroes (look):** Banana Slug, Frog, Pigeon.
- **Characters (builds), 46:** 22 base-style (Well Rounded, Bull, Multitasker, Ranger, Brawler, Mage, Lucky, Farmer, Glass Cannon, Pet Tamer, Speedy, Old, Chunky, Ghost, Saver, Engineer, One Armed, Knight, Masochist, Pacifist, Jack, Golem), 10 more base-style (Baby, Crazy, Mutant, Hunter, Loud, Doctor, Entrepreneur, Explorer, Arms Dealer, Sick) and 14 DLC-style (Sailor, Curious, Builder, Captain, Creature, Chef, Druid, Dwarf, Gangster, Diver, Hiker, Buccaneer, Ogre, Romantic). 12 are unlocked by achievements.
- **Weapons, 24**, 4 tiers each; combine two equal ones to tier up.
- **Pets, 8:** Catling Gun, Bonk Dog, Caterpillar, Ratzilla (tiny), Busy Bee, Coin Owl, Hedgehog, Froggo.
- **Items, ~60**, including 10 hats and items drawn on the hero (Pocket Factory pocket, glasses, crown, skillet…).
- **Enemies:** ants, tiny ants, spiders, mama/baby spiders, grasshoppers (hop), pigeons (swoop), mini mantises, frogs, froglets, toads, frog moms, turtles, gators, trees (drop fruit and crates). Bosses: Mantis King (10), Turtle Tank (15), Giant Frog King (20).
- **Achievements, 20.**

## Architecture (code map)
One HTML file, plain canvas 2D. Main parts in order: data tables (`WEAPONS`, `PETS`, `CHARS`, `ITEMS`, `EN`, `DZ`, `ACH`); vector sprite builder (`SB`, `renderParts`, `SP`, cached by `spr`); arena board (`makeBoard`); heroes (`FOODS`, `drawHero`, `drawHat`); game state (`newGame`, `startWave`, `saveRun`, `continueRun`); combat (`updWeapons`, `fire`, `updBullets`, `applyHit`, `killEnemy`); pets, structures, enemies; shop and level-up UI (HTML overlay); `draw` and `drawHud`.

## Audio
Small Web Audio beeps (hit, coin, level-up, boom…); mute in the pause menu.

## Accessibility and touch
Floating touch joystick anywhere on the screen; all menus are tap targets sized for phones. No text input. Fullscreen button (refused gracefully where not supported).

## Known limits
- Saves and unlocks live in the browser (localStorage) on one device.
- Balance was tuned with a simple test bot, not real playtesting on an iPad.
- Characters and DLC features are Claude's own versions of Brotato ideas, not exact copies.

## Re-prompt spec
Build a single-file HTML5 canvas game: a Brotato-style top-down arena survival roguelite. Hero is a yellow banana slug (also Frog and Pigeon) drawn with thick black outlines and flat colours. Up to 6 weapons orbit the hero and auto-target; melee weapons thrust, ranged ones shoot. 20 timed waves on a mixed grass-and-marsh arena with ponds; each wave mixes 3–4 random critter types (ants, spiders, grasshoppers, pigeons, mini mantises, frogs, toads, turtles, gators) with swarms and horde waves; bosses Mantis King (10), Turtle Tank (15), Giant Frog King (20). Coins drop and give XP; between waves: crate choices, level-up stat picks (4 rarity tiers), shop with weapons/items/pets, lock, reroll, combine, sell. 46 characters with Brotato-like gimmicks, Danger 0–5, Endless mode, 20 achievements unlocking characters, curse and charm, hats and items drawn on the hero, same-kind critters as friends. Save the run at each shop. Touch joystick and keyboard.

## Verification checklist
- [x] Full simulated runs to wave 20 for every character (headless Chromium), no errors
- [x] Endless mode to wave 26
- [x] Save at shop, reload, Continue restores coins, weapons, items
- [x] Boss waves wait for the boss; boss fight reachable
- [ ] Played on a real iPad
