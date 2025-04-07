let numSlices = 12;  // Valor por defecto
let radius = 100;    // Radio de los círculos
let inputSlices;

function setup() {
  createCanvas(900, 300);
  background(255);
  stroke(0);
  strokeWeight(2);
  noLoop();

  inputSlices = createInput(numSlices.toString(), 'number');
  inputSlices.position(20, height + 20);
  inputSlices.style('width', '50px');
  inputSlices.input(updateSlices);
  
  drawAll();
}

function drawAll() {
  background(255);
  // Primer círculo: Ecuación punto-pendiente
  let center1 = createVector(150, 150);
  ellipse(center1.x, center1.y, radius * 2);
  drawPizzaSlices(center1, radius, numSlices, drawLinePuntoPendiente);
  textAlign(CENTER);
  text("Ecuación Punto-Pendiente", center1.x, center1.y + radius + 20);
  
  // Segundo círculo: Algoritmo DDA
  let center2 = createVector(450, 150);
  ellipse(center2.x, center2.y, radius * 2);
  drawPizzaSlices(center2, radius, numSlices, drawLineDDA);
  text("Algoritmo DDA", center2.x, center2.y + radius + 20);
  
  // Tercer círculo: Algoritmo Bresenham
  let center3 = createVector(750, 150);
  ellipse(center3.x, center3.y, radius * 2);
  drawPizzaSlices(center3, radius, numSlices, drawLineBresenham);
  text("Algoritmo Bresenham", center3.x, center3.y + radius + 20);
}

function updateSlices() {
  // Convertir el valor del input a número y actualizar numSlices
  let val = parseInt(inputSlices.value());
  if (!isNaN(val) && val > 0) {
    numSlices = val;
    redrawCanvas();
  }
}

function redrawCanvas() {
  clear();
  drawAll();
}

function drawPizzaSlices(center, radius, slices, drawFunc) {
  for (let i = 0; i < slices; i++) {
    let angle = TWO_PI / slices * i;
    // Calculamos el punto en la circunferencia
    let xEnd = center.x + radius * cos(angle);
    let yEnd = center.y + radius * sin(angle);
    // Dibujamos la línea desde el centro hasta el borde usando el algoritmo
    drawFunc(round(center.x), round(center.y), round(xEnd), round(yEnd));
  }
}

// Algoritmo 1: Ecuación Punto-Pendiente
function drawLinePuntoPendiente(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  if (abs(dx) >= abs(dy)) {
    let m = dy / dx;
    let b = y0 - m * x0;
    let start = min(x0, x1);
    let end = max(x0, x1);
    for (let x = start; x <= end; x++) {
      let y = m * x + b;
      point(x, round(y));
    }
  } else {
    let mInv = dx / dy;
    let b = x0 - mInv * y0;
    let start = min(y0, y1);
    let end = max(y0, y1);
    for (let y = start; y <= end; y++) {
      let x = mInv * y + b;
      point(round(x), y);
    }
  }
}

// Algoritmo 2: DDA (Digital Differential Analyzer)
function drawLineDDA(x0, y0, x1, y1) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let steps = max(abs(dx), abs(dy));
  let xIncrement = dx / steps;
  let yIncrement = dy / steps;
  let x = x0;
  let y = y0;
  for (let i = 0; i <= steps; i++) {
    point(round(x), round(y));
    x += xIncrement;
    y += yIncrement;
  }
}

// Algoritmo 3: Bresenham
function drawLineBresenham(x0, y0, x1, y1) {
  let dx = abs(x1 - x0);
  let dy = abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;
  
  while (true) {
    point(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}
