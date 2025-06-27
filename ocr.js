
const video = document.getElementById('video');
const addresses = document.getElementById('addresses');
let seen = new Set();

navigator.mediaDevices.getUserMedia({
  video: { facingMode: { exact: "environment" } }
})
.then(stream => video.srcObject = stream)
.catch(err => alert("Kamera: " + err));

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9\/ ]/gi, '').trim();
}

function fixHouseNumbers(str) {
  return str.replace(/(\d{3,5})(\d{2,4})/, '$1/$2');
}

function captureAndRecognize() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  Tesseract.recognize(canvas, 'ces', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const candidates = lines.filter(l => l.match(/\d{3}\s?\d{2}/));
      if (candidates.length === 0) {
        alert("❌ Adresa nenalezena.");
        return;
      }

      const raw = candidates[0];
      const cleaned = fixHouseNumbers(raw);
      const key = normalize(cleaned);

      if (seen.has(key)) {
        alert("⚠️ Adresa již naskenována.");
        return;
      }

      seen.add(key);
      const div = document.createElement('div');
      div.className = 'item';
      div.textContent = cleaned;
      addresses.appendChild(div);
    })
    .catch(err => alert("OCR chyba: " + err));
}
