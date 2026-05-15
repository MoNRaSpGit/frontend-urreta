/* global self, caches, fetch, URL */

const CACHE_NAME = "urreta-pwa-v2";

function getAppBase() {
  const scopeUrl = new URL(self.registration.scope);
  return scopeUrl.pathname.endsWith("/") ? scopeUrl.pathname : `${scopeUrl.pathname}/`;
}

function getAppShellPaths() {
  const appBase = getAppBase();
  return [appBase, `${appBase}index.html`, `${appBase}manifest.webmanifest`];
}

async function updateCache(cache, request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") {
    return response;
  }

  await cache.put(request, response.clone());
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(getAppShellPaths()))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  const appBase = getAppBase();

  if (url.pathname.endsWith("/app-build.json") || url.pathname.endsWith("/manifest.webmanifest")) {
    event.respondWith(fetch(event.request, { cache: "no-store" }));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => caches.open(CACHE_NAME).then((cache) => updateCache(cache, event.request, response)))
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || caches.match(appBase);
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => caches.open(CACHE_NAME).then((cache) => updateCache(cache, event.request, response)))
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || caches.match(`${appBase}index.html`);
      })
  );
});
