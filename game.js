let voltage = 1000;
let level = 1;
let gameOver = false;
let score = 0;
let timeLeft = 30;  // 30 seconds per level
let gameInterval;

// DOM Elements
const voltageDisplay = document.getElementById("voltage");
const statusDisplay = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const levelProgressBar = document.getElementById("levelProgressBar");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Over Overlay Elements
const gameOverOverlay = document.getElementById("gameOverOverlay");
const gameOverMessage = document.getElementById("gameOverMessage");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton"); // Start button
const starRating = document.getElementById("starRating");

// Event Listeners
document.getElementById("stepUpButton").addEventListener("click", () => placeTransformer("step-up"));
document.getElementById("stepDownButton").addEventListener("click", () => placeTransformer("step-down"));
resumeButton.addEventListener("click", resumeGame);
restartButton.addEventListener("click", restartGame);
startButton.addEventListener("click", startGame);  // Start button event listener

// Start the game
function startGame() {
  clearGameInterface(); // Clear any previous game data before starting new game
  gameOver = false;
  voltage = 1000;
  level = 1;
  score = 0;
  timeLeft = 30;
  gameOverOverlay.style.display = "none"; // Hide the game over overlay
  startTimer();
  updateStatus();
}

// Start Timer for the game
function startTimer() {
  gameInterval = setInterval(() => {
    if (timeLeft > 0 && !gameOver) {
      timeLeft--;
      timerDisplay.textContent = timeLeft;  // Fix template literal error
    } else {
      clearInterval(gameInterval);
      gameOverScreen("Time's Up! Game Over.");
    }
  }, 1000);
}

// Update the game status (Voltage, score)
function updateStatus() {
  voltageDisplay.textContent = `${voltage}V`;  // Fix template literal error
  scoreDisplay.textContent = score;
  if (voltage > 2000) {
    gameOverScreen("Overload! Voltage too high.");
  } else if (voltage < 200) {
    gameOverScreen("Voltage too low.");
  }
  updateLevelProgressBar();
}

// Update the level progress bar
function updateLevelProgressBar() {
  const progress = (score / 100) * 100;
  levelProgressBar.style.width = `${progress}%`;  // Fix template literal error
}

// Handle transformer placement
function placeTransformer(type) {
  if (gameOver) return;

  const x = Math.random() * (canvas.width - 50);
  const y = Math.random() * (canvas.height - 50);

  if (type === "step-up") {
    voltage += 200;
    score += 10;
    drawTransformer(type, x, y);
  } else if (type === "step-down") {
    voltage -= 200;
    score += 10;
    drawTransformer(type, x, y);
  }
  updateStatus();
}

// Draw transformer (just for visual representation)
function drawTransformer(type, x, y) {
  ctx.fillStyle = type === "step-up" ? "green" : "red";
  ctx.fillRect(x, y, 50, 50);
}

// Game Over Handling
function gameOverScreen(message) {
  gameOver = true;
  gameOverMessage.textContent = message;
  gameOverOverlay.style.display = "flex";  // Show the game over overlay
}

// Resume the game (this can be used for pause/resume functionality)
function resumeGame() {
  gameOver = false;
  gameOverOverlay.style.display = "none"; // Hide the game over overlay
  startTimer();
  updateStatus();
}

// Restart the game
function restartGame() {
  clearGameInterface(); // Clear the interface before restarting
  gameOver = false;
  voltage = 1000;
  level = 1;
  score = 0;
  timeLeft = 30;
  gameOverOverlay.style.display = "none"; // Hide the game over overlay
  startTimer();
  updateStatus();
}

// Clear the game interface (reset all elements to initial state)
function clearGameInterface() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset voltage, score, timer, and level progress bar
  voltageDisplay.textContent = `${voltage}V`;  // Fix template literal error
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  levelProgressBar.style.width = '0%'; // Reset level progress

  // Reset game over elements
  gameOverOverlay.style.display = "none";
  gameOverMessage.textContent = "";

  // Optionally reset star rating
  starRating.textContent = '';
}

// Star Rating Function (as in your original code)
function rateGame(stars) {
  alert(`You rated the game with ${stars} stars.`);  // Fix template literal error
}
