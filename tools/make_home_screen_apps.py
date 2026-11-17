"""Make the browser games installable as iPad / phone Home Screen apps.

For every game listed in GAMES this script:
  * draws app icons into <game>/icons/ (180px for iPad/iPhone, 192px and 512px for Android/Chrome),
  * writes <game>/manifest.webmanifest (name, colours, icons, opens full screen),
  * writes <game>/sw.js, a small service worker so the game still opens with no Wi-Fi
    once it has been played online at least once,
  * adds the Home Screen tags to <game>/index.html between
    <!-- home-screen-app --> and <!-- /home-screen-app --> (replaced on every run).

Icons are the cute picture drawings from tools/game_icons.py (the same drawings the
dashboard shows as animated GIFs). It also writes dashboard/offline-files.json, the list the
dashboard's "Save for airplane" button downloads.

Re-run it safely any time. To add a new game (for example Pip the Watchman), add a
drawing to tools/game_icons.py, add a line to GAMES here and run:

    python tools/make_home_screen_apps.py

Needs Pillow (pip install pillow). Home Screen apps only work from a real https
address such as GitHub Pages, not from a file on disk.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

import game_icons

ROOT = Path(__file__).resolve().parent.parent

# folders whose picture in tools/game_icons.py has a different name
ICON_ID = {"experiments/snake-blender-mode": "snake"}

# folder, full name, short name (under the icon, keep to ~12 letters), icon letters,
# background colour, letter colour, accent colour (a stripe across the bottom).
GAMES = [
    ("dashboard", "K12 SD Games", "K12 Games", "K12", "#16191f", "#ffffff", "#3ddc97"),
    ("pong", "Pong", "Pong", "P", "#111827", "#ffffff", "#34d399"),
    ("whisker-dash", "Whisker Dash", "Whisker Dash", "WD", "#1b1033", "#7fd4ff", "#ff9f1c"),
    ("capybara-rumble", "Capybara Rumble", "Capybara Rumble", "CR", "#2c4a2a", "#ffcf4a", "#8b5a2b"),
    ("sprout-siege", "Sprout Siege", "Sprout Siege", "SS", "#3e2f1c", "#9be15d", "#e0b04a"),
    ("kitty-and-lotl", "Kitty & Lotl", "Kitty & Lotl", "K&L", "#cdeefd", "#e9418a", "#f7a531"),
    ("endless-crucible", "Endless Crucible", "Endless Crucible", "EC", "#f4f5f7", "#e2552d", "#3b82f6"),
    ("sensory-overload", "Sensory Overload", "Sensory Overload", "SO", "#fafafa", "#e5442f", "#111111"),
    ("mothwicks-lantern", "Mothwick's Lantern", "Mothwick's Lantern", "ML", "#000000", "#ffffff", "#ffd400"),
    ("prism-sprint", "Prism Sprint", "Prism Sprint", "PS", "#1c0b3a", "#ffd23f", "#ff3cac"),
    ("thistle-king", "Thistle King", "Thistle King", "TK", "#1f1530", "#d58cff", "#ffd400"),
    ("rulebound", "Rulebound", "Rulebound", "RB", "#2a2540", "#ffd34d", "#ff8fb8"),
    ("rooftop-flow", "Rooftop Flow", "Rooftop Flow", "RF", "#0e1230", "#ff8a1f", "#f5c24c"),
    ("poirot-pigeon", "Poirot the Pigeon", "Poirot the Pigeon", "PP", "#1a1830", "#f2c14e", "#8e5bd6"),
    ("banana-slug-arena", "Banana Slug Arena", "Banana Slug Arena", "BS", "#2f5a22", "#f7d63a", "#e98a6a"),
    ("ships-and-villagers", "Ships & Villagers", "Ships & Villagers", "S&V", "#232552", "#f7eedb", "#d9574f"),
    ("experiments/snake-blender-mode", "Blender Mode Snake", "Blender Mode Snake", "S", "#0f172a", "#22c55e", "#ef4444"),
]

ICON_SIZES = {"apple-touch-icon.png": 180, "icon-192.png": 192, "icon-512.png": 512}

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]

START = "<!-- home-screen-app -->"
END = "<!-- /home-screen-app -->"


def load_font(size: int) -> ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


def draw_icon(letters: str, bg: str, fg: str, accent: str, size: int) -> Image.Image:
    # Draw large and shrink, for smooth edges. Square corners: the iPad rounds them itself.
    big = 1024
    img = Image.new("RGB", (big, big), bg)
    d = ImageDraw.Draw(img)
    d.rectangle([0, int(big * 0.84), big, big], fill=accent)
    font_size = {1: 600, 2: 420, 3: 330}.get(len(letters), 300)
    font = load_font(font_size)
    box = d.textbbox((0, 0), letters, font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    x = (big - w) / 2 - box[0]
    y = (big * 0.84 - h) / 2 - box[1]
    d.text((x + 14, y + 14), letters, font=font, fill=accent)  # soft drop shadow
    d.text((x, y), letters, font=font, fill=fg)
    return img.resize((size, size), Image.LANCZOS)


SW_TEMPLATE = """// Made by tools/make_home_screen_apps.py. Lets this game open offline once it has
// been played online. Always tries the network first, so updates show up right away.
const PREFIX = "{prefix}";
const CACHE = PREFIX + "v2";
const PRECACHE = {precache};
// Google Fonts are kept in a shared cache so the games keep their fonts offline.
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const FONT_CACHE = "k12-fonts";

self.addEventListener("install", (event) => {{
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).catch(() => {{}}));
  self.skipWaiting();
}});

self.addEventListener("activate", (event) => {{
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
}});

self.addEventListener("fetch", (event) => {{
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) {{
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {{
        const copy = res.clone();
        caches.open(FONT_CACHE).then((c) => c.put(req, copy));
        return res;
      }}))
    );
    return;
  }}
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {{
        if (res.ok) {{
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }}
        return res;
      }})
      .catch(() => caches.match(req, {{ ignoreSearch: true }}).then((hit) => hit || caches.match("./index.html")))
  );
}});
"""


def head_block(name: str, short: str, bg: str) -> str:
    return (
        f"{START}\n"
        f'<link rel="manifest" href="manifest.webmanifest">\n'
        f'<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
        f'<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">\n'
        f'<meta name="apple-mobile-web-app-capable" content="yes">\n'
        f'<meta name="mobile-web-app-capable" content="yes">\n'
        f'<meta name="apple-mobile-web-app-title" content="{short}">\n'
        f'<meta name="apple-mobile-web-app-status-bar-style" content="black">\n'
        f'<meta name="theme-color" content="{bg}">\n'
        f"<script id=\"home-screen-sw\">if('serviceWorker' in navigator){{addEventListener('load',function(){{"
        f"navigator.serviceWorker.register('sw.js').catch(function(){{}});}});}}</script>\n"
        f"{END}\n"
    )


def local_files(index_html: str) -> list[str]:
    """Files in the same folder that the page loads (styles.css, game.js, ...)."""
    refs = re.findall(r'(?:src|href)="([^"#?:]+)"', index_html)
    return sorted({r for r in refs if "/" not in r and not r.endswith(".html") and r != "manifest.webmanifest"})


def build(folder: str, name: str, short: str, letters: str, bg: str, fg: str, accent: str) -> None:
    game_dir = ROOT / folder
    index = game_dir / "index.html"
    if not index.exists():
        print(f"skip {folder}: no index.html")
        return

    icons = game_dir / "icons"
    icons.mkdir(exist_ok=True)
    icon_id = ICON_ID.get(folder, folder)
    for filename, size in ICON_SIZES.items():
        if folder == "dashboard":  # four game pictures in a grid
            img = game_icons.dashboard_icon(size)
        elif (ROOT / "dashboard" / "app-icons" / f"{icon_id}.png").exists():
            # a still from the recorded first-level gameplay (tools/capture_icons.py)
            img = Image.open(ROOT / "dashboard" / "app-icons" / f"{icon_id}.png").convert("RGB").resize((size, size), Image.LANCZOS)
        elif folder == "ships-and-villagers":  # Joseph and John Taylor on a starry sky (tools/ships_and_villagers_icon.py)
            from ships_and_villagers_icon import draw_villagers_icon
            img = draw_villagers_icon(size)
        elif icon_id in game_icons.ICONS:  # drawn picture (a still frame of its dashboard GIF)
            img = game_icons.still_icon(icon_id, size)
        else:  # fallback: letters
            img = draw_icon(letters, bg, fg, accent, size)
        img.save(icons / filename, optimize=True)

    # A version tag on the icon links, so iPads and browsers fetch a changed icon
    # instead of keeping an old cached one.
    import hashlib
    ver = hashlib.md5((icons / "apple-touch-icon.png").read_bytes()).hexdigest()[:8]

    manifest = {
        "name": name,
        "short_name": short,
        "start_url": "./index.html",
        "scope": "./",
        "display": "standalone",
        "background_color": bg,
        "theme_color": bg,
        "icons": [
            {"src": f"icons/icon-192.png?v={ver}", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": f"icons/icon-512.png?v={ver}", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
        ],
    }
    (game_dir / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    html = index.read_text(encoding="utf-8")
    html = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n?", "", html, flags=re.S)
    if "</head>" not in html:
        raise SystemExit(f"{index}: no </head> to add the tags before")
    html = html.replace("</head>", head_block(name, short, bg).replace('.png"', f'.png?v={ver}"') + "</head>", 1)
    index.write_text(html, encoding="utf-8")

    precache = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon.png"]
    precache += ["./" + f for f in local_files(html)]
    prefix = "k12-" + folder.replace("/", "-") + "-"
    (game_dir / "sw.js").write_text(
        SW_TEMPLATE.format(prefix=prefix, precache=json.dumps(precache)), encoding="utf-8"
    )
    print(f"ok   {folder}")


def write_offline_list() -> None:
    """dashboard/offline-files.json: every file the dashboard needs to play all games offline."""
    import hashlib

    files, fonts = [], set()
    h = hashlib.sha1()
    dash = ROOT / "dashboard"
    for f in ["./", "index.html", "styles.css", "app.js", "manifest.webmanifest", "sw.js", "icons/apple-touch-icon.png"]:
        files.append(f)
    for gif in sorted((dash / "app-icons").glob("*.gif")):
        files.append("app-icons/" + gif.name)
        h.update(gif.read_bytes())
    for folder, *_ in GAMES:
        if folder == "dashboard":
            continue
        game_dir = ROOT / folder
        index = game_dir / "index.html"
        if not index.exists():
            continue
        html = index.read_text(encoding="utf-8")
        rel = "../" + folder + "/"
        files += [rel, rel + "index.html"]
        for r in sorted(set(re.findall(r'(?:src|href)="([^"#?:]+)(?:\?[^"]*)?"', html))):
            if (game_dir / r).is_file():
                files.append(rel + r)
                h.update((game_dir / r).read_bytes())
        files.append(rel + "sw.js")
        h.update(html.encode("utf-8"))
        fonts.update(re.findall(r'href="(https://fonts\.googleapis\.com/css2\?[^"]+)"', html))
    for f in ("index.html", "styles.css", "styles.css"):
        if (dash / f).exists():
            h.update((dash / f).read_bytes())
    data = {"version": h.hexdigest()[:12], "files": list(dict.fromkeys(files)),
            "fonts": sorted(f.replace("&amp;", "&") for f in fonts)}
    (dash / "offline-files.json").write_text(json.dumps(data, indent=1) + "\n", encoding="utf-8")
    print(f"ok   dashboard/offline-files.json ({len(data['files'])} files, {len(data['fonts'])} font sheets)")


if __name__ == "__main__":
    for game in GAMES:
        build(*game)
    write_offline_list()
