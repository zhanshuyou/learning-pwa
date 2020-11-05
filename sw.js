
/**
 * .jpg|.png 的图片替换为 .webp
 */
self.addEventListener('fetch', (event) => {
  if (/\.jpg$|.png$/.test(event.target.url)) {
    let supportWebp = false;
    if (event.target.headers.has('accept')) {
      supportWebp = event.target.headers.get('accept').includes('image/webp');
    }

    if (supportWebp) {
      const reqCopy = event.request.clone();
      const returnUrl = reqCopy.url.substr(0, reqCopy.url.lastIndexOf('.')) + '.webp';
      event.responseWith(fetch(returnUrl, { mode: 'no-cors' }));
    }
  }
});

/**
 * save-data 模式下资源加载
 */
self.addEventListener('fetch', (event) => {
  if (event.request.headers.get('save-data')) {
    if (event.request.url.includes('fonts.googleapis.com')) {
      event.responseWith(
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
    throw new Error('delay must be a number.')
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response('', {
        status: 408,
        statusText: 'Request timeout.'
      }))
    }, delay)
  })
}

self.addEventListener('fetch', (event) => {
  if (/googleapis/.test(event.target.url)) {
    event.responseWith(Promise.race([timeout(10000), fetch(event.request.url)]))
  } else {
    event.responseWith(fetch(event.request.url))
  }
})
