"""
Bank Game Assessment — Stock-Flow Failure Test
Based on Sterman, Weinhardt, & Short (Stock-Flow Analysis Framework)
Designed to catch the correlation heuristic: confusing a rate's slope with a stock's direction.

Goal: Students must achieve 100% to unlock the next level.
Wrong answers force a restart from Question 1 with an explicit explanation.

To run this assessment:
    python bank_game_assessment.py
"""

import sys

# =============================================================================
# ASSESSMENT QUESTIONS
# Each question targets a common stock-flow failure misconception.
# Questions deliberately trick students into conflating a *rate's* direction
# (e.g., deposit-rate graph sloping down) with a *stock's* direction (balance).
# =============================================================================

QUESTIONS = [
    {
        "question": "Your bank account earns interest at 3% per year. This year the rate fell from 4% to 3%. Is your balance falling?",
        "choices": ["A) Yes — lower interest means the balance is dropping.",
                    "B) No — the balance can still rise if deposits exceed withdrawals.",
                    "C) Yes, but only for the first 6 months.",
                    "D) It depends on the spending rate — can't say."],
        "correct": "B",
        "explanation": "A *rate* (percentage) can decline while the *stock* (balance) still increases, as long as the net flow (interest + deposits − spending) stays positive. The correlation heuristic makes you assume that because the rate-line is going down, the balance must also go down — but the balance follows the *net flow*, not the slope of any single rate."
    },
    {
        "question": "You deposit $100/month and spend $60/month. Your interest rate (a) was 2%/month, now (b) dropped to 1%/month. During period (b), does your balance grow or shrink each month?",
        "choices": ["A) It shrinks — the interest rate went down.",
                    "B) It grows — because $40 in deposits remain each month.",
                    "C) It shrinks — spending is higher than interest now.",
                    "D) It stays the same — deposits equal spending."],
        "correct": "B",
        "explanation": "Net monthly flow = $100 deposits + (balance × 1%) interest − $60 spending = $40 + interest > 0, so the balance *grows*. Students who pick 'A' fall for the correlation heuristic — they see the interest percentage dropping and conclude the balance must fall, ignoring that the deposit flow alone ($100 − $60 = $40 surplus) keeps the balance rising."
    },
    {
        "question": "Your balance was $1,000 at month 0 and $1,000 at month 6. Does this mean your account was perfectly stable all 6 months?",
        "choices": ["A) Yes — same start and end means no change.",
                    "B) No — the balance could have risen or fallen in between.",
                    "C) No — spending must have equaled deposits.",
                    "D) Yes, but only if the interest rate was the same."],
        "correct": "B",
        "explanation": "Two snapshots of a stock don't reveal the *flows* between them. The balance could have climbed to $1,500 and fallen back, or dipped to $500 and recovered — both give the same endpoints. This is a core stock-flow failure: people assume steady endpoints indicate steady flows, missing the dynamic behavior hidden in between."
    },
    {
        "question": "If you pause the game and the 'Deposit' bar is taller than the 'Spending' bar, but the 'Interest' bar is short and shrinking, is your balance growing?",
        "choices": ["A) No — interest is shrinking.",
                    "B) Yes — total inflows exceed total outflows.",
                    "C) No — spending is higher than deposits.",
                    "D) It depends on yesterday's balance."],
        "correct": "B",
        "explanation": "The key comparison is the *net flow*: (Deposits + Interest) − Spending. Even if 'Interest' is shrinking, as long as Deposits > Spending, the net flow is positive and the balance grows. Picking 'A' reveals the correlation heuristic — assuming that because the interest bar is falling, the stock must fall too."
    },
    {
        "question": "The game shows a graph where monthly spending is $50, deposits are $80, and the downward-sloping interest curve starts at 5% and ends at 1%. After 12 months the balance rose from $0 to $1,000. Which mental model explains this?",
        "choices": ["A) The balance follows the interest-rate trend — it should have fallen.",
                    "B) The balance follows the *cumulative net flow* (total deposits + interest − spending), not any single rate.",
                    "C) The balance fell but recovered — it must have been a dip.",
                    "D) The balance rose because spending dropped."],
        "correct": "B",
        "explanation": "The balance is the *integral* (running total) of net flows, not the slope of any single rate. Spending was constant at $50, deposits at $80 ($30 surplus/month), and interest added even more — so the balance climbed. Students who choose 'A' fall for the correlation heuristic: they see the interest curve trending downward and incorrectly predict the balance trend from that single visual."
         },
]