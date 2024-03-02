const canvas1 = document.getElementById('drawingCanvas1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('drawingCanvas2');
const ctx2 = canvas2.getContext('2d');

let isDrawing1 = false;
let isDrawing2 = false;

canvas1.addEventListener('mousedown', () => isDrawing1 = true);
canvas1.addEventListener('mouseup', () => isDrawing1 = false);
canvas1.addEventListener('mousemove', draw1);

canvas2.addEventListener('mousedown', () => isDrawing2 = true);
canvas2.addEventListener('mouseup', () => isDrawing2 = false);
canvas2.addEventListener('mousemove', draw2);

function draw1(e) {
  if (!isDrawing1) return;
  draws1(e);
}

function draw2(e) {
  if (!isDrawing2) return;
  draws2(e, ctx2);
}

function draws1(e) {
  const x = e.clientX - canvas1.getBoundingClientRect().left;
  const y = e.clientY - canvas1.getBoundingClientRect().top;
  ctx1.fillStyle = '#000';
  ctx1.beginPath();
  ctx1.arc(x, y, 5, 0, Math.PI * 2);
  ctx1.fill();
}

function draws2(e) {
  const x = e.clientX - canvas2.getBoundingClientRect().left;
  const y = e.clientY - canvas2.getBoundingClientRect().top;
  ctx2.fillStyle = '#000';
  ctx2.beginPath();
  ctx2.arc(x, y, 5, 0, Math.PI * 2);
  ctx2.fill();
}
function predictDigit1() {
  predictDigit(1);
}

function predictDigit2() {
  predictDigit(2);
}

function clearCanvas1() {
  clearCanvas(1);
}

function clearCanvas2() {
  clearCanvas(2);
}

function predictDigit(canvasNumber) {
  const canvas = canvasNumber === 1 ? canvas1 : canvas2;
  const ctx = canvas.getContext('2d');
  const dataUrl = canvas.toDataURL();
  fetch('/predict', {
    method: 'POST',
    body: JSON.stringify({ image: dataUrl }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(result => {
    const predictionResultId = `predictionResult${canvasNumber}`;
    document.getElementById(predictionResultId).innerHTML = `Predicted Digit: ${result.predicted_class}, Value: ${result.predicted_value}`;
  })
  .catch(error => console.error('Error:', error));
}

function clearCanvas(canvasNumber) {
  const canvas = canvasNumber === 1 ? canvas1 : canvas2;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const predictionResultId = `predictionResult${canvasNumber}`;
  document.getElementById(predictionResultId).innerHTML = '';
}
