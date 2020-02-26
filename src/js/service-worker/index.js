self.addEventListener('install', function(evnt) {
  evnt.waitUntil(
    caches.open('soundboard').then(function(cache) {
      return cache.addAll(
        [
          'index.html',
          'soundboard.js'
        ]
      );
    })
  );
});

self.addEventListener('fetch', function(evnt) {
  evnt.respondWith(
    caches.open('soundboard').then(function(cache) {
      return cache.match(evnt.request).then(function(response) {
        return response || fetch(evnt.request);
      });
    })
  );
});
