// Lembre de subir esta versão a cada deploy para invalidar o cache antigo.
const CACHE_NAME = "lar-espirita-static-v12";
const CACHE_STATIC = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/app.js",
  "/js/library.js",
  "/js/evangelho.js",
  "/js/ai.js",
  "/js/account.js",
  "/js/meet-config.js",
  "/data/livro-dos-espiritos.json",
  "/data/evangelho-segundo-espiritismo.json",
  "/assets/logo.png",
  "/assets/logo.ico",
  "/assets/maskable-icon512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_STATIC))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const { request } = event;

  // Nunca cachear chamadas a APIs (ex.: Cloudflare Worker em /api/*)
  if (request.url.includes("/api/")) return;

  // Nunca cachear respostas parciais (Range requests, ex.: áudio/vídeo)
  if (request.headers.has("range")) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && request.method === "GET") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
