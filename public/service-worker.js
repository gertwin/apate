
/* globals self, caches, fetch */

const cacheName = 'APATE-v1';

const appShellFiles = [
    '/',
    'index.html',
    'manifest.json',
    'APATE-bundle.js',
    'jsscm-bundle.js',
    'css/print.css',
    'css/theme-dark.css',
    'css/theme-default.css',
    'css/theme-light.css',
    'fonts/MaterialIcons-Regular.eot',
    'fonts/MaterialIcons-Regular.ttf',
    'fonts/MaterialIcons-Regular.woff',
    'fonts/MaterialIcons-Regular.woff2',
    'icons/apate-32.png',
    'icons/apate-64.png',
    'icons/apate-128.png',
    'icons/apate-256.png',
    'icons/favicon-16.png',
    'icons/favicon-32.png',
    'locales/en-US/messages.json',
    'locales/nl-NL/messages.json',
];

self.addEventListener('install', (event) => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(caches.open(cacheName).then((cache) => {
        return cache.addAll(appShellFiles);
    }));
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // cache hit - return response
            if (response) {
                return response;
            }
            // else fetch from network
            return fetch(event.request);
        }),
    );
});
