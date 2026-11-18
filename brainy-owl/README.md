# Brainy Owl: CogAT Level 7 thinking games

Adaptive practice for all nine CogAT Level 7 (Grade 1) question types. The child side needs no reading: every instruction is spoken (Web Speech API), and quantities are drawn, never written as numerals. One file, `index.html`. Progress stays in the browser's localStorage; there is no server.

| Battery | Question types |
|---|---|
| Verbal | Picture Analogies, Picture Classification, Sentence Completion |
| Quantitative | Number Analogies, Number Puzzles, Number Series |
| Nonverbal | Figure Matrices, Paper Folding, Figure Classification |

## How it works
- **Generators, not a question bank.** Each type has a generator with 5 levels (Foundation → Mastery). Every question is checked before it is shown. A question is thrown away if two choices look alike, if a second answer could be argued for, or if another simple rule fits the stem. Number series are checked against arithmetic, repeating, alternating, quadratic, doubling and interleaved rules. Paper folding is simulated geometrically, and the tests check it against an independent forward-folding simulation.
- **Diagnostic.** Three short parts, one per battery, 6 questions each. Each type gets one single-rule question and then a multi-attribute question with look-alike answers, or an easier one if the first was missed.
- **Skills profile.** Every question is tagged with the skills it needs: relationship, holding several attributes, spatial, number pattern, telling apart look-alike answers. Every first wrong pick is classified as almost-right or unrelated.
- **Practice plan.** Play gives most questions to unmastered types and weak skills. Mastered types only come back for spaced review (1, 3, 7 and 21 days). Missed ideas come back 2–3 questions later in a new picture. Each round starts with a warm-up and ends on an easier win. After two misses in a row the next question is easier. A soft daily limit suggests a rest.
- **Mastery** needs all five: accuracy (Wilson lower bound), difficulty (level 5), variety, transfer (first-try wins on known ideas in a new look) and retention (right again on later days). Very fast taps never count toward levelling up. It is a practice measure and does not predict CogAT scores.
- **Parent dashboard** (lock button, multiplication gate): skills profile, per-type table, trouble ideas, what Play will focus on and why, progress chart, diagnostic snapshot, challenge results, settings, export/import/reset.

## Developing
Source is in `dev/src/`. `python3 dev/build.py` rebuilds `index.html`, run from `dev/`.
Tests, run from `dev/`: `node test/stress.js 600` generates every type at every level and checks it. `node test/adapt.js` simulates 40 days of play by a child with uneven skills and prints how practice was shared out.
Tailwind and the Fredoka font load from CDNs. Without a connection the game still works, styled by its own CSS with a fallback font.
