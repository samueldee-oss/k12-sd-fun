"""Static file server for the dashboard that also makes the Pygbag builds playable.

Pygbag games ask the server that hosts the page for their runtime files at /cdn/... (for example
/cdn/cp312/pygame_ce-...whl). Pygbag's own test server forwards those requests to the Pygbag CDN; a plain
`python -m http.server` answers 404 and the game never finishes loading. This server redirects /cdn/...
to the CDN, which allows cross-site loading, and serves everything else from the repo folder.
"""

import argparse
import http.server
from pathlib import Path

CDN_ROOT = "https://pygame-web.github.io"


class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/cdn/"):
            self.send_response(302)
            self.send_header("Location", CDN_ROOT + self.path)
            self.end_headers()
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--bind", default="", help="address to listen on; empty means every network interface")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent

    def handler(*handler_args, **handler_kwargs):
        return DashboardHandler(*handler_args, directory=str(root), **handler_kwargs)

    with http.server.ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f"Serving dashboard at http://localhost:{args.port}/dashboard/")
        server.serve_forever()


if __name__ == "__main__":
    main()
