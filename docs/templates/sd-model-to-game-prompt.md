# Prompt template: turn a system dynamics model into a playable game

This is the prompt that started the Bank Game. It is reproduced **verbatim** from the author's first working session
with GitHub Copilot Chat on 2026-03-16 at 21:28 (America/Denver); see
[`docs/provenance/transcripts/01_copilot_2026-03_original-bank-game.md`](../provenance/transcripts/01_copilot_2026-03_original-bank-game.md).

**How it was used.** The author first asked the assistant to look at the model files, count them, and explain one
(`bank.stmx`, a bank-account model). Only then was this prompt sent, with the model already read. The assistant
produced the first complete `bank_game.py` in response.

**To reuse it,** replace "banks" with your own model name, and give the assistant the `.stmx` (or equivalent) file.
Everything after the first `INPUT:` line is the author's wording, unchanged.

```text
You are an expert in system dynamics, game design, and Python using pygame-ce.

Your task is to convert a system dynamics (SD) model (lets start with banks) into a simple, playable 2D game using pygame that can run visually and fun inside Visual Studio Code.

INPUT:
read in banks.stmx
STEP 1 — MODEL INTERPRETATION:

* Identify all stocks and represent them as state variables in a Python dictionary called `state`
* Identify flows and translate them into update equations
* Use a discrete timestep (e.g., per frame or per turn)
* Clearly implement reinforcing and balancing loops in code

STEP 2 — GAME DESIGN MAPPING:

* Map each stock to a visual representation (circles, bars, or icons)
* Map flows to visible changes (growth, decay, movement)
* Define 2–4 player actions that influence key parameters
* Actions should be simple (keyboard input or mouse clicks)

STEP 3 — GAME LOOP:
Create a complete pygame program that includes:

* initialization (`pygame.init`)
* window setup
* main loop
* event handling
* update step (system dynamics model)
* rendering step (visualizing state clearly)

STEP 4 — VISUALIZATION:

* Use simple 2D graphics (circles, rectangles, text)
* Ensure changes in stocks are visually obvious
* Avoid clutter — prioritize clarity for learning

STEP 5 — GAMEPLAY:

* Include a goal (e.g., maximize population, avoid collapse, sustain system)
* Include feedback (visual or text indicators)
* Include basic balancing so the game is neither trivial nor impossible

STEP 6 — ITERATION HOOK:
At the end of the code, include clearly marked sections:

* PARAMETERS (easy to tweak)
* MODEL RULES
* PLAYER ACTIONS

Also include comments suggesting:

* what to tweak to improve gameplay
* how to make the system more or less stable

OUTPUT REQUIREMENTS:

* Output a single complete Python file
* Must run with pygame-ce without additional dependencies
* Code should be clean, commented, and beginner-friendly
* No placeholders — produce fully working code

CONSTRAINTS:

* Keep the game simple and lightweight
* Do not use advanced assets or external files
* Everything must run immediately after `pip install pygame-ce`

GOAL:
The result should be a playable simulation where the system dynamics model is clearly visible through gameplay, and can be easily modified to explore different behaviors.

After generating the code, briefly explain:

1. how the SD model maps to the game
2. what player actions affect
3. 2–3 ideas for improving fun or educational value

Wait for the SD model input before generating code.
```

## Notes for teachers and researchers

- The six steps map onto a lesson sequence: interpret the model (stocks, flows, loops), map it to visuals and
  player actions, build the loop, make the changes visible, add a goal, and expose the tunable parts.
- The "ITERATION HOOK" step (PARAMETERS / MODEL RULES / PLAYER ACTIONS sections) is what made later
  iteration by prompt possible: most later requests change one of those three sections.
- This prompt produced a working but plain game. The garage, cars, click-driven earnings, and negotiated rates
  were added by follow-up prompts; see the provenance timeline.
