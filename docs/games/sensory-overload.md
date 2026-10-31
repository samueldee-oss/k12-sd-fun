# Sensory Overload

- **Genre:** incremental ("clicker") game, a satire of over-stimulating apps
- **File:** `sensory-overload/index.html` (~67 KB)
- **Live link:** `https://samueldee-oss.github.io/k12-sd-fun/sensory-overload/`
- **Save key:** `overload.save`
- **Brief:** derived from the code.

## Concept and feel
You start with one calm button on a paper-coloured page. Every purchase adds more noise: pops, confetti, bouncing logos, notifications, lava lamps, a news ticker, lofi radio, fidget spinner, emoji rain, loot boxes, a slot machine. The joke and the lesson: stimulation compounds, and the "ending" is choosing to leave (touch grass, then touch the moon), after which you may return.

## Controls
Tap/click the big button (and the objects that appear: notifications, lightning bolts, fish, loot boxes, the pet, the slot lever). Shop is a list on the right (desktop) or below (phones).

## Rules and numbers
- Score is "stimulation". `tap value = (1 + thumbLevel + pop) × twinButton(2) × allMul × streakMul`.
- `cps = Σ(upgrade.cps × level) × allMul`.
- `allMul = overclock(2) × grass(3) × hyperdrive(5^lv) × moon(10) × synth(2) × cosmicBoost(1.5^n) × happyPet(1.25) × 1.05^(screen modes owned)`.
- Streak multiplier: `1 + min(streak,40)/20` (up to ×3) once bought.
- Stronger thumb cost `ceil(10 × 1.55^level)`; level-up of tiered upgrades costs `cost × 4^level` (max 3 levels); Cosmic boost `2e9 × 3^n`.
- Number format: k, M, B, T, Qa, Qi.
- Shop shows the next 3 unowned upgrades, a "???" teaser for the 4th, then level-ups, screen modes and the endless sinks.
- Reset requires a confirm tap within 3 s.

## Content tables
**Tier 0 "Indoors" (23 upgrades + the first ending):** Satisfying pop 15 · Tap confetti 50 · Bouncing logo 120 · Notifications 300 · Lava lamp 700 · Auto-tapper 1,000 · Progress bars 1,500 · Background music 2,500 · News ticker 3,200 · Lofi radio 4,500 (5 tracks) · Fidget spinner 6,500 · Emoji rain 9,000 · Live stim chart 12,000 · Loot boxes 22,000 · Slot machine 30,000 · Rooftop runner clip 40,000 · Second button 70,000 · Virtual pet 95,000 · Color drift 120,000 · Tap streak 160,000 · Achievement spam 200,000 · Crowd cheer 350,000 · Overclock 600,000 · **Touch grass 2,000,000** (scene; can return).

**Tier 1 "Back inside" (level-up ×3 each):** Thunderstorm 3M · Aquarium 8M · Drop the beat 12M · Disco ball 18M · Meme stock 40M · Logo swarm 90M · Hyperdrive 200M · **Touch the moon 1B** (scene; can return).

**Tier 2 "Beyond":** Space synth 5B, then Cosmic boost and Stronger thumb as endless sinks.

**Screen modes (+5% each):** Dark mode 2k · Inverted 8k · Old photo 25k · Black & white 60k · Vaporwave 150k · Retro terminal 400k · Deep fried 3M · Upside down 15M.

## Architecture (code map)
Everything is one IIFE. Data (`UP`, `TIERS`, `MODES`) → state (`S`, saved as JSON) → formulas (`allMul`, `tapVal`, `cps`) → sound (SFX kit, 5 lofi tracks synthesized live, a 4-bar C–Am–F–G loop that gains layers as upgrades are bought) → one effect module per upgrade (DOM or canvas overlays inside `#fx`) → screen modes → shop renderer → `SCENES` (the two "endings" and the way back) → boot and main loop.

## Audio
All synthesized. Music gains layers with purchases; mute and volume controls; radio track picker.

## Accessibility and touch
Honours `prefers-reduced-motion` (`RM`). Shop is a plain button list. Because the design is deliberately overstimulating, the reduced-motion path matters; check it when changing effects.

## Known limits
Late numbers are floating point; very long play can reach display limits (Qi). A `done` flag from an earlier save format is migrated to scene `grass`.

## Re-prompt spec
"A one-button incremental game that satirizes stimulation: a calm start and 24 clutter upgrades (list), a 'touch grass' ending that you can return from, a second tier of 3-level upgrades with a moon ending, then endless sinks. Include screen-mode cosmetics with +5% each, a virtual pet multiplier, tap streaks, lofi radio with five synthesized tracks, a layered music loop, achievements and a news ticker. Save to localStorage `overload.save`."

## Verification checklist
- [ ] First purchase affordable after about 15 taps
- [ ] Touch grass appears at 2M and can be left
- [ ] Reload keeps owned upgrades and mode
- [ ] Reduced-motion removes flashing effects
