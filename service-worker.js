// OZZ Promotional Catalog Service Worker - CORS Safe Version
const CACHE_NAME = 'ozz-promo-v1.1';
const DYNAMIC_CACHE = 'ozz-promo-dynamic-v1.1';

// Only cache same-origin resources to avoid CORS issues
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
    // Removed external CDN resources to avoid CORS issues
];

// Resources that should bypass service worker completely
const BYPASS_PATTERNS = [
    'googleapis.com',
    'google.com',
    'cdn.tailwindcss.com',
    'cdnjs.cloudflare.com',
    'raw.githubusercontent.com'
];

// Install event - cache only same-origin static assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching same-origin assets...');
                // Only cache same-origin resources
                return Promise.allSettled(
                    STATIC_ASSETS.map(url => {
                        return cache.add(new Request(url, { 
                            mode: 'same-origin',
                            cache: 'reload'
                        })).catch(error => {
                            console.warn('Could not cache:', url, error);
                        });
                    })
                );
            })
            .then(() => {
                console.log('✅ Same-origin assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.warn('Cache installation completed with some warnings:', error);
                return self.skipWaiting();
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('ozz-promo-') && 
                                   cacheName !== CACHE_NAME && 
                                   cacheName !== DYNAMIC_CACHE;
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

// Fetch event - intelligent caching with CORS handling
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Bypass external resources that cause CORS issues
    if (BYPASS_PATTERNS.some(pattern => url.hostname.includes(pattern))) {
        return; // Let browser handle these normally
    }
    
    // Only handle same-origin requests or explicitly allowed cross-origin requests
    if (url.origin === location.origin) {
        event.respondWith(handleSameOriginRequest(request));
    }
    // For cross-origin requests, let browser handle them normally
});

// Handle same-origin requests with caching
async function handleSameOriginRequest(request) {
    try {
        // Try cache first for static assets
        if (request.method === 'GET') {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                console.log('📋 Serving from cache:', request.url);
                return cachedResponse;
            }
        }
        
        // Fetch from network
        const networkResponse = await fetch(request);
        
        // Cache successful GET responses
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone()).catch(error => {
                console.warn('Could not cache response:', error);
            });
        }
        
        return networkResponse;
        
    } catch (error) {
        console.warn('Network request failed:', request.url, error);
        
        // Try to serve from cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📋 Serving fallback from cache:', request.url);
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return new Response(getOfflineHTML(), {
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        // Return network error for other requests
        return new Response('Network error', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
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
        console.warn('Background sync failed:', error);
    }
}

// Message handling from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: '1.1' });
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
                <p>It looks like you've lost your internet connection. When you're back online, you'll be able to browse our full July 2025 promotional catalog!</p>
                <p><strong>Contact us directly:</strong><br>📞 +27 31 332 7192</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
}

console.log('🚀 OZZ Promotional Catalog Service Worker (CORS Safe) loaded successfully');
