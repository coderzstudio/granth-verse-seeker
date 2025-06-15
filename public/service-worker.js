
const CACHE_NAME = "sanatanigyan-cache-v1";
const toCache = ["/", "/index.html", "/manifest.webmanifest"];

// Install Service Worker & Cache Resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(toCache);
    })
  );
});

// Serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});

// Optionally: clear old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((c) => c !== CACHE_NAME)
          .map((c) => caches.delete(c))
      );
    })
  );
});

// Placeholder: Listen to push notification events (for later)
self.addEventListener('push', (event) => {
  // This is a placeholder for real notification handling.
  const data = event.data?.json() || { title: "Update!", body: "You have a new notification." };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/lovable-uploads/98daf744-58f5-4c66-9b04-2cad5e87236d.png",
    })
  );
});
