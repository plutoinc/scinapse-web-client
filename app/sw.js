workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp('https://assets.pluto.network/(.*)'),
  new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
  new RegExp('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://connect.facebook.net/en_US/sdk.js'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://apis.google.com/js/platform.js'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://www.googletagmanager.com/gtag/js?id=AW-817738370'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://missive.github.io/emoji-mart/emoji-mart.css'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css'),
  new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
  new RegExp('https://browser.sentry-cdn.com/5.0.6/bundle.min.js'),
  new workbox.strategies.CacheFirst()
);

self.addEventListener('push', (event) => {
  const title = 'Get Started With Workbox';
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});


workbox.precaching.precacheAndRoute(self.__precacheManifest);
