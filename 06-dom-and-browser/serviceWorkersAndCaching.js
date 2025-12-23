/**
 * TOPIC: SERVICE WORKERS AND CACHING
 * DESCRIPTION:
 * Service Workers are scripts that run in the background,
 * enabling offline functionality, push notifications, and
 * advanced caching strategies for Progressive Web Apps.
 */

// -------------------------------------------------------------------------------------------
// 1. REGISTERING A SERVICE WORKER
// -------------------------------------------------------------------------------------------

// In your main app (e.g., main.js)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered:', registration.scope);
        } catch (error) {
            console.log('SW registration failed:', error);
        }
    });
}

// Check registration status
async function checkRegistration() {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log('Registrations:', registrations);
}

// -------------------------------------------------------------------------------------------
// 2. SERVICE WORKER LIFECYCLE
// -------------------------------------------------------------------------------------------

/**
 * In sw.js (the service worker file):
 * 
 * Lifecycle events:
 * 1. install - SW is installed
 * 2. activate - SW takes control
 * 3. fetch - Intercepts network requests
 */

const CACHE_NAME = 'v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/offline.html'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())  // Activate immediately
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())  // Take control immediately
    );
});

// -------------------------------------------------------------------------------------------
// 3. FETCH STRATEGIES
// -------------------------------------------------------------------------------------------

// Strategy 1: Cache First (Offline-first)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
    );
});

// Strategy 2: Network First (Fresh content)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone and cache the response
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// Strategy 3: Stale While Revalidate
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                
                return cachedResponse || fetchPromise;
            });
        })
    );
});

// Strategy 4: Network Only
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});

// Strategy 5: Cache Only
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request));
});

// -------------------------------------------------------------------------------------------
// 4. ADVANCED FETCH HANDLING
// -------------------------------------------------------------------------------------------

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Different strategies for different content
    if (request.destination === 'image') {
        event.respondWith(cacheFirstWithExpiry(request));
    } else if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirstWithTimeout(request, 3000));
    } else if (request.mode === 'navigate') {
        event.respondWith(navigationHandler(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

async function cacheFirstWithExpiry(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Check if cache is expired (custom header or time-based)
        return cachedResponse;
    }
    
    const response = await fetch(request);
    const cache = await caches.open('images-v1');
    cache.put(request, response.clone());
    return response;
}

async function networkFirstWithTimeout(request, timeout) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(request, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline', { status: 503 });
    }
}

async function navigationHandler(request) {
    try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
            return preloadResponse;
        }
        return await fetch(request);
    } catch (error) {
        return caches.match('/offline.html');
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    });
    
    return cachedResponse || fetchPromise;
}

// -------------------------------------------------------------------------------------------
// 5. CACHE API DIRECTLY
// -------------------------------------------------------------------------------------------

// Open/create cache
const cache = await caches.open('my-cache');

// Add single item
await cache.add('/api/data');

// Add multiple items
await cache.addAll(['/page1.html', '/page2.html']);

// Put (custom key-value)
await cache.put('/custom-key', new Response('Custom data'));

// Match (find in cache)
const response = await cache.match('/api/data');

// Match with options
const matchedResponse = await cache.match(request, {
    ignoreSearch: true,  // Ignore query string
    ignoreMethod: true,  // Match any HTTP method
    ignoreVary: true     // Ignore Vary header
});

// Delete from cache
await cache.delete('/api/data');

// Get all keys
const keys = await cache.keys();

// Delete entire cache
await caches.delete('my-cache');

// -------------------------------------------------------------------------------------------
// 6. UPDATING SERVICE WORKERS
// -------------------------------------------------------------------------------------------

// Force update check
navigator.serviceWorker.ready.then(registration => {
    registration.update();
});

// Listen for updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
    // New SW has taken control
    window.location.reload();
});

// In SW: Handle update
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Prompt user to update
async function checkForUpdate(registration) {
    if (registration.waiting) {
        // New version available
        if (confirm('New version available. Reload?')) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }
}

// -------------------------------------------------------------------------------------------
// 7. BACKGROUND SYNC
// -------------------------------------------------------------------------------------------

// Register sync event
async function registerSync() {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-data');
}

// In SW: Handle sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Get pending data from IndexedDB
    // Send to server
    // Clear pending data on success
}

// -------------------------------------------------------------------------------------------
// 8. PUSH NOTIFICATIONS
// -------------------------------------------------------------------------------------------

// Subscribe to push
async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    
    // Send subscription to server
    await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription)
    });
}

// In SW: Handle push
self.addEventListener('push', (event) => {
    const data = event.data?.json() || { title: 'Notification' };
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icon.png',
            badge: '/badge.png',
            actions: [
                { action: 'open', title: 'Open' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        })
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(clients.openWindow('/'));
    }
});

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

// -------------------------------------------------------------------------------------------
// 9. COMMUNICATION WITH PAGE
// -------------------------------------------------------------------------------------------

// From page to SW
navigator.serviceWorker.controller?.postMessage({
    type: 'CACHE_URLS',
    urls: ['/new-page.html']
});

// From SW to page
self.clients.matchAll().then(clients => {
    clients.forEach(client => {
        client.postMessage({
            type: 'CACHE_UPDATED'
        });
    });
});

// Listen in page
navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('Message from SW:', event.data);
});

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SERVICE WORKER LIFECYCLE:
 * - install: Cache initial assets
 * - activate: Clean up old caches
 * - fetch: Intercept requests
 * 
 * CACHING STRATEGIES:
 * - Cache First: Offline-first
 * - Network First: Fresh content
 * - Stale While Revalidate: Best of both
 * - Network Only: Always fresh
 * - Cache Only: Pre-cached only
 * 
 * FEATURES:
 * - Offline support
 * - Background sync
 * - Push notifications
 * - Cache management
 * 
 * BEST PRACTICES:
 * - Version your caches
 * - Handle update prompts
 * - Provide offline fallback
 * - Use appropriate strategy per resource
 */
