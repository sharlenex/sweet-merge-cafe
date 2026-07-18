(() => {
  const hint = document.querySelector('#pwaHint');
  const close = document.querySelector('#closePwaHint');
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const artCache = 'sweet-merge-art-v3';
  const warmKey = 'sweet-merge-art-warmed-v3';
  const warmImages = [];
  const itemAssets = [
    ...['coffee', 'cake', 'fruit'].flatMap(type => Array.from({ length: 6 }, (_, level) => `assets/items/${type}-${level}.png`)),
    ...['tea', 'bread', 'icecream', 'chocolate'].flatMap(type => Array.from({ length: 15 }, (_, level) => `assets/items/${type}-${level}.png`))
  ];
  const artAssets = [
    ...itemAssets,
    ...['coffee', 'cake', 'fruit', 'tea', 'bread', 'icecream', 'chocolate'].flatMap(type => Array.from({ length: 12 }, (_, level) => `assets/machines/${type}-${level}.png`)),
    ...Array.from({ length: 3 }, (_, i) => `assets/characters/customer-${i}.png`),
    ...Array.from({ length: 80 }, (_, i) => `assets/decor/decor-${i}.png`),
    'assets/cafe-background.png', 'assets/scene-terrace.png', 'assets/scene-bakery.png', 'assets/scene-garden.png'
  ];

  const scheduleIdle = callback => 'requestIdleCallback' in window
    ? window.requestIdleCallback(callback, { timeout: 1200 })
    : window.setTimeout(callback, 160);

  const warmItemArt = () => {
    if (localStorage.getItem(warmKey)) return;
    let cursor = 0;
    const warmNext = () => {
      const end = Math.min(cursor + 3, itemAssets.length);
      while (cursor < end) {
        const image = new Image();
        image.decoding = 'async';
        image.src = itemAssets[cursor++];
        warmImages.push(image);
        image.decode?.().catch(() => {});
      }
      if (cursor < itemAssets.length) scheduleIdle(warmNext);
      else localStorage.setItem(warmKey, '1');
    };
    scheduleIdle(warmNext);
  };

  const cacheArtLocally = () => {
    if (!('caches' in window)) return;
    navigator.storage?.persist?.().catch(() => {});
    let cursor = 0;
    const cacheNext = () => {
      const batch = artAssets.slice(cursor, cursor + 6);
      cursor += batch.length;
      caches.open(artCache).then(cache => Promise.all(batch.map(async asset => {
        if (await cache.match(asset)) return;
        try {
          const response = await fetch(asset, { cache: 'force-cache' });
          if (response.ok) await cache.put(asset, response.clone());
        } catch {}
      }))).finally(() => {
        if (cursor < artAssets.length) scheduleIdle(cacheNext);
      });
    };
    scheduleIdle(cacheNext);
  };

  if (isIos && !standalone && !sessionStorage.getItem('pwa-hint-closed')) {
    hint.classList.remove('hidden');
  }
  close?.addEventListener('click', () => {
    hint.classList.add('hidden');
    sessionStorage.setItem('pwa-hint-closed', '1');
  });

  window.addEventListener('load', () => {
    const prepareArtwork = () => { cacheArtLocally(); warmItemArt(); };
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(prepareArtwork).catch(prepareArtwork);
    } else {
      prepareArtwork();
    }
  });
})();
