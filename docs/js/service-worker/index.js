const filesToCache = [
  'index.html',
  'js/app/lib/jsmediatags-3.9.7.js',
  'js/app/lib/thimbleful.js',
  'js/app/model/board.js',
  'js/app/model/mp3file.js',
  'js/app/model/play-mode.js',
  'js/app/model/sound.js',
  'js/app/util/keyboard.js',
  'js/app/util/midi.js',
  'js/app/util/pwa.js',
  'js/app/board-renderer.js',
  'js/app/index.js',
  'css/base.css',
  'css/board.css',
  'css/colours.css',
  'css/index.css',
  'css/navigation.css',
  'css/sound.css',
  'images/favicon.ico',
  'images/radio-icon.svg'
];

self.addEventListener('install', function(evnt) {
  evnt.waitUntil(
    caches.open('soundboard').then(function(cache) {
      return cache.addAll(
        filesToCache.map(file => `../../${file}`)
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
