# Ships & Villagers

- **Genre:** Cozy village-jobs sim (Stardew Valley-style), top-down with a tilted view
- **File:** `ships-and-villagers/index.html` (about 54 KB, single file; Patrick Hand font from Google Fonts)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/ships-and-villagers/`
- **Save key(s):** none (progress lasts for one visit)
- **Claude artifact:** "Ships & Villagers — World 1: The Castle Village" on claude.ai

## Brief
Built with Claude on claude.ai from a family's ongoing pretend-play universe (toys, small houses, ships and boats). The author asked for "a simple world with multiple simple levels like stardew valley", set in "gardens and village houses just outside a castle", with "a pond inside and around it", "a flat grassy area where later worlds will install the spaceport terminal", and a clay-brick castle "on an abrupt cliff at the ocean which allows ships to dock just below the castle gate". Later worlds (space, the Empire, boarding and scouting missions) are planned but not built.

## Concept and feel
World 1 is set around 1300 AD. You walk a storybook village and help the villagers. Hand-drawn doodle style: soft pastels on warm paper, wobbly brown outlines, round puffy characters.

## Controls
| Input | Action |
|---|---|
| Arrows / WASD, or tap/click a spot | Walk |
| E, Space or Enter (touch: "Do it" button) | Talk, water, fish, pick up, deliver, close gate |
| 1-4, or the hero tabs | Switch villager (Joseph, John Taylor, Ella, Snow) |

## Rules and numbers
- Five jobs, each worth one star; all five finish the world. No game over.
- Gardens: water 8 beds. Bakery: deliver 5 loaves to 5 houses. Castle pond: catch 4 fish (press again when "!" shows, 0.9 s window). Field: herd 5 sheep through the pen's east gate, then close it. Dock: carry 4 crates to the market stall (walking slower while carrying).
- Sheep flee within 95 px of the player and are drawn in near the open gate.

## Motion rules (art)
Only the player's outline "boils" (redraws every 0.12 s) and only while moving. Flowers and garden plants sway gently; field grass sways extra as the player passes; the gate's dragon banner is the one fluttering fabric.

## Architecture (code map)
Canvas 960x600 view over a 1700x1150 world. Ground pre-rendered once; buildings, trees, fences and characters are pre-rendered sprites drawn depth-sorted by their front edge (oblique view). Characters come from one `person()` drawing function with outfit options.

## Accessibility and touch
Tap to walk and a "Do it" button on touch screens. Not yet tried on a real iPad. No sound.

## Known limits
No saves; no controller support yet; fonts need internet the first time.

## Re-prompt spec
Build a single-file HTML5 canvas game: a cozy top-down village sim in a hand-drawn storybook doodle style (pastel colours, warm textured paper, wobbly dark-brown outlines, puffy characters with dot eyes and rosy cheeks), viewed at about 40 degrees so buildings show their front walls. Map: village of half-timbered houses around a well, a bakery, a vegetable garden, a grassy field with a sheep pen, a clay-brick castle with towers, keep, red banners with blue trim and black-dragon-on-gold banners, a moat and courtyard pond, on an ocean cliff with a dock and a merchant boat. Four playable villagers and five job-givers; five simple jobs (water beds, deliver bread, fish, herd sheep, carry crates), one star each. Keyboard, click-to-walk and touch.

## Verification checklist
- [x] All five jobs can be completed (automated playthrough, 2026-11-15)
- [x] Herding all sheep into the pen works with a simple strategy (about 40 s)
- [ ] Tried on a real iPad
