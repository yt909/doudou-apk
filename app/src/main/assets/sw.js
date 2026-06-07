// 璞嗚眴缂栫▼鍔╂暀 Service Worker 鈥?绂荤嚎缂撳瓨
const CACHE_NAME = 'doudou-assistant-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 鍙紦瀛?GET 璇锋眰锛孉PI 璋冪敤涓嶇紦瀛?  if (e.request.method !== 'GET') return;
  // 涓嶇紦瀛樺閮?API 璇锋眰
  if (e.request.url.includes('api.deepseek.com')) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
