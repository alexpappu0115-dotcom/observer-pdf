// Observer service worker: makes the app work offline after the first visit.
// Bump VERSION whenever vendor/ or icons/ change so phones pick up the new files.
const VERSION = 'observer-v7';
const CORE = [
  './',
  'index.html',
  'config.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'vendor/pdf.min.js',
  'vendor/pdf.worker.min.js',
  'vendor/pdf-lib.min.js',
  'vendor/forge.min.js',
  'vendor/zgapdfsigner.min.js',
  'vendor/tesseract.min.js'
];
// OCR engine + language data are fetched from these hosts on first use, then cached.
const RUNTIME_HOSTS = ['cdn.jsdelivr.net', 'unpkg.com', 'tessdata.projectnaptha.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page and its config: network first so updates show up, cache when offline.
  const isConfig = url.origin === location.origin && url.pathname.endsWith('/config.js');
  if (req.mode === 'navigate' || isConfig || (url.origin === location.origin && url.pathname.endsWith('/index.html'))) {
    const key = isConfig ? 'config.js' : 'index.html';
    e.respondWith(
      fetch(req)
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key, copy)); } return res; })
        .catch(() => caches.match(key))
    );
    return;
  }

  if (url.origin === location.origin || RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
  }
});
