// sw.js
const CACHE_NAME = 'bii-quin-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Cài đặt service worker và cache các file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log('✅ Service Worker: Installed & cached');
  self.skipWaiting(); // Bắt service worker active luôn không cần reload
});

// Kích hoạt SW và xóa cache cũ nếu có
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  console.log('⚡ Service Worker: Activated');
});

// Intercept các request và trả file từ cache (nếu có)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Nếu có file trong cache thì trả về
      if (response) return response;
      // Nếu không có thì fetch như bình thường
      return fetch(e.request).catch(() => {
        // Nếu fetch fail (do mất mạng) thì fallback về index.html
        return caches.match('./index.html');
      });
    })
  );
});
