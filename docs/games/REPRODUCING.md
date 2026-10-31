# Reproducing a game from this archive

Two routes. Route A is exact; Route B is regenerative.

## Route A: use the file (exact)

Each `<game>/index.html` is complete and self-contained. Open it in a browser or serve the folder (`python -m http.server`). Nothing else is needed. Endless Crucible runs without Claude, using its built-in recipe book.

## Route B: rebuild from the spec (regenerative)

Because the originals were produced by prompting, a rebuild will be a *new* implementation of the same design, not a byte-identical copy.

1. Open the game's spec in this folder.
2. Paste the **Re-prompt spec** block from the spec into Claude, preceded by the template below.
3. Ask for a single `index.html` with no libraries.
4. Run the **Verification checklist** in the spec.

### Template

```
Build a single-file HTML5 game (no libraries, no build step, no external assets
except Google Fonts). It must work on desktop (keyboard) and phone (touch),
respect prefers-reduced-motion, wrap localStorage in try/catch, synthesize any
audio with WebAudio after the first gesture, and have a mute button.
Use localStorage key "<key from spec>" for saves.

<paste the game's Re-prompt spec here>

Keep it kind, readable, and finishable in a few minutes per session.
```

### What a faithful rebuild should preserve

- The **core verb** and its feel (jump arc, tap value, fire rate).
- The **numbers** in the "Rules and numbers" section (costs, HP, speeds, timings). These define balance.
- The **content tables** (unit rosters, level lists, recipe seeds).
- The **save key and shape**, so progress files interchange.

### What may differ

Exact art, exact particle effects, exact melodies, and internal function names.

## Adding a new game to the archive

Copy `_TEMPLATE.md`, fill every section, link it from `README.md`, and add the game to the dashboard. Do not include student or child personal details.
