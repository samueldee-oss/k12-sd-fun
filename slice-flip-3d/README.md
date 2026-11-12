# Slice Flip 3D

A 3D knife-flipping slicing game (like Slice Master on Coolmath Games), built with Claude on claude.ai. Tap to flip the knife forward, slice through piles of food, land blade-first in the wooden platforms, and stick the biggest multiplier at the end of each level.

**Systems link:** each level's score is a stock that fills with every slice (inflow) and is multiplied at the finish, while falling into a gap drains it back to zero. Students can see how small repeated actions (one slice at a time) build up, and how one risky choice at the end (going for ×20 instead of ×5) can multiply or lose it all.

- `index.html` is the whole game (one page). It loads three.js r128 from cdnjs and fonts from Google Fonts, so it needs an internet connection.
- Real 3D slicing: the blade cuts each food's actual shape in two along the blade's angle (spheres become half-spheres with the inside showing). Pieces fall, tumble, settle and can be cut again.
- 12 foods with their own cut faces and their own ASMR-style slice sounds (juicy fruit, crunchy carrot and cucumber, crusty bread, creamy cheese, wobbly jelly).
- Pink blocks can't be cut; the knife bounces off them. Floating gems are worth +5.
- Knife Shop: 13 knives bought with 🔪 points (Classic to Diamond), each with its own colours and trail.
- Background music (🎵 toggles it) and a mute button (🔊).
- Controls: click, tap, Space, W, Up or Enter to flip. ↻ restarts the level.
- Progress, 🔪 points, owned knives and sound settings are saved in the browser (localStorage).
