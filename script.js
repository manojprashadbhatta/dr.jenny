const bird = document.getElementById("bird");
const bacteria = document.getElementById("bacteria");
const pipesContainer = document.getElementById("pipes-container");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const tryAgainBtn = document.getElementById("try-again-btn");

let birdY = 300;
let velocity = 0;
let gravity = 0.18; // Less gravity for smooth rise/fall
let jumpPower = -5.5; // Balanced jump
let isGameRunning = false;
let score = 0;
let pipeSpeed = 2.3;
let pipeGap = 320; // Easier vertical gap
let pipeSpacing = 320; // Horizontal spacing between pipes

let pipes = [];

function startGame() {
  startBtn.style.display = "none";
  tryAgainBtn.style.display = "none";
  resetGame();
  isGameRunning = true;
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  birdY = 300;
  velocity = 0;
  score = 0;
  pipeSpeed = 2.3;
  pipes.forEach(pipe => {
    pipe.top.remove();
    pipe.bottom.remove();
  });
  pipes = [];
  pipesContainer.innerHTML = '';
  bird.style.top = birdY + "px";
  bacteria.style.top = birdY + 10 + "px";
  spawnPipe(400);
  scoreDisplay.innerText = score;
}

function jump() {
  if (isGameRunning) {
    velocity = jumpPower;
  }
}

function spawnPipe(xPosition) {
  const minGapTop = 100;
  const maxGapTop = 844 - pipeGap - 100;
  const gapTop = Math.floor(Math.random() * (maxGapTop - minGapTop + 1)) + minGapTop;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = gapTop + "px";
  topPipe.style.left = xPosition + "px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = (844 - gapTop - pipeGap) + "px";
  bottomPipe.style.left = xPosition + "px";

  pipesContainer.appendChild(topPipe);
  pipesContainer.appendChild(bottomPipe);
  pipes.push({ x: xPosition, top: topPipe, bottom: bottomPipe, scored: false });
}

function gameLoop() {
  if (!isGameRunning) return;

  velocity += gravity;
  birdY += velocity;
  if (birdY < 0) birdY = 0;
  if (birdY + 60 > 844) return endGame();

  bird.style.top = birdY + "px";
  bacteria.style.top = birdY + 10 + "px";

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    pipe.x -= pipeSpeed;
    pipe.top.style.left = pipe.x + "px";
    pipe.bottom.style.left = pipe.x + "px";

    const birdBox = {
      top: birdY,
      bottom: birdY + 60,
      left: 90,
      right: 150
    };

    const pipeBox = {
      left: pipe.x,
      right: pipe.x + 70,
      gapTop: parseInt(pipe.top.style.height),
      gapBottom: 844 - parseInt(pipe.bottom.style.height)
    };

    const hitTop = birdBox.right > pipeBox.left && birdBox.left < pipeBox.right && birdBox.top < pipeBox.gapTop;
    const hitBottom = birdBox.right > pipeBox.left && birdBox.left < pipeBox.right && birdBox.bottom > pipeBox.gapBottom;

    if (hitTop || hitBottom) return endGame();

    if (!pipe.scored && pipe.x + 70 < 90) {
      pipe.scored = true;
      score++;
      scoreDisplay.innerText = score;
      pipeSpeed *= 1.02; // 2% speed increase
    }

    if (pipe.x < -70) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(i, 1);
      i--;
    }
  }

  // Add new pipes when last one reaches spacing threshold
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 400 - pipeSpacing) {
    spawnPipe(400);
  }

  requestAnimationFrame(gameLoop);
}

function endGame() {
  isGameRunning = false;
  tryAgainBtn.style.display = "block";
}

// Event listeners
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);
startBtn.addEventListener("click", startGame);
tryAgainBtn.addEventListener("click", startGame);
