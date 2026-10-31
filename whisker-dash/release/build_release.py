"""Build the share-ready WhiskerDash.html from the development page.

The development page loads its two pixel fonts from Google Fonts. The release
copy embeds those fonts inside the file, so it never contacts any outside
server. Usage:  python build_release.py <dev index.html> <output WhiskerDash.html>
Fonts: Press Start 2P and VT323, both SIL Open Font License (see fonts/OFL-*.txt).
"""
import base64, pathlib, re, sys

here = pathlib.Path(__file__).parent
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
html = src.read_text(encoding="utf-8")

def face(family, file):
    data = base64.b64encode((here / "fonts" / file).read_bytes()).decode()
    return (f"@font-face{{font-family:'{family}';font-style:normal;font-weight:400;font-display:block;"
            f"src:url(data:font/woff;base64,{data}) format('woff')}}")

fonts = ("<style>/* Press Start 2P and VT323: SIL Open Font License 1.1 */"
         + face("Press Start 2P", "PressStart2P-Regular.woff")
         + face("VT323", "VT323-Regular.woff") + "</style>")
link = re.compile(r'<link[^>]*fonts\.googleapis\.com[^>]*>')
if not link.search(html):
    sys.exit("Google Fonts link not found; nothing replaced")
html = link.sub(fonts, html, count=1)
left = re.findall(r'https?://[^"\'\s)]+', html)
if left:
    sys.exit(f"outside links still in the file: {left}")
out.write_text(html, encoding="utf-8")
print(f"wrote {out} ({out.stat().st_size // 1024} KB), no outside links")
