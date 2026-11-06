"""Make the browser games installable as iPad / phone Home Screen apps.

For every game listed in GAMES this script:
  * draws app icons into <game>/icons/ (180px for iPad/iPhone, 192px and 512px for Android/Chrome),
  * writes <game>/manifest.webmanifest (name, colours, icons, opens full screen),
  * writes <game>/sw.js, a small service worker so the game still opens with no Wi-Fi
    once it has been played online at least once,
  * adds the Home Screen tags to <game>/index.html between
    <!-- home-screen-app --> and <!-- /home-screen-app --> (replaced on every run).

Re-run it safely any time. To add a new game (for example Sky Days or the
Pip the Watchman song), add a line to GAMES and run:

    python tools/make_home_screen_apps.py

Needs Pillow (pip install pillow). Home Screen apps only work from a real https
address such as GitHub Pages, not from a file on disk.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent

# folder, full name, short name (under the icon, keep to ~12 letters), icon letters,
# background colour, letter colour, accent colour (a stripe across the bottom).
GAMES = [
    ("dashboard", "K12 SD Games", "K12 Games", "K12", "#16191f", "#ffffff", "#3ddc97"),
    ("pong", "Pong", "Pong", "P", "#111827", "#ffffff", "#34d399"),
    ("whisker-dash", "Whisker Dash", "Whisker Dash", "WD", "#1b1033", "#7fd4ff", "#ff9f1c"),
    ("capybara-rumble", "Capybara Rumble", "Capybara", "CR", "#2c4a2a", "#ffcf4a", "#8b5a2b"),
    ("sprout-siege", "Sprout Siege", "Sprout Siege", "SS", "#3e2f1c", "#9be15d", "#e0b04a"),
    ("kitty-and-lotl", "Kitty & Lotl", "Kitty & Lotl", "K&L", "#cdeefd", "#e9418a", "#f7a531"),
    ("endless-crucible", "Endless Crucible", "Crucible", "EC", "#f4f5f7", "#e2552d", "#3b82f6"),
    ("sensory-overload", "Sensory Overload", "Sensory", "SO", "#fafafa", "#e5442f", "#111111"),
    ("mothwicks-lantern", "Mothwick's Lantern", "Mothwick", "ML", "#000000", "#ffffff", "#ffd400"),
    ("prism-sprint", "Prism Sprint", "Prism Sprint", "PS", "#1c0b3a", "#ffd23f", "#ff3cac"),
    ("thistle-king", "Thistle King", "Thistle King", "TK", "#1f1530", "#d58cff", "#ffd400"),
    ("rooftop-flow", "Rooftop Flow", "Rooftop Flow", "RF", "#0e1230", "#ff8a1f", "#f5c24c"),
    ("experiments/snake-blender-mode", "Snake", "Snake", "S", "#0f172a", "#22c55e", "#ef4444"),
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
const CACHE = PREFIX + "v1";
const PRECACHE = {precache};

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
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
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
    for filename, size in ICON_SIZES.items():
        draw_icon(letters, bg, fg, accent, size).save(icons / filename, optimize=True)

    manifest = {
        "name": name,
        "short_name": short,
        "start_url": "./index.html",
        "scope": "./",
        "display": "standalone",
        "background_color": bg,
        "theme_color": bg,
        "icons": [
            {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
        ],
    }
    (game_dir / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    html = index.read_text(encoding="utf-8")
    html = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n?", "", html, flags=re.S)
    if "</head>" not in html:
        raise SystemExit(f"{index}: no </head> to add the tags before")
    html = html.replace("</head>", head_block(name, short, bg) + "</head>", 1)
    index.write_text(html, encoding="utf-8")

    precache = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon.png"]
    precache += ["./" + f for f in local_files(html)]
    prefix = "k12-" + folder.replace("/", "-") + "-"
    (game_dir / "sw.js").write_text(
        SW_TEMPLATE.format(prefix=prefix, precache=json.dumps(precache)), encoding="utf-8"
    )
    print(f"ok   {folder}")


if __name__ == "__main__":
    for game in GAMES:
        build(*game)
