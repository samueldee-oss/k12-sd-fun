# Studio: how Claude Desktop and Claude Code work together on this project

This folder is the shared desk for managing the games. Each app does what it is best at:

| | Claude Desktop (chat) | Claude Code (CLI / Code tab) |
|---|---|---|
| Best at | Planning, lesson design, thinking through fun and systems-thinking ideas, reading tester feedback, writing for teachers and students | Reading and changing the code, running and testing the games, committing and pushing |
| Owns | `ROADMAP.md`, `TESTER_FEEDBACK.md` | `STATUS.md` |
| Writes messages to | `to-code/` | `to-desktop/` |
| Reads messages from | `to-desktop/` | `to-code/` |

Everything here is plain Markdown in the Git repo, so it travels with the project to any computer through GitHub.

## The files

- **`STATUS.md`**: what exists and works right now, what is broken, what changed recently. Claude Code keeps it accurate after each work session.
- **`ROADMAP.md`**: planned features, ideas for fun, and the systems-thinking lesson each idea supports. Claude Desktop keeps it, and you decide the priorities.
- **`TESTER_FEEDBACK.md`**: what testers said, one entry per play session.
- **`to-code/`**: requests and questions for Claude Code (new feature, bug to fix, "is X possible?").
- **`to-desktop/`**: reports and questions for Claude Desktop (what was built, what needs a decision, results of a test).
- **`archive/`**: finished messages, moved here so the two boxes only hold open items.

## Writing a message

Copy [`MESSAGE_TEMPLATE.md`](MESSAGE_TEMPLATE.md) into the right box and name it with the date, time and a short topic:

```
to-code/2026-10-21-1530-bank-game-touch-controls.md
```

Keep one topic per message. When replying, name the reply after the original and put the original's file name in `reply-to`.

## The routine

1. **You and Claude Desktop** discuss plans or tester feedback, update `ROADMAP.md` or `TESTER_FEEDBACK.md`, and drop a request in `to-code/`.
2. **In Claude Code**, say "check the studio" (or start a session; `CLAUDE.md` tells it to look). It works through `to-code/`, asks you before anything it should not do on its own, updates `STATUS.md`, writes a report to `to-desktop/`, and moves handled messages to `archive/`.
3. **Back in Claude Desktop**, say "check the studio". It reads `to-desktop/` and `STATUS.md`, and you decide what comes next.

Nothing runs automatically. Each app only looks when you ask it, or when a session starts.

## Giving Claude Desktop access to this folder

Claude Desktop's chat can only read and write these files if you give it access. Use either option:

- **Filesystem access (recommended):** in Claude Desktop, open **Settings → Extensions**, add the **Filesystem** extension, and allow only `C:\Users\Admin\k12 sd fun\studio`. Desktop can then read and write the boxes directly.
- **Without it:** attach `STATUS.md` and the files in `to-desktop/` to the chat yourself, and paste anything Desktop writes into a new file in `to-code/`.

For the Desktop side's standing instructions, see [`DESKTOP_INSTRUCTIONS.md`](DESKTOP_INSTRUCTIONS.md). Paste them into a Claude Desktop **Project** so every chat in that project follows them.

## Privacy

This folder is pushed to GitHub. Do not put students' full names, photos or other personal details in tester feedback. Use first names, initials or labels like "Tester A, grade 6".
