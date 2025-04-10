let numSlices = 12;
let radius = 100;
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
  
  // Círculo 1: Ecuación Punto-Pendiente
  let center1 = createVector(150, 150);
  drawCircleMidpoint(center1.x, center1.y, radius);
  drawPizzaSlices(center1, radius, numSlices, drawLinePuntoPendiente);
  textAlign(CENTER);
  text("Ecuación Punto-Pendiente", center1.x, center1.y + radius + 20);
  
  // Círculo 2: Algoritmo DDA
  let center2 = createVector(450, 150);
  drawCircleMidpoint(center2.x, center2.y, radius);
  drawPizzaSlices(center2, radius, numSlices, drawLineDDA);
  text("Algoritmo DDA", center2.x, center2.y + radius + 20);
  
  // Círculo 3: Algoritmo Bresenham
  let center3 = createVector(750, 150);
  drawCircleMidpoint(center3.x, center3.y, radius);
  drawPizzaSlices(center3, radius, numSlices, drawLineBresenham);
  text("Algoritmo Bresenham", center3.x, center3.y + radius + 20);
}

function updateSlices() {
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
    let xEnd = center.x + radius * cos(angle);
    let yEnd = center.y + radius * sin(angle);
    drawFunc(round(center.x), round(center.y), round(xEnd), round(yEnd));
  }
}

// ---------------------
function drawCircleMidpoint(xc, yc, r) {
  let x = 0;
  let y = r;
  let p = 5 / 4 - r;
  plotCirclePoints(xc, yc, x, y);
  
  while (x < y) {
    x++;
    if (p < 0) {
      p = p + 2 * x + 1;
    } else {
      y--;
      p = p + 2 * x + 1 - 2 * y;
    }
    plotCirclePoints(xc, yc, x, y);
  }
}

function plotCirclePoints(xc, yc, x, y) {
  point(xc + x, yc + y);
  point(xc - x, yc + y);
  point(xc + x, yc - y);
  point(xc - x, yc - y);
  point(xc + y, yc + x);
  point(xc - y, yc + x);
  point(xc + y, yc - x);
  point(xc - y, yc - x);
}

// ---------------------
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

// ---------------------
// Algoritmo 2: DDA
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

// ---------------------
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
