const CACHE = 'xvi-dl-v1';
const ASSETS = ['./downloader.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
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
  // Per a les crides a l'API de cobalt, sempre xarxa
  if (e.request.url.includes('cobalt.tools')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
