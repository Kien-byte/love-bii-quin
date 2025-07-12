// sw.js – Service Worker chuẩn chỉnh cho PWA Nhật Ký Bii & Quìn

const CACHE_NAME = 'bii-quin-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png' // ✅ Đúng tên file icon của m
];

// Cài đặt service worker và cache các file
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  console.log('✅ Service Worker: Installed & cached');
  self.skipWaiting(); // ⚡ Active ngay
});
// Kích hoạt và clear cache cũ
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  console.log('⚡ Service Worker: Activated');
  self.clients.claim(); // 🔁 Làm chủ client ngay
});

// Xử lý fetch
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
