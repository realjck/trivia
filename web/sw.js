// self.registration.unregister();


const CACHE_NAME = 'trivia-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/main.js',
    './scripts/quiz.js',
    './images/logo.svg',
    './images/favicon.ico',
    './images/opentrivia-logo.png',
    './images/icon-192x192.png',
    './images/icon-512x512.png',
    './sounds/win.mp3',
    './sounds/lose.mp3',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    // Vérifier si nous avons reçu une réponse valide
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Cloner la réponse car elle ne peut être utilisée qu'une fois
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});
