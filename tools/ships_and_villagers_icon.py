"""Ships & Villagers Home Screen icon: Joseph and John Taylor as busts on a starry sky.

The art (tools/ships_and_villagers_icon.png, 1024x1024) was drawn with the game's own
character-drawing code. Used by make_home_screen_apps.py, which scales it to each size."""
from pathlib import Path

from PIL import Image

ART = Path(__file__).resolve().parent / "ships_and_villagers_icon.png"


def draw_villagers_icon(size: int) -> Image.Image:
    return Image.open(ART).convert("RGB").resize((size, size), Image.LANCZOS)
