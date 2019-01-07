"use strict";

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open('pick').then(function (cache) {
    return cache.addAll(['index.html', 'soundboard.css', 'soundboard.js']);
  }));
});
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }));
});

//# sourceMappingURL=service-worker.js.map