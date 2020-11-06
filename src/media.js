document.getElementById('btnVi').onclick = () => {
  getStream('video', document.getElementById('vi'));
};

document.getElementById('btnAu').onclick = () => {
  getStream('audio', document.getElementById('au'));
};

function getStream(type, el) {
  if (!navigator.mediaDevices) {
    alert('mediaDevices API 不支持');
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ [type]: true })
    .then((stream) => {
      vStream = stream;
      if ('srcObject' in el) {
        el.srcObject = stream;
      } else {
        el.src = window.URL.createObjectURL(stream);
      }
      el.onloadedmetadata = () => {
        el.play();
      };
    })
    .catch((err) => {
      console.log('捕获视频错误：', err);
    });
}

let vStream;
document.getElementById('btnPhoto').onclick = () => {
  takePhoto(vStream);
};

function takePhoto(stream) {
  if (!stream) {
    alert('请先进行视频捕获。');
    return;
  }
  if (!('ImageCapture' in window)) {
    alert('ImageCapture API 不支持。');
    return;
  }
  new ImageCapture(stream.getVideoTracks()[0])
    .takePhoto()
    .then((data) => {
      document.getElementById('photo').src = URL.createObjectURL(data);
    })
    .catch((err) => console.log('截图错误: ', err));
}

let vRecorder;
let recorderData = [];
document.getElementById('btnRecord').onclick = () => {
  startRecord(vStream);
};
document.getElementById('btnDownload').onclick = () => {
  download();
};

function startRecord(el) {
  if (!navigator.mediaDevices) {
    alert('mediaDevices API 不支持');
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    try {
      vRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      console.log('创建 MediaRecorder: ', vRecorder);
    } catch (e) {
      return console.error('创建 MediaRecorder 失败：', e);
    }

    vRecorder.ondataavailable = (e) => {
      if (e.data.size == 0) {
        return;
      }
      recorderData.push(e.data);
    };
    vRecorder.start(100); // 设置 ondataavailable 的触发间隔
  });
}

function download() {
  if (!vStream || !vRecorder) {
    alert('请先捕获视频');
    return;
  }
  console.log('开始下载');
  vRecorder.stop();
  vStream.getTracks()[0].stop();
  vStream.getVideoTracks()[0].stop();
  const aDom = document.createElement('a');
  document.body.appendChild(aDom);
  aDom.style = 'display: none';
  aDom.href = URL.createObjectURL(new Blob(recorderData, { type: 'video/webm' }));
  aDom.download = 'download.webm';
  aDom.click();
  recorderData = [];
  vStream = vRecorder = null;
}
