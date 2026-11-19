"""Cute picture icons for every game: one drawing per game, used two ways.

* Animated GIFs for the dashboard grid (dashboard/app-icons/<id>.gif).
* A still frame of the same drawing for each game's iPhone / iPad Home Screen icon
  (tools/make_home_screen_apps.py calls still_icon()).

Run it directly to (re)make the GIFs and a contact sheet:

    python tools/game_icons.py            # all games
    python tools/game_icons.py capybara   # just one

To add a game: write a draw function below (it gets a canvas and t, which goes 0 -> 1
over one loop), then add a line to ICONS. Coordinates are 0-100 across the icon.
Needs Pillow (pip install pillow).
"""

from __future__ import annotations

import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "dashboard" / "app-icons"
INK = "#2b1d33"  # outline colour for characters
GIF_SIZE = 200   # shown at ~96-110 px on the dashboard, so this is sharp on Retina screens
FRAMES = 20
FRAME_MS = 70

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]


def font(px: float) -> ImageFont.ImageFont:
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            return ImageFont.truetype(p, max(6, int(px)))
    return ImageFont.load_default(max(6, int(px)))


TAU = math.tau


def sn(x: float) -> float:
    return math.sin(TAU * x)


def cs(x: float) -> float:
    return math.cos(TAU * x)


def tri(x: float) -> float:
    """0 -> 1 -> 0 over one period."""
    return 1 - abs(2 * (x % 1) - 1)


def lerp(a, b, k):
    return a + (b - a) * k


def mix(c1: str, c2: str, k: float) -> tuple:
    a = [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(c2[i:i + 2], 16) for i in (1, 3, 5)]
    return tuple(int(lerp(x, y, k)) for x, y in zip(a, b))


class Canvas:
    """Draws in 0-100 units at a larger size, then shrinks for smooth edges."""

    def __init__(self, size: int, bg: str, ss: int = 3):
        self.size = size
        self.n = size * ss
        self.u = self.n / 100
        self.im = Image.new("RGB", (self.n, self.n), bg)
        self.d = ImageDraw.Draw(self.im, "RGBA")

    def _w(self, w):
        return max(1, int(round(w * self.u)))

    def _box(self, x0, y0, x1, y1):
        return [x0 * self.u, y0 * self.u, x1 * self.u, y1 * self.u]

    def ell(self, cx, cy, rx, ry=None, fill=None, ol=None, w=2.0):
        ry = rx if ry is None else ry
        self.d.ellipse(self._box(cx - rx, cy - ry, cx + rx, cy + ry), fill=fill,
                       outline=ol, width=self._w(w) if ol else 0)

    def rect(self, x0, y0, x1, y1, fill=None, ol=None, w=2.0, r=0):
        self.d.rounded_rectangle(self._box(x0, y0, x1, y1), radius=r * self.u, fill=fill,
                                 outline=ol, width=self._w(w) if ol else 0)

    def poly(self, pts, fill=None, ol=None, w=2.0):
        P = [(x * self.u, y * self.u) for x, y in pts]
        self.d.polygon(P, fill=fill)
        if ol:
            self.line(pts + [pts[0]], ol, w)

    def line(self, pts, fill, w=2.0):
        P = [(x * self.u, y * self.u) for x, y in pts]
        self.d.line(P, fill=fill, width=self._w(w), joint="curve")
        r = self._w(w) / 2
        for x, y in (P[0], P[-1]):
            self.d.ellipse([x - r, y - r, x + r, y + r], fill=fill)

    def arc(self, cx, cy, rx, ry, a0, a1, fill, w=2.0):
        self.d.arc(self._box(cx - rx, cy - ry, cx + rx, cy + ry), a0, a1, fill=fill, width=self._w(w))

    def chord(self, cx, cy, rx, ry, a0, a1, fill=None, ol=None, w=2.0):
        self.d.chord(self._box(cx - rx, cy - ry, cx + rx, cy + ry), a0, a1, fill=fill,
                     outline=ol, width=self._w(w) if ol else 0)

    def text(self, x, y, s, size, fill, ol=None):
        kw = {"stroke_width": self._w(1.6), "stroke_fill": ol} if ol else {}
        self.d.text((x * self.u, y * self.u), s, font=font(size * self.u), fill=fill, anchor="mm", **kw)

    def glow(self, cx, cy, r, rgb, strength=0.5, rings=10):
        for i in range(rings, 0, -1):
            k = i / rings
            self.ell(cx, cy, r * k, fill=rgb + (int(255 * strength / rings),))

    def star(self, cx, cy, r, fill, ol=None, points=5, rot=0.0, inner=0.45):
        pts = []
        for i in range(points * 2):
            a = rot + i * math.pi / points - math.pi / 2
            rr = r if i % 2 == 0 else r * inner
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
        self.poly(pts, fill=fill, ol=ol, w=1.4)

    def eye(self, cx, cy, r=3.2, look=(0, 0)):
        self.ell(cx, cy, r, fill=INK)
        self.ell(cx - r * .35 + look[0], cy - r * .35 + look[1], r * .38, fill="#ffffff")

    def blush(self, cx, cy, r=3.2):
        self.ell(cx, cy, r, r * .6, fill=(255, 120, 150, 120))

    def smile(self, cx, cy, r=3.0, w=1.6):
        self.arc(cx, cy, r, r * .8, 20, 160, INK, w)

    def sky(self, top: str, bottom: str, y0=0, y1=100, steps=40):
        for i in range(steps):
            k = i / (steps - 1)
            a = lerp(y0, y1, i / steps)
            b = lerp(y0, y1, (i + 1) / steps) + .5
            self.rect(0, a, 100, b, fill=mix(top, bottom, k))

    def done(self) -> Image.Image:
        return self.im.convert("RGB").resize((self.size, self.size), Image.LANCZOS)


# ---------------------------------------------------------------- the drawings


def d_pong(c: Canvas, t):
    for y in range(4, 100, 12):
        c.rect(49, y, 51, y + 6, fill="#334155")
    bx = 21 + 58 * tri(t)
    by = 50 + 26 * sn(t * 2 + .1) * .9
    ly = 50 + (by - 50) * .85 * (1 if bx < 55 else .5)
    ry = 50 + (by - 50) * .85 * (1 if bx > 45 else .5)
    c.rect(8, ly - 14, 15, ly + 14, fill="#34d399", r=3)
    c.rect(85, ry - 14, 92, ry + 14, fill="#f472b6", r=3)
    for i in range(1, 4):
        tt = t - i * .025
        c.ell(21 + 58 * tri(tt), 50 + 26 * sn(tt * 2 + .1) * .9, 6 - i, fill=(253, 224, 71, 70 - i * 15))
    c.ell(bx, by, 8.5, fill="#fde047", ol=INK, w=1.6)
    c.ell(bx - 2.4, by - 1.2, 1.2, fill=INK)
    c.ell(bx + 2.4, by - 1.2, 1.2, fill=INK)
    c.smile(bx, by + 1.2, 2.4, 1.2)


def d_whisker(c: Canvas, t):
    sys.path.insert(0, str(Path(__file__).parent))
    from whisker_dash_icon import FACE, PAL
    rnd = random.Random(3)
    for i in range(14):
        x, y, ph = rnd.uniform(4, 96), rnd.uniform(4, 96), rnd.random()
        a = .5 + .5 * sn(t + ph)
        c.star(x, y, 1.2 + 1.3 * a, (255, 240, 200, int(80 + 150 * a)), points=4, inner=.35)
    blink = .62 < t < .7
    bob = -2.2 * abs(sn(t))
    cell = 4.4
    ox, oy = 50 - cell * 8, 22 + bob
    for dy, slope in ((10, -1), (11, 0), (12, 1)):
        y = oy + dy * cell + cell / 2
        wig = .6 * sn(t * 2)
        c.line([(ox - cell * 1.7, y + slope * cell * .7 + wig), (ox + cell * 1.5, y)], PAL["w"], 1.3)
        c.line([(ox + 16 * cell - cell * 1.5, y), (ox + 16 * cell + cell * 1.7, y + slope * cell * .7 - wig)], PAL["w"], 1.3)
    for r, row in enumerate(FACE):
        for col, ch in enumerate(row):
            if ch == ".":
                continue
            if blink and 6 <= r <= 8 and ch in "we":
                ch = "e" if r == 8 else "o"
            c.rect(ox + col * cell, oy + r * cell, ox + (col + 1) * cell + .15, oy + (r + 1) * cell + .15, fill=PAL[ch])
    # little sneaker-dash dust puffs
    for i in range(3):
        k = (t + i / 3) % 1
        c.ell(14 - 10 * k, 88 - 3 * k, 2.5 + 3 * k, fill=(255, 158, 61, int(150 * (1 - k))))


def d_rulebound(c: Canvas, t):
    for x in range(0, 100, 10):
        c.rect(x, 0, x + .5, 100, fill=(255, 255, 255, 14))
        c.rect(0, x, 100, x + .5, fill=(255, 255, 255, 14))
    # Biscuit the pup
    tilt = 1.5 * sn(t)
    hx, hy = 50 + tilt, 33
    c.ell(hx - 17, hy + 2 + tilt, 7, 12, fill="#a8683a", ol=INK, w=1.6)
    c.ell(hx + 17, hy + 2 - tilt, 7, 12, fill="#a8683a", ol=INK, w=1.6)
    c.ell(hx, hy, 16, 14, fill="#f0c48a", ol=INK, w=1.8)
    c.ell(hx + 6, hy - 5, 5, 4, fill="#ffffff")
    c.eye(hx - 6, hy - 2, 2.6)
    c.eye(hx + 6, hy - 2, 2.6)
    c.ell(hx, hy + 4, 3.2, 2.4, fill=INK)
    if (t % .5) < .3:
        c.ell(hx + 1, hy + 10, 2.4, 3.2, fill="#ff8fb8", ol=INK, w=1)
    c.smile(hx - 2, hy + 6.5, 2.2, 1.2)
    c.smile(hx + 2, hy + 6.5, 2.2, 1.2)
    # PUP IS YOU word blocks, hopping one after another
    words = [("PUP", "#ff8fb8", INK), ("IS", "#ffffff", INK), ("YOU", "#ffd34d", INK)]
    for i, (word, bg, fg) in enumerate(words):
        hop = max(0.0, sn(t - i * .16)) ** 3 * 7
        x = 8 + i * 29
        y = 60 - hop
        c.rect(x + 1, y + 2, x + 27, y + 28, fill=(0, 0, 0, 90), r=4)
        c.rect(x, y, x + 26, y + 26, fill=bg, ol=INK, w=1.8, r=4)
        c.text(x + 13, y + 13.5, word, 8.6 if len(word) == 3 else 12, fg)


def d_capybara(c: Canvas, t):
    c.sky("#9ad7f0", "#d8f1d0", 0, 62)
    c.ell(18, 64, 30, 10, fill="#4f9a3c")
    c.ell(86, 63, 26, 9, fill="#4f9a3c")
    bob = 1.6 * sn(t)
    y = bob
    c.rect(20, 28 + y, 80, 92 + y, fill="#a86b3c", ol=INK, w=2, r=22)
    c.ell(29, 30 + y, 6, 5, fill="#7a4a26", ol=INK, w=1.6)
    c.ell(71, 30 + y, 6, 5, fill="#7a4a26", ol=INK, w=1.6)
    c.rect(29, 52 + y, 71, 76 + y, fill="#c48a55", r=12)
    sleepy = (t % 1) > .55
    for ex in (37, 63):
        if sleepy:
            c.arc(ex, 45 + y, 3.6, 2.4, 10, 170, INK, 1.6)
        else:
            c.eye(ex, 45 + y, 3)
    c.ell(44, 60 + y, 2, 1.6, fill=INK)
    c.ell(56, 60 + y, 2, 1.6, fill=INK)
    c.smile(50, 66 + y, 4, 1.4)
    c.blush(30, 55 + y)
    c.blush(70, 55 + y)
    # the orange on its head
    c.ell(50, 23 + y * 1.4, 8.5, fill="#ff9f1c", ol=INK, w=1.6)
    c.ell(53, 13 + y * 1.4, 4, 2, fill="#4caf50", ol=INK, w=1)
    # river in front
    c.rect(0, 74, 100, 100, fill="#3a8fb7")
    for i in range(6):
        x = (i * 22 + 30 * t) % 120 - 10
        c.arc(x, 76, 6, 2.5, 200, 340, "#bfe6f7", 1.4)
    k = t % 1
    c.ell(50, 77, 32 + 10 * k, 4 + 2 * k, ol=(255, 255, 255, int(160 * (1 - k))), w=1.2)


def d_sprout(c: Canvas, t):
    c.sky("#a9e1ff", "#e9f8ff", 0, 64)
    c.rect(0, 64, 100, 100, fill="#7a5230")
    c.rect(0, 62, 100, 70, fill="#5cb85c")
    for x in range(-2, 102, 6):
        c.poly([(x, 63), (x + 3, 57), (x + 6, 63)], fill="#5cb85c")
    # Gloob
    sq = .5 + .5 * sn(t * 2)
    gx, gw, gh = 79, 13 + 2 * sq, 14 - 2 * sq
    c.ell(gx, 64 - gh, gw, gh, fill="#a35bd6", ol=INK, w=1.8)
    c.rect(gx - gw, 64 - gh, gx + gw, 64, fill="#a35bd6")
    c.line([(gx - gw, 64), (gx + gw, 64)], INK, 1.8)
    hit = t > .78
    c.eye(gx - 5, 62 - gh, 2.6, (-.5, 0))
    c.eye(gx + 3, 62 - gh, 2.6, (-.5, 0))
    if hit:
        c.ell(gx - 1, 66 - gh * .4, 2.6, 2, fill=INK)
    # plant
    lean = 2 * max(0, sn(t * 2 + .25)) if t < .3 else 0
    c.line([(26, 64), (26 + lean, 44)], "#3e8e2f", 3)
    c.ell(17, 56, 7, 3.4, fill="#6cc04a", ol=INK, w=1.4)
    c.ell(35, 58, 7, 3.4, fill="#6cc04a", ol=INK, w=1.4)
    c.ell(26 + lean, 36, 11, fill="#7fd36b", ol=INK, w=1.8)
    c.ell(37 + lean, 37, 4, 3.4, fill="#6cc04a", ol=INK, w=1.6)
    c.ell(38.5 + lean, 37, 1.6, fill=INK)
    c.eye(24 + lean, 33, 2.4)
    c.ell(18, 23, 3, 6, fill="#7fd36b", ol=INK, w=1.2)
    # dew pea flying
    if t < .8:
        k = t / .8
        px = 42 + (gx - gw - 42) * k
        c.ell(px - 3, 37 + 10 * k * k, 2.3, fill=(150, 220, 255, 90))
        c.ell(px, 37 + 10 * k * k, 3.4, fill="#7fd0ff", ol=INK, w=1.2)
    else:
        k = (t - .8) / .2
        for i in range(6):
            a = i / 6 * TAU
            r = 3 + 8 * k
            c.ell(gx - gw + math.cos(a) * r, 47 + math.sin(a) * r, 1.8 * (1 - k) + .4, fill="#7fd0ff")


def d_kitty(c: Canvas, t):
    c.sky("#cdeefd", "#fef3f7", 0, 74)
    for i, (x, y) in enumerate(((15, 15), (82, 22), (60, 10))):
        c.ell(x + 2 * sn(t + i / 3), y, 7, 3.5, fill="#ffffff")
    # falling treats
    for i, (kind, x0) in enumerate((("fish", 30), ("star", 72), ("heart", 50))):
        k = (t + i / 3) % 1
        y = -8 + 50 * k
        a = int(255 * min(1, (1 - k) * 3))
        if kind == "star":
            c.star(x0, y, 4.5, (255, 214, 64, a), rot=k * 2)
        elif kind == "heart":
            c.ell(x0 - 2, y, 2.6, fill=(255, 107, 154, a))
            c.ell(x0 + 2, y, 2.6, fill=(255, 107, 154, a))
            c.poly([(x0 - 4.5, y + .8), (x0 + 4.5, y + .8), (x0, y + 6)], fill=(255, 107, 154, a))
        else:
            c.ell(x0, y, 4.5, 2.6, fill=(255, 159, 67, a))
            c.poly([(x0 + 4, y), (x0 + 8, y - 3), (x0 + 8, y + 3)], fill=(255, 159, 67, a))
    bob = 1.8 * sn(t)
    rock = 1.2 * sn(t + .25)
    y = bob
    # Mochi the cat
    cx, cy = 37, 52 + y
    c.poly([(cx - 10, cy - 4), (cx - 8, cy - 16), (cx - 1, cy - 9)], fill="#ffffff", ol=INK, w=1.5)
    c.poly([(cx + 10, cy - 4), (cx + 8, cy - 16), (cx + 1, cy - 9)], fill="#ffffff", ol=INK, w=1.5)
    c.ell(cx, cy, 11, 10, fill="#ffffff", ol=INK, w=1.7)
    c.poly([(cx - 8, cy - 7), (cx - 7.5, cy - 13), (cx - 3.5, cy - 9)], fill="#ffb3c7")
    c.eye(cx - 4, cy, 2.2)
    c.eye(cx + 4, cy, 2.2)
    c.ell(cx, cy + 3, 1.2, .9, fill="#ff7fa8")
    c.blush(cx - 7, cy + 4, 2.4)
    # Bubbles the axolotl
    ax, ay = 63, 53 + y - rock
    for s in (-1, 1):
        for g in (-4, 0, 4):
            c.line([(ax + s * 9, ay - 2 + g * .7), (ax + s * 16, ay - 5 + g * 1.4)], "#e9418a", 2)
    c.ell(ax, ay, 11, 9.5, fill="#ffb3d1", ol=INK, w=1.7)
    c.eye(ax - 4.5, ay - 1, 2.2)
    c.eye(ax + 4.5, ay - 1, 2.2)
    c.smile(ax, ay + 3, 3.2, 1.3)
    c.blush(ax - 7, ay + 3, 2.2)
    c.blush(ax + 7, ay + 3, 2.2)
    # teacup boat
    c.chord(50, 58 + y, 32, 22, 0, 180, fill="#ffffff", ol=INK, w=2)
    c.rect(18.5, 58 + y, 81.5, 60 + y, fill=INK)
    c.ell(84, 66 + y, 6, 7, ol=INK, w=2.4)
    for x in (32, 50, 68):
        c.ell(x, 68 + y, 2.6, fill="#ff9ec4")
    # pond
    c.rect(0, 76, 100, 100, fill="#7cc8f0")
    for i in range(6):
        x = (i * 20 - 20 * t) % 120 - 10
        c.arc(x, 78, 6, 2.5, 200, 340, "#ffffff", 1.4)


def d_poirot(c: Canvas, t):
    c.ell(50, 115, 60, 40, fill="#2a2650")
    # body + neck shine
    c.ell(50, 96, 30, 22, fill="#8d97ab", ol=INK, w=1.8)
    c.chord(50, 78, 22, 12, 0, 180, fill="#6fae8f")
    c.chord(50, 80, 18, 8, 0, 180, fill="#9a6fc2")
    # head
    c.ell(50, 56, 23, 22, fill="#a9b2c4", ol=INK, w=1.8)
    c.eye(41, 52, 3.2)
    c.eye(59, 52, 3.2)
    c.poly([(46, 58), (54, 58), (50, 66)], fill="#e8b04a", ol=INK, w=1.2)
    # mustache, twitching
    tw = 1.2 * max(0, sn(t * 2)) ** 4
    for s in (-1, 1):
        c.line([(50, 66), (50 + s * 6, 67), (50 + s * 11, 65 - tw), (50 + s * 13, 61 - tw), (50 + s * 11, 59 - tw)], INK, 2.6)
    # bowler hat
    c.ell(50, 36, 21, 4.5, fill="#1b1b22", ol=INK, w=1.4)
    c.chord(50, 35, 13, 16, 180, 360, fill="#1b1b22")
    c.rect(37, 31, 63, 34, fill="#8e5bd6")
    # magnifying glass sweeping
    gx = 62 + 13 * sn(t)
    gy = 64 + 7 * sn(t * 2)
    c.line([(gx + 8, gy + 8), (gx + 18, gy + 20)], "#6b4a2b", 4)
    c.ell(gx, gy, 11.5, fill=(190, 225, 255, 70), ol="#f2c14e", w=2.8)
    c.arc(gx - 2, gy - 2, 6.5, 6.5, 200, 260, (255, 255, 255, 200), 1.6)
    # clue footprint sparkle
    k = (t * 2) % 1
    c.star(20, 22, 2 + 2.5 * tri(k), (242, 193, 78, 230), points=4, inner=.3)


def d_slug(c: Canvas, t):
    c.ell(50, 90, 70, 22, fill="#3f7a2c")
    for i in range(7):
        x = i * 16 + 4
        c.poly([(x, 100), (x + 3, 76 + 4 * (i % 2)), (x + 6, 100)], fill="#4e9136")
    st = sn(t)
    body_len = 34 + 3 * st
    # slime trail
    c.ell(68, 80, 24, 3, fill=(255, 255, 255, 45))
    # body (head on the left, tail on the right)
    c.ell(46 + body_len * .3, 70, body_len, 11, fill="#f7d63a", ol=INK, w=1.8)
    c.ell(34, 60 - 1.5 * st, 15, 15, fill="#f7d63a", ol=INK, w=1.8)
    c.rect(26, 62, 60, 79, fill="#f7d63a")
    c.line([(20, 80), (78, 80)], INK, 1.6)
    for x, y in ((56, 66), (66, 72), (74, 66), (46, 74)):
        c.ell(x, y, 2.3, 1.8, fill="#8a6a1c")
    # eye stalks
    for s, ph in ((-1, 0), (1, .25)):
        tipx = 34 + s * 7 + 2 * sn(t + ph)
        tipy = 33 - 1.5 * st + 1.5 * cs(t + ph)
        c.line([(34 + s * 3, 49), (tipx, tipy)], "#e9c12c", 2.6)
        c.ell(tipx, tipy, 4, fill="#ffffff", ol=INK, w=1.2)
        c.ell(tipx + .8, tipy + .5, 2, fill=INK)
    c.smile(34, 62 - 1.5 * st, 4, 1.6)
    c.blush(26, 61, 2.4)
    c.blush(42, 61, 2.4)
    # derpy bug buzzing around
    bx, by = 76 + 12 * cs(t), 28 + 8 * sn(t * 2)
    flap = abs(sn(t * 5))
    c.ell(bx - 2, by - 4, 3.5, 2 + 2.5 * flap, fill=(255, 255, 255, 170))
    c.ell(bx + 2, by - 4, 3.5, 2 + 2.5 * flap, fill=(255, 255, 255, 170))
    c.ell(bx, by, 5.5, 4, fill="#e98a6a", ol=INK, w=1.3)
    c.ell(bx - 2, by - 1, 1.6, fill="#ffffff")
    c.ell(bx + 1.5, by - 1, 1.1, fill="#ffffff")
    c.ell(bx - 2, by - .6, .7, fill=INK)
    c.ell(bx + 1.5, by - .7, .6, fill=INK)


def d_crucible(c: Canvas, t):
    for x in range(5, 100, 9):
        for y in range(5, 100, 9):
            c.ell(x, y, .7, fill="#d4d8de")
    # cauldron
    phase = (t * 2) % 1 if t < .5 else 0
    lc = mix("#5aa8ff", "#7fd36b", min(1, max(0, (t - .45) * 6)) * (1 if t < .9 else (1 - (t - .9) * 10)))
    c.ell(50, 66, 26, 22, fill="#3a3a48", ol=INK, w=2)
    c.ell(50, 50, 24, 6, fill=lc, ol=INK, w=2)
    c.ell(34, 88, 4, 3, fill="#3a3a48")
    c.ell(66, 88, 4, 3, fill="#3a3a48")
    c.ell(42, 66, 6, 4, fill=(255, 255, 255, 40))
    if t < .5:
        k = t / .5
        e = k * k
        # fire from the left, water from the right, falling in
        fx, fy = lerp(18, 46, e), lerp(20, 48, e) - 10 * sn(k / 2)
        wx, wy = lerp(82, 54, e), lerp(20, 48, e) - 10 * sn(k / 2)
        s = 1 - .4 * e
        c.poly([(fx, fy - 9 * s), (fx + 6 * s, fy + 2 * s), (fx, fy + 6 * s), (fx - 6 * s, fy + 2 * s)], fill="#ff7a2f", ol=INK, w=1.2)
        c.ell(fx, fy + 2 * s, 3.4 * s, fill="#ffd23f")
        c.poly([(wx, wy - 9 * s), (wx + 5.5 * s, wy + 1 * s), (wx - 5.5 * s, wy + 1 * s)], fill="#5aa8ff")
        c.ell(wx, wy + 1.5 * s, 5.6 * s, fill="#5aa8ff", ol=None)
        c.ell(wx - 1.8 * s, wy + .5 * s, 1.4 * s, fill="#ffffff")
        c.text(50, 22, "+", 16, "#9aa0ab")
    else:
        k = (t - .5) / .5
        # sparkles + a new thing appears (a little sprout)
        for i in range(8):
            a = i / 8 * TAU + k
            r = 8 + 22 * k
            c.star(50 + math.cos(a) * r, 46 + math.sin(a) * r * .7, 2.6 * (1 - k) + .3, "#ffd23f", points=4, inner=.35)
        rise = min(1, k * 2.2)
        y = 48 - 24 * rise
        c.line([(50, y + 10), (50, y)], "#3e8e2f", 2.4)
        c.ell(45, y + 2, 5, 3, fill="#7fd36b", ol=INK, w=1.2)
        c.ell(55, y - 1, 5, 3, fill="#7fd36b", ol=INK, w=1.2)
        for i in range(3):
            kk = (k + i / 3) % 1
            c.ell(38 + i * 12, 44 - 22 * kk, 3 + 3 * kk, fill=(200, 205, 215, int(160 * (1 - kk))))


def d_sensory(c: Canvas, t):
    rnd = random.Random(7)
    k = (t * 2) % 1
    press = max(0, 1 - k * 4)
    cols = ["#e5442f", "#ffd23f", "#3b82f6", "#22c55e", "#ff3cac", "#111111"]
    for i in range(22):
        a = rnd.uniform(0, TAU)
        sp = rnd.uniform(18, 40)
        x = 50 + math.cos(a) * sp * k
        y = 56 + math.sin(a) * sp * k + 25 * k * k
        if k > .05:
            c.rect(x - 1.6, y - 1, x + 1.6, y + 1, fill=cols[i % len(cols)])
    c.ell(50, 66, 30, 14, fill="#222222")
    c.rect(20, 56, 80, 66, fill="#222222")
    top = 50 + 6 * press
    c.ell(50, 60, 26, 10, fill="#9b2416")
    c.rect(24, top, 76, 60, fill="#9b2416")
    c.ell(50, top, 26, 10, fill="#e5442f", ol=INK, w=1.6)
    c.ell(42, top - 3, 8, 3, fill=(255, 255, 255, 110))
    # floating +1
    c.text(68 + 4 * k, 34 - 18 * k, "+1", 12, (17, 17, 17, int(255 * (1 - k))))
    # notification badge
    bounce = 3 * abs(sn(t * 2))
    c.ell(80, 16 - bounce, 11, fill="#e5442f", ol="#ffffff", w=1.6)
    c.text(80, 16.5 - bounce, "99+", 7.5, "#ffffff")
    # pointer finger pressing
    fy = 30 + 6 * press
    c.rect(22, fy - 14, 31, fy + 4, fill="#f5c9a5", ol=INK, w=1.4, r=4.5)
    c.rect(17, fy + 1, 37, fy + 18, fill="#f5c9a5", ol=INK, w=1.4, r=6)


def d_moth(c: Canvas, t):
    # drawn small and blown up with hard edges, for the game's 8-bit look
    pulse = .5 + .5 * sn(t * 2)
    c.glow(50, 64, 40 + 4 * pulse, (255, 212, 0), .5 + .2 * pulse, 8)
    c.rect(34, 40, 66, 46, fill="#cfcfcf")
    c.rect(44, 34, 56, 40, fill="#cfcfcf")
    c.rect(36, 46, 64, 84, fill="#ffd400")
    c.rect(36, 46, 40, 84, fill="#cfcfcf")
    c.rect(60, 46, 64, 84, fill="#cfcfcf")
    c.rect(46, 54, 54, 76, fill="#fff7c0")
    c.rect(34, 84, 66, 90, fill="#cfcfcf")
    # Mothwick circling the lantern
    mx, my = 50 + 30 * cs(t), 30 + 10 * sn(t)
    flap = abs(sn(t * 4))
    wing = 5 + 12 * flap
    c.rect(mx - 5 - wing, my - 10, mx - 4, my + 4, fill="#ffffff")
    c.rect(mx + 4, my - 10, mx + 5 + wing, my + 4, fill="#ffffff")
    c.rect(mx - 3 - wing * .7, my + 2, mx - 4, my + 12, fill="#bdbdbd")
    c.rect(mx + 4, my + 2, mx + 3 + wing * .7, my + 12, fill="#bdbdbd")
    c.rect(mx - 5, my - 8, mx + 5, my + 12, fill="#e8e0d0")
    c.rect(mx - 4, my - 5, mx - 1, my - 1, fill="#000000")
    c.rect(mx + 1, my - 5, mx + 4, my - 1, fill="#000000")
    c.rect(mx - 6, my - 14, mx - 3, my - 8, fill="#e8e0d0")
    c.rect(mx + 3, my - 14, mx + 6, my - 8, fill="#e8e0d0")
    # the little red heart
    hx, hy = 16, 90 - 2 * pulse
    c.rect(hx - 6, hy - 4, hx - 1, hy, fill="#ff2a2a")
    c.rect(hx + 1, hy - 4, hx + 6, hy, fill="#ff2a2a")
    c.rect(hx - 6, hy - 1, hx + 6, hy + 2, fill="#ff2a2a")
    c.rect(hx - 4, hy + 2, hx + 4, hy + 4, fill="#ff2a2a")
    c.rect(hx - 2, hy + 4, hx + 2, hy + 6, fill="#ff2a2a")


def d_prism(c: Canvas, t):
    for x in range(0, 110, 12):
        xx = (x - 40 * t) % 108 - 4
        c.rect(xx, 0, xx + .4, 74, fill=(255, 60, 172, 30))
    for y in range(6, 74, 12):
        c.rect(0, y, 100, y + .4, fill=(255, 60, 172, 30))
    c.rect(0, 74, 100, 100, fill="#12062a")
    c.rect(0, 73.5, 100, 76, fill="#ff3cac")
    c.rect(0, 72, 100, 78, fill=(255, 60, 172, 50))
    # spikes slide past under the jump
    for off in (0, 1):
        sx = 104 - 84 * ((t + off) % 1) - 0
        sx = 34 + 70 * (.5 - ((t + off * .5) % 1)) * 1.2
        if -10 < sx < 110:
            c.poly([(sx - 7, 74), (sx, 60), (sx + 7, 74)], fill="#ffffff", ol="#3cf0ff", w=1.4)
    h = 30 * math.sin(math.pi * t)
    cx, cy = 34, 66 - h
    ang = math.pi * t
    # trail
    for i in range(1, 5):
        tt = t - i * .035
        hh = 30 * math.sin(math.pi * (tt % 1))
        c.rect(cx - 4 * i - 3, 66 - hh - 3, cx - 4 * i + 3, 66 - hh + 3, fill=(255, 210, 63, 120 - i * 25))
    c.glow(cx, cy, 18, (255, 210, 63), .6, 8)
    r = 8 * math.sqrt(2)
    pts = [(cx + r * math.cos(ang + math.pi / 4 + i * math.pi / 2), cy + r * math.sin(ang + math.pi / 4 + i * math.pi / 2)) for i in range(4)]
    c.poly(pts, fill="#ffd23f", ol="#ffffff", w=1.6)
    inner = [(cx + .5 * (x - cx), cy + .5 * (y - cy)) for x, y in pts]
    c.poly(inner, fill="#ff3cac")


def d_thistle(c: Canvas, t):
    c.sky("#3b2a5c", "#1f1530", 0, 100)
    rnd = random.Random(5)
    for i in range(10):
        x, y = rnd.uniform(0, 100), rnd.uniform(0, 50)
        c.ell(x, y, .6 + .5 * (.5 + .5 * sn(t + i / 10)), fill="#fff2b0")
    # Thistle King
    kb = 1.2 * sn(t * 2)
    kx, ky = 70, 48 + kb
    c.line([(kx, ky + 10), (kx - 2, 100)], "#4c8a3a", 4)
    c.ell(kx - 10, 80, 8, 3, fill="#4c8a3a")
    spikes = []
    for i in range(24):
        a = i / 24 * TAU
        r = 18 if i % 2 == 0 else 13
        spikes.append((kx + math.cos(a) * r, ky + math.sin(a) * r))
    c.poly(spikes, fill="#7a3fb0")
    c.ell(kx, ky, 13, fill="#a35bd6", ol=INK, w=1.6)
    c.poly([(kx - 10, ky - 13), (kx - 10, ky - 22), (kx - 5, ky - 16), (kx, ky - 24), (kx + 5, ky - 16), (kx + 10, ky - 22), (kx + 10, ky - 13)],
           fill="#ffd400", ol=INK, w=1.4)
    c.line([(kx - 8, ky - 6), (kx - 2, ky - 4)], INK, 1.6)
    c.line([(kx + 8, ky - 6), (kx + 2, ky - 4)], INK, 1.6)
    c.eye(kx - 5, ky - 1, 2.2)
    c.eye(kx + 5, ky - 1, 2.2)
    c.arc(kx, ky + 7, 3.5, 2, 200, 340, INK, 1.5)
    # Buzz the bee with a nectar drop
    bx, by = 30 + 9 * sn(t), 42 + 10 * sn(t * 2)
    c.glow(bx, by + 11, 9, (255, 220, 120), .6, 6)
    c.ell(bx, by + 11, 3.4, fill="#ffe27a", ol=INK, w=1)
    flap = abs(sn(t * 6))
    c.ell(bx - 3, by - 7, 4.5, 2 + 3.5 * flap, fill=(220, 240, 255, 190), ol=INK, w=.9)
    c.ell(bx + 3, by - 7, 4.5, 2 + 3.5 * flap, fill=(220, 240, 255, 190), ol=INK, w=.9)
    c.ell(bx, by, 9, 7, fill="#ffd400", ol=INK, w=1.5)
    c.rect(bx - 2.5, by - 6.6, bx + .5, by + 6.6, fill=INK)
    c.rect(bx + 3.5, by - 5.6, bx + 5.5, by + 5.6, fill=INK)
    c.ell(bx - 5, by - 1, 1.6, fill=INK)
    c.ell(bx - 5.4, by - 1.5, .6, fill="#ffffff")
    c.blush(bx - 6, by + 2.5, 1.6)


def d_rooftop(c: Canvas, t):
    c.sky("#ff8a5c", "#3a1f5a", 0, 100)
    c.ell(70, 46, 15, fill="#ffd27a")
    # far skyline (slow)
    for i in range(6):
        x = (i * 20 - 50 * t) % 120 - 20
        hgt = (28, 18, 34, 22, 30, 16)[i]
        c.rect(x, 74 - hgt, x + 16, 100, fill="#5b3a7a")
    # near rooftops with one gap that passes under the runner
    for base in (-100, 0, 100):
        x0 = base - 100 * t + 50
        c.rect(x0 + 6, 70, x0 + 94, 100, fill="#1a1430")
        for wx in range(10, 90, 12):
            for wy in (78, 88):
                lit = ((wx * 7 + wy) % 3) != 0
                c.rect(x0 + wx, wy, x0 + wx + 5, wy + 5, fill="#f5c24c" if lit else "#2c2448")
        c.rect(x0 + 6, 68, x0 + 94, 71, fill="#2c2448")
    dt = ((t + .5) % 1) - .5
    jump = 0.0
    if abs(dt) < .14:
        jump = 20 * (1 - (dt / .14) ** 2)
    rx, ry = 50, 68 - jump
    swing = sn(t * 4) if jump == 0 else .6
    col = "#ff8a1f"
    z = 1.45

    def P(x, y):
        return (rx + x * z, ry + y * z)
    c.ell(*P(2, -23), 4.2 * z, fill=col)
    c.line([P(1, -18), P(-1, -8)], col, 3 * z)
    c.line([P(-1, -8), P(-1 + 6 * swing, -1), P(-4 + 6 * swing, 0)], col, 2.4 * z)
    c.line([P(-1, -8), P(-1 - 6 * swing, -1), P(1 - 6 * swing, 0)], col, 2.4 * z)
    c.line([P(1, -15), P(6 - 4 * swing, -10)], col, 2.2 * z)
    c.line([P(1, -15), P(-4 + 4 * swing, -11)], col, 2.2 * z)
    for i in range(3):
        c.line([P(-12 - i * 5, -16 + i * 5), P(-7 - i * 5, -16 + i * 5)], (255, 255, 255, 140), 1.4)


def d_bank(c: Canvas, t):
    for i in range(5):
        k = (t + i / 5) % 1
        c.text(12 + i * 19, 96 - 80 * k, "%", 7, (255, 255, 255, int(70 * math.sin(math.pi * k))))
    fall = t < .45
    k = t / .45
    land = max(0.0, 1 - (t - .45) / .25) if not fall else 0
    sq = 3 * land * math.sin(land * math.pi * 2)
    # piggy
    px, py = 50, 62 + sq * .3
    for lx in (34, 44, 58, 68):
        c.rect(lx - 3.5, py + 12, lx + 3.5, py + 22, fill="#f57fae", ol=INK, w=1.5, r=2)
    c.ell(px, py, 28 + sq * .4, 20 - sq * .4, fill="#ff9ec4", ol=INK, w=1.8)
    c.poly([(30, py - 12), (33, py - 26), (42, py - 16)], fill="#f57fae", ol=INK, w=1.5)
    c.rect(20, py - 2, 28, py + 8, fill="#f57fae", ol=INK, w=1.5, r=3)
    c.ell(22.5, py + 3, 1, 1.6, fill=INK)
    c.ell(25.5, py + 3, 1, 1.6, fill=INK)
    c.eye(34, py - 5, 2.6)
    c.blush(36, py + 4, 2.8)
    c.rect(44, py - 20, 58, py - 17, fill=INK, r=1.5)
    c.arc(80, py - 2, 4, 4, 180, 450, INK, 1.6)
    # coin dropping into the slot
    if fall:
        cy = 4 + 34 * k * k
        c.ell(51, cy, 9, 9, fill="#f2c14e", ol=INK, w=1.6)
        c.text(51, cy + .5, "$", 10, "#9a6a10")
    else:
        kk = (t - .45) / .55
        for i in range(6):
            a = i / 6 * TAU
            r = 6 + 16 * kk
            c.star(51 + math.cos(a) * r, 36 + math.sin(a) * r * .6, 2.4 * (1 - kk) + .3, "#ffe27a", points=4, inner=.35)
        c.text(70, 30 - 10 * kk, "+$", 10, (255, 226, 122, int(255 * (1 - kk))))


def d_snake(c: Canvas, t):
    for x in range(0, 100, 10):
        for y in range(0, 100, 10):
            if (x // 10 + y // 10) % 2 == 0:
                c.rect(x, y, x + 10, y + 10, fill="#13203a")
    # apple
    ab = 1.2 * sn(t * 2)
    c.ell(84, 54 + ab, 8, fill="#ef4444", ol=INK, w=1.6)
    c.line([(84, 46 + ab), (85, 42 + ab)], "#6b4a2b", 1.6)
    c.ell(88, 43 + ab, 3.2, 1.6, fill="#22c55e")
    c.ell(81, 51 + ab, 2, 1.4, fill=(255, 255, 255, 140))
    pts = []
    for i in range(30):
        x = 10 + i * 2
        y = 56 + 10 * math.sin(TAU * (x / 34 - t))
        pts.append((x, y))
    for i, (x, y) in enumerate(pts):
        r = 4.5 + 2.5 * (i / len(pts))
        c.ell(x, y, r + 1.4, fill=INK)
    for i, (x, y) in enumerate(pts):
        r = 4.5 + 2.5 * (i / len(pts))
        c.ell(x, y, r, fill="#22c55e" if (i // 3) % 2 == 0 else "#4ade80")
    hx, hy = pts[-1]
    c.ell(hx + 2, hy, 8.5, 7.5, fill="#22c55e", ol=INK, w=1.6)
    c.eye(hx + 3, hy - 3, 2.2)
    c.eye(hx + 7, hy - 2, 2)
    if (t * 3) % 1 < .45:
        c.line([(hx + 10, hy + 2), (hx + 15, hy + 2)], "#ef4444", 1.2)
        c.line([(hx + 15, hy + 2), (hx + 17, hy)], "#ef4444", 1)
        c.line([(hx + 15, hy + 2), (hx + 17, hy + 4)], "#ef4444", 1)


def d_ships(c: Canvas, t):
    # the hand-made icon art (tools/ships_and_villagers_icon.png) with twinkling stars on top
    art = Image.open(Path(__file__).parent / "ships_and_villagers_icon.png").convert("RGB")
    c.im.paste(art.resize((c.n, c.n), Image.LANCZOS))
    rnd = random.Random(11)
    for i in range(9):
        x, y, ph = rnd.uniform(4, 96), rnd.uniform(3, 26), rnd.random()
        a = max(0.0, sn(t + ph)) ** 2
        if a > .02:
            c.star(x, y, 1 + 2.6 * a, (255, 246, 200, int(255 * a)), points=4, inner=.3)


def d_brainy(c: Canvas, t):
    # Brainy Owl: the purple owl folds a paper in half, punches a hole, opens it: two holes (paper folding)
    c.sky("#bfe7ff", "#fdf6e3")
    ease = lambda k: .5 - .5 * math.cos(math.pi * max(0.0, min(1.0, k)))
    if t < .3:
        k = ease(t / .3)
    elif t < .5:
        k = 1.0
    elif t < .78:
        k = 1 - ease((t - .5) / .28)
    else:
        k = 0.0
    punched = .38 <= t or t < 0
    # paper: right half fixed, left flap swings over the fold line x=70
    fx, y0, y1, half = 70, 22, 64, 21
    c.rect(fx, y0, fx + half, y1, fill="#fffdf6", ol=INK, w=1.8)
    if punched:
        c.ell(fx + 11, 36, 3.6, fill=INK)
    flap = math.cos(math.pi * k) * half          # >0: flap on the left (front), <0: folded over (back)
    x_end = fx - flap
    col = "#fffdf6" if flap >= 0 else "#f0e6c8"
    c.poly([(fx, y0), (x_end, y0), (x_end, y1), (fx, y1)], fill=col, ol=INK, w=1.8)
    if punched and abs(flap) > 2:
        hx = fx - math.cos(math.pi * k) * 11
        c.ell(hx, 36, 3.6 * min(1, abs(flap) / half + .3), 3.6, fill=INK)
    c.line([(fx, y0 - 3), (fx, y1 + 3)], (61, 130, 196, 230), 1.4) if k < .05 else None
    # punch sparkle
    if .36 <= t < .5:
        a = 1 - (t - .36) / .14
        c.star(fx + 11, 36, 4 + 7 * (1 - a), (255, 210, 63, int(255 * a)), points=8, inner=.35)
    # two-holes celebration
    if t >= .8:
        a = tri((t - .8) / .4)
        c.star(52, 18, 3 + 3 * a, (255, 210, 63, 230), ol=INK, rot=t)
    # the owl
    bob = 1.5 * sn(t * 2)
    ox, oy = 26, 66 + bob
    c.ell(ox, oy, 19, 22, fill="#8e6bd6", ol=INK, w=2.2)
    c.ell(ox, oy + 7, 12, 13, fill="#d9c8f7")
    c.poly([(ox - 17, oy - 14), (ox - 14, oy - 28), (ox - 6, oy - 18)], fill="#8e6bd6", ol=INK, w=2.0)
    c.poly([(ox + 17, oy - 14), (ox + 14, oy - 28), (ox + 6, oy - 18)], fill="#8e6bd6", ol=INK, w=2.0)
    for ex in (ox - 8, ox + 8):
        c.ell(ex, oy - 8, 8, fill="#ffffff", ol=INK, w=2.0)
        c.eye(ex + 2.4, oy - 8.5, 3.4)
    c.poly([(ox - 3, oy - 1), (ox + 3, oy - 1), (ox, oy + 4)], fill="#f2b632", ol=INK, w=1.4)
    # wing reaching to the paper
    c.line([(ox + 15, oy + 2), (ox + 28, oy - 10), (fx - 2, y1 - 6)], "#8e6bd6", 5.5)
    c.line([(ox - 6, oy + 22), (ox - 6, oy + 26)], "#f2b632", 2.2)
    c.line([(ox + 6, oy + 22), (ox + 6, oy + 26)], "#f2b632", 2.2)
    c.blush(ox - 13, oy - 1, 2.6)
    c.blush(ox + 13, oy - 1, 2.6)


# id: (background, draw function, still-frame t for the Home Screen icon, pixel-art size or 0)
ICONS = {
    "pong": ("#111827", d_pong, .12, 0),
    "whisker-dash": ("#1b1033", d_whisker, 0, 0),
    "rulebound": ("#2a2540", d_rulebound, .1, 0),
    "capybara-rumble": ("#2c4a2a", d_capybara, 0, 0),
    "sprout-siege": ("#a9e1ff", d_sprout, .45, 0),
    "kitty-and-lotl": ("#cdeefd", d_kitty, .1, 0),
    "poirot-pigeon": ("#1a1830", d_poirot, .1, 0),
    "banana-slug-arena": ("#2f5a22", d_slug, 0, 0),
    "endless-crucible": ("#f4f5f7", d_crucible, .3, 0),
    "sensory-overload": ("#fafafa", d_sensory, .15, 0),
    "mothwicks-lantern": ("#000000", d_moth, .1, 40),
    "prism-sprint": ("#1c0b3a", d_prism, .5, 0),
    "thistle-king": ("#1f1530", d_thistle, .1, 0),
    "rooftop-flow": ("#3a1f5a", d_rooftop, .02, 0),
    "ships-and-villagers": ("#232552", d_ships, 0, 0),
    "bank-game": ("#1f6f4a", d_bank, .3, 0),
    "snake": ("#0f172a", d_snake, .1, 0),
    "brainy-owl": ("#bfe7ff", d_brainy, .9, 0),
}


def frame(game_id: str, t: float, size: int) -> Image.Image:
    bg, fn, _, pix = ICONS[game_id]
    if pix:
        c = Canvas(pix, bg, ss=1)
        fn(c, t)
        return c.im.convert("RGB").resize((size, size), Image.NEAREST)
    c = Canvas(size, bg, ss=3 if size <= 256 else 2)
    fn(c, t)
    return c.done()


def still_icon(game_id: str, size: int) -> Image.Image:
    return frame(game_id, ICONS[game_id][2], size)


def dashboard_icon(size: int) -> Image.Image:
    """The dashboard's own Home Screen icon: four game icons in a 2x2 grid."""
    big = 1024
    im = Image.new("RGB", (big, big), "#16191f")
    tile, gap = 420, 60
    mask = Image.new("L", (tile, tile), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, tile - 1, tile - 1], radius=96, fill=255)
    for i, gid in enumerate(("whisker-dash", "capybara-rumble", "poirot-pigeon", "banana-slug-arena")):
        x = gap + (i % 2) * (tile + gap) - 6
        y = gap + (i // 2) * (tile + gap) - 6
        shot = ROOT / "dashboard" / "app-icons" / f"{gid}.png"  # recorded gameplay still, if there is one
        pic = Image.open(shot).convert("RGB").resize((tile, tile), Image.LANCZOS) if shot.exists() else still_icon(gid, tile)
        im.paste(pic, (x + 6, y + 6), mask)
    return im.resize((size, size), Image.LANCZOS)


def write_gif(game_id: str) -> Path:
    frames = [frame(game_id, i / FRAMES, GIF_SIZE) for i in range(FRAMES)]
    # one shared palette for all frames, so colours don't flicker between frames
    sheet = Image.new("RGB", (GIF_SIZE, GIF_SIZE * FRAMES))
    for i, f in enumerate(frames):
        sheet.paste(f, (0, i * GIF_SIZE))
    pal = sheet.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    pframes = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{game_id}.gif"
    pframes[0].save(out, save_all=True, append_images=pframes[1:], duration=FRAME_MS, loop=0,
                    optimize=False, disposal=1)
    return out


def contact_sheet(ids, path: Path, n=4) -> None:
    s = 120
    im = Image.new("RGB", (s * n, s * len(ids)), "#ffffff")
    for r, gid in enumerate(ids):
        for i in range(n):
            im.paste(frame(gid, i / n, s), (i * s, r * s))
    im.save(path)


if __name__ == "__main__":
    ids = [a for a in sys.argv[1:] if a in ICONS] or list(ICONS)
    for gid in ids:
        p = write_gif(gid)
        print(f"ok   {p.relative_to(ROOT)}  ({p.stat().st_size // 1024} KB)")
    if "--sheet" in sys.argv:
        contact_sheet(ids, ROOT / "icon-sheet.png")
