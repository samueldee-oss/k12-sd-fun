# K-12 SD Games — Teaching Systems Thinking Through Game Creation

This document is **two-in-one**: a student-friendly narrative ("How this game was built") and a structured teacher lesson plan. Read it start-to-finish, or jump to the level you're teaching.

---

## 👤 Part A — Student Narrative: How These Games Were Built

> *Written for students. No jargon without explanation.*

### Chapter 1 — The Spark

It started with a question: **"What makes a bank account grow — earning more, or spending less?"** Most people see graphs go up and down and assume the direction of the line *right now* controls the total balance. That's a **correlation heuristic** — mistaking a rate for a total.

The full record of how the games were built is in [`docs/provenance/`](docs/provenance/README.md). Here are the key moments:

1. **We picked a metaphor students live with:** a bank account. Students understand *deposit* (money in) and *withdrawal* (money out). The balance is the **stock**.
2. **We built Bank Game in layers.** It started from a system dynamics model of a bank account (balance, deposits, spending and interest, in `K12 sd/transfers/bank.stmx`). Then came a garage and cars, earnings tied to how fast you click, car depreciation, negotiated interest rates, and finally a pause screen with a bank and a dealership. Each layer added one systems idea.
3. **We expect students to make a well-known mistake.** Research on how people understand stocks and flows (the author cites Sterman and Weinhardt; *full references to be added*) reports that many people judge a total by the shape of a rate graph. We designed a test to catch it. *So far the games have only been tried informally by a small number of students; we have no structured results yet, so this section makes no claims about how students react.*

### Chapter 2 — The Multi-Level Plan

We mapped every feature to a systems-thinking concept:

| Level | Concept | Feature in the Game |
|-------|---------|---------------------|
| 1 | **Stock vs. Flow** | Clicker / Pong warm-up: you control a rate and watch the total change |
| 2 | **Balancing Loop** | Save button: spending drops → balance rises (goal: sports car) |
| 3 | **Reinforcing Loop** | Interest coins: more balance → more interest → more balance (compound) |
| 4 | **Delays & Trade-offs** | Negotiated interest contract: a higher rate requires keeping a minimum balance; break the contract and you drop back to the starting rate |

### Chapter 3 — The Hard Lesson: Not All Lines That Drop Mean Loss

The next planned piece is **bank_game_assessment.py**, which is **not finished yet** (it currently holds draft questions only, and they still need review). The test is designed to *trick* you on purpose:

> **Question:** The deposit rate is sloping downward. Is the balance dropping?

The correct answer is **NO** — as long as deposits still exceed spending, the balance rises, even if deposits are *slowly decreasing*. The downward slope of a *rate* is not the same as the direction of a *stock*.

If you answer wrong, the test is designed to **force you to restart** after explaining the mistake, so students only move on once they have the idea.

### Chapter 4 — From Model to Code

The `.stmx` files in `K12 sd/` are **system dynamics models**. We translated their math into Pygame:

- `My_Account_Balance` ← stock, integrates `Deposits − Withdrawals`
- `Monthly_Interest_Payments` ← `Balance × Rate` (reinforcing loop)
- `Sustain Balance = Spending ÷ Rate` (the threshold where interest covers expenses)

You can verify these formulas live in the game by pausing (`P`) and reading the cash-flow panel.

---
---

## 🍎 Part B — Teacher Lesson Plan

### Course Metadata
| Field | Value |
|-------|-------|
| **Grade Band** | 6 – 12 |
| **Duration** | 5 sessions × 45–60 min (or modular) |
| **Subjects** | Math, Economics, Systems Thinking |
| **Standards** | [References to CCSS / NGSS where relevant — *fill in*] |
| **Prerequisites** | Basic arithmetic (percentages, addition/subtraction) |

### Learning Objectives

By the end of this module, students will be able to:

1. **Distinguish stock from flow** — explain why a *rate graph's* slope ≠ a *level's* direction.
2. **Identify feedback loops** — label a balancing loop (saving) vs. a reinforcing loop (compound interest).
3. **Predict delays** — recognize that raising a savings rate won't instantly raise the balance.
4. **Design iteratively** — modify a simple Pygame program to add or remove a feature and observe the effect.

### Materials

| Item | Location |
|------|----------|
| Bank Game (desktop) | `bank_game.py` — run with `python bank_game.py` |
| Assessment test | `bank_game_assessment.py` — run with `python bank_game_assessment.py` |
| Level 1 warm-up | `pong/index.html` or a simple clicker (see *Build Guide*) |
| System dynamics models | `K12 sd/*.stmx` (for reference / extension) |
| Student worksheet | *(to be created — template below)* |

### Testing with students

Testing so far has been informal (one student at first, then a few others). Before wider classroom use, decide and document:
what may be recorded about student play, how consent is handled for minors, and whether the work needs ethics review for
publication. *This section is a placeholder until those guardrails are settled.*
