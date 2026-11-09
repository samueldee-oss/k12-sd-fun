# Ionuț's Climb: Through Romania

- **Genre:** 3D third-person parkour / platformer
- **File:** `ionuts-climb/index.html` (about 60 KB, single file; loads three.js r128 from cdnjs)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/ionuts-climb/`
- **Save key(s):** `ionut_climb_v1` (best time and coins per site)
- **Claude artifact:** "Ionuț's Climb: Through Romania" on claude.ai

## Brief
A 3D parkour, jumping and climbing game. The player is a man with hazel hair in Romanian *costum național*, visiting Romanian sites, with checkpoints. Later requests added smoother movement, animated water, collision fixes and four more sites. Bran Castle shows only its real history (no vampire material).

## Concept and feel
Low-poly floating courses in the style of "Only Up". Each site is a run of platforms that climbs from a start area to a finish ring. Touching a tricolor flag saves a checkpoint and shows a short fact about the place, so the game doubles as a geography and history tour.

The hero, Ionuț, wears the men's costume of the Pădureni area (Hunedoara): white shirt with black and red cross-stitch (drawn as pixel textures), red woven belt (brâu), white trousers (ițari), opinci shoes, black felt hat and a woven bag (traistă). He has hazel hair and a mustache.

## Controls
| Input | Action |
|---|---|
| W A S D / arrows | Move (relative to the camera) |
| Space | Jump (hold for a higher jump; buffered and with coyote time) |
| Shift | Run |
| Walk into a vine, ladder or stone wall | Climb; Space kicks off the wall |
| Mouse drag, Q / E | Turn camera; scroll to zoom |
| R | Back to last checkpoint |
| P / Esc | Pause; M toggles sound |
| Touch | Joystick (left), JUMP and RUN buttons (right), drag to turn camera |

## Rules and numbers
- Gravity 32, jump speed 11.5 (about 2 m high), walk 7, run 10.5. Player box radius 0.42, height 1.8.
- Falling below a site's kill height or touching water returns you to the last checkpoint and counts a fall.
- Platform types: solid, moving (sine path), crumbling (falls 0.75 s after you stand on it, returns after 3.8 s), bounce (launch speed 18), climbable.
- Stats per run: time, coins collected, falls. Best time and most coins are saved per site.

## Content tables
| # | Site | Region | Signature features |
|---|---|---|---|
| 1 | Muntele Găina | Apuseni | Haystack bounce, vine wall, logs over a mountain lake, Girls' Fair at the top |
| 2 | Castelul Corvinilor | Hunedoara | River pillars, battlements, raven-and-ring emblem at the finish |
| 3 | Roșia Montană | Alba | Dark Roman gold galleries, mine carts, lift, gets lighter near the exit |
| 4 | Sarmizegetusa Regia | Orăștie Mountains | Circle of sanctuary pillars, murus dacicus wall, Andesite Sun |
| 5 | Cetatea Devei | Hunedoara | Funicular ride, ruins, rising slabs, big tricolor flag |
| 6 | Detunata Goală | Apuseni | Hexagonal basalt columns, piston columns, thunderstorm |
| 7 | Cetatea Făgărașului | Brașov | Moat rafts, drawbridge, princes' palace roof |
| 8 | Castelul Bran | Brașov | Cliff climb, white walls and red roofs, Queen Marie's crown |
| 9 | Râul Arieș | Apuseni | Stepping stones, log rafts, gold panning, water mill |

Each site has 3 checkpoint facts and one finish fact (in the `LEVELS` array).

## Architecture (code map)
- `B(x, top, z, w, h, d, colour, options)` adds an axis-aligned platform whose top is at `top`. Options: `cap`, `move`, `crumble`, `bounce`, `climb`, `hazard`, `round`, `hex`, `coin`.
- `cp()` adds a checkpoint flag, `finish()` the finish ring, `coin()` a coin; `pine`, `leafy`, `tower`, `house`, `tent`, `sign` and others are decoration (trees, tents and posts get invisible colliders).
- Collision: per-axis box resolution with step-up (0.55), ledge assist, and carrying on moving platforms.
- Camera: third-person orbit that stops in front of solid platforms (raycast).
- `window.__game` exposes a few hooks used for automated checks.

## Audio
All sound is generated live with WebAudio (jump, coin, checkpoint jingle, bounce, crumble, fall, thunder, finish fanfare). No audio files.

## Accessibility and touch
Keyboard-only play works, including camera turning with Q/E. Touch devices get an on-screen joystick and buttons.

## Known limits
- three.js comes from cdnjs, so the Home Screen app's offline mode only works if the browser has that file cached.
- Each site was checked by script (every checkpoint holds the player; climbing, carts and the funicular work), but not every site has been played start to finish by a person.
- Not yet tried on a real iPad.

## Re-prompt spec
A single-file three.js (r128, cdnjs) 3D parkour game, "Ionuț's Climb: Through Romania". Hero: hazel-haired man with mustache in the Pădureni men's costume (black/red cross-stitch shirt, red brâu, white ițari, opinci, black hat, traistă). Nine floating low-poly courses, one per site (table above), each with 3 tricolor checkpoints that show a short true fact, coins, moving, crumbling, bounce and climbable platforms, and a finish ring. WASD, Space, Shift, Q/E camera, touch joystick. Menu with site cards and best times, pause and finish screens styled with a red/black folk border. Bran Castle uses only its real history.

## Verification checklist
- [x] All 9 sites load with no console errors (headless Chrome).
- [x] All 27 checkpoints hold the player in place.
- [x] Climbing, the funicular and moving platforms carry the player.
- [ ] Each site played start to finish by a person.
- [ ] Tried on a real iPad.
