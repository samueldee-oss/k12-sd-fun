# Poirot the Pigeon

- **Genre:** 3D deduction game (Clue-style whodunit, no board-game turns), 1–2 players on one screen
- **File:** `poirot-pigeon/index.html` (~104 KB) plus `poirot-pigeon/three.min.js` (three.js r128, MIT licence)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/poirot-pigeon/`
- **Save key:** `poirotPigeon` (cases solved, last chosen mode / difficulty / crime scene, music on or off)
- **Brief:** a 3D game in the chunky style of Blade Mosaic. The main character is Poirot the pigeon, who works out who did it, with what weapon, when, why and where. Later asks: a 2-player mode, Agatha Christie tropes (then narrowed to Poirot books only), themed rooms per case, a pop-up drawing of each room searched with a magnifying glass, and a red herring that hard mode makes you investigate.

## Concept and feel
A crime has happened in one of three themed places: Featherstone Manor at Christmas, the snowbound Orient Express, or the Karnak steamer on the Nile. Poirot (and in 2-player mode Captain Hastings) walks a top-down 3D map of nine rooms. Stepping into a room opens a large hand-drawn picture of it. Each player moves a magnifying glass over the picture: every nook is named under the glass ("under the pillow", "inside the grandfather clock"), real clues sparkle only through the lens, and empty nooks give one of 40 jokes. Suspects stand in the pictures and can be questioned. The case ends with Poirot gathering every suspect in the hub room and explaining the solution.

## Controls
- **1 player:** WASD or arrows to walk; mouse or WASD/arrows to move the magnifying glass; click, E, Space or Enter to inspect; N notebook; Esc leaves a room.
- **2 players:** Poirot WASD + E, Hastings arrows + Enter (both walking and magnifying glasses).
- **Touch:** on-screen joystick(s) to walk; drag a magnifying glass and lift the finger to inspect.

## Rules and numbers
- Five questions per case: who (6 bird suspects), weapon (6, themed per place), where (8 rooms; the body is found in the 9th, the hub), when (5 times), why (5 motives). Every part is picked at random each case.
- **Logic guarantee:** every wrong answer is ruled out by exactly one or more true clues (alibis from other suspects, "everyone was together at…" statements, tidy-room checks, unused weapons, motive notes). The right answer is never ruled out. All clues are true except one deliberate lie in the Fake Alibi trick, which another clue exposes.
- **Easy:** extra pointing clues (feather of the culprit, fallen clock, hidden weapon, struggle in the crime room, motive note) and the notebook marks itself. **Hard:** fewer pointers, one more trick, you mark the notebook yourself, and the red herring must be investigated (look at the handkerchief again, or question the framed suspect after finding it).
- Three accusation tries; stars = 3 / 2 / 1 by tries used. Easy mode says which parts of a wrong accusation were right; hard only says how many.

## Poirot tricks used (each case: storm/isolation, the torn letter and the gathering, plus 2 (easy) or 3 (hard) of the rest)
| Trick | Source book |
|---|---|
| Isolation (Christmas snow / snowbound train / steamer mid-river) | Hercule Poirot's Christmas; Murder on the Orient Express; Death on the Nile |
| The torn letter that would have named the culprit (narrows to 2 suspects) | The Murder of Roger Ackroyd |
| The smashed watch with turned hands (fake time) | Murder on the Orient Express |
| The talking machine (fake alibi by recording) | The Murder of Roger Ackroyd |
| The spare uniform (fake alibi by disguise) | Murder on the Orient Express |
| The planted handkerchief (red herring) | Murder on the Orient Express |
| The locked room, locked from outside with a string | Hercule Poirot's Christmas |
| The crooked ornament Poirot straightens (hides the motive note) | The Mysterious Affair at Styles |
| Poirot gathers everyone for the reveal | The Mysterious Affair at Styles |

## Architecture (code map)
Data (suspects, victims, motives, text templates, the three settings with their rooms, weapons, times and furniture lists) → three.js setup → 3D birds (`makeBird`) → 3D world built per setting (`buildWorld`, `furnish3D`, snow) → 2D drawing kit (`IT` furniture painters that return their nooks, `bird2d`, `buildRoomArt`) → `newCase` (solution, tricks, talk clues, hidden clues placed into nooks) → notebook / accusation / reveal → dialog → room view and magnifiers (`openView`, `inspect`, `drawView`) → input, audio, menus → main loop and minimap.

## Systems-thinking angle
Deduction by elimination: each clue removes options from five linked lists, and the notebook is a live model of what is still possible. The tricks show how a single false input (a fake time, a planted object, a lying alibi) changes the whole conclusion until it is checked against other evidence.

## Known limits
- Needs WebGL. three.js is copied into the folder (not loaded from a CDN) so the Home Screen app works offline after one online play.
- Not yet tried on a real iPad. The room picture is sized to the screen; on a small phone the labels are small.

## Re-prompt spec
"A 3D top-down mystery game. Poirot the pigeon (bowler hat, curly moustache) walks a 9-room map; one of three themed places is chosen per case (Christmas manor, snowbound Orient Express, Nile steamer). Entering a room opens a big hand-drawn picture of it with a magnifying glass per player; nooks are named under the glass, hidden clues sparkle, empty nooks tell jokes. Six bird suspects to question. Randomly generated solvable cases: who, weapon, where, when, why, each wrong option ruled out by a true clue. Tricks only from Poirot books (smashed watch, talking machine, spare uniform, planted handkerchief, locked room, crooked ornament, torn letter). Notebook with ✗/✓, three accusation tries, Poirot gathers everyone for the reveal. Easy/hard, 1–2 players (WASD+E / arrows+Enter), touch joysticks."

## Verification checklist
- [ ] Each of the three places starts and every room opens its picture
- [ ] Every clue is placed (no lost clues) and every wrong answer is ruled out (automated check used during development)
- [ ] Both magnifying glasses work in 2-player mode
- [ ] Hard mode: the framed suspect is evasive until the handkerchief is found; looking at it again proves it planted
- [ ] Correct accusation plays the gathering and shows the tricks with their books
