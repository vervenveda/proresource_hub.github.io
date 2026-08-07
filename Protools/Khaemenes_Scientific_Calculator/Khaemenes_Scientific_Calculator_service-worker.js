"use strict";

const CACHE_PREFIX = "khaemenes-scientific-calculator-";
const CACHE_NAME = `${CACHE_PREFIX}v4-1-0`;
const APP_FILE = "Khaemenes_Scientific_Calculator_index.html";
const ASSETS = [
  `./${APP_FILE}`,
  "./Khaemenes_Scientific_Calculator_manifest.webmanifest",
  "./Khaemenes_Scientific_Calculator_icon-192.png",
  "./Khaemenes_Scientific_Calculator_icon-512.png"
];
const CONTROLLED_FILENAMES = new Set(ASSETS.map(path => path.replace(/^\.\//, "")));

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  const filename = url.pathname.split("/").pop() || "";

  // This worker is stored in the shared Protools directory. It deliberately
  // intercepts only calculator assets and remains passive for every other tool.
  if(!CONTROLLED_FILENAMES.has(filename)) return;

  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(cached => {
      const network = fetch(event.request).then(response => {
        if(response && response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });

      if(cached){
        event.waitUntil(network.catch(() => null));
        return cached;
      }
      return network.catch(() => caches.match(`./${APP_FILE}`));
    })
  );
});
