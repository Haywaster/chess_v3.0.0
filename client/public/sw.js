// public/sw.js
const CACHE_NAME = 'my-app-v1'

// Что кэшируем при установке
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.json']

// 1. Установка — кэшируем статику
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  // Сразу активируем, не ждя закрытия старых вкладок
  self.skipWaiting()
})

// 2. Активация — чистим старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      )
  )
  // Берём под контроль все вкладки сразу
  self.clients.claim()
})

// 3. Перехват запросов
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Навигационные запросы (переходы по страницам) — стратегия: сеть → кэш
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  // Игнорируем запросы расширений браузера и devtools
  if (
    ['chrome-extension:', 'moz-extension:'].includes(url.protocol) ||
    request.referrer?.includes('chrome-extension://')
  ) {
    return
  }

  // Не кешируем api запросы
  if (url.pathname.startsWith('/api')) {
    return
  }

  // Для статики (JS, CSS, картинки) — стратегия: кэш → сеть
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Есть в кэше — отдаём сразу
        return cached
      }

      // Нет в кэше — пробуем сеть
      return fetch(request).then(networkRes => {
        // Если ответ ок — кладём в кэш на будущее
        if (networkRes && networkRes.ok) {
          // Пропускаем частичные ответы (206)
          // Дополнительная проверка: Range запросы
          if (networkRes.status === 206 || event.request.headers.get('Range')) {
            return networkRes
          }

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkRes.clone())
          })
        }
        return networkRes
      })
    })
  )
})
