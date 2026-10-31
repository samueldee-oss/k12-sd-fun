# Thistle King

- **Genre:** single-arena boss fight
- **File:** `thistle-king/index.html` (~16 KB, the smallest)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/thistle-king/`
- **Save key:** none
- **Brief:** derived from the code.

## Concept and feel
You are Buzz, a bee. The Thistle King has choked the meadow. You cannot shoot: you must pick up a glowing nectar drop and fly it into his crown to hurt him, which forces you to move toward danger. A 480×480 dusk-garden arena, pixel fonts, an original chiptune called "Bramble Waltz".

## Controls
Arrows / WASD, or press and drag on the arena (the bee follows your finger/pointer). Mute button.

## Rules and numbers
- Bee: 6 HP, speed 190 px/s, 1.2 s invulnerability after a hit. While carrying nectar the bee may fly higher (`y ≥ 40`) than when empty (`y ≥ 150`); getting hit drops the nectar.
- Boss: 30 HP; each nectar delivery deals 3 (10 hits to win); phases at HP > 20, > 10, ≤ 10.
- Nectar: one drop at a time, spawns after each pattern, somewhere in the lower arena.
- Patterns cycle: **seedburst** (3.2 s, radial ring, 10+3·phase seeds), **thorns** (3.6 s, telegraphed horizontal spikes, faster per phase), **spiral** (3.4 s, petals, extra arm in phase 2), **fluff** (3.4 s, drifting falling puffs). Pattern gap 0.6 s; in the last phase patterns are skipped half the time.
- Win text shows the time taken.

## Architecture (code map)
Audio (BPM 152 step sequencer: lead melody, bass, hi-hat noise) → input → state (`boss`, `bee`, `shots`, `nectar`) → `pats` array → `update` (movement, patterns, collisions, nectar, particles) → `end` → `draw` (boss, shots, bee drawn with canvas primitives).

## Audio
Original square/triangle chiptune, A-minor-ish; SFX via short oscillators.

## Accessibility and touch
Reduced motion cuts particles by a third and disables shake; pointer-drag steering; large buttons.

## Known limits
No save or difficulty options. One boss.

## Re-prompt spec
"A 480×480 pixel arena. A bee must collect nectar and deliver it to a thistle boss's crown to damage it (30 HP, 3 per delivery). Boss cycles four projectile patterns with three phases. Bee has 6 HP and brief invulnerability. Keyboard and drag controls. Original chiptune."

## Verification checklist
- [ ] Only nectar damages the boss
- [ ] Being hit while carrying drops the nectar
- [ ] Thorns show a warning before moving
- [ ] Win and lose screens both offer a retry
