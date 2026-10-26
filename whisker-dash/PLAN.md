# Whisker Dash: game plan

This is the design plan for Whisker Dash, a single-file pixel-art platformer in `index.html`.
It describes what the game is, how it is organized, and how the plan grew over each round of requests.
A new session should be able to read this file plus [`GAME-FILE.md`](GAME-FILE.md) and continue the game, or check that
`index.html` matches the plan. The exact game is the file itself; this plan explains it.

- **How it was made:** designed through prompts to Claude on claude.ai (October 2026). All code was written by Claude; per the author, none was edited by hand.
- **Where it runs:** any browser. Open `index.html`, or the "Whisker Dash" card on the dashboard. It also runs as a claude.ai artifact.
- **Place in the project:** it lives in this repo next to Pong and has a dashboard card. It is not yet tied to the systems-thinking lessons.

## 1. The game in one paragraph

You are a cat (or a chicken, puppy, sheep, penguin, frog, platypus, capybara, puffin, deer…) running through
**49 worlds and 240 levels** to reach the fish at the end of each level. Every world has its own look, music,
physics quirk, hint and a "story" transition screen ("WHOOSH! A giant wave swept the cat into… THE OCEAN").
Between levels you pick upgrades (powers and skins). Each world gives you a wearable accessory. In the middle of
the game is the **Hotel Lobby**, a hub with talking friends, a fair with rides, a chicken party, a pool, a bounce
house and food stands. The game supports 1 player, 2-player co-op and 2-player speed battle, keyboard and touch.

## 2. Core rules

| Topic | Rule |
|---|---|
| Goal | Touch the goal at the end of the level. Usually a fish; chicken skins get a grasshopper, sheep get grass, frogs get flies. |
| Death | Spikes, pits, hazards. You restart at the last checkpoint flag. Shields (from Nine/Ten Lives) absorb one hit each; Tower of London lasers do 2 damage. |
| Story run | Play worlds in order. Run time and deaths are tracked; the lobby pauses the timer. "Continue run" resumes from a save in the browser (`localStorage`, key `whiskerdash`). |
| Level select | Unlocks after beating 2 worlds; replay any level you have beaten. |
| Upgrades | After each level, pick 1 of 3 cards (powers or skins). Max 10 powers; you can delete one. Skins reset on a new run. |
| Accessories | Each world gives one on arrival (or when you have already beaten it). One per body spot: hat, face, neck, held. |
| Two players | Co-op (share the screen) or battle (race; the camera follows the leader). |
| Controls | Arrows/WASD + Space/↑ to jump, Shift/X dash, ↓ tiptoe/belly-slide/dive/pound, pause button, fullscreen button, on-screen touch pad. |

**Powers (upgrade cards):** Double Jump, Triple Jump, Zoomies, Spring Paws, Nine Lives, Whisker Glide, Pounce Dash, Kitten Size,
Fish Sense, Grippy Paws, Wall Jump, Cat Reflexes, Bouncy Tail, Lucky Bell, Phase Dash, Ground Pound, Ten Lives, Slow Whiskers,
Moon Boots, Cat Eyes, Heavy Paws, Feather Fall, Super Spring.

## 3. World order

Play order is `WORDER` in the code. World id 32 (Tower of London) was added later and is played between 30 and 31.
"Quirk" is the world's physics or hazard flag in `PHYS`. The accessory is what you get on arrival.

| # | id | World | Levels (style) | Quirk | Hint shown on level 1 | Accessory |
|---|---|---|---|---|---|---|
| 1 | 1 | ROOFTOPS | Alley Stroll; Rooftop Gaps; Clothesline; Spike Garden; Catnip Castle (cave) | - |  | Bell Collar |
| 2 | 2 | THE OCEAN | Shallow Reef; Kelp Forest; Urchin Valley; Coral Castle; The Deep (cave) | - | lower gravity down here! | Bubble Helmet |
| 3 | 3 | THE SEWERS | Drain Pipe; Sludge Run; Rat Tunnels (cave); Grate Expectations; The Big Flush | - | watch the dripping pipes! | Hard Hat |
| 4 | 4 | HIGH MOUNTAINS | Snowy Trail; Icicle Pass; Frozen Falls; Avalanche Ridge; The Summit (climb) | - | the ground is icy! | Red Scarf |
| 5 | 5 | THE JUNGLE | Jungle Path; Mud Pits (gaps); Vine Hollow (movers); Temple Steps (climb); Canopy Crown (allmovers) | vines | thick mud: you run slower | Flower Crown |
| 6 | 6 | THE STREETS | Main Street; Cone Zone (spikes); Window Washers (movers); Construction Site (bridge); Downtown Dash (finale) | - | scooter speed: fast but slidey | Headphones |
| 7 | 7 | LONDON | Foggy Lane; Drizzle Docks (bridge); Double-Decker Hop (movers); The Underground (cave); Clock Tower (vert) | fog | thick fog! hold jump while falling to float with your umbrella | Top Hat |
| 8 | 8 | THE AIRPORT | Check-In; Security Line (spikes); Baggage Claim (movers); Jet Bridge (bridge); Runway (finale) | push | moving walkways push you forward | Pilot Goggles |
| 9 | 9 | TOKYO | Neon Alley; Lantern Roofs (movers); Ramen Row (spikes); Shrine Steps (climb); Skyline Sprint (finale) | ts | everything runs in turbo time | Headband |
| 10 | 10 | THE BEACH | Sandy Toes; Tide Pools (gaps); Pier Hop (bridge); Surf's Up (movers); Sandcastle (climb) | wind | the sea breeze pushes you around | Sun Hat |
| 11 | 11 | THE LAUNCHPAD | Mission Control (cave); Fuel Depot (spikes); Elevator Ride (movers); Gantry Climb (climb); Countdown (finale) | - | heavy gravity on the launchpad | Mission Cap |
| 12 | 12 | SPACE | Low Orbit; Moon Bounce (bounce); Asteroid Belt (movers); Space Station (cave); Comet Tail (finale) | - | super floaty space gravity | Space Helmet |
| 13 | 13 | ALIEN PLANET | Glow Grove; Spore Swamp (gaps); Crystal Caves (cave); Sneaking Aboard (movers); The Bridge (cave) | gmin, gwave | gravity goes up and down | Alien Antennae |
| 14 | 14 | EGYPT | Dune Walk; Oasis (gaps); Flying Carpets (movers); Pyramid Climb (climb); Pharaoh's Vault (cave) | - | hot desert air: you jump higher | Cool Shades |
| 15 | 15 | HIGHLANDS | Heather Hills; Misty Loch (gaps); Thistle Field (spikes); Rope Swings (movers); Castle Ruins (climb) | ts | misty moors: everything in slow motion | Tartan Scarf |
| 16 | 16 | PARIS | Croissant Lane; Café Awnings (bridge); River Seine (gaps); Balloon Ride (movers); The Grand Tower (climb) | freeAir | café energy: a free double jump | Beret |
| 17 | 17 | THE GLACIER | Frost Field; Crevasse Run (gaps); Ice Floes (movers); Ice Caves (cave); Icicle Peak (hazard) | drip | slippery ice and falling icicles! | Winter Beanie |
| 18 | 18 | PIRATE COVE | Sandy Dock; Plank Walk (bridge); Barrel Bob (movers); Cannon Bay (hazard); Captain's Ship (finale) | cannon | watch out for cannonballs! | Pirate Bandana |
| 19 | 19 | MAYAN TEMPLES | Jungle Gate; Crumbling Steps (bridge); Serpent Hall (cave); Stone Swings (movers); Sun Pyramid (climb) | crumble | old stone slabs crumble under your paws | Jungle Feather |
| 20 | 20 | ANCIENT ROME | Cobble Road; The Forum (spikes); Aqueduct (bridge); Chariot Race (movers); The Colosseum (finale) | walljump | tall columns: everyone can jump off walls! | Laurel Wreath |
| 21 | 21 | THE SUBURBS | Cul-de-Sac; Picket Fences (spikes); Backyard Bounce (bounce); Tire Swings (movers); Block Party (finale) | tramp | trampolines in every backyard! | Baseball Cap |
| 22 | 22 | THE STORE | Entrance; Snack Aisle (spikes); Frozen Foods; Checkout Lane (movers); Closing Time (finale) | cannon, cart | look out for runaway shopping carts! | Bow Tie |
| 23 | 23 | THE LIBRARY | Front Desk; Picture Books (spikes); Rolling Ladders (movers); Tall Stacks (climb); Quiet Zone (finale) | library | shh! hold ↓ to tiptoe. Too much noise wakes the librarian! | Reading Glasses |
| 24 | 24 | MAD SCIENTIST LAB | Test Tubes; Geyser Floor (hazard); Beaker Lifts (movers); Tesla Tower (climb); The Doctor's Desk (finale) | geyser | watch out for the green geysers! | Lab Goggles |
| 25 | 25 | INSIDE A PC | Motherboard (vert); Cooling Fans (vert); RAM Ridge (vert); CPU Core (vert); Power Supply (vert) | walljump | climb to the exit at the TOP! you can wall-jump here | Pixel Shades |
| 26 | 26 | THE DIGITAL WORLD | Boot Up; Glitch Gap (gaps); Pixel Bridge (movers); Firewall (spikes); The TV Exit (finale) | glitch | glitchy blocks blink on and off! | 3D Glasses |
| 27 | 27 | HOTEL LOBBY | Hotel Lobby (lobby) | lobby | take a break! walk up to friends and press jump to chat | Party Hat |
| 28 | 28 | ANTARCTICA | Penguin Point; Ice Shelf Slide (gaps); Floe Hop (movers); Penguin Rafts (rafts); Iceberg Climb (climb); South Pole (finale) | slide | hold ↓ to belly-slide like a penguin! | Earmuffs |
| 29 | 29 | THE SCOTTISH CASTLE | Gatehouse; Drawbridge (bridge); Great Hall (cave); Tower Stairs (climb); The Battlements (finale) | guard | sneak! hold ↓ to tiptoe. Noise alerts the guard! | Highland Bonnet |
| 30 | 30 | BUCKINGHAM PALACE | Palace Gates; Garden Hedges (spikes); Corgi Parade (movers); The Throne Room (cave); Royal Grounds Chase | guard | sneak! hold ↓ to tiptoe. Noise alerts the royal guard! | Royal Crown |
| 31 | 32 | TOWER OF LONDON | Traitors' Gate; The Moat (gaps); Laser Corridor (spikes); Jewel House (bridge); The White Tower (finale) | lasers | security test! red lasers blink on and off: wait for them to switch off |  |
| 32 | 31 | MANGROVE SWAMP | Muddy Banks; Root Bridges (bridge); Lily Pad Hop (movers); Gator Gulch (hazard); Mangrove Maze (finale) | gator | watch out for snapping gators in the water! | Frog Friend |
| 33 | 33 | THE JUNGLE CANOPY | Treetop Trail; Vine Bridges (movers); Monkey Business (bridge); Leafy Leaps (gaps); The High Canopy (allmovers) | vines | swing through the treetops on vines |  |
| 34 | 34 | THE EIFFEL TOWER | First Floor (vert); Second Floor (vert); The Summit (vert) | walljump | wall-jump up the iron tower! |  |
| 35 | 35 | THE CASTLE DUNGEONS | The Stairs Down; Rattling Chains (movers); Crumbling Cells (spikes); Dripping Tunnels (cave); The Deepest Dungeon (finale) | crumble, dark | it's dark down here… and some floors crumble |  |
| 36 | 36 | THE BOUNCY CASTLE | Front Door Flop (bounce); Boing Hall (bounce); Squishy Steps; Turret Trampolines (bounce); The Big Bounce (finale) | tramp | everything is bouncy! |  |
| 37 | 37 | THE ICE CAVES | Frozen Entrance; Icicle Alley (cave); Crystal Cavern (gaps); Slippery Slopes (spikes); The Frozen Heart (finale) | drip | slippery ice and falling icicles! |  |
| 38 | 38 | YELLOWSTONE | Old Faithful (hazard); Bison Meadow; Grand Prismatic (gaps); Mud Pots (hazard); Steamy Summit (finale) | geyser | geysers erupt on a timer: wait for them to stop |  |
| 39 | 39 | CLOUD WORLD | Cloud Nine; Fluffy Hops (gaps); Rainbow Bridge (bridge); Thunder Puffs (movers); Above the Sky (finale) | - | light and floaty up in the clouds |  |
| 40 | 40 | THE REDWOOD FOREST | Forest Floor; Ladder Lane (spikes); Branch Hopping (gaps); Giant Sequoia (bridge); The Tallest Tree (finale) | ladders | hold ↑ on a ladder to climb up to the branches! |  |
| 41 | 41 | MACHU PICCHU | Inca Trail; Stone Terraces (climb); Sun Gate (spikes); Llama Path (gaps); Temple of the Sun (finale) | - | thin mountain air: you jump higher |  |
| 42 | 42 | MILLIONAIRES' ROW | Gated Community; Fancy Fountains (bounce); Golden Gardens (bridge); Pool Party (gaps); The Penthouse (finale) | - | polished sidewalks: fast and fancy |  |
| 43 | 43 | THE MOVIE THEATER | Ticket Line; Snack Bar (bridge); Stadium Seats (climb); Lights Out (cave); The Big Screen (finale) | dark | the lights are off! you can only see near you |  |
| 44 | 44 | MAD SCIENTIST LAB II | Return to the Lab (hazard); Laser Labs; Bubbling Beakers (hazard); Robot Room (spikes); The Shrink Ray (finale) | geyser, lasers | geysers AND lasers this time! |  |
| 45 | 45 | YARN WORLD | Button Hills; Spool Stairs (climb); Knitting Needles (spikes); Thread Swings (movers); The Giant Sweater (finale) | tramp, vines | everything is soft and bouncy |  |
| 46 | 46 | THE FOAM PIT | Splash Zone; Cube Canyon (gaps); Deep Dive; Squishy Stacks (spikes); The Foam Sea (finale) | foam | walk on the foam, or hold ↓ to dive in and swim! |  |
| 47 | 47 | THE STATUE OF LIBERTY | Liberty Island; The Pedestal (climb); Harbor Hop (gaps); Crown Stairs (spikes); The Torch (vert) | wind | a strong harbor wind is blowing |  |
| 48 | 48 | NEW YORK CITY | Times Square; Taxi Rush; Rainy Avenue (spikes); Foggy Bridge (gaps); Rooftop Finale (finale) | traffic | watch out for taxis! jump over them, or bounce on their roofs |  |
| 49 | 49 | ICELAND | Black Sand Beach; Geyser Fields (hazard); Glacier Lagoon (gaps); Volcano Ridge (spikes); Northern Lights (finale) | geyser, wind | windy, slippery and full of geysers |  |

Story moments: the Captain (Alien Planet), Pharaoh's treasure (Egypt), the shrink ray into the PC (world 25), the TV exit
(world 26), Queen Purrcilla makes you **Royal Mouser** (end of The Throne Room), the mouse chase, the Tower of London
security test, the **knighting scene** and Beefeater Hat (The White Tower), the second shrink ray into Yarn World (end of
Mad Scientist Lab II). Iceland is the last world; finishing it shows the final screen.

## 4. Characters and unlocks

- **Skins (79):** 34 cat coats, 8 chickens, 9 dogs, 7 sheep (incl. Icelandic Sheep), 6 penguins, 5 frogs, 3 capybaras, 3 deer, 2 puffins, 2 platypuses.
- **Unlocked by playing:** Penguin (arrive in Antarctica), Capybara (end of Canopy Crown), Puffin (end of The Battlements), Frog (end of Lily Pad Hop),
  Platypus (end of Mangrove Maze), Deer (end of Grand Prismatic), Icelandic Sheep (arrive in Iceland). Chicken, Puppy and Sheep are rare upgrade cards from level 10; their breeds then appear as cards.
- **Copyright rule (keep):** no character from TV, films or games. The platypus is light green with a blue frog "Pip" on its head and wears no hat;
  it must never look like a well-known cartoon platypus. The "Queen" is an original cat, Queen Purrcilla, not a real person.
- **Accessories (36):** 31 world accessories (one per world 1–31) plus Beefeater Hat (knighting), Knitted Sweater (say yes to the knitting Sheep),
  Prize Balloon (win Ring Toss), Snowflake Badge (bring a snowball to the Snow Leopard), Umbrella (with the Top Hat in London).

## 5. The Hotel Lobby (world 27)

A hub level; the timer is paused there. Left to right:
1. **Lobby inside:** Bellhop, Librarian, Castle Guard and Palace Guard (each guard only after you beat one level of their world), and up to 8 friends (your unlocked skins).
2. **The fair:** Ferris wheel, a tall clock tower to climb (bell at the top), carousel, pirate ship, drop tower, roller coaster.
3. **Chicken Party:** 8 named chickens; hold ↓ to dance and they dance with you.
4. **Bounce house and pool:** bouncy floor; swim in the pool. Animals live there (Splash, Floaty, Lily; Boing, Sprinkle, Sproing).
5. **Food court:** Popcorn (popcorn burst), Cotton Candy (12-second Sugar Rush), Games (Ring Toss mini-game).
6. **Friends** beyond 8 hang out past the food court. The Snow Leopard is always by the pool.

**Talking:** walk up and press jump. Every character has their own lines (`LINES`) and asks a question (`ASK`) answered with ← → and jump,
Undertale style. Lines in (parentheses) are acted out by the character with the text box hidden. Same-breed greetings come first
(exact same skin: "long-lost twin"). Some answers start games: fetch (Black Lab), hide-and-seek (Snowball), the stands.
The Castle Guard's line depends on how often you maxed the noise bar in the Scottish Castle.
Once you have visited the lobby in a run, most later levels have a floating **LOBBY portal** before the fish; jumping into it finishes the level and takes you back.

## 6. Special mechanics (by world)

| Mechanic | Where | How it works |
|---|---|---|
| Vertical levels | Inside a PC, London's Clock Tower, Eiffel Tower, The Torch | Climb up to the fish; wall jumps allowed. |
| Noise meter and chase | Library, Scottish Castle, Buckingham Palace | Running and air jumps make noise; tiptoe with ↓. Full meter wakes the librarian or a guard who chases you. |
| Moving platforms ("movers") | Many | Swing, slide, lift, bob, orbit, wheel; each world has its own skin (vines, buses, corgis, rafts…). |
| Penguin Rafts | Antarctica 4 | Wide water; air jumps, glide, umbrella float and air dash are off (`noAir`), so you must ride the rafts. |
| Lasers, tripwires, fog machines | Tower of London, Lab II | Beams blink on/off (yellow warning). Lasers do 2 damage. |
| Mouse chase | Royal Grounds Chase | A mouse runs ahead; catch it at the end. |
| Ladders and branches | Redwood Forest | Hold ↑/jump on a ladder to climb, hang when you let go, step onto branch platforms; or stay on the ground route. |
| Foam | Foam Pit | Walk on top, or hold ↓ to dive in and swim. |
| Taxis | New York City | Taxis drive back and forth; jump over them or bounce on the roof. Rain and fog on later levels. |
| Darkness | Castle Dungeons, Movie Theater | You only see a circle around your cat. |
| Geysers | Lab, Yellowstone, Lab II, Iceland | Erupt on a timer. |
| Snowball quest | Antarctica → lobby | Grab the glowing snowball, carry it on your head, give it to the Snow Leopard. |

## 7. Plan iterations

Each row is one round of requests from the designer and what the plan became. Exact prompts are in
[`docs/provenance/transcripts/05_claude_2026-10_whisker-dash.md`](../docs/provenance/transcripts/05_claude_2026-10_whisker-dash.md).

| # | Round | What the plan added or changed |
|---|---|---|
| 0 | Boss-fight request | The first request was a variation on a well-known flower boss fight and its song. Declined (copyrighted character and lyrics); an original "Thistle King" boss was made instead as a separate file. Not part of Whisker Dash. |
| 1 | First game | Cat platformer: spikes, checkpoints, restart, a fish at the end, 5 levels (Rooftops). |
| 2 | Ocean | World 2 under water with lower gravity and coral platforms; upgrade cards (pick 1 of 3) from level 3; more powers. |
| 3 | Progression | Level select after 2 worlds; timer and run time; skin changer; final screen; Sewers and High Mountains; original music. |
| 4 | Many worlds | Jungle, Streets, London (fog), Airport, Tokyo, Beach, Launchpad, Space, Alien Planet, each with a quirk; particles. Speedometer and Earth dropped. |
| 5 | More worlds | Egypt, Scottish Highlands, Paris, Glacier. No finale yet ("I plan to make it BIG"). |
| 6 | Fairness and 2 players | Upgrades from level 1; no level select at the start of a new run; skins reset per run; Pirate Cove, Mayan Temples, Rome; co-op and speed battle; triple jump only later; max 10 powers with delete. |
| 7 | Polish | Upside-down spikes you can stand on; lost-save fix; Suburbs and Store; secret animal friends (birds, then chickens, dogs, sheep) as rare upgrade cards; swinging vines. |
| 8 | Repo and touch | Placed in the repo next to Pong (dashboard card); touch controls. |
| 9 | Story | Level names match their content; animated end-of-world transitions; special platforms; Canopy Crown all vines. |
| 10 | Big expansion | Library with tiptoe noise and librarian chase; Mad Scientist Lab with geysers; Inside a PC (vertical, exit at top); Digital World with TV exit; Hotel Lobby with Undertale-style talking and paused timer; Antarctica with penguins. |
| 11 | Tuning | Slower noise meter; air jumps make noise; librarian at the party; penguin raft level; pause button; more cat and chicken skins; capybara unlocked at Canopy Crown. |
| 12 | Castles | Fullscreen; Scottish Castle and Buckingham Palace with the same sneaking rule and guard cats; guards at the party. |
| 13 | Details | Chicken breed details; scarf animation; London umbrella (hold jump to float); London's Clock Tower became a vertical parkour level. |
| 14 | Mangrove | Mangrove Swamp with gators; frog and platypus skins (with the copyright rule above). |
| 15 | Accessories and fair | Crisper pixels; more skins; one accessory per world, unlocked on arrival; a fair outside the lobby; rideable Ferris wheel. |
| 16 | Tower and puffin | Climbing tower with a bell at the fair; puffin unlock. A backup plan (`NEXT-STEPS.md`) in case a session ends early. |
| 17 | Rides and fixes | Taller tower; carousel, pirate ship, drop tower, roller coaster; sunglasses redrawn; sun stays in the sky; 18 more skins. |
| 18 | Screens and goals | World transition screen fixed (5 s with countdown, skippable); goal matches your skin (grasshopper, grass, flies). |
| 19 | Royal story | Queen Purrcilla, Royal Mouser, mouse chase; new Tower of London world (lasers, fog machines, knighting, Beefeater Hat). |
| 20 | Conversations | Every character has unique lines and an answerable question; funny chickens; Sweater from the Sheep; fetch, hide-and-seek, Chicken Party. |
| 21 | Lobby area 3 | Parentheses lines acted out in the world; lag fix; bounce house and pool; usable food stands; pool and bounce animals; same-breed greetings; snowball quest; umbrella as accessory. |
| 22 | Flow | LOBBY portal near the end of levels; no spoiler hints; accessories by body spot; dancing at the party; guards appear after their world; rafts can't be skipped; Castle Guard remembers your noise. |
| 23 | Harder tower | Laser Corridor: 10 lasers, 5 fog machines; lasers do 2 damage; knighting animation. |
| 24 | 17 new worlds | Jungle Canopy → Iceland (order as requested); ladders, foam, taxis, darkness; Deer and Icelandic Sheep; skin previews in the picker; accessories granted for worlds you already reached; the game keeps running if an error happens. |
| 25 | Save fix | Replaying a level from level select no longer resets where "Continue run" goes; it always resumes at the furthest level reached. |

## 8. Ideas not built yet

- An ending for Iceland bigger than the final screen.
- Accessories for worlds 32–49.
- Bumper cars or a log flume at the fair.
