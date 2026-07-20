const APP_CACHE = 'sweet-merge-shell-v14';
const ART_CACHE = 'sweet-merge-art-v4';
const TYPES = ['coffee', 'cake', 'fruit'];
const MACHINE_TYPES = ['coffee', 'cake', 'fruit', 'tea', 'bread', 'icecream', 'chocolate'];
const GENERATED_ITEM_TYPES = ['tea', 'bread', 'icecream', 'chocolate'];
const CORE = [
  './', './index.html', './style.css', './polish.css', './features.css', './scene-renovation.css', './game.js', './scene-renovation.js', './pwa.js', './manifest.webmanifest'
];
const ITEM_ASSETS = [
  ...TYPES.flatMap(type => Array.from({ length: 6 }, (_, level) => `./assets/items/${type}-${level}.png`)),
  ...GENERATED_ITEM_TYPES.flatMap(type => Array.from({ length: 15 }, (_, level) => `./assets/items/${type}-${level}.png`))
];
const MACHINE_ASSETS = MACHINE_TYPES.flatMap(type => Array.from({ length: 12 }, (_, level) => `./assets/machines/${type}-${level}.png`));
const EXTRA_ASSETS = [
  './assets/cafe-background.png', './assets/scene-terrace-v2.png', './assets/scene-bakery-v2.png', './assets/scene-garden-v2.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/apple-touch-icon.png',
  ...Array.from({ length: 80 }, (_, i) => `./assets/decor/decor-${i}.png`),
  ...Array.from({ length: 3 }, (_, i) => `./assets/characters/customer-${i}.png`)
];
const ART_ASSETS = [...ITEM_ASSETS, ...MACHINE_ASSETS, ...EXTRA_ASSETS];

async function cacheArtAssets() {
  const cache = await caches.open(ART_CACHE);
  await Promise.all(ART_ASSETS.map(async asset => {
    if (await cache.match(asset)) return;
    try { await cache.add(asset); } catch {}
  }));
}

self.addEventListener('install', event => {
  event.waitUntil(Promise.all([
    caches.open(APP_CACHE).then(cache => cache.addAll(CORE)),
    cacheArtAssets()
  ]).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('sweet-merge-') && key !== APP_CACHE && key !== ART_CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === location.origin) {
      const cacheName = new URL(event.request.url).pathname.includes('/assets/') ? ART_CACHE : APP_CACHE;
      caches.open(cacheName).then(cache => cache.put(event.request, response.clone()));
    }
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
