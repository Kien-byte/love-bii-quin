// sw.js
self.addEventListener('install', e => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  // Mặc định, không làm gì, nhưng phải có để kích hoạt PWA
});
