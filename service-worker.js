// Service Worker cho Văn kiện Đại hội
const CACHE_NAME = 'vankien-daihoi-v2';
const IMAGE_CACHE_NAME = 'vankien-images-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/1.svg',
  '/1.png',
  '/2.png',
  '/3.png',
  '/trongdong.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap&subset=vietnamese',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Skip waiting để activate ngay
  self.skipWaiting();
});

// Fetch event với chiến lược cache tối ưu
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Chiến lược Cache First cho ảnh (nhanh hơn trên mobile)
  if (request.destination === 'image' || 
      url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          if (cachedResponse) {
            // Trả về cache ngay, update cache ở background
            const fetchPromise = fetch(request).then(networkResponse => {
              if (networkResponse && networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            }).catch(() => cachedResponse);
            
            return cachedResponse;
          }
          
          // Không có cache, fetch và cache
          return fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  // Network First cho tài nguyên khác
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clone response để cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Nếu network fail, dùng cache
        return caches.match(request);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients để activate ngay
  return self.clients.claim();
});
