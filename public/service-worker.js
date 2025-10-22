const VERSION = 'v2';
const CACHE_NAME = `Lalasia-${VERSION}`;

const STATIC_FILES = [
    '/offline.html',
    '/offline.css',    
    '/favicon.ico',
    '/network-error.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

async function cacheFirstAndUpdate(request) { 
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
  
    const networkPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => caches.match('/offline.html'));

    if (cached) {
        return cached;
    }

    const networkResponse = await networkPromise;
    return networkResponse;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(error => {
                if (error instanceof TypeError) {
                    return caches.match('/offline.html');
                }
                throw error;
            })
        );
        return;
    }

    if (request.url.includes('/_next/static/')) {
        event.respondWith(cacheFirstAndUpdate(request));
        return;
    }

    if (STATIC_FILES.some(file => request.url.endsWith(file))) {
        event.respondWith(cacheFirstAndUpdate(request));
        return;
    }
});