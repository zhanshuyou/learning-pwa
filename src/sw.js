self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
