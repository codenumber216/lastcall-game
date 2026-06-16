/* Last Call — service worker (플레이테스트용: network-first + 오프라인 폴백)
   업데이트를 항상 우선 받게(온라인이면 최신본), 오프라인이면 캐시로 실행. */
const CACHE = "lastcall-v1";
const ASSETS = [
  "./", "./index.html", "./manifest.json",
  "./drinks.js", "./gathering.js", "./characters.js", "./fermentation.js",
  "./progression.js", "./skills.js", "./combat.js",
  "./art/grandma.png", "./art/player.png", "./art/jin.png", "./art/bori.png",
  "./art/comic_prologue.png",
  "./art/stickers/grandma.png", "./art/stickers/player.png",
  "./art/stickers/jin.png", "./art/stickers/bori.png"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
