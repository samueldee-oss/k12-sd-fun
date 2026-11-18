// Offline helper for the whole site (every game folder), registered by the dashboard.
// The dashboard's "Save for airplane" button fills the "k12-offline-files" cache; this worker
// then serves those files when there is no internet. With internet it always uses the network
// first (so updates show up), falling back to the saved copy if the network fails or is very slow.
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
const FONT_CACHE = "k12-fonts";
const SLOW_MS = 4000; // airplane Wi-Fi that never answers: use the saved copy after this long

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

function fromCache(req) {
  return caches.match(req, { ignoreSearch: true });
}

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

  event.respondWith(new Promise((resolve) => {
    let done = false;
    const finish = (res) => { if (!done && res) { done = true; resolve(res); } };
    const timer = setTimeout(() => fromCache(req).then(finish), SLOW_MS);
    fetch(req, { cache: "no-cache" }) // ask the server each time, so a new version shows right away
      .then((res) => { clearTimeout(timer); finish(res); })
      .catch(() => {
        clearTimeout(timer);
        fromCache(req).then((hit) => {
          if (hit) return finish(hit);
          if (req.mode === "navigate") return fromCache(new URL("dashboard/index.html", self.registration.scope)).then((d) => finish(d || Response.error()));
          finish(Response.error());
        });
      });
  }));
});
