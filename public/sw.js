/*
 * QuickLocal's service worker — deliberately small.
 *
 * Pages: network first, always. A page that loads is copied, so the pages a
 * visitor has opened still open without a signal; one never opened shows the
 * offline page instead. Nothing is served stale while online.
 * Build assets (/_next/static, hashed and immutable) and images: cache first.
 *
 * It is registered as /sw.js?v=<deploy>, so every deploy installs it afresh:
 * the offline page is re-fetched and the previous deploy's caches are cleared.
 */
const VERSION = `ql-${new URL(self.location.href).searchParams.get('v') || 'local'}`;
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const OFFLINE = '/offline';
const MAX_PAGES = 40;
const MAX_ASSETS = 160;

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map(k => cache.delete(k)));
}

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const res = await fetch(OFFLINE, { cache: 'reload' });
      if (res.ok) {
        const html = await res.clone().text();
        await pages.put(OFFLINE, res);
        /* The offline page's own styles, fonts and scripts, so it renders as itself. */
        const assets = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s)\\]+/g)].map(m => m[0]))];
        const cache = await caches.open(ASSETS);
        await Promise.all(assets.map(a => cache.add(a).catch(() => {})));
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(PAGES).then(c => c.put(url.pathname, copy).then(() => trim(PAGES, MAX_PAGES)));
          }
          return res;
        } catch {
          const cache = await caches.open(PAGES);
          return (await cache.match(url.pathname)) || (await cache.match(OFFLINE)) || Response.error();
        }
      })(),
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || /\.(?:png|jpe?g|webp|avif|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone()).then(() => trim(ASSETS, MAX_ASSETS));
        return res;
      })(),
    );
  }
});
