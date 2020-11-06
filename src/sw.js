/**
 * 安装、激活
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      caches.open('offline-caches').then((cache) => {
        return cache.addAll(['offline.html', 'images/offline.jpg']);
      }),
    ]),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.open('offline-caches').then((cache) => {
        return cache.addAll(['offline.html', 'images/offline.jpg']);
      }),
    ]),
  );
});

/**
 * 支持离线访问
 */
self.addEventListener('fetch', (event) => {
  console.info(event.request.headers.get('accept'));
  if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request.url).catch((error) => {
        return caches.match('offline.html');
      }),
    );
  } else if (event.request.method === 'GET' && event.request.headers.get('accept').includes('image')) {
    event.respondWith(
      fetch(event.request.url).catch((error) => {
        return caches.match('images/offline.jpg');
      }),
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});


/**
 * .jpg|.png 的图片替换为 .webp
 */
self.addEventListener('fetch', (event) => {
  if (/\.jpg$|.png$/.test(event.request.url)) {
    let supportWebp = false;
    if (event.request.headers.has('accept')) {
      supportWebp = event.request.headers.get('accept').includes('image/webp');
    }

    if (supportWebp) {
      const reqCopy = event.request.clone();
      const returnUrl = reqCopy.url.substr(0, reqCopy.url.lastIndexOf('.')) + '.webp';
      event.respondWith(fetch(returnUrl, { mode: 'no-cors' }));
    }
  }
});

/**
 * save-data 模式下资源加载
 */
self.addEventListener('fetch', (event) => {
  if (event.request.headers.get('save-data')) {
    if (event.request.url.includes('fonts.googleapis.com')) {
      event.respondWith(
        new Response('', {
          status: 417,
          statusText: 'Ignore fonts to save data.',
        }),
      );
    }
  }
});

/**
 * 在网速慢时返回408响应
 */
function timeout(delay) {
  if (typeof delay !== 'number') {
    throw new Error('delay must be a number.');
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        new Response('', {
          status: 408,
          statusText: 'Request timeout.',
        }),
      );
    }, delay);
  });
}

self.addEventListener('fetch', (event) => {
  if (/googleapis/.test(event.request.url)) {
    event.respondWith(Promise.race([timeout(10000), fetch(event.request.url)]));
  } else {
    event.respondWith(fetch(event.request.url));
  }
});
