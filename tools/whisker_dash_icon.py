"""Whisker Dash Home Screen icon: the orange cat from the game, drawn face-on in the game's pixel style.

Used by make_home_screen_apps.py. Run it directly to write the three PNGs and a preview.png into the current folder."""
from PIL import Image, ImageDraw

FACE = [
    "..o..........o..",
    ".ooo........ooo.",
    ".oppo......oppo.",
    ".opppoooooopppo.",
    ".oooooddddooooo.",
    "oooooooddooooooo",
    "ooowwwoooowwwooo",
    "ooowewoooowewooo",
    "ooowewoooowewooo",
    "oooooooooooooooo",
    "dooooooppooooood",
    "ddoooeooooeooodd",
    ".oooooeeeeooooo.",
    "..oooooooooooo..",
    "....oooooooo....",
]
# the orange cat's colours from the game's SKINS table (coat, stripes, pupils, cream, nose)
PAL = {'o': '#ff9e3d', 'd': '#c4621c', 'e': '#1b1530', 'w': '#fff4e0', 'p': '#ff7fa8'}
BG = '#1b1033'  # the game's page/theme colour


def draw_cat_icon(size: int, face_frac: float = .70) -> Image.Image:
    im = Image.new('RGB', (size, size), BG)
    d = ImageDraw.Draw(im)
    W, H = len(FACE[0]), len(FACE)
    cell = int(size * face_frac / W)
    ox = (size - cell * W) // 2
    oy = (size - cell * H) // 2 + cell // 3
    t = max(2, cell // 4)
    for dy, slope in ((10, -1), (11, 0), (12, 1)):  # whiskers
        y = oy + dy * cell + cell // 2
        d.line([(ox - cell * 1.6, y + slope * cell * .7), (ox + cell * 1.5, y)], fill=PAL['w'], width=t)
        d.line([(ox + W * cell - cell * 1.5, y), (ox + W * cell + cell * 1.6, y + slope * cell * .7)], fill=PAL['w'], width=t)
    for r, row in enumerate(FACE):
        for c, ch in enumerate(row):
            if ch in PAL:
                d.rectangle([ox + c * cell, oy + r * cell, ox + (c + 1) * cell - 1, oy + (r + 1) * cell - 1], fill=PAL[ch])
    return im


if __name__ == '__main__':
    for row in FACE:  # 16 wide and mirror-symmetric
        assert len(row) == 16 and row == row[::-1], row
    sizes = {'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512}
    for name, s in sizes.items():
        draw_cat_icon(s).save(name, optimize=True)
    sheet = Image.new('RGB', (512 + 20 + 192 + 20 + 180 + 20 + 60, 512), '#ffffff')
    x = 0
    for s in (512, 192, 180, 60):
        sheet.paste(draw_cat_icon(s), (x, 0)); x += s + 20
    sheet.save('preview.png')
