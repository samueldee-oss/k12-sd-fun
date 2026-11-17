// K12 Games dashboard: icon grid, game player, notes, and "Save for airplane" (offline).
// Icons are animated GIFs made by tools/game_icons.py. To add a game, add a line here.

const GAMES = [
  { id: "whisker-dash", name: "Whisker Dash", desc: "Pixel cat platformer, 1–2 players.", src: "../whisker-dash/index.html" },
  { id: "rulebound", name: "Rulebound", desc: "Word-rule puzzles: push words to change the rules (90 levels + sandbox).", src: "../rulebound/index.html" },
  { id: "poirot-pigeon", name: "Poirot the Pigeon", desc: "Poirot the Pigeon: 3D whodunit, search rooms with a magnifying glass, 1–2 players.", src: "../poirot-pigeon/index.html" },
  { id: "banana-slug-arena", name: "Banana Slug Arena", desc: "Banana Slug Arena: survive 20 waves of derpy bugs and swamp critters.", src: "../banana-slug-arena/index.html" },
  { id: "ships-and-villagers", name: "Ships & Villagers", desc: "Ships & Villagers, World 1: storybook castle village with 5 village jobs.", src: "../ships-and-villagers/index.html" },
  { id: "capybara-rumble", name: "Capybara Rumble", desc: "Capybara Rumble: lane-battle strategy on the riverbank.", src: "../capybara-rumble/index.html" },
  { id: "sprout-siege", name: "Sprout Siege", desc: "Lane-defense strategy: plant seeds, stop the Gloobs.", src: "../sprout-siege/index.html" },
  { id: "kitty-and-lotl", name: "Kitty & Lotl", desc: "Cat and axolotl catch treats in a teacup boat.", src: "../kitty-and-lotl/index.html" },
  { id: "endless-crucible", name: "Endless Crucible", desc: "Endless Crucible: combine elements to discover new things. Offline it uses the recipe book only.", src: "../endless-crucible/index.html" },
  { id: "sensory-overload", name: "Sensory Overload", desc: "Sensory Overload: a clicker about stimulation and touching grass.", src: "../sensory-overload/index.html" },
  { id: "mothwicks-lantern", name: "Mothwick's Lantern", desc: "Mothwick's Lantern: pixel boss fight with a kind ending.", src: "../mothwicks-lantern/index.html" },
  { id: "prism-sprint", name: "Prism Sprint", desc: "Neon rhythm runner, 6 levels.", src: "../prism-sprint/index.html" },
  { id: "thistle-king", name: "Thistle King", desc: "Bee vs. boss garden dodger.", src: "../thistle-king/index.html" },
  { id: "rooftop-flow", name: "Rooftop Flow", desc: "Endless rooftop runner with tricks.", src: "../rooftop-flow/index.html" },
  { id: "tiny-realms", name: "Tiny Realms", desc: "Tribe strategy: grow your little realm, 15 tribes, pass-and-play.", src: "../tiny-realms/index.html" },
  { id: "bounce-pit", name: "Bounce Pit: Skyward", desc: "Ball-bouncing roguelite: build up New Ballbytown.", src: "../bounce-pit/index.html" },
  { id: "blade-mosaic", name: "Blade Mosaic", desc: "Be a spinning blade: grind giant 3D block mosaics, or relax in the Zen Tower.", src: "../blade-mosaic/index.html" },
  { id: "mochi-star-quest", name: "Mochi's Star Quest", desc: "Story reading game: read with Mochi to build reading speed.", src: "../mochi-star-quest/index.html" },
  { id: "slice-flip-3d", name: "Slice Flip 3D", desc: "Flip your knife through piles of food and land blade-first.", src: "../slice-flip-3d/index.html" },
  { id: "blips-climb", name: "Only Up: Blip's Climb Home", desc: "Climb a sky tower in 3D to get Blip the alien back to his UFO.", src: "../blips-climb/index.html" },
  { id: "dropper-3d", name: "Dropper 3D", desc: "Steer your ball down the shaft, dodge everything, splash into the water.", src: "../dropper-3d/index.html" },
  { id: "ionuts-climb", name: "Ionuț's Climb: Through Romania", desc: "3D parkour across famous Romanian places in costum național.", src: "../ionuts-climb/index.html" },
  { id: "spark-burst", name: "Spark Burst", desc: "Pop glowing orbs into chain reactions and supernovas.", src: "../spark-burst/index.html" },
  { id: "supernova-run", name: "Supernova Run", desc: "Spin the track, dodge everything, go as fast as you can.", src: "../supernova-run/index.html" },
  { id: "underglow", name: "Underglow: A Fungal Network Game", desc: "Grow glowing fungus threads through the dark soil.", src: "../underglow/index.html" },
  { id: "pal-island", name: "Pal Island 3D", desc: "Island life sim: make pals and watch them live together.", src: "../pal-island/index.html" },
  { id: "hypernova-3d", name: "Hypernova 3D", desc: "Fly through a 3D tunnel, clear 7 trials, unlock ships.", src: "../hypernova-3d/index.html" },
  { id: "wanderleaf", name: "Wanderleaf", desc: "Hand-drawn platformer adventure as a silkie chicken.", src: "../wanderleaf/index.html" },
  { id: "chameleon-hide-seek", name: "Chameleon Hide & Seek", desc: "Copy colors from the world onto your chameleon and hide.", src: "../chameleon-hide-seek/index.html" },
  { id: "pong", name: "Pong", desc: "Classic Pong with touch controls, 1–2 players.", src: "../pong/index.html" },
  { id: "snake", name: "Blender Mode Snake", desc: "Snake (side project). Swipe to steer.", src: "../experiments/snake-blender-mode/index.html" },
  {
    id: "bank-game", name: "Bank Game", desc: "Stocks, flows and interest: save, buy, and watch money grow. Needs the PC server and internet.",
    needsNet: true,
    versions: [
      { id: "bank-game-current", name: "Current", src: "web_builds/bank-game-current/index.html" },
      { id: "bank-game-copy-5", name: "Copy 5", src: "web_builds/bank-game-copy-5/index.html" },
      { id: "bank-game-copy-4", name: "Copy 4", src: "web_builds/bank-game-copy-4/index.html" },
      { id: "bank-game-copy-3", name: "Copy 3", src: "web_builds/bank-game-copy-3/index.html" },
      { id: "bank-game-copy-2", name: "Copy 2", src: "web_builds/bank-game-copy-2/index.html" },
      { id: "bank-game-copy", name: "Copy 1", src: "web_builds/bank-game-copy/index.html" },
    ],
  },
];

const PAGES_BASE = "https://samueldee-oss.github.io/k12-sd-fun/";
const $ = (s) => document.querySelector(s);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

const grid = $("#grid"), frame = $("#gameFrame"), player = $("#player");
const wide = matchMedia("(min-width: 900px)");
let current = null, currentVersion = null;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2200);
}

// ---------- grid
GAMES.forEach((g) => {
  const b = document.createElement("button");
  b.className = "app";
  b.type = "button";
  b.dataset.id = g.id;
  b.setAttribute("role", "listitem");
  b.innerHTML = `<span class="app-icon"><img src="app-icons/${g.id}.gif" alt="" loading="lazy"></span><span class="app-name"></span>`;
  b.querySelector(".app-name").textContent = g.name;
  b.addEventListener("click", () => open(g));
  grid.appendChild(b);
});

$("#search").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  grid.querySelectorAll(".app").forEach((el) => {
    const g = GAMES.find((x) => x.id === el.dataset.id);
    el.hidden = q && !(g.name + " " + g.desc).toLowerCase().includes(q);
  });
});

// ---------- player
function noteKey() { return "k12-game-note:" + (currentVersion ? currentVersion.id : current.id); }
function srcOf() { return currentVersion ? currentVersion.src : current.src; }

function open(g, opts = {}) {
  if (g.needsNet && !navigator.onLine) toast("Bank Game needs internet");
  current = g;
  const vs = g.versions;
  currentVersion = vs ? (vs.find((v) => v.id === store.get("k12-bank-version")) || vs[0]) : null;
  const pick = $("#versionPick");
  pick.hidden = !vs;
  if (vs) pick.innerHTML = vs.map((v) => `<option value="${v.id}"${v === currentVersion ? " selected" : ""}>${v.name}</option>`).join("");
  $("#gameTitle").textContent = g.name;
  $("#barIcon").src = `app-icons/${g.id}.gif`;
  $("#gameDesc").textContent = g.desc;
  load();
  grid.querySelectorAll(".app").forEach((el) => el.classList.toggle("active", el.dataset.id === g.id));
  store.set("k12-last-game", g.id);
  if (!wide.matches && !opts.quiet) {
    player.classList.add("open");
    document.body.classList.add("playing");
    if (!history.state || !history.state.playing) history.pushState({ playing: true }, "");
  }
}

function load() {
  const src = srcOf();
  frame.src = src;
  $("#openLink").href = src;
  $("#pickHint").hidden = true;
  $("#notes").value = store.get(noteKey()) || "";
  $("#copyLink").hidden = !!current.versions;
}


$("#versionPick").addEventListener("change", (e) => {
  currentVersion = current.versions.find((v) => v.id === e.target.value);
  store.set("k12-bank-version", currentVersion.id);
  load();
});

function closePlayer() {
  player.classList.remove("open");
  document.body.classList.remove("playing");
  frame.src = "about:blank"; // stops the game's music
  $("#pickHint").hidden = false;
}
$("#back").addEventListener("click", () => { if (history.state && history.state.playing) history.back(); else closePlayer(); });
addEventListener("popstate", () => { if (player.classList.contains("open")) closePlayer(); });

$("#infoBtn").addEventListener("click", () => {
  const info = $("#info");
  info.hidden = !info.hidden;
  $("#infoBtn").setAttribute("aria-expanded", String(!info.hidden));
});
$("#notes").addEventListener("input", (e) => { if (current) store.set(noteKey(), e.target.value); });

$("#fullBtn").addEventListener("click", () => {
  const el = $(".stage");
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (req) req.call(el); else toast("Full screen isn't available here");
});

$("#copyLink").addEventListener("click", async () => {
  const url = PAGES_BASE + current.src.replace("../", "");
  try { await navigator.clipboard.writeText(url); toast("Link copied"); }
  catch (e) { prompt("Copy this link:", url); }
});

// first load: show the last game played (side panel on big screens only)
const last = GAMES.find((g) => g.id === store.get("k12-last-game")) || GAMES[0];
if (wide.matches) open(last, { quiet: true });
else grid.querySelector(`[data-id="${last.id}"]`)?.classList.add("active");

// ---------- offline: "Save for airplane"
const saveBtn = $("#saveOffline"), saveStatus = $("#saveStatus");
const OFFLINE_CACHE = "k12-offline-files";

function updateOnline() {
  $("#offlinePill").hidden = navigator.onLine;
  grid.querySelectorAll(".app").forEach((el) => {
    const g = GAMES.find((x) => x.id === el.dataset.id);
    el.classList.toggle("dim", !!g.needsNet && !navigator.onLine);
  });
}
addEventListener("online", updateOnline);
addEventListener("offline", updateOnline);
updateOnline();

function setSaved(state) {
  saveBtn.classList.toggle("saved", state === "saved");
  saveBtn.textContent = { saved: "✓ Ready for airplane", update: "⬇ Update offline games", none: "⬇ Save for airplane" }[state];
}

async function checkSaved() {
  const have = store.get("k12-offline-version");
  if (!have) return setSaved("none");
  if (!navigator.onLine) return setSaved("saved");
  try {
    const list = await (await fetch("offline-files.json", { cache: "no-store" })).json();
    setSaved(list.version === have ? "saved" : "update");
  } catch (e) { setSaved("saved"); }
}

if ("serviceWorker" in navigator) {
  // one offline helper for every game folder (../sw.js), on top of the dashboard's own
  navigator.serviceWorker.register("../sw.js", { scope: "../" }).catch(() => {});
} else {
  saveBtn.hidden = true;
}
if (!("caches" in window)) saveBtn.hidden = true;
checkSaved();

saveBtn.addEventListener("click", async () => {
  if (!navigator.onLine) { toast("Connect to Wi-Fi first"); return; }
  saveBtn.disabled = true;
  saveStatus.hidden = false;
  saveStatus.textContent = "Getting the list…";
  try {
    const list = await (await fetch("offline-files.json", { cache: "no-store" })).json();
    const cache = await caches.open(OFFLINE_CACHE);
    const fonts = await caches.open("k12-fonts");
    const jobs = list.files.map((f) => async () => {
      const url = new URL(f, location.href).href;
      const res = await fetch(url, { cache: "no-cache" });
      if (res.ok) await cache.put(url, res);
    });
    for (const css of list.fonts) {
      jobs.push(async () => { try { // fonts are a nice extra: if one fails the game uses a plain font
        const res = await fetch(css);
        if (!res.ok) return;
        const text = await res.clone().text();
        await fonts.put(css, res);
        const urls = [...text.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
        for (const u of urls) {
          try { const r = await fetch(u); if (r.ok) await fonts.put(u, r); } catch (e) {}
        }
      } catch (e) {} });
    }
    let done = 0, failed = 0;
    const total = jobs.length;
    const worker = async () => {
      while (jobs.length) {
        const job = jobs.shift();
        try { await job(); } catch (e) { failed++; }
        done++;
        saveStatus.textContent = `Saving games… ${Math.round((done / total) * 100)}%`;
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    if (failed) {
      saveStatus.textContent = `Saved, but ${failed} file${failed > 1 ? "s" : ""} didn't download. Try again on better Wi-Fi.`;
      setSaved("update");
    } else {
      store.set("k12-offline-version", list.version);
      saveStatus.textContent = "All games saved. They'll play with no internet (except Bank Game).";
      setSaved("saved");
      setTimeout(() => { saveStatus.hidden = true; }, 5000);
    }
  } catch (e) {
    saveStatus.textContent = "Couldn't save. Check the Wi-Fi and try again.";
  }
  saveBtn.disabled = false;
});
