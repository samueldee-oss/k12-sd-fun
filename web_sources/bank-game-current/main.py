"""
Enhanced Bank Dynamics Game

This is an enhanced version of the earlier bank dynamics game. New features:
- Left-click to 'Work' (instant deposit)
- Garage UI with slots and animated cars
- Multiple car tiers (including a luxury Lamborghini)
- Visualized interest snowball (coins) and thickening flow arrows to show
  the positive-feedback loop

Run:
  pip install pygame-ce
  python bank_game.py

Controls:
  - Left mouse click: Work (instant deposit)
  - S: Save (temporary reduced spending)
  - P: Pause and open shops
  - I: Apply current bank offer while paused
  - B: Buy selected car while paused
  - TAB: Cycle car selection while paused
  - R: Reset game
  - Esc / window close: Quit

Sections at bottom: PARAMETERS, MODEL RULES, PLAYER ACTIONS
"""

import pygame
import sys
import math
import random
from collections import deque
import asyncio

pygame.init()
WIDTH, HEIGHT = 1000, 640
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bank Dynamics — Garage Edition")
clock = pygame.time.Clock()
FONT = pygame.font.SysFont("Arial", 16)
BIG = pygame.font.SysFont("Arial", 26)
SMALL = pygame.font.SysFont("Arial", 14)


def apy_to_monthly_percent(apy_percent):
    return ((1.0 + apy_percent / 100.0) ** (1.0 / 12.0) - 1.0) * 100.0


def monthly_percent_to_apy(monthly_percent):
    return ((1.0 + monthly_percent / 100.0) ** 12 - 1.0) * 100.0


LOW_APY = 2.0
MEDIUM_APY = 2.6
PREMIUM_MONTHLY_PERCENT = (50.0 / 20000.0) * 100.0
PREMIUM_APY = monthly_percent_to_apy(PREMIUM_MONTHLY_PERCENT)

# ----------------------------
# MODEL INTERPRETATION (from `bank.stmx`)
# Stocks -> state dictionary
state = {
    "My_Account_Balance": 0.0,
    "Monthly_earnings": 100.0,
    "Monthly_spending": 50.0,
    "Monthly_Percent_Interest_Rate": apy_to_monthly_percent(LOW_APY),
    "Price_of_car": 5000.0,
}

# Derived flows
flows = {"Monthly_Interest_Payments": 0.0, "Deposits": 0.0, "Withdrawals": 0.0}

# Integration settings
MODEL_DT = 0.25  # months per model step
time_accumulator = 0.0
MONTHS_PER_SECOND = 1.5  # speed: months per real second

# Click -> earnings mapping
CLICK_SAMPLE_WINDOW = 5.0  # seconds used to estimate current click rate
IDEAL_CPS = 2.0  # clicks/sec considered 'ideal' for full earnings
TARGET_MONTHLY_EARNINGS = 250.0
click_timestamps = deque()

# Game state
cars = []  # purchased cars stored as dicts
steps_elapsed = 0
balance_history = deque(maxlen=300)

# Action timers (months)
action_timers = {"save_months": 0.0, "neg_rate_months": 0.0}

# Effects and tunables
# small immediate feedback (kept small); main earnings come from click rate
ACTION_EFFECTS = {
    "work_deposit": 8.0,
    "save_multiplier": 0.5,
    "save_duration_months": 12.0,
    "neg_rate_duration_months": 24.0,
    "work_cooldown_seconds": 0.12,
}

# Cooldowns in seconds
cooldowns = {"work": 0.0}

# Visual elements
coin_particles = []  # show interest coins
arrow_strength = 0.0
liquidity_sources = {"work": 0.0, "interest": 0.0}
pause_ui_buttons = {}

# Garage config
GARAGE_SLOTS = 6
garage_slots = [None] * GARAGE_SLOTS
garage_pos = (560, 170)
slot_w, slot_h = 120, 70
car_animation_queue = []
selected_car_index = 0
game_over = False

# Car catalogue (tiers)
CAR_CATALOG = [
    {"name": "Compact", "price": 1000, "color": (200, 200, 200), "score": 1, "dep": 1.0},
    {"name": "Sedan", "price": 3000, "color": (120, 180, 240), "score": 2, "dep": 0.8},
    {"name": "Sports", "price": 8000, "color": (255, 90, 90), "score": 4, "dep": 0.6},
    {"name": "Lamborghini", "price": 20000, "color": (255, 215, 0), "score": 10, "dep": -0.2},
]

# Selling / upgrade settings
SELL_FRACTION = 0.8
UPGRADE_COST = 20000
UPGRADE_SLOTS = 3

selected_slot = None

# Starter/easier settings
STARTER_PERIOD_SECONDS = 30.0
STARTER_MULTIPLIER = 2.0
start_time = pygame.time.get_ticks() / 1000.0

# Negotiation contract state
negotiated_apy = 0.0
negotiated_minimum = 0.0

# Helpers
def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def draw_text(surf, text, x, y, color=(255, 255, 255), font=FONT):
    surf.blit(font.render(text, True, color), (x, y))


def get_asset_value():
    return sum(car.get("value", car["price"]) for car in garage_slots if car is not None)


def get_effective_interest_rate():
    rate = state["Monthly_Percent_Interest_Rate"]
    if action_timers["neg_rate_months"] > 0 and negotiated_apy > 0.0:
        rate = apy_to_monthly_percent(negotiated_apy)
    return rate


def get_current_apy():
    return monthly_percent_to_apy(get_effective_interest_rate())


def get_bank_offer(balance):
    if balance >= 20000:
        return ("Premium Yield", PREMIUM_APY, 20000.0)
    if balance >= 5000:
        return ("Growth Savings", MEDIUM_APY, 5000.0)
    return ("Starter Savings", LOW_APY, 0.0)


def get_total_tracked_liquidity():
    return liquidity_sources["work"] + liquidity_sources["interest"]


def rebalance_liquidity_sources(target_balance):
    tracked_total = get_total_tracked_liquidity()
    if target_balance <= 0 or tracked_total <= 0:
        liquidity_sources["work"] = max(0.0, target_balance)
        liquidity_sources["interest"] = 0.0
        return
    scale = target_balance / tracked_total
    liquidity_sources["work"] *= scale
    liquidity_sources["interest"] *= scale


def add_liquidity(work=0.0, interest=0.0):
    liquidity_sources["work"] += work
    liquidity_sources["interest"] += interest


def remove_liquidity(amount):
    if amount <= 0:
        return
    tracked_total = get_total_tracked_liquidity()
    if tracked_total <= 0:
        liquidity_sources["work"] = max(0.0, state["My_Account_Balance"])
        liquidity_sources["interest"] = 0.0
        return
    work_share = liquidity_sources["work"] / tracked_total
    interest_share = liquidity_sources["interest"] / tracked_total
    liquidity_sources["work"] = max(0.0, liquidity_sources["work"] - amount * work_share)
    liquidity_sources["interest"] = max(0.0, liquidity_sources["interest"] - amount * interest_share)
    rebalance_liquidity_sources(state["My_Account_Balance"])


def get_monthly_loop_gain(rate=None):
    if rate is None:
        rate = get_effective_interest_rate()
    return rate / 100.0


def get_monthly_multiplier(rate=None):
    return 1.0 + get_monthly_loop_gain(rate)


def get_sustain_balance(rate=None, spending=None):
    if rate is None:
        rate = get_effective_interest_rate()
    if spending is None:
        spending = state["Monthly_spending"]
    gain = get_monthly_loop_gain(rate)
    if gain <= 0:
        return None
    return spending / gain


def draw_bar(x, y, w, h, value, max_value, color, label):
    pygame.draw.rect(screen, (34, 38, 48), (x, y, w, h))
    fill = 0 if max_value <= 0 else int(w * clamp(value / max_value, 0.0, 1.0))
    pygame.draw.rect(screen, color, (x, y, fill, h))
    pygame.draw.rect(screen, (220, 220, 220), (x, y, w, h), 2)
    draw_text(screen, label, x + 8, y + 5, font=SMALL)


def draw_button(rect, label, fill=(36, 46, 62), border=(235, 220, 170), text_color=(245, 245, 245)):
    pygame.draw.rect(screen, fill, rect, border_radius=10)
    pygame.draw.rect(screen, border, rect, 2, border_radius=10)
    text = SMALL.render(label, True, text_color)
    text_rect = text.get_rect(center=rect.center)
    screen.blit(text, text_rect)


def draw_pause_overlay():
    global pause_ui_buttons
    pause_ui_buttons = {}
    overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
    overlay.fill((8, 12, 18, 215))
    screen.blit(overlay, (0, 0))

    rate = get_effective_interest_rate()
    current_apy = get_current_apy()
    sustain_balance = get_sustain_balance(rate)
    offer_name, offer_apy, _ = get_bank_offer(state["My_Account_Balance"])

    header = pygame.Rect(110, 36, 780, 70)
    bank_panel = pygame.Rect(110, 124, 360, 330)
    dealer_panel = pygame.Rect(500, 124, 390, 330)
    notes_panel = pygame.Rect(110, 472, 780, 92)

    for panel in (header, bank_panel, dealer_panel, notes_panel):
        pygame.draw.rect(screen, (20, 28, 40), panel, border_radius=16)
        pygame.draw.rect(screen, (235, 220, 170), panel, 2, border_radius=16)

    draw_text(screen, "Paused", header.x + 22, header.y + 14, color=(255, 245, 220), font=BIG)
    draw_text(screen, "I: bank   Tab/B: dealership   U: upgrade", header.x + 22, header.y + 42, color=(225, 232, 240), font=SMALL)
    pause_ui_buttons["resume"] = pygame.Rect(header.right - 210, header.y + 18, 84, 34)
    pause_ui_buttons["reset"] = pygame.Rect(header.right - 108, header.y + 18, 84, 34)
    draw_button(pause_ui_buttons["resume"], "Resume")
    draw_button(pause_ui_buttons["reset"], "Reset", fill=(58, 42, 42))

    draw_text(screen, "Bank", bank_panel.x + 18, bank_panel.y + 16, color=(255, 245, 220), font=BIG)
    draw_text(screen, f"Current APY: {current_apy:.2f}%", bank_panel.x + 18, bank_panel.y + 54)
    draw_text(screen, f"Current monthly rate: {rate:.3f}%", bank_panel.x + 18, bank_panel.y + 78)
    draw_text(screen, f"Best available now: {offer_name}", bank_panel.x + 18, bank_panel.y + 114)
    pause_ui_buttons["apply_bank"] = pygame.Rect(bank_panel.x + 18, bank_panel.y + 138, 190, 34)
    draw_button(pause_ui_buttons["apply_bank"], f"Apply {offer_apy:.2f}% APY", fill=(64, 82, 58), text_color=(255, 245, 220))
    draw_text(screen, f"Starter Savings: {LOW_APY:.2f}% APY", bank_panel.x + 18, bank_panel.y + 180)
    draw_text(screen, f"Growth Savings: {MEDIUM_APY:.2f}% APY at $5,000+", bank_panel.x + 18, bank_panel.y + 208)
    draw_text(screen, f"Premium Yield: {PREMIUM_APY:.2f}% APY at $20,000+", bank_panel.x + 18, bank_panel.y + 236)
    if sustain_balance is None:
        draw_text(screen, "Interest-only sustain balance: not possible", bank_panel.x + 18, bank_panel.y + 278, color=(255, 210, 160))
    else:
        sustain_color = (120, 240, 160) if state["My_Account_Balance"] >= sustain_balance else (255, 225, 140)
        draw_text(screen, f"Interest-only sustain balance: ${sustain_balance:,.0f}", bank_panel.x + 18, bank_panel.y + 278, color=sustain_color)

    draw_text(screen, "Dealership", dealer_panel.x + 18, dealer_panel.y + 16, color=(255, 245, 220), font=BIG)
    draw_text(screen, "Tab to browse cars. Press B to buy the highlighted car.", dealer_panel.x + 18, dealer_panel.y + 54, font=SMALL)
    selected = CAR_CATALOG[selected_car_index]
    preview = pygame.Rect(dealer_panel.x + 18, dealer_panel.y + 92, 160, 88)
    pygame.draw.rect(screen, (28, 34, 46), preview, border_radius=12)
    pygame.draw.rect(screen, selected["color"], (preview.x + 12, preview.y + 14, 136, 28), border_radius=8)
    pygame.draw.rect(screen, (200, 200, 200), preview, 2, border_radius=12)
    draw_text(screen, selected["name"], preview.x + 12, preview.y + 52)
    draw_text(screen, f"${selected['price']:,}", preview.x + 12, preview.y + 70, font=SMALL)
    pause_ui_buttons["buy_car"] = pygame.Rect(dealer_panel.x + 196, dealer_panel.y + 106, 170, 36)
    pause_ui_buttons["upgrade_garage"] = pygame.Rect(dealer_panel.x + 196, dealer_panel.y + 150, 170, 36)
    draw_button(pause_ui_buttons["buy_car"], f"Buy {selected['name']}", fill=(54, 76, 92))
    draw_button(pause_ui_buttons["upgrade_garage"], f"Upgrade ${UPGRADE_COST:,}", fill=(72, 64, 88))
    grid_y = dealer_panel.y + 202
    for idx, car in enumerate(CAR_CATALOG):
        x = dealer_panel.x + 18 + (idx % 2) * 178
        y = grid_y + (idx // 2) * 58
        rect = pygame.Rect(x, y, 160, 46)
        pause_ui_buttons[f"car_{idx}"] = rect
        pygame.draw.rect(screen, (28, 34, 46), rect, border_radius=10)
        pygame.draw.rect(screen, car["color"], (x + 8, y + 9, 20, 20), border_radius=4)
        pygame.draw.rect(screen, (255, 215, 120) if idx == selected_car_index else (130, 140, 150), rect, 2, border_radius=10)
        draw_text(screen, car["name"], x + 36, y + 7)
        draw_text(screen, f"${car['price']:,}", x + 36, y + 24, font=SMALL)

    draw_text(screen, "Notes", notes_panel.x + 18, notes_panel.y + 14, color=(255, 245, 220), font=BIG)
    draw_text(screen, f"Each work input adds ${ACTION_EFFECTS['work_deposit']:.0f}. Work can drive up to ${TARGET_MONTHLY_EARNINGS:.0f}/month.", notes_panel.x + 18, notes_panel.y + 48)
    draw_text(screen, "Bank and dealership panels only appear while paused so the live view stays clear.", notes_panel.x + 18, notes_panel.y + 70, font=SMALL)

# ----------------------------
# VISUAL: draw UI, garage, balance, bars, arrows, coins
def draw_ui():
    screen.fill((18, 24, 36))

    # Left: Balance bubble
    bal = state["My_Account_Balance"]
    radius = int(36 + math.sqrt(max(0.0, bal)) * 1.8)
    radius = clamp(radius, 36, 260)
    cx, cy = 220, 200
    pygame.draw.circle(screen, (30, 170, 100), (cx, cy), radius)
    pygame.draw.circle(screen, (255, 255, 255), (cx, cy), radius, 3)
    draw_text(screen, f"Balance: ${bal:,.2f}", cx - 70, cy + radius + 8, font=BIG)

    # Draw arrows showing positive feedback loop (Balance -> Interest -> Deposits -> Balance)
    # Arrow thickness based on arrow_strength
    thickness = int(clamp(1 + arrow_strength * 10, 1, 12))
    # Balance -> Interest (to right)
    ax1 = (cx + radius, cy)
    ax2 = (cx + radius + 140, cy - 40)
    pygame.draw.line(screen, (200, 180, 40), ax1, ax2, thickness)
    draw_text(screen, "Interest", ax2[0] - 10, ax2[1] - 24)
    # Interest -> Deposits (down-left)
    bx1 = ax2
    bx2 = (cx + 80, cy + 110)
    pygame.draw.line(screen, (200, 180, 40), bx1, bx2, thickness)
    draw_text(screen, "Deposits", bx2[0] - 20, bx2[1] + 8)
    # Deposits -> Balance (left)
    cx2 = (cx + 30, cy + 80)
    pygame.draw.line(screen, (200, 180, 40), cx2, (cx - radius, cy + 40), thickness)

    # Interest coins (particles)
    for coin in coin_particles:
        pygame.draw.circle(screen, (255, 223, 0), (int(coin['x']), int(coin['y'])), int(coin['r']))

    # Top-right summary
    px, py = 520, 28
    draw_text(screen, f"Bank APY: {get_current_apy():.2f}%", px, py, font=BIG)
    draw_text(screen, "Pause to visit the bank and dealership.", px, py + 30, color=(215, 220, 230))

    # Right: Liquidity and Asset stacked bars
    bx, by = 520, 84
    w, h = 420, 36
    asset_value = get_asset_value()
    total_net = state['My_Account_Balance'] + asset_value
    liquidity_w = int(w * (state['My_Account_Balance'] / (total_net if total_net>0 else 1)))
    tracked_liquidity = max(0.01, get_total_tracked_liquidity())
    work_liquidity = min(state["My_Account_Balance"], liquidity_sources["work"])
    interest_liquidity = min(state["My_Account_Balance"], liquidity_sources["interest"])
    work_split = int(liquidity_w * (work_liquidity / tracked_liquidity))
    interest_split = int(liquidity_w * (interest_liquidity / tracked_liquidity))
    pygame.draw.rect(screen, (60, 60, 70), (bx, by, w, h))
    pygame.draw.rect(screen, (70, 170, 255), (bx, by, work_split, h))
    pygame.draw.rect(screen, (255, 215, 80), (bx + work_split, by, interest_split, h))
    remainder = max(0, liquidity_w - work_split - interest_split)
    if remainder > 0:
        pygame.draw.rect(screen, (0, 200, 120), (bx + work_split + interest_split, by, remainder, h))
    pygame.draw.rect(screen, (220, 220, 220), (bx, by, w, h), 2)
    draw_text(screen, f"Liquidity: ${state['My_Account_Balance']:,.0f}", bx + 6, by + 6)
    draw_text(screen, f"Assets: ${asset_value:,.0f}", bx + 220, by + 6)
    draw_text(screen, f"Work ${work_liquidity:,.0f}", bx, by + 42, color=(70, 170, 255), font=SMALL)
    draw_text(screen, f"Interest ${interest_liquidity:,.0f}", bx + 120, by + 42, color=(255, 215, 80), font=SMALL)

    # Financial breakdown panel
    panel_x, panel_y, panel_w, panel_h = 20, 360, 470, 215
    pygame.draw.rect(screen, (16, 20, 30), (panel_x, panel_y, panel_w, panel_h))
    pygame.draw.rect(screen, (100, 110, 140), (panel_x, panel_y, panel_w, panel_h), 2)
    draw_text(screen, "Monthly Cash Flow", panel_x + 12, panel_y + 10, font=BIG)
    effective_rate = get_effective_interest_rate()
    work_income = state["Monthly_earnings"]
    interest_income = flows["Monthly_Interest_Payments"]
    spending = state["Monthly_spending"]
    sustain_balance = get_sustain_balance(effective_rate, spending)
    chart_max = max(1.0, work_income, interest_income, spending)
    draw_bar(panel_x + 12, panel_y + 52, 300, 24, work_income, chart_max, (70, 170, 255), f"Work: ${work_income:,.1f}/month")
    draw_bar(panel_x + 12, panel_y + 84, 300, 24, interest_income, chart_max, (255, 215, 80), f"Interest: ${interest_income:,.1f}/month")
    draw_bar(panel_x + 12, panel_y + 116, 300, 24, spending, chart_max, (255, 120, 120), f"Spending: ${spending:,.1f}/month")
    draw_text(screen, f"Interest rate: {monthly_percent_to_apy(effective_rate):.2f}% APY", panel_x + 12, panel_y + 154)
    draw_text(screen, f"Loop gain: {get_monthly_loop_gain(effective_rate):.4f}", panel_x + 12, panel_y + 176)
    draw_text(screen, f"Multiplier: x{get_monthly_multiplier(effective_rate):.4f} / month", panel_x + 180, panel_y + 176)
    draw_text(screen, f"Liquid from work: ${liquidity_sources['work']:,.0f}", panel_x + 320, panel_y + 60, color=(70, 170, 255), font=SMALL)
    draw_text(screen, f"Liquid from interest: ${liquidity_sources['interest']:,.0f}", panel_x + 320, panel_y + 82, color=(255, 215, 80), font=SMALL)
    if sustain_balance is None:
        draw_text(screen, "Interest-only sustain: not possible", panel_x + 12, panel_y + 198, color=(255, 210, 160))
    else:
        sustain_color = (120, 240, 160) if state["My_Account_Balance"] >= sustain_balance else (255, 225, 140)
        draw_text(screen, f"Sustain target: ${sustain_balance:,.0f} liquid", panel_x + 12, panel_y + 198, color=sustain_color)
        if state["My_Account_Balance"] >= sustain_balance:
            draw_text(screen, "Interest can cover the $50/month spend now.", panel_x + 250, panel_y + 198, color=(120, 240, 160), font=SMALL)
        else:
            gap = sustain_balance - state["My_Account_Balance"]
            draw_text(screen, f"${gap:,.0f} more to self-sustain", panel_x + 250, panel_y + 198, color=(255, 225, 140), font=SMALL)

    # Garage display
    gx, gy = garage_pos
    draw_text(screen, "Garage:", gx, gy - 34)
    for i in range(len(garage_slots)):
        sx = gx + (i % 3) * (slot_w + 10)
        sy = gy + (i // 3) * (slot_h + 10)
        pygame.draw.rect(screen, (28, 28, 36), (sx, sy, slot_w, slot_h))
        pygame.draw.rect(screen, (100, 100, 110), (sx, sy, slot_w, slot_h), 2)
        if garage_slots[i]:
            c = garage_slots[i]
            # car icon rectangle
            cx_ = sx + 10
            cy_ = sy + 10
            pygame.draw.rect(screen, c['color'], (cx_, cy_, slot_w - 20, slot_h - 28))
            draw_text(screen, c['name'], sx + 6, sy + slot_h - 22)
        else:
            draw_text(screen, "Empty", sx + 8, sy + slot_h - 22, color=(120, 120, 120))

    # Bottom: controls and stats
    draw_text(screen, "P: Pause/shops  Click or Space: Work  S: Save  V: Sell  R: Reset", 20, HEIGHT - 40, color=(190,190,190))
    draw_text(screen, f"Interest/month: ${flows['Monthly_Interest_Payments']:0.2f}  Work/month: ${state.get('Monthly_earnings',0):0.1f}  Spending: ${state['Monthly_spending']:.0f}", 20, HEIGHT - 64)

    # Sparkline small graph
    hx, hy = 20, 20
    hw, hh = 380, 120
    pygame.draw.rect(screen, (10, 10, 14), (hx, hy, hw, hh))
    if balance_history:
        maxb = max(balance_history) or 1.0
        minb = min(balance_history)
        span = maxb - minb if maxb > minb else 1.0
        pts = []
        for i, v in enumerate(balance_history):
            px = hx + int(i / max(1, (len(balance_history)-1)) * (hw-6)) if len(balance_history) > 1 else hx+3
            py = hy + hh - 6 - int((v - minb) / span * (hh-12))
            pts.append((px, py))
        if len(pts) > 1:
            pygame.draw.lines(screen, (90, 220, 150), False, pts, 2)

    # Animating incoming car drive-ins
    for anim in car_animation_queue:
        # simple circle representing car moving to slot
        pygame.draw.rect(screen, anim['color'], (anim['x'], anim['y'], anim['w'], anim['h']))

    # show selected garage slot
    if selected_slot is not None:
        i = selected_slot
        sx = gx + (i % 3) * (slot_w + 10)
        sy = gy + (i // 3) * (slot_h + 10)
        pygame.draw.rect(screen, (255, 200, 120), (sx, sy, slot_w, slot_h), 3)

    if paused:
        draw_pause_overlay()

# ----------------------------
# MODEL UPDATE (Euler discrete)
def model_step(dt_months):
    global steps_elapsed, arrow_strength

    # compute current click-driven monthly earnings
    now = pygame.time.get_ticks() / 1000.0
    # remove old timestamps
    while click_timestamps and click_timestamps[0] < now - CLICK_SAMPLE_WINDOW:
        click_timestamps.popleft()
    clicks_in_window = len(click_timestamps)
    # ideal clicks per sample window
    ideal_clicks = IDEAL_CPS * CLICK_SAMPLE_WINDOW
    per_click_value = TARGET_MONTHLY_EARNINGS / max(1.0, ideal_clicks)
    # starter easier multiplier for first few seconds
    if now - start_time < STARTER_PERIOD_SECONDS:
        per_click_value *= STARTER_MULTIPLIER
    # earnings scale with clicks, capped at target
    monthly_earnings = min(TARGET_MONTHLY_EARNINGS, clicks_in_window * per_click_value)
    state['Monthly_earnings'] = monthly_earnings

    effective_spending = state['Monthly_spending']
    if action_timers['save_months'] > 0:
        effective_spending *= ACTION_EFFECTS['save_multiplier']

    effective_interest_rate = state['Monthly_Percent_Interest_Rate']
    if action_timers['neg_rate_months'] > 0 and negotiated_apy > 0.0:
        effective_interest_rate = apy_to_monthly_percent(negotiated_apy)

    flows['Monthly_Interest_Payments'] = state['My_Account_Balance'] * effective_interest_rate / 100.0
    flows['Deposits'] = state['Monthly_earnings'] + flows['Monthly_Interest_Payments']
    flows['Withdrawals'] = effective_spending

    work_inflow = state['Monthly_earnings'] * dt_months
    interest_inflow = flows['Monthly_Interest_Payments'] * dt_months
    spending_outflow = flows['Withdrawals'] * dt_months
    delta_per_month = flows['Deposits'] - flows['Withdrawals']
    state['My_Account_Balance'] += delta_per_month * dt_months
    state['My_Account_Balance'] = max(0.0, state['My_Account_Balance'])
    add_liquidity(work=work_inflow, interest=interest_inflow)
    remove_liquidity(spending_outflow)
    rebalance_liquidity_sources(state['My_Account_Balance'])

    # Update car asset values (depreciation/appreciation per month)
    for i, car in enumerate(garage_slots):
        if car is not None:
            dep_rate = car.get('dep', 1.0)  # percent per month (negative = appreciation)
            # linear approx for small dt: value -= value * dep_rate/100 * dt_months
            car['value'] = car.get('value', car['price'])
            car['value'] -= car['value'] * (dep_rate / 100.0) * dt_months
            # don't go negative
            car['value'] = max(0.0, car['value'])

    # Interest visual: spawn coin particles proportional to interest payments
    interest_amount = flows['Monthly_Interest_Payments'] * dt_months
    spawn_coins = int(clamp(interest_amount / 5.0, 0, 30))
    for _ in range(spawn_coins):
        coin = {
            'x': 220 + radius_for_balance(state['My_Account_Balance']),
            'y': 200,
            'vx': random.uniform(30, 140),
            'vy': random.uniform(-80, -20),
            'r': random.uniform(3, 7),
            'life': random.uniform(0.8, 1.6),
        }
        coin_particles.append(coin)

    # Update coin particles
    for c in coin_particles[:]:
        c['x'] += c['vx'] * (dt_months / MODEL_DT) * 0.6
        c['y'] += c['vy'] * (dt_months / MODEL_DT) * 0.6
        c['vy'] += 80 * (dt_months / MODEL_DT) * 0.6
        c['life'] -= dt_months / 6.0
        if c['life'] <= 0:
            coin_particles.remove(c)

    # Arrow strength is proportional to interest payments relative to balance
    if state['My_Account_Balance'] > 0:
        arrow_strength = flows['Monthly_Interest_Payments'] / max(0.01, state['My_Account_Balance'])
    else:
        arrow_strength = 0.0

    # Check negotiated contract: enforce minimum balance requirement
    if action_timers['neg_rate_months'] > 0 and negotiated_minimum > 0.0:
        if state['My_Account_Balance'] < negotiated_minimum:
            # contract broken: reset negotiated rate and duration
            action_timers['neg_rate_months'] = 0.0
            globals()['negotiated_apy'] = 0.0
            globals()['negotiated_minimum'] = 0.0

    # timers
    for k in action_timers:
        if action_timers[k] > 0:
            action_timers[k] = max(0.0, action_timers[k] - dt_months)

    steps_elapsed += 1
    balance_history.append(state['My_Account_Balance'])

def radius_for_balance(bal):
    return int(36 + math.sqrt(max(0.0, bal)) * 1.8)

# ----------------------------
# PLAYER ACTIONS
def do_work():
    if cooldowns['work'] > 0:
        return
    # record click timestamp (used to compute monthly earnings)
    click_timestamps.append(pygame.time.get_ticks() / 1000.0)
    # small immediate feedback
    state['My_Account_Balance'] += ACTION_EFFECTS['work_deposit']
    add_liquidity(work=ACTION_EFFECTS['work_deposit'])
    cooldowns['work'] = ACTION_EFFECTS['work_cooldown_seconds']

def do_save():
    if action_timers['save_months'] > 0:
        return
    action_timers['save_months'] = ACTION_EFFECTS['save_duration_months']

def do_negotiate():
    global negotiated_apy, negotiated_minimum
    bal = state['My_Account_Balance']
    _, negotiated_apy, negotiated_minimum = get_bank_offer(bal)
    action_timers['neg_rate_months'] = ACTION_EFFECTS['neg_rate_duration_months']

def buy_selected_car():
    global garage_slots
    cc = CAR_CATALOG[selected_car_index]
    price = cc['price']
    if state['My_Account_Balance'] >= price:
        # find first empty slot
        for i in range(len(garage_slots)):
            if garage_slots[i] is None:
                state['My_Account_Balance'] -= price
                remove_liquidity(price)
                newcar = { 'name': cc['name'], 'price': price, 'color': cc['color'], 'value': price, 'dep': cc.get('dep',1.0) }
                # create animation from right to slot
                sx = garage_pos[0] + (i % 3) * (slot_w + 10)
                sy = garage_pos[1] + (i // 3) * (slot_h + 10)
                anim = {'x': WIDTH - 180, 'y': 100, 'w': slot_w - 20, 'h': slot_h - 28, 'color': cc['color'], 'target': (sx+10, sy+10), 'speed': 600.0, 'id': id(newcar), 'newcar': newcar, 'slot': i}
                car_animation_queue.append(anim)
                return

def place_car_in_slot(anim):
    # place car once animation finishes
    idx = anim['slot']
    garage_slots[idx] = anim['newcar']
    # Check for win (garage full)
    global game_over
    if all(slot is not None for slot in garage_slots):
        game_over = True
    # clear selection
    global selected_slot
    selected_slot = None

def reset_game():
    global state, flows, action_timers, cars, steps_elapsed, balance_history, coin_particles, garage_slots, car_animation_queue, selected_slot, selected_car_index, time_accumulator, negotiated_apy, negotiated_minimum, start_time, liquidity_sources
    state = {
        'My_Account_Balance': 0.0,
        'Monthly_earnings': TARGET_MONTHLY_EARNINGS,
        'Monthly_spending': 50.0,
        'Monthly_Percent_Interest_Rate': apy_to_monthly_percent(LOW_APY),
        'Price_of_car': 5000.0,
    }
    flows.update({k:0.0 for k in flows})
    action_timers.update({k:0.0 for k in action_timers})
    cooldowns.update({k:0.0 for k in cooldowns})
    steps_elapsed = 0
    balance_history.clear()
    click_timestamps.clear()
    coin_particles.clear()
    garage_slots = [None] * GARAGE_SLOTS
    car_animation_queue.clear()
    liquidity_sources = {"work": 0.0, "interest": 0.0}
    selected_slot = None
    selected_car_index = 0
    time_accumulator = 0.0
    negotiated_apy = 0.0
    negotiated_minimum = 0.0
    start_time = pygame.time.get_ticks() / 1000.0
    global game_over
    game_over = False

# ----------------------------
# MAIN LOOP
async def main():
    global paused, selected_car_index, selected_slot, time_accumulator
    running = True
    last_time = pygame.time.get_ticks() / 1000.0
    paused = True
    
    while running:
        now = pygame.time.get_ticks() / 1000.0
        elapsed = now - last_time
        last_time = now
    
        # Update cooldowns
        # Update cooldowns only when not paused
        if not globals().get('paused', False):
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
                elif event.key == pygame.K_p:
                    paused = not paused
                elif paused and event.key == pygame.K_r:
                    reset_game()
                elif paused and event.key == pygame.K_i:
                    do_negotiate()
                elif paused and event.key == pygame.K_TAB:
                    selected_car_index = (selected_car_index + 1) % len(CAR_CATALOG)
                elif paused and event.key == pygame.K_b:
                    buy_selected_car()
                elif paused and event.key == pygame.K_u:
                    if state['My_Account_Balance'] >= UPGRADE_COST:
                        state['My_Account_Balance'] -= UPGRADE_COST
                        remove_liquidity(UPGRADE_COST)
                        for _ in range(UPGRADE_SLOTS):
                            garage_slots.append(None)
                elif paused:
                    continue
                elif event.key == pygame.K_s:
                    do_save()
                elif event.key == pygame.K_v:
                    # sell selected slot
                    if selected_slot is not None and garage_slots[selected_slot] is not None:
                        car = garage_slots[selected_slot]
                        refund = car.get('value', car['price']) * SELL_FRACTION
                        state['My_Account_Balance'] += refund
                        add_liquidity(work=refund)
                        garage_slots[selected_slot] = None
                        selected_slot = None
                elif event.key == pygame.K_r:
                    reset_game()
                elif event.key == pygame.K_SPACE:
                    # space acts as a work input
                    do_work()
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if paused:
                    if event.button == 1:
                        mx, my = event.pos
                        for button_id, rect in pause_ui_buttons.items():
                            if rect.collidepoint(mx, my):
                                if button_id == "resume":
                                    paused = False
                                elif button_id == "reset":
                                    reset_game()
                                elif button_id == "apply_bank":
                                    do_negotiate()
                                elif button_id == "buy_car":
                                    buy_selected_car()
                                elif button_id == "upgrade_garage":
                                    if state['My_Account_Balance'] >= UPGRADE_COST:
                                        state['My_Account_Balance'] -= UPGRADE_COST
                                        remove_liquidity(UPGRADE_COST)
                                        for _ in range(UPGRADE_SLOTS):
                                            garage_slots.append(None)
                                elif button_id.startswith("car_"):
                                    selected_car_index = int(button_id.split("_")[1])
                                break
                    continue
                if event.button == 1:  # left click = work
                    mx, my = event.pos
                    gx, gy = garage_pos
                    for i in range(len(garage_slots)):
                        sx = gx + (i % 3) * (slot_w + 10)
                        sy = gy + (i // 3) * (slot_h + 10)
                        rect = pygame.Rect(sx, sy, slot_w, slot_h)
                        if rect.collidepoint(mx, my):
                            selected_slot = i
                            break
                    else:
                        do_work()
    
        # Model stepping: convert real seconds to months and take MODEL_DT steps
        if not paused and not game_over:
            time_accumulator += elapsed * MONTHS_PER_SECOND
            while time_accumulator >= MODEL_DT:
                model_step(MODEL_DT)
                time_accumulator -= MODEL_DT
    
        # Update car animations
        for anim in car_animation_queue[:]:
            tx, ty = anim['target']
            dx = tx - anim['x']
            dy = ty - anim['y']
            dist = math.hypot(dx, dy)
            if dist < 8:
                # finish
                place_car_in_slot(anim)
                car_animation_queue.remove(anim)
            else:
                # move proportionally to elapsed
                step = anim['speed'] * elapsed
                anim['x'] += dx / dist * step
                anim['y'] += dy / dist * step
    
        # Draw everything
        draw_ui()
    
        pygame.display.flip()
        clock.tick(60)
        await asyncio.sleep(0)
    
    pygame.quit()
    sys.exit()

asyncio.run(main())

# ----------------------------
# PARAMETERS (easy to tweak)
# - MODEL_DT: internal model step (months)
# - MONTHS_PER_SECOND: simulation speed
# - ACTION_EFFECTS: tweak `work_deposit`, `save_multiplier`, durations, etc.

# ----------------------------
# MODEL RULES
# - Stock `My_Account_Balance` integrates (Deposits - Withdrawals)
# - Deposits = Monthly_earnings + Monthly_Interest_Payments
# - Monthly_Interest_Payments = My_Account_Balance * Monthly_Percent_Interest_Rate / 100
# - Withdrawals = Monthly_spending (modified by save action)
# - Interest payments visually spawn coins that flow back into the balance (reinforcing)

# ----------------------------
# PLAYER ACTIONS
# - Left-click: Work — instant deposit (short cooldown)
# - S: Save — reduces spending temporarily (balancing)
# - P: Pause — open the bank and dealership panels
# - I: Apply the current bank APY offer while paused
# - B: Buy selected car while paused — moves value from liquidity to assets
