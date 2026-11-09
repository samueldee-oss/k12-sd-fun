# Whisker Dash: next steps (handover)

_Last updated 2026-11-09, after secrets everywhere (artifact publish #110, version 1794234071-72fd)._

## To continue in a new session

Use the prompt in [`CONTINUE-PROMPT.md`](CONTINUE-PROMPT.md). In short: give Claude the game file and this folder's docs,
have it read `PLAN.md` and `GAME-FILE.md` first, read the **live** artifact before editing (other sessions also edit it),
patch in small find-and-replace steps, test in a browser, publish, then send the class copy.

## State

- 70 worlds, 341 levels, 430 skins, Lore Book with 71 pages. Hotel Lobby 2 comes after The Lush Caves; worlds 62–70 (Câmpeni → The Riverside) follow it, and The Riverside is the last world.
- Every world has a secret family and a hint animal on its first level (see PLAN.md section 6).
- Repo copies (`index.html`, `site/index.html`, `WhiskerDash.html`) match publish #110. Several sessions edit this game: before changing it, read the live artifact AND check the repo for newer commits (a repo-only change on 11-09 had to be merged in).
- Live game: claude.ai artifact "Whisker Dash" (https://claude.ai/artifact/C66TYqxe54unZ12gz2VepF). Repo copy: `whisker-dash/index.html` in samueldee-oss/k12-sd-fun. The docs call this repo private, but on 11-05 and 11-08 the session tools read it with no credentials (as a public repo); check its visibility on GitHub. Keep student details out of it either way.
- GitHub Pages copy: https://samueldee-oss.github.io/k12-sd-fun/whisker-dash/index.html (also installed as a Home Screen app). Home Screen icon: the orange cat's face in pixel style on the game's dark purple, from `tools/whisker_dash_icon.py` (11-08). After an icon change is pushed, the phone keeps the old icon until the Home Screen app is removed and added again.

## Open items

- The "Restore my run · Antarctica 4" button was built but not published (the designer stopped it on 2026-11-02). Ask before adding it.
- A bigger ending after the last world; bumper cars or a log flume at the fair.
- Saves are per place: the claude.ai page, the Home Screen app and a downloaded `WhiskerDash.html` each keep their own progress.
- Don't tell the designer where the secret lobby is (see the spoiler section in `PLAN.md`).
