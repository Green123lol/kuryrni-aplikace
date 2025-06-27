
const video = document.getElementById('video');
const addresses = document.getElementById('addresses');
let seen = new Set();

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Nelze spustit kameru: " + err));

function captureAndRecognize() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  Tesseract.recognize(canvas, 'eng', { logger: m => console.log(m) })
    .then(({ data: { text } }) => {
      const cleaned = text.trim().replace(/\s+/g, ' ');
      if (seen.has(cleaned)) {
        alert("Adresa již naskenována.");
      } else {
        seen.add(cleaned);
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = cleaned;
        addresses.appendChild(div);
      }
    })
    .catch(err => alert("OCR chyba: " + err));
}
