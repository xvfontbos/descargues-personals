const CACHE = 'xvi-dl-v1';
const ASSETS = ['./index.html', './manifest.json'];

const EXCLUDED_HOSTS = ['cobalt.tools', 'kwiateusz.pl', 'allorigins.win'];

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
  const url = new URL(e.request.url);

  // Si la petició és per a una de les APIs, no fem res (deixem que vagi a internet)
  if (EXCLUDED_HOSTS.some(host => url.hostname.includes(host))) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});