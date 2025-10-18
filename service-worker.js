// service-worker.js

// Версия кэша (меняй номер при обновлении файлов)
const CACHE_NAME = 'renovation-calculator-v5'; // Версия увеличена для сброса старого кэша

// Список файлов, которые кэшируются для офлайн-работы
const urlsToCache = [
  '/', // главная страница (корневой путь)
  '/index.html',
  '/manifest.json',
  
  // Font Awesome - ЛОКАЛЬНЫЙ CSS
  '/fa/all.min.css', // <-- ДОБАВЛЕНО ДЛЯ ОФФЛАЙН-РАБОТЫ ИКОНОК

  // Иконки PWA (пути и расширение скорректированы)
  '/assets/icons/icon-72.png',
  '/assets/icons/icon-96.png',
  '/assets/icons/icon-128.png',
  '/assets/icons/icon-144.png',
  '/assets/icons/icon-152.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.jpg' 
];

// Установка service worker и кэширование файлов
self.addEventListener('install', (event) => {
  console.log('🧱 Устанавливаем Service Worker и кэшируем файлы...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Обслуживание запросов из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если файл есть в кэше — берём оттуда, иначе из сети
        return response || fetch(event.request);
      })
  );
});

// Удаление старых кэшей при активации новой версии
self.addEventListener('activate', (event) => {
  console.log('♻️ Активируем новую версию Service Worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🗑 Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});