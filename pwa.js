(() => {
  const hint = document.querySelector('#pwaHint');
  const close = document.querySelector('#closePwaHint');
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const warmImages = [];
  const itemAssets = [
    ...['coffee', 'cake', 'fruit'].flatMap(type => Array.from({ length: 6 }, (_, level) => `assets/items/${type}-${level}.png`)),
    ...['tea', 'bread', 'icecream', 'chocolate'].flatMap(type => Array.from({ length: 15 }, (_, level) => `assets/items/${type}-${level}.png`))
  ];

  const scheduleIdle = callback => 'requestIdleCallback' in window
    ? window.requestIdleCallback(callback, { timeout: 1200 })
    : window.setTimeout(callback, 160);

  const warmItemArt = () => {
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
    };
    scheduleIdle(warmNext);
  };

  if (isIos && !standalone && !sessionStorage.getItem('pwa-hint-closed')) {
    hint.classList.remove('hidden');
  }
  close?.addEventListener('click', () => {
    hint.classList.add('hidden');
    sessionStorage.setItem('pwa-hint-closed', '1');
  });

  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(warmItemArt).catch(warmItemArt);
    } else {
      warmItemArt();
    }
  });
})();
