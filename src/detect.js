const barcodeDetector = new BarcodeDetector();
const image = document.getElementById('image');

document.getElementById('btnDetect').onclick = () => {
  detectImage(image);
};

function detectImage(image) {
  barcodeDetector
    .detect(image)
    .then((barcodes) => {
      console.info('barcodes: ', barcodes);
      let result = '';
      barcodes.forEach((barcode) => {
        result += barcode.rawValue;
      });
      document.querySelector('.detectResult').innerHTML = result;
    })
    .catch(() => {
      alert('Detect Wrong~');
    });
}
