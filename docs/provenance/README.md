# Provenance: how these games were made

This folder is the record of how the project was built **before it was put under git**. It exists so that the
games, the teaching materials, and any article that describes them can point to evidence rather than memory.

## Authorship statement

According to the author, **none of the Pygame scripts were edited by hand**. Every change to the game code was
made by prompting AI coding assistants. The transcripts below are the record of those prompts. (Chat logs show what
was asked and answered; they cannot by themselves prove that no manual edit was ever made, so this is
recorded as the author's statement.)

## Timeline (all times America/Denver)

| When | Tool and model | What happened | Record |
|---|---|---|---|
| 2026-03-16 21:17 to 2026-03-17 19:34 | GitHub Copilot Chat, "Auto" picker (the session reports the `gpt-5-mini` family) | Read the model files; the author's six-step prompt turned `bank.stmx` into the first `bank_game.py`. Then: garage and Lamborghini, asset counter, game-over, earnings tied to click rate, car depreciation and selling, a puzzle step (shelved: the game kept running during it), pause key, negotiated interest tiers with a minimum balance. Ended on an indentation error. | [transcript 01](transcripts/01_copilot_2026-03_original-bank-game.md), [8 code snapshots](code-snapshots/copilot-2026-03/) |
| 2026-03-17 19:37 to 2026-03-18 | Codex (VS Code). The thread's log records `gpt-5.4` and `gpt-5.5` | Fixed the broken file; removed the puzzle; stronger work income; pause/instructions overlay; garage moved; loop-gain and sustain-balance display; liquidity bar split into work-earned and interest-earned; interest shown as APY with three tiers; bank and dealership moved to a pause-only shop screen; shop made clickable. | [transcript 02](transcripts/02_codex_2026-03_bank-game-refinement-dashboard-repo-plan.md) |
| 2026-06-09 to 2026-06-26 | Codex, `gpt-5.5` | Turned `Mammoth Game.stmx` into a scored game; built Pong (two balls, speed settings, two players, 1P and 2P brackets); a learning curve from wins and losses by difficulty. | [transcript 03](transcripts/03_codex_2026-06_mammoth-and-pong.md) |
| 2026-06-26 | Codex (same thread as 02) | Browser dashboard with a card per game version, note boxes, and Pygbag web builds. First description of the multi-level systems-thinking idea. Browser builds were still showing a gray box when the transcript ends. | transcript 02 |
| 2026-08-19 | GitHub Copilot Chat | A Snake game with a "Blender Mode" menu. Not part of the systems-thinking project; kept in [`experiments/`](../../experiments/snake-blender-mode/). | [transcript](../../experiments/snake-blender-mode/transcript.md) |
| 2026-10-01 | Cline (free OpenRouter and Gemini models), then Codex | Level structure and documentation plan; first README and LESSONS outline; a partial `bank_game_assessment.py`. The Cline session stopped when its free daily request limit ran out. | [transcript 04](transcripts/04_cline_2026-10_repo-and-assessment-scaffold.md), plus the Codex thread above |
| 2026-10-23 18:18 to 2026-10-25 15:43 | Claude on claude.ai (the session reports `claude-opus-5-5`) | Whisker Dash, a pixel cat platformer, built from scratch over 24 rounds of requests: 49 worlds, 240 levels, 79 skins, a Hotel Lobby hub with talking characters, rides and mini-games, 2 players, touch. Published as a claude.ai artifact (versions 1–49). The first part of the session was compacted, so early requests survive only as a summary. | [transcript 05](transcripts/05_claude_2026-10_whisker-dash.md), [`whisker-dash/PLAN.md`](../../whisker-dash/PLAN.md), [`whisker-dash/GAME-FILE.md`](../../whisker-dash/GAME-FILE.md) |

## Where each part of the repo came from

| Part | Origin |
|---|---|
| `bank_game.py` | Copilot (March 16–17), then Codex (March 17–18) |
| `bank_game copy*.py` | Backup copies made during the March sessions. Snapshot v6 has the same size as `bank_game copy.py` and was saved within two seconds of it |
| `pong/` | Codex, 2026-06-09 to 06-26 |
| `dashboard/`, `tools/`, `web_sources/` | Codex, 2026-06-26 |
| `README.md`, `LESSONS.md` (first draft) | Cline, 2026-10-01 (free-tier model); revised in the archive pass below |
| `bank_game_assessment.py` | Cline, 2026-10-01; **unfinished** (draft questions only) |
| `whisker-dash/` | Claude on claude.ai, 2026-10-23 to 10-25. Not yet tied to the systems-thinking lessons. Design plan in `PLAN.md`, file guide in `GAME-FILE.md`, tests in `tests/`. |
| `K12 sd/transfers/*.stmx` | Pre-existing system dynamics models (446 files). `Mammoth Game.stmx` was modified by Codex on 2026-06-09. **Origin and redistribution rights still to be confirmed** (see below). |

## Folder contents

- `transcripts/`: cleaned, readable copies of each AI session. Prompts and replies are verbatim. Tool calls, file contents
  the assistants read, and hidden reasoning are left out (each file says so at the top).
- `code-snapshots/copilot-2026-03/`: eight saved versions of `bank_game.py` from the Copilot session, oldest first. VS Code
  keeps these automatically; they are the nearest thing to commit history for that period.
- `author-notes/`: two text notes the author exported earlier (a Codex chat export and a Cline planning note), unchanged.
- `../templates/sd-model-to-game-prompt.md`: the author's original six-step prompt, extracted for reuse.

## Notes on the eight code snapshots

Saved automatically by VS Code during the Copilot session (times America/Denver). "Compiles" means Python could parse the file
(it was not run). The matches to the transcript are by time and content, not recorded by Copilot.

| Snapshot | Saved | Size | Parses? | Likely matches |
|---|---|---|---|---|
| v1 | 03-16 21:56 | 12.5 KB | yes | The first, simple game (before the garage version replaced it) |
| v2 | 03-16 21:56 | 16.2 KB | **no** (indentation error, line 2) | The garage/Lamborghini version before Copilot "removed the stray empty function declarations at the top" |
| v3 | 03-16 21:57 | 16.2 KB | yes | The same version after that fix |
| v4 | 03-16 22:03 | 16.5 KB | yes | Asset counter fix and game-over flag |
| v5 | 03-17 18:49 | 17.0 KB | yes | Before the click-rate earnings, depreciation, selling and garage-upgrade round |
| v6 | 03-17 18:50 | 21.7 KB | yes | After that round; same size as `bank_game copy.py` |
| v7 | 03-17 19:32 | 21.0 KB | yes | Puzzle removed, pause key, negotiated-contract round |
| v8 | 03-17 19:33 | 22.3 KB | **no** (unexpected indent, line 504) | The file with the indentation error the author reported at 19:34; Codex picked up the project three minutes later |

## What is not in this archive

- **Tester notes.** Testing so far has been informal: first one student tester (the author's child), then other students.
  No notes, consent records, or results are stored here. The author is working out the ethical guardrails for
  developing curriculum with children; until that is settled, treat any statement about student reactions as unverified.
- **Tool calls and edits.** The code changes made through tool calls are not in the transcripts. The final code is
  the repo itself; the snapshots cover only part of the Copilot period.
- **Anything before 2026-03-16 21:17.** The first logged message is already inside the project folder with the model files.
- **Raw logs.** The original session files (large, and containing the assistants' internal instructions) are kept on the author's computer only.

## Known inaccuracies in AI-written documents (corrected where noted)

- The Cline session described the root `index.html` as a "landing page". It is the unrelated Snake game; it has been moved to `experiments/`.
- The first `LESSONS.md` claimed "early play tests" showed students panicking at falling rates. Nothing in the record supports
  that claim; it was removed and replaced with an accurate statement.
- The first `README.md` stated an MIT license. No license has been chosen; the statement was replaced.

## Open questions before publishing

1. **Licensing of the `.stmx` models.** Confirm who made them and whether they may be redistributed. If not, keep them out of a public repo and link to their source.
2. **License choice** for code versus teaching text (they often differ).
3. **Student testing:** ethics review requirements for the article, and what, if anything, from testing may be recorded here.
