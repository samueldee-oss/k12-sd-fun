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
  - I: Negotiate (temporary increase in interest rate)
  - B: Buy selected car (or cheapest if none selected)
  - TAB: Cycle car selection
  - R: Reset game
  - Esc / window close: Quit

Sections at bottom: PARAMETERS, MODEL RULES, PLAYER ACTIONS
"""

import pygame
import sys
import math
import random
from collections import deque

pygame.init()
WIDTH, HEIGHT = 1000, 640
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Bank Dynamics — Garage Edition")
clock = pygame.time.Clock()
FONT = pygame.font.SysFont("Arial", 16)
BIG = pygame.font.SysFont("Arial", 26)

# ----------------------------
# MODEL INTERPRETATION (from `bank.stmx`)
# Stocks -> state dictionary
state = {
    "My_Account_Balance": 0.0,
    "Monthly_earnings": 100.0,
    "Monthly_spending": 50.0,
    "Monthly_Percent_Interest_Rate": 0.5,  # percent per month
    "Price_of_car": 5000.0,
}

# Derived flows
flows = {"Monthly_Interest_Payments": 0.0, "Deposits": 0.0, "Withdrawals": 0.0}

# Integration settings
MODEL_DT = 0.25  # months per model step
time_accumulator = 0.0
MONTHS_PER_SECOND = 1.5  # speed: months per real second

# Game state
cars = []  # purchased cars stored as dicts
steps_elapsed = 0
balance_history = deque(maxlen=300)

# Action timers (months)
action_timers = {"save_months": 0.0, "neg_rate_months": 0.0}

# Effects and tunables
ACTION_EFFECTS = {
    "work_deposit": 250.0,
    "save_multiplier": 0.5,
    "save_duration_months": 12.0,
    "neg_rate_bonus": 0.6,
    "neg_rate_duration_months": 24.0,
    "work_cooldown_seconds": 0.25,
}

# Cooldowns in seconds
cooldowns = {"work": 0.0}

# Visual elements
coin_particles = []  # show interest coins
arrow_strength = 0.0

# Garage config
GARAGE_SLOTS = 6
garage_slots = [None] * GARAGE_SLOTS
garage_pos = (60, 360)
slot_w, slot_h = 120, 70
car_animation_queue = []
selected_car_index = 0
game_over = False

# Car catalogue (tiers)
CAR_CATALOG = [
    {"name": "Compact", "price": 1000, "color": (200, 200, 200), "score": 1},
    {"name": "Sedan", "price": 3000, "color": (120, 180, 240), "score": 2},
    {"name": "Sports", "price": 8000, "color": (255, 90, 90), "score": 4},
    {"name": "Lamborghini", "price": 20000, "color": (255, 215, 0), "score": 10},
]

# Helpers
def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def draw_text(surf, text, x, y, color=(255, 255, 255), font=FONT):
    surf.blit(font.render(text, True, color), (x, y))

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

    # Top-right: Progress to selected car
    catalog = CAR_CATALOG[selected_car_index]
    px, py = 520, 40
    draw_text(screen, f"Selected: {catalog['name']}  Price: ${catalog['price']:,}", px, py)
    # Progress bar
    bar_x, bar_y, bar_w, bar_h = px, py + 30, 420, 28
    pygame.draw.rect(screen, (40, 40, 40), (bar_x, bar_y, bar_w, bar_h))
    prog = clamp(state['My_Account_Balance'] / catalog['price'], 0.0, 1.0)
    pygame.draw.rect(screen, (40, 170, 240), (bar_x, bar_y, int(bar_w * prog), bar_h))
    pygame.draw.rect(screen, (220, 220, 220), (bar_x, bar_y, bar_w, bar_h), 2)
    draw_text(screen, f"{prog*100:0.1f}% toward {catalog['name']}", bar_x + 8, bar_y + 4)

    # Right: Liquidity and Asset stacked bars
    bx, by = 520, 120
    w, h = 420, 36
    # asset value comes from placed cars in garage_slots
    asset_value = sum([c['price'] for c in garage_slots if c is not None])
    total_net = state['My_Account_Balance'] + asset_value
    # Liquidity bar (left portion)
    liquidity_w = int(w * (state['My_Account_Balance'] / (total_net if total_net>0 else 1)))
    pygame.draw.rect(screen, (60, 60, 70), (bx, by, w, h))
    pygame.draw.rect(screen, (0, 200, 120), (bx, by, liquidity_w, h))
    pygame.draw.rect(screen, (220, 220, 220), (bx, by, w, h), 2)
    draw_text(screen, f"Liquidity: ${state['My_Account_Balance']:,.0f}", bx + 6, by + 6)
    draw_text(screen, f"Assets: ${asset_value:,.0f}", bx + 220, by + 6)

    # Garage display
    gx, gy = garage_pos
    draw_text(screen, "Garage:", gx, gy - 34)
    for i in range(GARAGE_SLOTS):
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

    # Car catalogue buttons / hints
    cy_base = gy + 170
    for idx, cc in enumerate(CAR_CATALOG):
        x = 520 + (idx * 120)
        y = cy_base
        w2, h2 = 110, 52
        pygame.draw.rect(screen, (24, 24, 28), (x, y, w2, h2))
        pygame.draw.rect(screen, (150, 150, 150), (x, y, w2, h2), 2)
        draw_text(screen, cc['name'], x + 6, y + 6)
        draw_text(screen, f"${cc['price']}", x + 6, y + 26)
        if idx == selected_car_index:
            pygame.draw.rect(screen, (255, 215, 120), (x, y, w2, h2), 2)

    # Bottom: controls and stats
    draw_text(screen, "Left-click: Work (instant deposit)  S: Save  I: Negotiate  B: Buy  TAB: Select car  R: Reset", 20, HEIGHT - 40, color=(190,190,190))
    draw_text(screen, f"Interest/month: ${flows['Monthly_Interest_Payments']:0.2f}  Earnings: ${state['Monthly_earnings']:.0f}  Spending: ${state['Monthly_spending']:.0f}", 20, HEIGHT - 64)

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

# ----------------------------
# MODEL UPDATE (Euler discrete)
def model_step(dt_months):
    global steps_elapsed, arrow_strength

    effective_spending = state['Monthly_spending']
    if action_timers['save_months'] > 0:
        effective_spending *= ACTION_EFFECTS['save_multiplier']

    effective_interest_rate = state['Monthly_Percent_Interest_Rate']
    if action_timers['neg_rate_months'] > 0:
        effective_interest_rate += ACTION_EFFECTS['neg_rate_bonus']

    flows['Monthly_Interest_Payments'] = state['My_Account_Balance'] * effective_interest_rate / 100.0
    flows['Deposits'] = state['Monthly_earnings'] + flows['Monthly_Interest_Payments']
    flows['Withdrawals'] = effective_spending

    delta_per_month = flows['Deposits'] - flows['Withdrawals']
    state['My_Account_Balance'] += delta_per_month * dt_months
    state['My_Account_Balance'] = max(0.0, state['My_Account_Balance'])

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
    state['My_Account_Balance'] += ACTION_EFFECTS['work_deposit']
    cooldowns['work'] = ACTION_EFFECTS['work_cooldown_seconds']

def do_save():
    if action_timers['save_months'] > 0:
        return
    action_timers['save_months'] = ACTION_EFFECTS['save_duration_months']

def do_negotiate():
    if action_timers['neg_rate_months'] > 0:
        return
    action_timers['neg_rate_months'] = ACTION_EFFECTS['neg_rate_duration_months']

def buy_selected_car():
    global garage_slots
    cc = CAR_CATALOG[selected_car_index]
    price = cc['price']
    if state['My_Account_Balance'] >= price:
        # find first empty slot
        for i in range(GARAGE_SLOTS):
            if garage_slots[i] is None:
                state['My_Account_Balance'] -= price
                newcar = { 'name': cc['name'], 'price': price, 'color': cc['color'] }
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

def reset_game():
    global state, flows, action_timers, cars, steps_elapsed, balance_history, coin_particles, garage_slots, car_animation_queue
    state = {
        'My_Account_Balance': 0.0,
        'Monthly_earnings': 100.0,
        'Monthly_spending': 50.0,
        'Monthly_Percent_Interest_Rate': 0.5,
        'Price_of_car': 5000.0,
    }
    flows.update({k:0.0 for k in flows})
    action_timers.update({k:0.0 for k in action_timers})
    steps_elapsed = 0
    balance_history.clear()
    coin_particles.clear()
    for i in range(GARAGE_SLOTS):
        garage_slots[i] = None
    car_animation_queue.clear()
    global game_over
    game_over = False

# ----------------------------
# MAIN LOOP
running = True
last_time = pygame.time.get_ticks() / 1000.0

while running:
    now = pygame.time.get_ticks() / 1000.0
    elapsed = now - last_time
    last_time = now

    # Update cooldowns
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
            elif event.key == pygame.K_s:
                do_save()
            elif event.key == pygame.K_i:
                do_negotiate()
            elif event.key == pygame.K_b:
                buy_selected_car()
            elif event.key == pygame.K_TAB:
                selected_car_index = (selected_car_index + 1) % len(CAR_CATALOG)
            elif event.key == pygame.K_r:
                reset_game()
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # left click = work
                do_work()

    # Model stepping: convert real seconds to months and take MODEL_DT steps
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

pygame.quit()
sys.exit()

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
# - I: Negotiate — temporarily raises interest rate (reinforcing)
# - B: Buy selected car — moves value from liquidity to assets (garage)
