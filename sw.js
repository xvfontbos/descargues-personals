const CACHE = 'xvi-dl-v2';
const ASSETS = ['./index.html', './manifest.json', './video_blanc.svg', './llibre_blanc.svg', './auriculars_blanc.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('cobalt.tools')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
