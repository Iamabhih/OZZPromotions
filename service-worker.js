// OZZ Promotional Catalog Service Worker - GitHub + Custom Domain Optimized
const CACHE_NAME = 'ozz-github-v1.0';
const DYNAMIC_CACHE = 'ozz-github-dynamic-v1.0';

// Only cache same-origin resources (your domain)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// External resources to bypass (let browser handle normally)
const BYPASS_PATTERNS = [
    'github.com',
    'githubusercontent.com',
    'googleapis.com',
    'google.com',
    'cdn.tailwindcss.com',
    'cdnjs.cloudflare.com'
];

// Install event - cache only local assets
self.addEventListener('install', event => {
    console.log('🔧 GitHub Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching local assets...');
                return Promise.allSettled(
                    STATIC_ASSETS.map(url => {
                        return cache.add(url).catch(error => {
                            console.warn('Could not cache:', url, error);
                        });
                    })
                );
            })
            .then(() => {
                console.log('✅ Local assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.warn('Cache installation completed with warnings:', error);
                return self.skipWaiting();
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('🚀 GitHub Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('ozz-') && 
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
                console.log('✅ GitHub Service Worker ready');
                return self.clients.claim();
            })
    );
});

// Fetch event - smart caching for GitHub setup
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Bypass external resources (GitHub, CDNs, APIs)
    if (BYPASS_PATTERNS.some(pattern => url.hostname.includes(pattern))) {
        return; // Let browser handle normally
    }
    
    // Only handle same-origin requests
    if (url.origin === location.origin) {
        event.respondWith(handleRequest(request));
    }
});

// Handle requests with caching strategy
async function handleRequest(request) {
    try {
        // For GET requests, try cache first
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
        
        // Try cache as fallback
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
        
        return new Response('Network error', { 
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Background sync for data updates
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'github-sync') {
        event.waitUntil(syncGitHubData());
    }
});

// Sync GitHub data when online
async function syncGitHubData() {
    try {
        console.log('📊 Syncing GitHub data...');
        
        // Try to refresh the Excel file from GitHub
        const response = await fetch('https://github.com/Iamabhih/OZZPromotions/raw/main/JULY%20PROMO.xlsx');
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put('https://github.com/Iamabhih/OZZPromotions/raw/main/JULY%20PROMO.xlsx', response.clone());
            
            // Notify clients of updated data
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({ 
                    type: 'GITHUB_DATA_UPDATED',
                    message: 'Product data refreshed from GitHub' 
                });
            });
            
            console.log('✅ GitHub data synced');
        }
    } catch (error) {
        console.warn('GitHub sync failed:', error);
    }
}

// Message handling from main thread
self.addEventListener('message', event => {
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({ version: '1.0' });
            }
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                if (event.ports && event.ports[0]) {
                    event.ports[0].postMessage({ success: true });
                }
            });
            break;
            
        case 'SYNC_GITHUB':
            // Trigger background sync
            self.registration.sync.register('github-sync').catch(error => {
                console.warn('Background sync registration failed:', error);
            });
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames
            .filter(name => name.startsWith('ozz-'))
            .map(name => caches.delete(name))
    );
}

// Offline fallback page
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

console.log('🚀 OZZ GitHub Service Worker loaded successfully');
