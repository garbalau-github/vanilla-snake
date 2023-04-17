// DOM References
const canvas = document.getElementById('canvas');

// Constants
let ROWS = 30;
let COLS = 50;
let PIXEL = 10;
let pixels = new Map();

// Initialize Canvas with Rows and Columns
(function initializeCanvas() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let pixel = document.createElement('div');
      pixel.style.position = 'absolute';
      pixel.style.border = '0.5px solid #aaa';
      pixel.style.left = j * PIXEL + 'px';
      pixel.style.top = i * PIXEL + 'px';
      pixel.style.width = PIXEL + 'px';
      pixel.style.height = PIXEL + 'px';
      let position = i + '_' + j;
      canvas.appendChild(pixel);
      pixels.set(position, pixel);
    }
  }
})();

// Draw Snake
function drawSnake(snake) {
  let snakePositions = new Set();
  for (let [top, left] of snake) {
    let position = top + '_' + left;
    snakePositions.add(position);
  }
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let position = i + '_' + j;
      let pixel = pixels.get(position);
      pixel.style.background = snakePositions.has(position) ? 'black' : 'white';
    }
  }
}

// Initial Position
let currentSnake = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
];

// Movements
let moveRight = ([top, left]) => [top, left + 1];
let moveLeft = ([top, left]) => [top, left - 1];
let moveUp = ([top, left]) => [top - 1, left];
let moveDown = ([top, left]) => [top + 1, left];

let currentDirection = moveDown;
let lastDirection = currentDirection;

// Change Direction With Keyboard
window.addEventListener('keydown', (event) => {
  console.log(event.key);
  switch (event.key) {
    case 'ArrowLeft':
    case 'A':
    case 'a':
      if (lastDirection !== moveRight) {
        currentDirection = moveLeft;
      }
      break;
    case 'ArrowRight':
    case 'D':
    case 'd':
      if (lastDirection !== moveLeft) {
        currentDirection = moveRight;
      }
      break;
    case 'ArrowUp':
    case 'W':
    case 'w':
      if (lastDirection !== moveDown) {
        currentDirection = moveUp;
      }
      break;
    case 'ArrowDown':
    case 'S':
    case 's':
      if (lastDirection !== moveUp) {
        currentDirection = moveDown;
      }
      break;
    default:
      break;
  }
});

// Step
function step() {
  currentSnake.shift();
  let head = currentSnake[currentSnake.length - 1];
  let nextHead = currentDirection(head);
  lastDirection = currentDirection;
  currentSnake.push(nextHead);
  drawSnake(currentSnake);
}

// Initial Function Calls
drawSnake(currentSnake);
setInterval(() => {
  step();
}, 100);
