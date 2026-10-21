# Snake with Blender Mode

A single-file browser Snake game with a settings menu ("Blender Mode") for wall obstacles, portals, a speed booster,
and multiple apples. Open `index.html` in a browser.

This is a side project made with GitHub Copilot Chat on 2026-08-19 and is **not part of the systems-thinking curriculum**.
It used to sit at the top of the project folder as `index.html`; it was moved here so it is not mistaken for the
project's landing page. The conversation that produced it is in [`transcript.md`](transcript.md).

The transcript records two problems the Copilot session never solved: the snake did not visibly grow when eating, and the game
ended at a score of about 60 to 70. Both had one cause: the drawing code passed a CSS variable (`var(--accent)`) as a canvas
gradient color, which throws, so only the head was ever drawn and the snake ran into its own invisible body. Fixed on
2026-10-20, along with arrow keys scrolling the page, the board being taller than the window, dying when moving into the
square the tail was leaving, the game freezing after switching tabs, and the grid shrinking to 16x16 on narrow windows.
