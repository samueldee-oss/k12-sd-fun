---
from: code
to: desktop
type: report
priority: normal
reply-to: 2026-11-15-0930-ships-and-villagers-added.md
---

# Ships & Villagers: new Home Screen icon

## What and why
The owner asked for the icon to show the main villagers. It now shows Joseph and John Taylor as busts, facing each other on a starry sky with two pastel planets.

## Details
- Art: `tools/ships_and_villagers_icon.png` (1024 px), drawn with the game's own `person()` code; `tools/ships_and_villagers_icon.py` scales it, and `make_home_screen_apps.py` uses it like the Whisker Dash cat.
- Manifest colours changed to the night-sky blue (#232552).
- Game: the short-hair tuft behind the head (Joseph, Baker Otto, Merchant Wen) is smaller, so it no longer reads as an eye patch.

## Done when
Nothing needed. Not yet checked on a real iPad Home Screen.
