const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart");

let cards = [];
let firstCard = null;
let secondCard = null;
let score = 0;
let timeLeft = 60;
let timer;
let level = 1;
const maxLevel = 5;

function generateCards(level) {
  const baseExpressions = [
    ["2 + 3", "5"],
    ["4 x 2", "8"],
    ["9 - 5", "4"],
    ["6 / 2", "3"],
    ["3 x 3", "9"],
    ["10 - 7", "3"],
    ["5 + 6", "11"],
    ["8 / 4", "2"],
    ["7 + 8", "15"],
    ["12 / 3", "4"],
    ["9 x 2", "18"],
    ["15 - 6", "9"]
  ];

  const pairsToUse = baseExpressions.slice(0, level * 2 + 2);
  const paired = [];
  pairsToUse.forEach(pair => {
    paired.push({ value: pair[0], match: pair[1], type: "expr" });
    paired.push({ value: pair[1], match: pair[0], type: "ans" });
  });

  return shuffle(paired);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  cards = generateCards(level);
  score = 0;
  timeLeft = 60 - (level - 1) * 5;
  board.innerHTML = "";
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);

  cards.forEach((cardData, i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = cardData.value;
    card.dataset.match = cardData.match;
    card.innerText = "?";
    card.addEventListener("click", () => flipCard(card, cardData));
    board.appendChild(card);
  });
}

function flipCard(card, cardData) {
  if (card.classList.contains("revealed") || secondCard) return;

  card.innerText = cardData.value;
  card.classList.add("revealed");

  if (!firstCard) {
    firstCard = { card, data: cardData };
  } else {
    secondCard = { card, data: cardData };
    setTimeout(checkMatch, 800);
  }
}

function checkMatch() {
  if (
    firstCard.data.value === secondCard.data.match &&
    secondCard.data.value === firstCard.data.match
  ) {
    score++;
    scoreDisplay.textContent = score;

    const revealed = document.querySelectorAll(".card.revealed").length;
    if (revealed === cards.length) {
      nextLevel();
    }
  } else {
    firstCard.card.classList.remove("revealed");
    secondCard.card.classList.remove("revealed");
    firstCard.card.innerText = "?";
    secondCard.card.innerText = "?";
  }
  firstCard = null;
  secondCard = null;
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timer);
    alert("Time's up! Your score: " + score + " | Level: " + level);
    level = 1;
    startGame();
  }
}

function nextLevel() {
  clearInterval(timer);
  if (level < maxLevel) {
    alert("Great! Moving to level " + (level + 1));
    level++;
    startGame();
  } else {
    alert("🏆 Congratulations! You finished all levels! Final Score: " + score);
    level = 1;
    startGame();
  }
}

restartBtn.addEventListener("click", () => {
  level = 1;
  startGame();
});

startGame();
