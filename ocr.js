
const video = document.getElementById('video');
const addresses = document.getElementById('addresses');
let seen = new Set();

navigator.mediaDevices.getUserMedia({
  video: { facingMode: { exact: "environment" } }
})
.then(stream => video.srcObject = stream)
.catch(err => alert("Kamera: " + err));

function captureAndRecognize() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  Tesseract.recognize(canvas, 'ces', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const addressLine = lines.find(line => line.match(/\d{3}\s?\d{2}/));
      if (!addressLine) {
        alert("❌ Adresa nenalezena.");
        return;
      }
      if (seen.has(addressLine)) {
        alert("⚠️ Adresa již naskenována.");
        return;
      }
      seen.add(addressLine);
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = addressLine;
      addresses.appendChild(div);
    })
    .catch(err => alert("OCR chyba: " + err));
}
