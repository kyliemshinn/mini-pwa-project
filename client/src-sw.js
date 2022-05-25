// TODO: Create a service worker that caches static assets:
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate} from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Import the expiration plugin

precacheAndRoute(self.__WB_MANIFEST);

const cacheName = 'static-resources';
const matchCallback = ({ request }) => {
  console.log(request);
  return (
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script' ||
    //worker
    request.destination === 'worker'
  );
};

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// Register route for caching data
registerRoute(
  ({ request }) => request.destination === 'style', 'script', 'worker',
  new CacheFirst({
    cacheName: 'my-cache',
    plugins: [
      new CacheableResponsePlugin({
          // up to 200 cached data
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);