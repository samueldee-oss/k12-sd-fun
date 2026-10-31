# K12 SD Fun — Multi-Level Systems Thinking Games

A repository of interactive games and teaching materials designed to help K-12 students learn **systems thinking** through hands-on game creation and play.

## 🎯 Overview

This project builds a **multi-level game experience** where each level introduces a core systems-thinking concept using financial metaphors (stocks, flows, feedback loops, delays). The flagship game is **Bank Game**, a Pygame simulation where students manage a bank account, earn interest, and balance spending against income.

**Level progression (planned):**
| Level | Systems Concept | Game / Activity | Unlock Goal |
|-------|-----------------|-----------------|-------------|
| 1 | Stock & Flow | Simple clicker / Pong warm-up | Buy a car |
| 2 | Balancing Loops | Bank Game — saving, spending, interest basics | Buy a sports car |
| 3 | Reinforcing Loops | Bank Game — interest snowball, compound growth | Stabilize account (interest ≥ expenses for 12 months) |
| 4 | Delays & Trade-offs | Bank Game — negotiated rates, garage assets, liquidity split | Achieve self-sustaining liquidity equilibrium |
| 🏁 | Capstone | Combine all concepts | Fill garage without losing liquidity equilibrium |

## 📁 Repository Structure

```
k12-sd-fun/
├── README.md                 # This file
├── LESSONS.md                # Student narrative + teacher lesson plans
├── CLAUDE.md                 # Notes for Claude Code (studio routine)
├── studio/                   # Shared desk for Claude Desktop + Claude Code: status, roadmap, tester feedback, inbox/outbox
├── .gitignore
├── bank_game.py              # Flagship game (Levels 2–4)
├── bank_game_assessment.py   # Stock-flow failure assessment (100% mastery gate)
├── pong/                     # Level 1 warm-up (browser-native)
├── whisker-dash/             # Pixel cat platformer (browser-native, 1–2 players)
├── capybara-rumble/ miriams-sky-day/ sprout-siege/ kitty-and-lotl/ endless-crucible/
│   sensory-overload/ mothwicks-lantern/ prism-sprint/ thistle-king/ rooftop-flow/
│                             # More browser-native games (one index.html each)
├── experiments/              # Side projects, not part of the curriculum
│   └── snake-blender-mode/
├── K12 sd/                   # System dynamics models (.stmx)
├── dashboard/                # Web dashboard to launch & compare builds
│   ├── index.html
│   ├── styles.css
│   └── web_builds/
├── web_sources/              # Staging area for Pygbag builds
├── tools/
│   ├── build_web_games.ps1   # Build Pygame → Web via Pygbag
│   └── serve_dashboard.ps1   # Local HTTP server for dashboard
└── docs/
    ├── provenance/           # How the games were made: AI session transcripts, code snapshots, timeline
    ├── templates/            # Reusable prompts (SD model to game)
    ├── games/                # Game archive: design + reproduction spec for every browser game
    ├── student/              # (to be added)
    └── teacher/              # (to be added)
```

## 🔗 Play the games (copy these links)

Links assume GitHub Pages is enabled for this repo (Settings → Pages → deploy from `main`, root folder).

| Game | Link |
|------|------|
| Dashboard (all games, notes) | `https://samueldee-oss.github.io/k12-sd-fun/dashboard/` |
| Pong | `https://samueldee-oss.github.io/k12-sd-fun/pong/index.html` |
| Whisker Dash | `https://samueldee-oss.github.io/k12-sd-fun/whisker-dash/index.html` |
| Capybara Rumble | `https://samueldee-oss.github.io/k12-sd-fun/capybara-rumble/index.html` |
| Miriam's Sky Day | `https://samueldee-oss.github.io/k12-sd-fun/miriams-sky-day/index.html` |
| Sprout Siege | `https://samueldee-oss.github.io/k12-sd-fun/sprout-siege/index.html` |
| Kitty & Lotl | `https://samueldee-oss.github.io/k12-sd-fun/kitty-and-lotl/index.html` |
| Endless Crucible | `https://samueldee-oss.github.io/k12-sd-fun/endless-crucible/index.html` |
| Sensory Overload | `https://samueldee-oss.github.io/k12-sd-fun/sensory-overload/index.html` |
| Mothwick's Lantern | `https://samueldee-oss.github.io/k12-sd-fun/mothwicks-lantern/index.html` |
| Prism Sprint | `https://samueldee-oss.github.io/k12-sd-fun/prism-sprint/index.html` |
| Thistle King | `https://samueldee-oss.github.io/k12-sd-fun/thistle-king/index.html` |
| Rooftop Flow | `https://samueldee-oss.github.io/k12-sd-fun/rooftop-flow/index.html` |
| Snake (experiment) | `https://samueldee-oss.github.io/k12-sd-fun/experiments/snake-blender-mode/index.html` |

The Bank Game is a Pygame program; its web builds are not committed (see `.gitignore`), so it has no public link yet.

## 🚀 Quick Start (Desktop)

```bash
# Install dependencies
pip install pygame-ce

# Run the flagship game
python bank_game.py
```

**Controls in Bank Game:**
- **Left-click / Space** — Work (instant deposit)
- **S** — Save (temporarily reduces spending)
- **P** — Pause & open Bank / Dealership
- **I** — Apply current bank offer (while paused)
- **B** — Buy selected car (while paused)
- **Tab** — Cycle car selection (while paused)
- **R** — Reset game
- **Esc** — Quit

## 🌐 Web Deployment (Pygbag)

```powershell
# Build all Pygame games to static web bundles
.\tools\build_web_games.ps1 -InstallPygbag

# Serve the dashboard
.\tools\serve_dashboard.ps1
# Then open http://localhost:8000/dashboard/
```

## 📚 Documentation

- **`LESSONS.md`** — Combined student-friendly narrative ("How this game was built") and structured teacher lesson plans with objectives, discussion prompts, and assessment rubrics.
- **`docs/provenance/`** — The record of how the games were built (start with its `README.md` for the timeline)
- **`docs/games/`** — Design archive: catalog of what makes each game fun, a spec per game (rules, numbers, code map, re-prompt spec) and [how to reproduce them](docs/games/REPRODUCING.md)
- **`docs/templates/sd-model-to-game-prompt.md`** — The prompt that started the Bank Game, for reuse with other models
- **`docs/student/`** — Student-facing guides (to be added)
- **`docs/teacher/`** — Teacher-facing guides, slide decks, answer keys (to be added)

## 🎓 Pedagogical Foundations

The assessment (`bank_game_assessment.py`) is grounded in **stock-flow failure research** (Sterman, Weinhardt, et al.). It presents multiple-choice questions that deliberately trigger the **correlation heuristic** (e.g., "balance drops because deposit-rate graph slopes down, even though deposits > spending"). Students must achieve **100% mastery** to unlock the next level—wrong answers reset the test with an explicit explanation of the misconception.

## 🤝 Contributing

This is an educational research project. Issues and PRs welcome for:
- New levels or game mechanics
- Improved explanations in the assessment
- Teacher resources (slides, worksheets, rubrics)
- Web build stability (Pygbag / iframe integration)

## 📄 License

Not yet chosen. Code and teaching text may need different licenses, and the redistribution rights for the `.stmx` models in `K12 sd/` are still to be confirmed (see `docs/provenance/README.md`).

---

*Built with ❤️ for K-12 systems thinking education.*