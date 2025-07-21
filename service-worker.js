// OZZ Promotional Catalog Service Worker
// Version 1.0 - Optimized for performance and offline support

const CACHE_NAME = 'ozz-promo-v1.0';
const CACHE_VERSION = '1.0';

// Critical resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://raw.githubusercontent.com/Iamabhih/OZZPromotions/main/OZZ-logo-transparent-1-1.png'
];

// Dynamic resources to cache on first request
const DYNAMIC_CACHE = 'ozz-promo-dynamic-v1.0';

// Resources that should always be fetched from network
const NETWORK_FIRST = [
    '/JULY PROMO.xlsx',
    'googleapis.com',
    'google.com/drive'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { mode: 'cors' })));
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Error caching static assets:', error);
            })
    );
});

// Activate event - cleanup old caches and take control
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            // Delete old caches
                            return cacheName.startsWith('ozz-promo-') && cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
                        })
                        .map(cacheName => {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated and ready');
                return self.clients.claim();
            })
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Skip Google APIs (they have their own caching)
    if (url.hostname.includes('googleapis.com') || url.hostname.includes('google.com')) {
        return;
    }
    
    // Network first for critical dynamic content
    if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Cache first for static assets
    if (STATIC_ASSETS.some(asset => request.url.includes(asset.replace('https://', '').replace('http://', '')))) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Stale while revalidate for everything else
    event.respondWith(staleWhileRevalidate(request));
});

// Cache first strategy (for static assets)
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
        
    } catch (error) {
        console.error('Cache first failed:', error);
        return await caches.match('/index.html') || new Response('Offline', { status: 503 });
    }
}

// Network first strategy (for dynamic content)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return await caches.match('/index.html') || new Response(
                getOfflineHTML(), 
                { headers: { 'Content-Type': 'text/html' } }
            );
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Stale while revalidate strategy (for most content)
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || await fetchPromise;
}

// Background sync for data updates
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(syncData());
    }
});

// Sync data when connection returns
async function syncData() {
    try {
        console.log('📊 Syncing product data...');
        
        const response = await fetch('/JULY PROMO.xlsx');
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put('/JULY PROMO.xlsx', response.clone());
            
            // Notify all clients of updated data
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({ 
                    type: 'DATA_UPDATED',
                    message: 'Product data has been updated' 
                });
            });
            
            console.log('✅ Product data synced successfully');
        }
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Push notification support (for future use)
self.addEventListener('push', event => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New promotional deals available!',
        icon: 'https://raw.githubusercontent.com/Iamabhih/OZZPromotions/main/OZZ-logo-transparent-1-1.png',
        badge: 'https://raw.githubusercontent.com/Iamabhih/OZZPromotions/main/OZZ-logo-transparent-1-1.png',
        vibrate: [200, 100, 200],
        data: data,
        actions: [
            {
                action: 'view',
                title: 'View Deals',
                icon: 'https://raw.githubusercontent.com/Iamabhih/OZZPromotions/main/OZZ-logo-transparent-1-1.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'OZZ Cash & Carry', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_VERSION });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Utility function to clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames
            .filter(name => name.startsWith('ozz-promo-'))
            .map(name => caches.delete(name))
    );
}

// Offline HTML fallback
function getOfflineHTML() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OZZ Cash & Carry - Offline</title>
            <style>
                body {
                    font-family: system-ui, sans-serif;
                    background: linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #eff6ff 100%);
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 1rem;
                }
                .container {
                    max-width: 400px;
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .icon { font-size: 4rem; margin-bottom: 1rem; }
                h1 { color: #dc2626; margin-bottom: 1rem; }
                p { color: #6b7280; line-height: 1.5; }
                button {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 1rem;
                }
                button:hover { background: #b91c1c; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">🏪</div>
                <h1>OZZ Cash & Carry</h1>
                <h2>You're Offline</h2>
                <p>It looks like you've lost your internet connection. Don't worry - when you're back online, you'll be able to browse our full July 2025 promotional catalog!</p>
                <p><strong>Contact us directly:</strong><br>📞 +27 31 332 7192</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
}

// Performance monitoring
self.addEventListener('fetch', event => {
    // Log slow requests for monitoring
    const start = performance.now();
    
    event.respondWith(
        (async () => {
            const response = await handleRequest(event.request);
            const duration = performance.now() - start;
            
            if (duration > 2000) {
                console.warn(`Slow request detected: ${event.request.url} took ${duration.toFixed(2)}ms`);
            }
            
            return response;
        })()
    );
});

// Main request handler
async function handleRequest(request) {
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return fetch(request);
    }
    
    // Skip Google APIs
    if (url.hostname.includes('googleapis.com') || url.hostname.includes('google.com')) {
        return fetch(request);
    }
    
    // Network first for critical dynamic content
    if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
        return networkFirst(request);
    }
    
    // Cache first for static assets
    if (STATIC_ASSETS.some(asset => request.url.includes(asset.replace('https://', '').replace('http://', '')))) {
        return cacheFirst(request);
    }
    
    // Stale while revalidate for everything else
    return staleWhileRevalidate(request);
}

console.log('🚀 OZZ Promotional Catalog Service Worker loaded successfully');
