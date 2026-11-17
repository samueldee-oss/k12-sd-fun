"""Record real first-level gameplay of each game and turn it into the dashboard GIF icons.

    python tools/capture_icons.py                 # every game
    python tools/capture_icons.py pong rulebound  # just some

Needs Playwright (pip install playwright, then `playwright install chromium`) and Pillow.
It serves the repo on a local port, opens each game in a headless browser, starts level 1,
plays a few seconds with scripted key presses / taps, screenshots the action, crops a square
around it and writes:

    dashboard/app-icons/<id>.gif         animated, for the dashboard grid
    dashboard/app-icons/<id>.png         one still frame, used for the Home Screen icon

Each game's RECIPE says how to start it, what to press while recording, and where to crop.
"""

from __future__ import annotations

import asyncio
import functools
import http.server
import json
import math
import os
import shutil
import sys
import threading
import time
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "dashboard" / "app-icons"
RAW = Path(os.environ.get("CAPTURE_RAW", ROOT / ".capture-raw"))
PORT = 8799
GIF_SIZE = 200
STILL_SIZE = 512  # still frame kept for the Home Screen icon
CHROME_ARGS = ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
               "--autoplay-policy=no-user-gesture-required", "--mute-audio"]


# ------------------------------------------------------------------ helpers used by recipes

async def click_text(pg, text, exact=False):
    await pg.get_by_text(text, exact=exact).first.click()


async def tap(pg, key, ms=60):
    await pg.keyboard.down(key)
    await pg.wait_for_timeout(ms)
    await pg.keyboard.up(key)


def every(n, offset=0):
    return lambda i: i % n == offset


# ------------------------------------------------------------------ recipes
# setup(pg): start level 1.   step(pg, i): what to press before frame i.
# crop: (x, y, size) square, or (x, y, w, h) which gets letterboxed into a square, in page px;
# or an async function(pg) returning one of those each frame (to follow the player).


def follow(js, size, dx=0, dy=0):
    """Square crop centred on a point the page reports, e.g. the player's screen position."""
    async def crop(pg):
        x, y = await pg.evaluate(js)
        return (x - size / 2 + dx, y - size / 2 + dy, size)
    return crop


def elem(selector):
    """Crop to an element's box (letterboxed if it isn't square)."""
    async def crop(pg):
        r = await pg.locator(selector).first.bounding_box()
        return (r["x"], r["y"], r["width"], r["height"])
    return crop


async def hold(pg, key, keys):
    for k in keys:
        if k != key:
            await pg.keyboard.up(k)
    await pg.keyboard.down(key)


async def drag(pg, a, b, i, start, steps=6):
    """Drag from point a to b over frames start..start+steps."""
    if i == start:
        await pg.mouse.move(*a)
        await pg.mouse.down()
    elif start < i <= start + steps:
        k = (i - start) / steps
        await pg.mouse.move(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, steps=3)
        if i == start + steps:
            await pg.mouse.up()


# Pong: player (left, W/S) vs the computer
async def pong_setup(pg):
    await pg.click("#startButton")


async def pong_step(pg, i):
    if i % 6 == 0:
        await hold(pg, "w" if (i // 6) % 2 else "s", ["w", "s"])


# Whisker Dash: 1 Player, World 1 level 1 (Alley Stroll), run right and hop the spikes
async def whisker_setup(pg):
    await click_text(pg, "1 Player")
    await pg.wait_for_timeout(800)
    await pg.keyboard.press("Enter")
    await pg.wait_for_timeout(3500)  # let the "new lore page" banners fade
    await pg.keyboard.down("ArrowRight")


async def whisker_step(pg, i):
    if i % 7 == 2:
        await tap(pg, "Space", 220)

WHISKER_CAT = """(()=>{const c=document.querySelector('canvas'),r=c.getBoundingClientRect(),k=r.width/VW,p=players[0]||cat;
  return [r.x+(p.x+p.w/2-cam)*k, r.y+(p.y-camY)*k]})()"""


# Rulebound: Biscuit, World 1 level 1: PUP IS YOU, walk right pushing the rock to the flag
async def rulebound_setup(pg):
    await click_text(pg, "Biscuit")
    await pg.get_by_role("button", name="1", exact=True).first.click()
    await pg.wait_for_timeout(900)


async def rulebound_step(pg, i):
    if i % 3 == 0 and i // 3 < 11:
        await tap(pg, "ArrowRight")


# Capybara Rumble: stage 1 Muddy Shallows, send capybaras out
async def capy_setup(pg):
    await pg.click("#stage-1")
    await pg.wait_for_timeout(1200)
    for k in "1121":
        await tap(pg, k)
        await pg.wait_for_timeout(1500)
    await pg.wait_for_timeout(5000)


async def capy_step(pg, i):
    if i % 8 == 0:
        await tap(pg, "1")


# Sprout Siege: level 1, plant seeds, collect dew, the first Gloobs walk in
SPROUT_PAGE = """((r,c)=>{const cv=document.getElementById('c'),b=cv.getBoundingClientRect(),k=b.width/cv.width;
  const [x,y]=cellCenter(r,c);return [b.x+x*k,b.y+y*k]})"""


async def sprout_plant(pg, key, row, col):
    await tap(pg, key)
    await pg.mouse.click(*await pg.evaluate(f"{SPROUT_PAGE}({row},{col})"))


async def sprout_dew(pg):
    pts = await pg.evaluate("""(()=>{const cv=document.getElementById('c'),b=cv.getBoundingClientRect(),k=b.width/cv.width;
      return S.drops.map(d=>[b.x+d.x*k,b.y+d.y*k])})()""")
    for x, y in pts:
        await pg.mouse.click(x, y)


async def sprout_setup(pg):
    await pg.get_by_text("14 waves").first.click()
    await pg.wait_for_timeout(800)
    await pg.get_by_text("Start!").first.click()
    await pg.wait_for_timeout(600)
    # plants further right, so plants and Gloobs fit in one square-ish picture
    plan = [("1", 1, 4), ("1", 0, 4), ("1", 2, 4), ("2", 1, 6), ("2", 0, 6), ("2", 2, 6),
            ("1", 0, 5), ("3", 1, 5), ("1", 2, 5)]
    for n in range(120):  # up to 60 s, until the first Gloob is close to the plants
        await sprout_dew(pg)
        if plan:
            key, row, col = plan[0]
            if await pg.evaluate(f"S.dew>=PL[KEYS[{int(key) - 1}]].cost&&!S.cds[KEYS[{int(key) - 1}]]"):
                await sprout_plant(pg, key, row, col)
                plan.pop(0)
        if await pg.evaluate("S.en.some(e=>e.x<GX+CW*10.3)"):
            break
        await pg.wait_for_timeout(500)


async def sprout_step(pg, i):
    if i % 4 == 0:
        await sprout_dew(pg)


# Kitty & Lotl: sail the teacup boat left and right catching treats
async def kitty_setup(pg):
    await pg.evaluate("document.getElementById('play').click()")
    await pg.wait_for_timeout(1500)


async def kitty_step(pg, i):
    if i % 12 == 0:
        await hold(pg, "ArrowLeft" if (i // 12) % 2 else "ArrowRight", ["ArrowLeft", "ArrowRight"])


# Banana Slug Arena: Banana Slug, Well Rounded, first weapon, wave 1, walk in a loop
async def slug_setup(pg):
    await click_text(pg, "Banana Slug", exact=True)
    await pg.locator(".chcard[data-act=char]").first.click()
    await pg.wait_for_timeout(400)
    await pg.locator("[data-act=start]").first.click()
    await pg.wait_for_timeout(500)
    go = pg.locator("[data-act=go]")
    if await go.count():
        await go.first.click()
    await pg.wait_for_timeout(4000)


async def slug_step(pg, i):
    keys = ["d", "s", "a", "w"]
    if i % 6 == 0:
        await hold(pg, keys[(i // 6) % 4], keys)


# Endless Crucible: drag Water onto Fire, then Earth onto Wind
async def crucible_step(pg, i):
    await drag(pg, (180, 252), (294, 396), i, 2)
    await drag(pg, (330, 252), (450, 396), i, 16)


async def nothing(pg, i=0):
    pass


# Sensory Overload: tap the big button
async def sensory_step(pg, i):
    if i % 2 == 0:
        await pg.click("#btn")


# Mothwick's Lantern: the mercy route. Off camera: Cup the flame twice and Hum once, dodging in between,
# until MOTHWICK no longer wants to fight. On camera: MERCY -> Spare -> "You spared MOTHWICK."
MOTH_PATCH = ("let G;", "let G; window.__G = () => G;")


async def moth_until_menu(pg, limit=120):
    arrows = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]
    for n in range(limit):
        st = await pg.evaluate("__G().state")
        if st == "menu":
            for k in arrows:
                await pg.keyboard.up(k)
            return
        await pg.evaluate("(g=>g.hp=Math.max(g.hp,g.maxHp-2))(__G())")  # never lose the run while setting up
        if st in ("text", "say", "sub", "bubble"):
            await tap(pg, "z")
        else:
            await hold(pg, arrows[(n // 3) % 4], arrows)
        await pg.wait_for_timeout(250)


async def moth_menu(pg, btn, sub):
    while await pg.evaluate("__G().btn") != btn:
        await tap(pg, "ArrowRight")
        await pg.wait_for_timeout(120)
    await tap(pg, "z")
    await pg.wait_for_timeout(250)
    while await pg.evaluate("__G().sub") != sub:
        await tap(pg, "ArrowDown")
        await pg.wait_for_timeout(120)
    await tap(pg, "z")
    await pg.wait_for_timeout(300)


async def moth_setup(pg):
    await tap(pg, "z")  # past the intro line
    await pg.wait_for_timeout(500)
    await moth_until_menu(pg)
    for sub in (1, 1, 2):  # Cup the flame, Cup the flame, Hum softly
        await moth_menu(pg, 1, sub)
        await moth_until_menu(pg)
    await pg.wait_for_timeout(1200)  # let "no longer wants to fight" settle


async def moth_step(pg, i):
    if i < 3:
        return
    if i == 3:
        while await pg.evaluate("__G().btn") != 3:  # over to MERCY
            await tap(pg, "ArrowRight")
            await pg.wait_for_timeout(150)
    elif i in (8, 13) or (i > 16 and i % 6 == 0):
        if await pg.evaluate("__G().state") not in ("end", "explore"):
            await tap(pg, "z")  # MERCY, then Spare, then read the lines (stop at YOU WON)


# Prism Sprint: Neon Steps, jump the spikes
async def prism_setup(pg):
    await pg.click("#lvl0")
    await pg.wait_for_timeout(300)


async def prism_step(pg, i):
    if i == 0:
        await pg.keyboard.down("Space")  # holding jump hops again on every landing


# Thistle King: fly Buzz around dodging seeds
async def thistle_setup(pg):
    await pg.click("#go")
    await pg.wait_for_timeout(1500)


async def thistle_step(pg, i):
    keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"]
    if i % 5 == 0:
        await hold(pg, keys[(i // 5) % 4], keys)


# Rooftop Flow: run and jump the gaps
async def rooftop_setup(pg):
    await pg.click("#startBtn")
    await pg.wait_for_timeout(400)


async def rooftop_step(pg, i):
    if i % 5 == 2:
        await tap(pg, "Space", 120)


# Ships & Villagers: Joseph walks to the bakery
async def ships_setup(pg):
    await pg.keyboard.press("Enter")
    await pg.wait_for_timeout(1500)


async def ships_step(pg, i):
    keys = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"]
    if i % 9 == 0:
        await hold(pg, keys[(i // 9) % 4], keys)


# Snake: head for the apple (the page is patched so the recorder can see where things are)
SNAKE_PATCH = ("let pendingGrowth = 0;", "let pendingGrowth = 0; window.__snake = () => ({snake, apples, dir});")


async def snake_setup(pg):
    await pg.click("#start-btn")
    await pg.wait_for_timeout(100)


async def snake_step(pg, i):
    s = await pg.evaluate("window.__snake && window.__snake()")
    if not s or not s["snake"] or not s["apples"]:
        return
    h, a, d = s["snake"][0], s["apples"][0], s["dir"]
    a = min(s["apples"], key=lambda q: abs(q["x"] - h["x"]) + abs(q["y"] - h["y"]))
    body = {(q["x"], q["y"]) for q in s["snake"][1:]}
    options = [("ArrowRight", 1, 0), ("ArrowLeft", -1, 0), ("ArrowDown", 0, 1), ("ArrowUp", 0, -1)]
    best = None
    for key, dx, dy in options:
        if (dx, dy) == (-d["x"], -d["y"]) or (h["x"] + dx, h["y"] + dy) in body:
            continue
        dist = abs(a["x"] - h["x"] - dx) + abs(a["y"] - h["y"] - dy)
        if best is None or dist < best[0]:
            best = (dist, key)
    if best:
        await tap(pg, best[1], 20)


# Poirot the Pigeon: the real first room (Featherstone Manor, Grand Hall), with John's pigeon
# from Banana Slug Arena (drawn by that game's own drawHero code) standing in for the 3D detective.
async def poirot_setup(pg):
    await pg.get_by_role("button", name="🏰 Manor").click()
    await pg.get_by_text("Start a New Case").click()
    await pg.wait_for_timeout(2500)
    for _ in range(12):  # read through Poirot's opening lines
        if not await pg.get_by_text("tap or press E").first.is_visible():
            break
        await pg.keyboard.press("Enter")
        await pg.wait_for_timeout(500)


async def bsa_pigeon_frames(browser, n=12, size=360):
    """Frames of the Banana Slug Arena pigeon hero walking in place, as transparent images."""
    import base64
    import io
    pg = await browser.new_page()
    await pg.goto(f"http://127.0.0.1:{PORT}/banana-slug-arena/index.html")
    await pg.wait_for_timeout(1200)
    urls = await pg.evaluate(f"""(()=>{{const out=[];for(let i=0;i<{n};i++){{const c=document.createElement('canvas');
      c.width=c.height={size};const x=c.getContext('2d');
      drawHero(x,{size}/2,{size}*0.55,{size}*0.24,{{ch:CHARS[0],food:'pigeon',t:i*0.1,bob:i/{n}*Math.PI*2,moving:true,face:1}});
      out.push(c.toDataURL());}}return out}})()""")
    await pg.close()
    return [Image.open(io.BytesIO(base64.b64decode(u.split(",")[1]))).convert("RGBA") for u in urls]


async def poirot_step(pg, i):
    import math
    a = i / 32 * math.tau
    await pg.mouse.move(470 + 90 * math.cos(a), 360 + 45 * math.sin(a), steps=2)


def poirot_post(frames, extra, start=0):
    """John's pigeon detective peeks in at the bottom-right corner, bobbing."""
    out = []
    sprites = extra["sprites"]
    for i, f in enumerate(frames, start):
        f = f.convert("RGBA")
        k = f.width / 200
        sp = sprites[i % len(sprites)].resize((int(122 * k), int(122 * k)), Image.LANCZOS)
        f.alpha_composite(sp, (int((200 - 96) * k), int((200 - 106) * k)))
        out.append(f.convert("RGB"))
    return out


RECIPES = {
    "poirot-pigeon": dict(path="poirot-pigeon/index.html", setup=poirot_setup, step=poirot_step,
                          crop=(230, 150, 460), frames=32, gap_ms=60, extra=bsa_pigeon_frames, post=poirot_post),
    "pong": dict(path="pong/index.html", setup=pong_setup, step=pong_step, crop=elem("#game"), view=(400, 900)),
    # Whisker Dash and Endless Crucible keep their drawn GIFs from tools/game_icons.py (owner's choice)
    "_whisker-dash": dict(path="whisker-dash/index.html", setup=whisker_setup, step=whisker_step,
                         crop=follow(WHISKER_CAT, 250, dx=40, dy=-30)),
    "rulebound": dict(path="rulebound/index.html", setup=rulebound_setup, step=rulebound_step,
                      crop=(105, 105, 690, 420), frames=36),
    "capybara-rumble": dict(path="capybara-rumble/index.html", setup=capy_setup, step=capy_step,
                            crop=(470, 320, 200), frames=34),
    "sprout-siege": dict(path="sprout-siege/index.html", setup=sprout_setup, step=sprout_step,
                         crop=(350, 225, 590, 290), frames=40, gap_ms=90),
    "kitty-and-lotl": dict(path="kitty-and-lotl/index.html", setup=kitty_setup, step=kitty_step,
                           crop=(220, 150, 500)),
    "banana-slug-arena": dict(path="banana-slug-arena/index.html", setup=slug_setup, step=slug_step,
                              crop=(300, 140, 360)),
    "_endless-crucible": dict(path="endless-crucible/index.html", setup=nothing, step=crucible_step,
                             crop=(140, 175, 340), frames=32),
    "sensory-overload": dict(path="sensory-overload/index.html", setup=nothing, step=sensory_step,
                             crop=(120, 190, 360)),
    "mothwicks-lantern": dict(path="mothwicks-lantern/index.html", setup=moth_setup, step=moth_step,
                              crop=(160, 58, 640, 480), frames=56, gap_ms=60, still=12, trim=(0, 46), load_ms=1500, patch=MOTH_PATCH),
    "prism-sprint": dict(path="prism-sprint/index.html", setup=prism_setup, step=prism_step,
                         crop=(120, 160, 420)),
    "thistle-king": dict(path="thistle-king/index.html", setup=thistle_setup, step=thistle_step,
                         crop=(254, 110, 452)),
    "rooftop-flow": dict(path="rooftop-flow/index.html", setup=rooftop_setup, step=rooftop_step,
                         crop=(20, 200, 440), still=1),
    "ships-and-villagers": dict(path="ships-and-villagers/index.html", setup=ships_setup, step=ships_step,
                                crop=(270, 120, 420)),
    "snake": dict(path="experiments/snake-blender-mode/index.html", setup=snake_setup, step=snake_step,
                  crop=(40, 130, 420), frames=40, patch=SNAKE_PATCH, still=39),
}



# ---------- games added 2026-11-16 (from John's claude.ai artifacts)

async def js_click(pg, text=None, selector=None):
    """Click without waiting for the element to hold still (start buttons often bounce)."""
    if selector:
        return await pg.evaluate("s=>{const e=document.querySelector(s);if(e){e.click();return true}return false}", selector)
    return await pg.evaluate("""t=>{const els=[...document.querySelectorAll('button,a,[role=button],div,span')]
      .filter(e=>e.offsetParent&&e.textContent.trim().startsWith(t));
      const e=els.sort((a,b)=>a.textContent.length-b.textContent.length)[0];if(e){e.click();return true}return false}""", text)


async def click_first(pg, *selectors):
    for sel in selectors:
        loc = pg.locator(sel)
        if await loc.count() and await loc.first.is_visible():
            await loc.first.click()
            return True
    return False


async def tiny_setup(pg):
    await pg.click("#bNew")
    await pg.wait_for_timeout(800)
    for _ in range(4):  # accept the default tribe / map choices
        if not await click_first(pg, "button:has-text('Start')", "button:has-text('Play')", "button:has-text('Begin')"):
            break
        await pg.wait_for_timeout(600)


async def tiny_step(pg, i):
    if i % 6 == 0:
        await pg.mouse.click(480 + 60 * ((i // 6) % 3 - 1), 320 + 40 * ((i // 12) % 2))


async def bounce_setup(pg):
    await js_click(pg, "Pit")  # Enter the Pit -> Wanderer -> Mossy Pit
    await pg.wait_for_timeout(800)
    await js_click(pg, "Mossy Pit")
    await pg.wait_for_timeout(1500)


async def bounce_step(pg, i):
    if i % 3 == 0:
        await pg.mouse.click(480 + 80 * math.sin(i / 5), 300)


async def blade_setup(pg):
    await js_click(pg, selector="#btnPlay")
    await pg.wait_for_timeout(800)
    await js_click(pg, "1. Heart")
    await pg.wait_for_timeout(2000)


async def blade_step(pg, i):
    a = i / 28 * math.tau
    await pg.mouse.move(480 + 160 * math.cos(a), 330 + 90 * math.sin(a), steps=3)


async def mochi_setup(pg):
    await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='1').click()")
    await pg.wait_for_timeout(1000)
    await click_first(pg, "button:has-text('Start')", "button:has-text('Go')", "button:has-text('Read')")
    await pg.wait_for_timeout(800)


async def mochi_step(pg, i):
    if i % 4 == 1:  # read the warm-up words, then into the story
        if not await js_click(pg, "Got it"):
            await click_first(pg, "button:has-text('Next')", "button:has-text('Start')", "button:has-text('Go')")


async def tap_to_play(pg):
    await js_click(pg, "Tap to play")
    await pg.wait_for_timeout(700)


async def slice_step(pg, i):
    if i % 4 == 0:
        await tap(pg, "Space", 60)


async def blip_setup(pg):
    await pg.click("#bEasy")
    await pg.wait_for_timeout(1500)
    await pg.keyboard.down("w")


async def climb_step(pg, i):
    if i % 6 == 3:
        await tap(pg, "Space", 200)


async def dropper_setup(pg):
    await pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.trim().startsWith('1')).click()")
    await pg.wait_for_timeout(1500)


async def dropper_step(pg, i):
    keys = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]
    if i % 5 == 0:
        await hold(pg, keys[(i // 5) % 4], keys)


async def ionut_setup(pg):
    await js_click(pg, "1Muntele")
    await pg.wait_for_timeout(2500)
    await pg.keyboard.down("w")


async def spark_step(pg, i):
    await pg.mouse.click(480 + 200 * math.sin(i * 1.7), 320 + 140 * math.cos(i * 1.1))


async def nova_setup(pg):
    await js_click(pg, selector="#playBtn")
    await pg.wait_for_timeout(1500)


async def nova_step(pg, i):
    if i % 8 == 0:
        await hold(pg, "a" if (i // 8) % 2 else "d", ["a", "d"])


async def underglow_step(pg, i):
    if i % 2 == 0:
        await pg.mouse.click(480 + 120 * math.cos(i / 4), 300 + 80 * math.sin(i / 3))


async def pal_step(pg, i):
    if i == 0:
        await pg.mouse.move(380, 400)
        await pg.mouse.down()
    elif i < 24:
        await pg.mouse.move(380 + i * 9, 400, steps=2)
    elif i == 24:
        await pg.mouse.up()


async def wander_setup(pg):
    await js_click(pg, "✨ New Game")
    await pg.wait_for_timeout(1500)
    await pg.keyboard.press("Enter")  # OK on the save name
    for _ in range(6):  # through the story pages to level 1-1
        await pg.wait_for_timeout(450)
        await pg.keyboard.press("Enter")
        await pg.wait_for_timeout(450)
        await pg.keyboard.press("Space")
    await pg.wait_for_timeout(1200)
    await pg.keyboard.down("ArrowRight")


async def wander_step(pg, i):
    if i % 7 == 3:
        await tap(pg, "Space", 220)


async def chameleon_setup(pg):
    await js_click(pg, selector="#startBtn")
    await pg.wait_for_timeout(1500)
    await pg.mouse.click(210, 456)  # Sunny Field, the first place on the map
    await pg.wait_for_timeout(3500)
    await js_click(pg, "🦉 Hide from Owly")
    await pg.wait_for_timeout(2500)


async def chameleon_step(pg, i):
    keys = ["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"]
    if i % 7 == 0:
        await hold(pg, keys[(i // 7) % 4], keys)


RECIPES_NEW = {
    "tiny-realms": dict(path="tiny-realms/index.html", setup=tiny_setup, step=tiny_step, crop=(290, 40, 380)),
    "bounce-pit": dict(path="bounce-pit/index.html", setup=bounce_setup, step=bounce_step, crop=(300, 0, 360)),
    "blade-mosaic": dict(path="blade-mosaic/index.html", setup=blade_setup, step=blade_step, crop=(220, 60, 480)),
    "mochi-star-quest": dict(path="mochi-star-quest/index.html", setup=mochi_setup, step=mochi_step, crop=(200, 0, 560), frames=40),
    "slice-flip-3d": dict(path="slice-flip-3d/index.html", setup=tap_to_play, step=slice_step, crop=(160, 0, 640)),
    "blips-climb": dict(path="blips-climb/index.html", setup=blip_setup, step=climb_step, crop=(160, 0, 640)),
    "dropper-3d": dict(path="dropper-3d/index.html", setup=dropper_setup, step=dropper_step, crop=(160, 0, 640)),
    "ionuts-climb": dict(path="ionuts-climb/index.html", setup=ionut_setup, step=climb_step, crop=(160, 0, 640)),
    "spark-burst": dict(path="spark-burst/index.html", setup=tap_to_play, step=spark_step, crop=(160, 0, 640)),
    "supernova-run": dict(path="supernova-run/index.html", setup=nova_setup, step=nova_step, crop=(160, 0, 640)),
    "underglow": dict(path="underglow/index.html", setup=nothing, step=underglow_step, crop=(300, 90, 360)),
    "pal-island": dict(path="pal-island/index.html", setup=nothing, step=pal_step, crop=(240, 80, 480)),
    "hypernova-3d": dict(path="hypernova-3d/index.html", setup=nova_setup, step=nova_step, crop=(160, 0, 640), trim=(0, 16), still=8),
    "wanderleaf": dict(path="wanderleaf/index.html", setup=wander_setup, step=wander_step, crop=(40, 140, 460)),
    "chameleon-hide-seek": dict(path="chameleon-hide-seek/index.html", setup=chameleon_setup, step=chameleon_step, crop=(170, 40, 600)),
}
RECIPES.update(RECIPES_NEW)


# ------------------------------------------------------------------ recording

def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


async def record(browser, gid, r):
    view = r.get("view", (960, 640))
    ctx = await browser.new_context(viewport={"width": view[0], "height": view[1]},
                                    device_scale_factor=r.get("dpr", 2), has_touch=r.get("touch", False))
    pg = await ctx.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    if r.get("patch"):
        find, repl = r["patch"]

        async def patch(route):
            resp = await route.fetch()
            await route.fulfill(response=resp, body=(await resp.text()).replace(find, repl, 1))
        await pg.route(f"**/{r['path']}", patch)
    await pg.goto(f"http://127.0.0.1:{PORT}/{r['path']}", wait_until="domcontentloaded")
    await pg.wait_for_timeout(r.get("load_ms", 1200))
    await r["setup"](pg)
    await pg.wait_for_timeout(r.get("warmup_ms", 300))
    d = RAW / gid
    shutil.rmtree(d, ignore_errors=True)
    d.mkdir(parents=True)
    times = []
    t0 = time.monotonic()
    for i in range(r.get("frames", 28)):
        await r["step"](pg, i)
        crop = r.get("crop")
        if callable(crop):
            crop = await crop(pg)
        await pg.screenshot(path=str(d / f"{i:03d}.png"))
        times.append(time.monotonic() - t0)
        if crop:
            (d / f"{i:03d}.crop").write_text(json.dumps(crop))
        await pg.wait_for_timeout(r.get("gap_ms", 40))
    (d / "times.json").write_text(json.dumps(times))
    await ctx.close()
    return errors


def square(im, box):
    """Crop box (x, y, s) or (x, y, w, h); a non-square box is letterboxed with its edge colour."""
    if len(box) == 3:
        x, y, s = box
        x = max(0, min(im.width - s, x)); y = max(0, min(im.height - s, y))
        return im.crop((int(x), int(y), int(x + s), int(y + s)))
    x, y, w, h = box
    part = im.crop((int(x), int(y), int(x + w), int(y + h)))
    side = max(w, h)
    sq = Image.new("RGB", (int(side), int(side)), part.getpixel((2, 2)))
    sq.paste(part, (int((side - w) / 2), int((side - h) / 2)))
    return sq


def build_gif(gid, r):
    d = RAW / gid
    times = json.loads((d / "times.json").read_text())
    frames = []
    for i in range(len(times)):
        im = Image.open(d / f"{i:03d}.png").convert("RGB")
        cf = d / f"{i:03d}.crop"
        k = r.get("dpr", 2)
        box = json.loads(cf.read_text()) if cf.exists() else r.get("crop")
        box = [v * k for v in box] if box else [0, 0, im.width, im.height]
        frames.append(square(im, box))
    first, last = r.get("trim", (0, len(frames)))
    frames, times = frames[first:last], times[first:last]
    si = min(len(frames) - 1, r.get("still", len(frames) // 2))
    still = frames[si].resize((STILL_SIZE, STILL_SIZE), Image.LANCZOS)
    frames = [f.resize((GIF_SIZE, GIF_SIZE), Image.LANCZOS) for f in frames]
    if r.get("post"):
        frames = r["post"](frames, r.get("_extra", {}))
        still = r["post"]([still], r.get("_extra", {}), start=si)[0]
    durs = [max(40, int(1000 * (b - a))) for a, b in zip(times, times[1:])] + [int(1000 * (times[-1] - times[-2]))]
    sheet = Image.new("RGB", (GIF_SIZE, GIF_SIZE * len(frames)))
    for i, f in enumerate(frames):
        sheet.paste(f, (0, i * GIF_SIZE))
    pal = sheet.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    pf = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    OUT.mkdir(parents=True, exist_ok=True)
    pf[0].save(OUT / f"{gid}.gif", save_all=True, append_images=pf[1:], duration=durs, loop=0, disposal=1)
    still.save(OUT / f"{gid}.png")
    return OUT / f"{gid}.gif"


async def main(ids):
    from playwright.async_api import async_playwright
    srv = serve()
    async with async_playwright() as p:
        exe = os.environ.get("CHROME")
        browser = await p.chromium.launch(executable_path=exe, args=CHROME_ARGS) if exe else \
            await p.chromium.launch(args=CHROME_ARGS)
        for gid in ids:
            r = RECIPES[gid]
            try:
                if r.get("extra"):
                    r["_extra"] = {"sprites": await r["extra"](browser)}
                errs = await record(browser, gid, r)
                out = build_gif(gid, r)
                print(f"ok   {gid}  ({out.stat().st_size // 1024} KB){'  page errors: ' + errs[0][:80] if errs else ''}")
            except Exception as e:  # keep going with the other games
                print(f"FAIL {gid}: {str(e).splitlines()[0][:160]}")
        await browser.close()
    srv.shutdown()


if __name__ == "__main__":
    only = [a for a in sys.argv[1:] if a in RECIPES]
    ALL = [g for g in RECIPES if not g.startswith("_")]
    if "--build-only" in sys.argv:
        for gid in only or ALL:
            print(build_gif(gid, RECIPES[gid]))
    else:
        asyncio.run(main(only or ALL))
