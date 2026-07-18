(() => {
  const hint = document.querySelector('#pwaHint');
  const close = document.querySelector('#closePwaHint');
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isIos && !standalone && !sessionStorage.getItem('pwa-hint-closed')) {
    hint.classList.remove('hidden');
  }
  close?.addEventListener('click', () => {
    hint.classList.add('hidden');
    sessionStorage.setItem('pwa-hint-closed', '1');
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
  }
})();
