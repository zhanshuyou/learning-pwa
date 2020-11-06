let btnDom = document.getElementById('btn');
let contentFinalDom = document.getElementById('content-final');
let contentTmpDom = document.getElementById('content-tmp');
let recognition;

btnDom.onclick = () => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('不支持 SpeechRecognition API');
    return;
  }
  if (btnDom.innerText === '开始识别') {
    recognition = new SpeechRecognition();
    recognition.continuous = true; // 边说边识别
    recognition.interimResults = true; // 临时识别的结果也显示。通过isFinal来确定
    recognition.lang = 'cmn-Hans-CN'; // 中文普通话，遵循 BCP-47 规范
    recognition.start();
    btnDom.innerText = '停止识别';
    recognition.onstart = () => {
      contentFinalDom.innerText = '';
      contentTmpDom.innerText = '';
      console.log('识别开始');
    };
    recognition.onresult = (event) => {
      let content = '';
      let contentTmp = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          content += event.results[i][0].transcript;
        } else {
          contentTmp += event.results[i][0].transcript;
        }
      }
      contentFinalDom.innerText = content;
      contentTmpDom.innerText = contentTmp;
    };
    recognition.onerror = (event) => {
      console.log('识别错误', event);
    };
    recognition.onend = () => {
      console.log('识别结束');
    };
    return;
  }
  recognition.stop();
  recognition = null;
  btnDom.innerText = '开始识别';
};
