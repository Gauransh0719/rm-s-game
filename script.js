const man = document.getElementById('man');
const soup = document.getElementById('soup');
const scoreDisplay = document.getElementById('score-value');
const endMessage = document.getElementById('end-message');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let gameEnd = false;
let isDragging = false;
let initialX = 0;
let xOffset = 0;

// Function to update the position of the man
function updateManPosition(x) {
  man.style.left = x + 'px';
}

// Function to generate random position for soup
function generateRandomPosition() {
  return Math.floor(Math.random() * 350); // Adjust according to game container width
}

// Function to move soup down and check for collision
function moveSoup() {
  if (!gameEnd) {
    let soupX = generateRandomPosition();
    soup.style.left = soupX + 'px';
    soup.style.top = '0px';

    const soupInterval = setInterval(() => {
      const manX = parseInt(window.getComputedStyle(man).getPropertyValue('left'));
      const manY = parseInt(window.getComputedStyle(man).getPropertyValue('bottom'));
      const soupY = parseInt(window.getComputedStyle(soup).getPropertyValue('top'));

      if (soupY > 350) {
        clearInterval(soupInterval);
        if (!gameEnd) {
          endGame();
        }
      }

      if (soupY > 300 && soupY < 400 && soupX > manX && soupX < manX + 50 && manY < 20) {
        score++;
        scoreDisplay.innerText = score;
        soup.style.top = '0px';
        soupX = generateRandomPosition();
        soup.style.left = soupX + 'px';
      } else {
        soup.style.top = soupY + 1 + 'px';
      }
    }, 10);
  }
}

// Function to end the game
function endGame() {
  gameEnd = true;
  endMessage.innerText = 'Game Over. Score: ' + score;
  endMessage.style.display = 'block';
}

// Restart the game
restartBtn.addEventListener('click', () => {
  score = 0;
  scoreDisplay.innerText = score;
  endMessage.style.display = 'none';
  gameEnd = false;
  moveSoup();
});

// Event listeners for dragging the man with both mouse and touch events
man.addEventListener('mousedown', startDragging);
man.addEventListener('touchstart', startDragging);

document.addEventListener('mousemove', dragMan);
document.addEventListener('touchmove', dragMan);

document.addEventListener('mouseup', stopDragging);
document.addEventListener('touchend', stopDragging);

// Functions for dragging the man
function startDragging(e) {
  if (!gameEnd) {
    isDragging = true;
    initialX = e.clientX || e.touches[0].clientX;
    xOffset = initialX - man.getBoundingClientRect().left;
  }
}

function dragMan(e) {
  if (isDragging) {
    let x = (e.clientX || e.touches[0].clientX) - initialX + xOffset;
    const gameContainer = document.getElementById('game-container');
    const maxX = gameContainer.offsetWidth - man.offsetWidth;
    x = Math.max(0, Math.min(x, maxX));
    updateManPosition(x);
  }
}

function stopDragging() {
  isDragging = false;
}

// Start the game
moveSoup();
