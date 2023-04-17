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

let currentDirection = moveRight;
let directionQueue = [];

// Change Direction With Keyboard
window.addEventListener('keydown', (event) => {
  console.log(event.key);
  if (event.key)
    switch (event.key) {
      case 'ArrowLeft':
      case 'A':
      case 'a':
        directionQueue.push(moveLeft);
        break;
      case 'ArrowRight':
      case 'D':
      case 'd':
        directionQueue.push(moveRight);
        break;
      case 'ArrowUp':
      case 'W':
      case 'w':
        directionQueue.push(moveUp);
        break;
      case 'ArrowDown':
      case 'S':
      case 's':
        directionQueue.push(moveDown);
        break;
      default:
        break;
    }
});

// Step
function step() {
  console.log(directionQueue);
  currentSnake.shift();
  let head = currentSnake[currentSnake.length - 1];
  let nextDirection = currentDirection;
  while (directionQueue.length > 0) {
    let candidateDirection = directionQueue.shift();
    if (!areOpposite(candidateDirection, currentDirection)) {
      nextDirection = candidateDirection;
      break;
    }
  }
  currentDirection = nextDirection;
  let nextHead = currentDirection(head);
  currentSnake.push(nextHead);
  drawSnake(currentSnake);
}

// Helper
function areOpposite(dir1, dir2) {
  if (dir1 === moveLeft && dir2 === moveRight) {
    return true;
  }
  if (dir1 === moveRight && dir2 === moveLeft) {
    return true;
  }
  if (dir1 === moveUp && dir2 === moveDown) {
    return true;
  }
  if (dir1 === moveDown && dir2 === moveUp) {
    return true;
  }
  return false;
}

// Initial Function Calls
drawSnake(currentSnake);
setInterval(() => {
  step();
}, 100);
