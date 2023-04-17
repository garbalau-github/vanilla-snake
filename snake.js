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
      let key = toKey([i, j]);
      canvas.appendChild(pixel);
      pixels.set(key, pixel);
    }
  }
})();

// Draw Snake
function drawSnake() {
  let foodKey = toKey(currentFood);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      let key = toKey([i, j]);
      let pixel = pixels.get(key);

      let background = 'white';

      if (key === foodKey) {
        background = 'purple';
      } else if (currentSnakeKeys.has(key)) {
        background = 'black';
      }

      pixel.style.background = background;
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
  [0, 5],
  [0, 6],
];

let currentSnakeKeys = toKeySet(currentSnake);
let currentFood = [15, 10];

// Movements
let moveRight = ([top, left]) => [top, left + 1];
let moveLeft = ([top, left]) => [top, left - 1];
let moveUp = ([top, left]) => [top - 1, left];
let moveDown = ([top, left]) => [top + 1, left];

let currentDirection = moveRight;
let directionQueue = [];

// Change Direction With Keyboard
window.addEventListener('keydown', (event) => {
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
  // Check if head goes out of bounds
  if (!checkValidHead(currentSnakeKeys, nextHead)) {
    stopGame();
    return;
  }
  currentSnake.push(nextHead);
  currentSnakeKeys = toKeySet(currentSnake);
  drawSnake();
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

function checkValidHead(keys, cell) {
  let [top, left] = cell;
  if (top < 0 || left < 0) {
    return false;
  }
  if (top >= ROWS || left >= COLS) {
    return false;
  }
  if (keys.has(toKey(cell))) {
    return false;
  }
  return true;
}

function stopGame() {
  canvas.style.borderColor = 'red';
  clearInterval(gameInterval);
}

function toKeySet(snake) {
  let set = new Set();
  for (let cell of snake) {
    let position = toKey(cell);
    set.add(position);
  }
  return set;
}

function toKey([left, top]) {
  return top + '_' + left;
}

// Initial Function Calls
drawSnake();
let gameInterval = setInterval(() => {
  step();
}, 100);
