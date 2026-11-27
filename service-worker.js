
const CACHE_NAME = "qesmetna-v2";

self.addEventListener("install", function(event) {
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        (async function() {
            const keys = await caches.keys();

            await Promise.all(
                keys
                    .filter(function(key) {
                        return key !== CACHE_NAME;
                    })
                    .map(function(key) {
                        return caches.delete(key);
                    })
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request, {
            cache: "no-store"
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
