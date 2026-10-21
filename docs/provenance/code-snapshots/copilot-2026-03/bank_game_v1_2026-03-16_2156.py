"""
Bank Dynamics — simple playable system-dynamics game using pygame-ce.

How to run:
1) pip install pygame-ce
2) python bank_game.py

Controls:
- E : Work (instant deposit boost)
- S : Save (reduce monthly spending for a limited time)
- I : Negotiate (raise interest rate temporarily)
- B : Buy car (if you have enough balance)
- R : Reset game
- Esc or window close : Quit

This file contains three marked sections at the end:
- PARAMETERS
- MODEL RULES
- PLAYER ACTIONS
"""

import pygame
import sys
import math
from collections import deque

pygame.init()
WIDTH, HEIGHT = 900, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bank Dynamics — Can I Buy a Car?")
clock = pygame.time.Clock()
FONT = pygame.font.SysFont("Arial", 18)
BIG = pygame.font.SysFont("Arial", 28)

# ----------------------------
# MODEL INTERPRETATION (from `bank.stmx`)
# Stocks -> state dictionary
state = {
    # Stock: My_Account_Balance (initial 0)
    "My_Account_Balance": 0.0,
    # Aux / parameters (from model)
    "Monthly_earnings": 100.0,
    "Monthly_spending": 50.0,
    # Percent per month (model used 0.5 meaning 0.5%)
    "Monthly_Percent_Interest_Rate": 0.5,
    "Price_of_car": 5000.0,
}

# Internal/derived flow values (kept for clarity)
flows = {
    "Monthly_Interest_Payments": 0.0,
    "Deposits": 0.0,
    "Withdrawals": 0.0,
}

# Integration settings
MODEL_DT = 0.25  # months per model step (matches XMILE dt)
time_accumulator = 0.0
# We'll run the model at fixed step MODEL_DT by accumulating real time
MONTHS_PER_SECOND = 1.0  # simulation speed: how many months pass per real second
SECONDS_PER_MODEL_STEP = MODEL_DT / MONTHS_PER_SECOND

# Game state
cars_owned = 0
steps_elapsed = 0  # number of model steps executed

# UI helpers and history for small sparkline
balance_history = deque(maxlen=200)

# Action timers (store remaining months)
action_timers = {
    "save_months": 0.0,  # reduces spending while >0
    "neg_rate_months": 0.0,  # boosts interest while >0
}
# Action effects (configurable)
ACTION_EFFECTS = {
    "work_deposit": 200.0,          # instant deposit when pressing E
    "save_multiplier": 0.6,         # reduce spending to 60% while active
    "save_duration_months": 12.0,   # lasts 12 months
    "neg_rate_bonus": 0.3,          # +0.3 percentage points to monthly percent
    "neg_rate_duration_months": 24.0,
    "work_cooldown_seconds": 2.0,   # simple input cooldown to avoid spam
}

# simple cooldown timers (in real seconds)
cooldowns = {
    "work": 0.0,
    "save": 0.0,
    "neg": 0.0,
}

# clamp helper
def clamp(x, lo, hi):
    return max(lo, min(hi, x))

# ----------------------------
# VISUAL MAPPING
# - Balance is shown as a large circle whose radius scales with sqrt(balance)
# - A progress bar shows progress toward car price
# - Text shows parameters and active buffs
def draw_text(surf, text, x, y, color=(255, 255, 255), font=FONT):
    surf.blit(font.render(text, True, color), (x, y))

def draw_ui():
    screen.fill((24, 24, 30))

    # Draw balance circle
    bal = state["My_Account_Balance"]
    # Use sqrt scaling so radius grows visually nicely
    radius = int(30 + math.sqrt(max(0.0, bal)) * 2.0)
    radius = clamp(radius, 30, 220)
    circle_x, circle_y = 200, HEIGHT // 2
    pygame.draw.circle(screen, (40, 180, 120), (circle_x, circle_y), radius)
    pygame.draw.circle(screen, (255, 255, 255), (circle_x, circle_y), radius, 3)
    draw_text(screen, f"Balance: ${bal:,.2f}", circle_x - 80, circle_y + radius + 8, font=BIG)

    # Progress bar toward car
    car_price = state["Price_of_car"]
    progress = clamp(bal / car_price, 0.0, 1.0)
    bar_x, bar_y = 420, 120
    bar_w, bar_h = 440, 40
    pygame.draw.rect(screen, (80, 80, 90), (bar_x, bar_y, bar_w, bar_h))
    pygame.draw.rect(screen, (0, 180, 255), (bar_x, bar_y, int(bar_w * progress), bar_h))
    pygame.draw.rect(screen, (220, 220, 220), (bar_x, bar_y, bar_w, bar_h), 2)
    draw_text(screen, f"Car price: ${car_price:,.0f}", bar_x, bar_y - 26)
    draw_text(screen, f"{progress*100:0.1f}% toward car", bar_x + 8, bar_y + 8)

    # Show small sparkline of balance history
    hx, hy = 420, 200
    hw, hh = 440, 140
    pygame.draw.rect(screen, (12, 12, 12), (hx, hy, hw, hh))
    pygame.draw.rect(screen, (80, 80, 80), (hx, hy, hw, hh), 1)
    if balance_history:
        maxb = max(balance_history) or 1.0
        minb = min(balance_history)
        span = maxb - minb if maxb > minb else 1.0
        pts = []
        for i, v in enumerate(balance_history):
            px = hx + int(i / max(1, (len(balance_history)-1)) * (hw-4)) if len(balance_history) > 1 else hx+2
            py = hy + hh - 4 - int((v - minb) / span * (hh-8))
            pts.append((px, py))
        if len(pts) > 1:
            pygame.draw.lines(screen, (0, 200, 120), False, pts, 2)

    # Parameter readouts
    px, py = 30, 30
    draw_text(screen, f"Monthly earnings: ${state['Monthly_earnings']:,.2f}", 420, 370)
    draw_text(screen, f"Monthly spending: ${state['Monthly_spending']:,.2f}", 420, 400)
    draw_text(screen, f"Monthly interest rate: {state['Monthly_Percent_Interest_Rate']:0.3f} %", 420, 430)
    draw_text(screen, f"Cars owned: {cars_owned}", 420, 460)
    draw_text(screen, f"Steps (model ticks): {steps_elapsed}", 420, 490)

    # Active buffs
    buffs = []
    if action_timers["save_months"] > 0:
        buffs.append(f"Saving mode ({action_timers['save_months']:0.1f} mo left)")
    if action_timers["neg_rate_months"] > 0:
        buffs.append(f"Better rate ({action_timers['neg_rate_months']:0.1f} mo left)")
    if buffs:
        draw_text(screen, "Active: " + " | ".join(buffs), 30, HEIGHT - 60, color=(255, 215, 0))

    # Controls hint
    help_lines = [
        "Controls: E=Work (instant deposit)  S=Save (reduce spending)  I=Negotiate (raise rate)  B=Buy car",
        "Goal: Reach the car price to buy cars. Press R to reset.",
    ]
    for i, line in enumerate(help_lines):
        draw_text(screen, line, 30, HEIGHT - 120 + i*22, color=(180, 180, 180))

# ----------------------------
# MODEL UPDATE (discrete Euler steps)
def model_step(dt_months):
    """
    Perform one model integration step using Euler method:
    dBalance/dt = Deposits - Withdrawals
    Deposits = Monthly_earnings + Monthly_Interest_Payments
    Monthly_Interest_Payments = My_Account_Balance * Monthly_Percent_Interest_Rate / 100
    Withdrawals = Monthly_spending
    """
    global steps_elapsed

    # Apply action modifiers
    effective_spending = state["Monthly_spending"]
    if action_timers["save_months"] > 0:
        effective_spending *= ACTION_EFFECTS["save_multiplier"]

    effective_interest_rate = state["Monthly_Percent_Interest_Rate"]
    if action_timers["neg_rate_months"] > 0:
        effective_interest_rate += ACTION_EFFECTS["neg_rate_bonus"]

    # Compute flows (per month)
    flows["Monthly_Interest_Payments"] = state["My_Account_Balance"] * effective_interest_rate / 100.0
    flows["Deposits"] = state["Monthly_earnings"] + flows["Monthly_Interest_Payments"]
    flows["Withdrawals"] = effective_spending

    # Rate of change per month
    delta_per_month = flows["Deposits"] - flows["Withdrawals"]
    # Euler integration
    state["My_Account_Balance"] += delta_per_month * dt_months

    # Enforce non-negative (model had <non_negative/> on stock)
    state["My_Account_Balance"] = max(0.0, state["My_Account_Balance"])

    # decrement action timers by dt_months
    for k in action_timers:
        if action_timers[k] > 0:
            action_timers[k] = max(0.0, action_timers[k] - dt_months)

    steps_elapsed += 1
    balance_history.append(state["My_Account_Balance"])

# ----------------------------
# PLAYER ACTIONS
def do_work():
    """Instant deposit (E)."""
    global cooldowns
    if cooldowns["work"] > 0:
        return
    state["My_Account_Balance"] += ACTION_EFFECTS["work_deposit"]
    cooldowns["work"] = ACTION_EFFECTS["work_cooldown_seconds"]

def do_save():
    """Temporary reduce spending for a set duration (S)."""
    if action_timers["save_months"] > 0:
        return
    action_timers["save_months"] = ACTION_EFFECTS["save_duration_months"]

def do_negotiate():
    """Temporary increase monthly interest percent (I)."""
    if action_timers["neg_rate_months"] > 0:
        return
    action_timers["neg_rate_months"] = ACTION_EFFECTS["neg_rate_duration_months"]

def do_buy_car():
    """Buy car if affordable (B)."""
    global cars_owned
    price = state["Price_of_car"]
    if state["My_Account_Balance"] >= price:
        state["My_Account_Balance"] -= price
        cars_owned += 1

def reset_game():
    global state, flows, action_timers, cars_owned, steps_elapsed, balance_history, cooldowns
    state = {
        "My_Account_Balance": 0.0,
        "Monthly_earnings": 100.0,
        "Monthly_spending": 50.0,
        "Monthly_Percent_Interest_Rate": 0.5,
        "Price_of_car": 5000.0,
    }
    flows = {k: 0.0 for k in flows}
    action_timers = {k: 0.0 for k in action_timers}
    cars_owned = 0
    steps_elapsed = 0
    balance_history.clear()
    cooldowns = {k: 0.0 for k in cooldowns}

# ----------------------------
# MAIN LOOP
running = True
last_time = pygame.time.get_ticks() / 1000.0

while running:
    now = pygame.time.get_ticks() / 1000.0
    elapsed = now - last_time
    last_time = now

    # Update cooldowns in real seconds
    for k in cooldowns:
        if cooldowns[k] > 0:
            cooldowns[k] = max(0.0, cooldowns[k] - elapsed)

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                running = False
            elif event.key == pygame.K_e:
                do_work()
            elif event.key == pygame.K_s:
                do_save()
            elif event.key == pygame.K_i:
                do_negotiate()
            elif event.key == pygame.K_b:
                do_buy_car()
            elif event.key == pygame.K_r:
                reset_game()

    # Accumulate real time into months and step the model in fixed MODEL_DT steps
    time_accumulator += elapsed * MONTHS_PER_SECOND  # convert seconds to months
    while time_accumulator >= MODEL_DT:
        model_step(MODEL_DT)
        time_accumulator -= MODEL_DT

    # Draw
    draw_ui()

    # Win/loss feedback
    if state["My_Account_Balance"] >= state["Price_of_car"]:
        draw_text(screen, "You can buy the car! Press B to purchase.", 30, 80, color=(255, 220, 120), font=BIG)

    pygame.display.flip()
    clock.tick(60)  # limit to 60 FPS

pygame.quit()
sys.exit()

# ----------------------------
# PARAMETERS (easy to tweak)
# - MODEL_DT: internal model step (months) — smaller = more precise
# - MONTHS_PER_SECOND: simulation speed (how fast months pass)
# - ACTION_EFFECTS: tweak `work_deposit`, `save_multiplier`, durations, etc.
# - Starting parameters are in the `state` dict above:
#     - Monthly_earnings = 100
#     - Monthly_spending = 50
#     - Monthly_Percent_Interest_Rate = 0.5 (% per month)
#     - Price_of_car = 5000

# ----------------------------
# MODEL RULES
# - Stock `My_Account_Balance` integrates (Deposits - Withdrawals)
# - Deposits = Monthly_earnings + Monthly_Interest_Payments
# - Monthly_Interest_Payments = My_Account_Balance * Monthly_Percent_Interest_Rate / 100
# - Withdrawals = Monthly_spending (modified by save action)
# - Non-negative enforced: balance cannot go below 0

# ----------------------------
# PLAYER ACTIONS
# - Work (E): instant deposit to account (good for short-term boosts)
# - Save (S): reduces monthly spending for a limited time (balancing action)
# - Negotiate (I): temporarily increases monthly interest rate (reinforcing loop)
# - Buy car (B): if balance >= price, spend money to acquire a car (score)
#
# Suggestions:
# - Increase `Monthly_Percent_Interest_Rate` or lengthen negotiate duration to
#   emphasize reinforcing interest loop.
# - Reduce `work_deposit` or shorten save duration to make the game harder.
# - Add random events (job loss, windfall) to increase drama.
