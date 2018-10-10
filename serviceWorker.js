// console.log("Service wroker rgistered");

const cacheName = 'firstCache';
const cacheFiles = [
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(function(response) {
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response.
            //https://developers.google.com/web/fundamentals/primers/service-workers/
            let fetchRequest= e.request.clone();

            return fetch(fetchRequest).then(function(response) {
              // Check if we received a valid response
              //https://developers.google.com/web/fundamentals/primers/service-workers/
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              let responseClone = response.clone();

              caches.open(cacheName).then(function(cache) {
                cache.put(e.request, responseClone);
              });
              return response;
            }).catch(function(err) {
              console.error(err);
            });
        })
    );
});
