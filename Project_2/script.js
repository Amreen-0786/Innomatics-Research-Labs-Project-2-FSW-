// brother-script.js
const themes = {
    "theme-fruits": ["🍎", "🍌", "🍇", "🍊", "🍓", "🍍", "🥭", "🍒"],
    "theme-emojis": ["😀", "😎", "🤩", "😍", "🥳", "😜", "🤪", "😇"],
    "theme-animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    "theme-planets": ["🌍", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓"],
    "theme-flags": ["🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇩🇪", "🇫🇷", "🇮🇳"]
  };
  
  let currentTheme = [];
  let openCards = [];
  let matches = 0;
  let points = 0;
  let gameTimer;
  let remainingTime = 30;
  
  const startScreen = document.querySelector(".start-screen");
  const gameScreen = document.querySelector(".game-screen");
  const cardBoard = document.querySelector(".card-board");
  const pointsDisplay = document.getElementById("points");
  const timeDisplay = document.getElementById("time");
  const endScreen = document.querySelector(".end-screen");
  const totalPointsDisplay = document.getElementById("total-points");
  const restartButton = document.getElementById("restart");
  
  document.querySelectorAll(".theme-buttons button").forEach(button => {
    button.addEventListener("click", () => {
      currentTheme = themes[button.id];
      beginGame();
    });
  });
  
  function beginGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    setupCards();
    startGameTimer();
    saveProgress();
  }
  
  function setupCards() {
    const cards = [...currentTheme, ...currentTheme];
    cards.sort(() => Math.random() - 0.5);
    cardBoard.innerHTML = "";
    cards.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.item = item;
      card.addEventListener("click", flipCard);
      cardBoard.appendChild(card);
    });
  
    const savedProgress = JSON.parse(localStorage.getItem("memoryGameProgress"));
    if (savedProgress && savedProgress.openCards) {
      savedProgress.openCards.forEach(item => {
        const card = Array.from(cardBoard.children).find(card => card.dataset.item === item);
        if (card) {
          card.classList.add("flipped");
          card.textContent = item;
          openCards.push(card);
        }
      });
    }
  }
  
  function flipCard(event) {
    const card = event.target;
    if (openCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      card.textContent = card.dataset.item;
      openCards.push(card);
      playAudio("card-flip-sound");
      saveProgress();
  
      if (openCards.length === 2) {
        setTimeout(checkMatch, 1000);
      }
    }
  }
  
  function checkMatch() {
    const [card1, card2] = openCards;
    if (card1.dataset.item === card2.dataset.item) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matches++;
      points += 10;
      pointsDisplay.textContent = points;
      playAudio("card-match-sound");
      saveProgress();
  
      if (matches === currentTheme.length) {
        endGame(true);
      }
    } else {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.textContent = "";
      card2.textContent = "";
    }
    openCards = [];
  }
  
  function startGameTimer() {
    gameTimer = setInterval(() => {
      remainingTime--;
      timeDisplay.textContent = remainingTime;
      saveProgress();
      if (remainingTime === 0) {
        endGame(false);
      }
    }, 1000);
  }
  
  function endGame(isWin) {
    clearInterval(gameTimer);
    endScreen.classList.remove("hidden");
    totalPointsDisplay.textContent = points;
    playAudio(isWin ? "card-match-sound" : "end-game-sound");
    clearProgress();
  }
  
  function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    audio.currentTime = 0;
    audio.play();
  }
  
  function saveProgress() {
    const progress = {
      points: points,
      remainingTime: remainingTime,
      matches: matches,
      openCards: openCards.map(card => card.dataset.item),
      currentTheme: currentTheme
    };
    localStorage.setItem("memoryGameProgress", JSON.stringify(progress));
  }
  
  function clearProgress() {
    localStorage.removeItem("memoryGameProgress");
  }
  
  window.addEventListener("load", () => {
    const savedProgress = JSON.parse(localStorage.getItem("memoryGameProgress"));
    if (savedProgress) {
      currentTheme = savedProgress.currentTheme;
      points = savedProgress.points;
      remainingTime = savedProgress.remainingTime;
      matches = savedProgress.matches;
      pointsDisplay.textContent = points;
      timeDisplay.textContent = remainingTime;
      beginGame();
    }
  });
  
  restartButton.addEventListener("click", () => {
    clearProgress();
    location.reload();
  });