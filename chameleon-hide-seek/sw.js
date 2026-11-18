// Made by tools/make_home_screen_apps.py. Lets this game open offline once it has
// been played online. Always tries the network first, so updates show up right away.
const PREFIX = "k12-chameleon-hide-seek-";
const CACHE = PREFIX + "v2";
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icons/apple-touch-icon.png", "./${S.stickImg}"];
// Google Fonts are kept in a shared cache so the games keep their fonts offline.
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const FONT_CACHE = "k12-fonts";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(FONT_CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req, { cache: "no-cache" }) // ask the server each time, so a new version shows right away
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("./index.html")))
  );
});
