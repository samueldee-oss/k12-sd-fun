# Game archive: what a fun game can look like

This folder documents the single-file browser games in this repo: what each one is, how it plays, the numbers and structure behind it, and how to rebuild it. It is meant to sit in the archive of "what a fun game can be like", alongside the systems-thinking work in the rest of the repo.

## How these games were made (provenance)

- Every game was produced by prompting Claude (claude.ai artifacts). **No game script was hand-edited**; changes were made only through further prompts.
- The original chat prompts are **not stored in this repo**. Each page below therefore describes the design **as it exists in the code**. Where the author's brief is known it is stated in "Brief"; nothing else about the history is claimed.
- The shipped `index.html` in each game folder **is the source of truth**. The specs here are for understanding and for re-prompting a rebuild, not a substitute for the file.
- Privacy rule (see `CLAUDE.md`): no personal details of students or children appear in this repo. Game docs describe design only.

## Catalog

| Game | Genre | One line | Spec |
|---|---|---|---|
| Whisker Dash | Cat-themed arcade runner | The most developed project; has its own plan docs | [whisker-dash.md](whisker-dash.md) |
| Capybara Rumble | Lane battler / roster collector | Send capybara units, defend a base, unlock a 33-unit roster | [capybara-rumble.md](capybara-rumble.md) |
| Sprout Siege | Lawn-defence strategy | 8 levels of plants vs. slime monsters on a 12x3 board | [sprout-siege.md](sprout-siege.md) |
| Endless Crucible | Crafting / discovery sandbox | Combine elements; an LLM invents new results | [endless-crucible.md](endless-crucible.md) |
| Sensory Overload | Incremental / clicker satire | Tap a button, buy ever more clutter, then leave the planet | [sensory-overload.md](sensory-overload.md) |
| Mothwick's Lantern | Bullet-hell boss with spare/fight choice | Box-dodging fight, then a walk to camp | [mothwicks-lantern.md](mothwicks-lantern.md) |
| Prism Sprint | Rhythm auto-runner | One-button cube runner, 6 levels, synthesized soundtracks | [prism-sprint.md](prism-sprint.md) |
| Thistle King | Arena boss fight | Bee dodges patterns, carries nectar to hit the boss | [thistle-king.md](thistle-king.md) |
| Rooftop Flow | Endless runner | Tricks and combos across dusk rooftops | [rooftop-flow.md](rooftop-flow.md) |
| Kitty & Lotl | Toddler-friendly catch game | Catch falling treats in a boat; 7 hidden surprises | [kitty-and-lotl.md](kitty-and-lotl.md) |
| Miriam's Sky Day | 7-level pixel adventure | Seven different mini-games in one story | [miriams-sky-day.md](miriams-sky-day.md) (held back, see note) |

## Why these are fun: patterns across the set

1. **A verb that feels good in one second.** Jump, tap, drag, catch. Each game's core action works with one finger and gives instant feedback (sound, particles, screen shake).
2. **Juice before depth.** Bursts, bobbing buttons, banners that pop, synthesized blips on every success. Where there is sound it is generated live with WebAudio, so there are no asset files (Rooftop Flow and Sprout Siege have no sound).
3. **Escalation with a safety net.** Difficulty ramps by waves, speed, or unlock tiers; failure restarts fast (Prism Sprint respawns instantly, Rooftop Flow restarts on one key) or is non-punishing (Kitty & Lotl has no fail state).
4. **Collections and secrets.** Rosters (Capybara Rumble), discoveries (Endless Crucible), hidden surprises (Kitty & Lotl), achievements and screen modes (Sensory Overload).
5. **Systems you can feel.** Economies with feedback loops: dew income vs. plant cost (Sprout Siege), wallet and cooldowns (Capybara Rumble), income-per-second compounding (Sensory Overload), combo timer (Rooftop Flow). These are natural bridges to systems-thinking teaching.
6. **Respect for the player.** Reduced-motion handling, safe-area padding, touch and keyboard parity, pause on tab hide, no accounts, no tracking, all saves local.

## Shared technical conventions

- **Single file**, no build step, no libraries: HTML + CSS + JS, canvas or DOM. Fonts via Google Fonts only.
- **Hosting:** GitHub Pages. Pages shares one origin, so each game uses a **unique localStorage key** (listed in each spec). All storage calls are wrapped in try/catch and the game must run with storage blocked.
- **Audio:** WebAudio, created on first user gesture; mute control in each game that has sound.
- **Input:** pointer events plus keyboard; `touch-action:none` on play surfaces.
- **Accessibility:** `prefers-reduced-motion` honoured where there is shake/particles; focus-visible outlines; 16px side gutters and `env(safe-area-inset-*)`.
- **Publishing wrapper:** repo copies add a small `<!doctype html>` head around the artifact body. Content is otherwise identical to the claude.ai artifact.

## Reproducing a game

See [REPRODUCING.md](REPRODUCING.md) for the recipe, a re-prompt template, and a checklist to verify a rebuild.

## Note on Miriam's Sky Day

The title and character name refer to a real person. Under the repo's privacy rule it is **not published by default** until the owner decides. Its spec is included for completeness and should be committed or excluded together with the game.
