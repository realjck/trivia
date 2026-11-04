// Incrémenter la version à chaque déploiement pour purger les anciens caches.
const CACHE_NAME = 'trivia-v4';
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
    './images/icon-maskable-192x192.png',
    './images/icon-maskable-512x512.png',
    './images/apple-touch-icon.png',
    './fonts/inter-800-latin.woff2',
    './fonts/inter-800-latin-ext.woff2',
    './sounds/win.mp3',
    './sounds/lose.mp3',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Réseau d'abord : on sert toujours la version la plus récente,
// le cache ne sert que de secours hors ligne.
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        // Les médias sont demandés par plages (206) : seul un 200 complet peut aller en cache.
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw err;
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    // Les appels à l'API (cross-origin) et les requêtes non-GET passent directement au réseau.
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }
    event.respondWith(networkFirst(request));
});
