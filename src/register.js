const serviceWorker = {
  register() {
    if ('serviceWorker' in window.navigator) {
      navigator.serviceWorker
        .register('./sw.js', {
          scope: './',
          updateViaCache: 'none',
        })
        .then((swReg) => {
          console.info('✅✅✅');
          console.info('swReg: ', swReg);

          console.info('ServiceWorker: ', navigator.serviceWorker.controller);

          swReg.onupdatefound = () => {
            console.info('onupdatefound');
            const workerInstalling = swReg.installing;

            if (!workerInstalling) {
              return;
            }

            workerInstalling.onstatechange = () => {
              console.info(`===> worker 状态 ${workerInstalling.state}`);
            };
          };
        })
        .catch((err) => {
          console.error('❌❌❌');
        });
    }
  },
  unregister() {
    navigator.serviceWorker
      .getRegistration()
      .then((swReg) => {
        if (!swReg) {
          return Promise.resolve(true);
        }
        return swReg.unregister();
      })
      .then((result) => {
        if (result) {
          alert('卸载成功');
        }
      });
  },
};

serviceWorker.register();

if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.onstatechange = (state) => {
    console.info('controller state: ', state);
  };
}

navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
  console.info('ready registration: ', serviceWorkerRegistration);
});

navigator.serviceWorker.onmessage = () => {
  console.info('message');
};

navigator.serviceWorker.oncontrollerchange = (controller) => {
  console.info('controller 2: ', controller);
};

navigator.serviceWorker.onmessageerror = () => {
  console.info('onmessageerror');
};

window.addEventListener('beforeinstallprompt', function (e) {
  // log the platforms provided as options in an install prompt
  console.log(e.platforms); // e.g., ["web", "android", "windows"]
  e.userChoice.then(
    function (outcome) {
      console.log(outcome); // either "installed", "dismissed", etc.
    },
    (error) => {
      console.error(error);
    },
  );
});

Notification.requestPermission()
  .then(() => {
    // const n = new Notification('今日新闻', {
    //   body: '假期到来旅客人数突破新高~',
    //   icon: 'icon.png',
    //   requireInteraction: true,
    //   data: {
    //     nav: 'https://xxx.news.com/xxx.html', //自定义的属性
    //   },
    // });
    // n.onclick = (event) => {
    //   n.close();
    //   if (event.currentTarget.data.nav) {
    //     //获取自定义的属性
    //     window.open(event.currentTarget.data.nav);
    //   }
    // };
  })
  .catch(() => {
    alert('通知权限已禁止，请设置打开权限');
  });

/**
 * 网络状态监听
 */
window.addEventListener('online', () => {
  const onlineEle = document.querySelector('#online');
  const offlineEle = document.querySelector('#offline');

  onlineEle.style.display = 'block';
  offlineEle.style.display = 'none';

  setTimeout(() => {
    onlineEle.style.display = 'none';
  }, 3000);
});

window.addEventListener('offline', () => {
  const onlineEle = document.querySelector('#online');
  const offlineEle = document.querySelector('#offline');

  onlineEle.style.display = 'none';
  offlineEle.style.display = 'block';

  setTimeout(() => {
    offlineEle.style.display = 'none';
  }, 3000);
});

let normalTitle = document.title;
document.addEventListener('visibilitychange', () => {
  //浏览器tab切换监听事件
  if (document.visibilityState == 'visible') {
    //状态判断：显示（切换到当前页面）
    // 切换到页面执行事件
    document.title = normalTitle;
  } else if (document.visibilityState == 'hidden') {
    //状态判断：隐藏（离开当前页面）
    // 离开页面执行事件
    normalTitle = document.title;
    document.title = '😂 你要离开我吗';
  }
});
