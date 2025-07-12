// sw.js – Service Worker chuẩn chỉnh cho PWA Nhật Ký Bii & Quìn
const CACHE_NAME = 'bii-quin-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // ✅ Đổi thành tên file icon đúng của m
];

// Cài đặt service worker và cache các file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log('✅ Service Worker: Installed & cached');
  self.skipWaiting(); // ⚡ Bắt SW active ngay không chờ
});

// Kích hoạt SW và dọn cache cũ
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  console.log('⚡ Service Worker: Activated');
  self.clients.claim(); // ✅ Kích hoạt bản mới ngay lập tức
});

// Trả file từ cache nếu có, fallback về index nếu mất mạng
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      if (response) return response;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
