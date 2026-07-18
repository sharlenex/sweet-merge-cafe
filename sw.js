const CACHE_NAME = 'sweet-merge-cafe-v8';
const TYPES = ['coffee', 'cake', 'fruit'];
const GENERATED_ITEM_TYPES = ['tea', 'bread', 'icecream', 'chocolate'];
const CORE = [
  './', './index.html', './style.css', './polish.css', './features.css', './game.js', './pwa.js', './manifest.webmanifest',
  './assets/cafe-background.png', './assets/scene-terrace.png', './assets/scene-bakery.png', './assets/scene-garden.png',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/apple-touch-icon.png'
];
const ITEM_ASSETS = [
  ...TYPES.flatMap(type => Array.from({ length: 6 }, (_, level) => `./assets/items/${type}-${level}.png`)),
  ...GENERATED_ITEM_TYPES.flatMap(type => Array.from({ length: 15 }, (_, level) => `./assets/items/${type}-${level}.png`))
];
const MACHINE_ASSETS = TYPES.flatMap(type => Array.from({ length: 12 }, (_, level) => `./assets/machines/${type}-${level}.png`));
const EXTRA_ASSETS = [
  ...Array.from({ length: 6 }, (_, i) => `./assets/decor/decor-${i}.png`),
  ...Array.from({ length: 3 }, (_, i) => `./assets/characters/customer-${i}.png`)
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([...CORE, ...ITEM_ASSETS, ...MACHINE_ASSETS, ...EXTRA_ASSETS])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === location.origin) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
