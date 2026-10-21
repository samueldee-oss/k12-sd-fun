const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const messageEl = document.getElementById("message");
const rightPlayerLabelEl = document.getElementById("rightPlayerLabel");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const tournamentButton = document.getElementById("tournamentButton");
const difficultySelect = document.getElementById("difficulty");
const ballModeSelect = document.getElementById("ballMode");
const ballSpeedSelect = document.getElementById("ballSpeed");
const opponentModeSelect = document.getElementById("opponentMode");
const tournamentModeSelect = document.getElementById("tournamentMode");
const bracketTitleEl = document.getElementById("bracketTitle");
const bracketRecordEl = document.getElementById("bracketRecord");
const bracketRoundsEl = document.getElementById("bracketRounds");
const learningRowsEl = document.getElementById("learningRows");
const resetLearningButton = document.getElementById("resetLearningButton");

const keys = new Set();
const winScore = 7;
const paddle = {
  width: 14,
  height: 96,
  speed: 540
};
const bracketRounds = ["Quarterfinal", "Semifinal", "Final"];
const soloOpponents = ["CPU Rookie", "CPU Ace", "CPU Champion"];
const learningStorageKey = "pongLearningStats";
const difficultyLevels = [
  { value: "0.08", name: "Easy" },
  { value: "0.12", name: "Normal" },
  { value: "0.17", name: "Hard" }
];

const state = {
  running: false,
  over: false,
  playerScore: 0,
  cpuScore: 0,
  playerY: canvas.height / 2 - paddle.height / 2,
  cpuY: canvas.height / 2 - paddle.height / 2,
  balls: [],
  lastTime: 0,
  tournament: {
    active: false,
    mode: "off",
    round: 0,
    playerWins: 0,
    rightWins: 0,
    results: []
  },
  learning: loadLearningStats()
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createBall(index = 0) {
  const baseSpeed = Number(ballSpeedSelect.value);
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 9,
    vx: 0,
    vy: 0,
    speed: baseSpeed,
    baseSpeed,
    color: index === 0 ? "#f4f5f2" : "#7dd3fc"
  };
}

function resetBall(ball, direction = Math.random() > 0.5 ? 1 : -1, index = 0) {
  const angle = (Math.random() * 0.9 - 0.45);
  const offset = index === 0 ? -28 : 28;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2 + offset;
  ball.baseSpeed = Number(ballSpeedSelect.value);
  ball.speed = ball.baseSpeed;
  ball.vx = Math.cos(angle) * ball.speed * direction;
  ball.vy = Math.sin(angle) * ball.speed;
}

function prepareBalls(serving = false) {
  const count = Number(ballModeSelect.value);
  state.balls = Array.from({ length: count }, (_, index) => {
    const ball = createBall(index);
    if (serving) resetBall(ball, index === 0 ? 1 : -1, index);
    return ball;
  });
}

function resetGame() {
  state.running = false;
  state.over = false;
  state.playerScore = 0;
  state.cpuScore = 0;
  state.playerY = canvas.height / 2 - paddle.height / 2;
  state.cpuY = canvas.height / 2 - paddle.height / 2;
  prepareBalls(false);
  state.lastTime = 0;
  updateHud(state.tournament.active ? tournamentPrompt() : "Press Space to serve");
  updateBracket();
  updateLearningCurve();
  draw();
}

function updateHud(message) {
  playerScoreEl.textContent = state.playerScore;
  cpuScoreEl.textContent = state.cpuScore;
  rightPlayerLabelEl.textContent = rightPlayerName();
  messageEl.textContent = message;
}

function rightPlayerName() {
  if (state.tournament.active && state.tournament.mode === "solo") {
    return soloOpponents[state.tournament.round];
  }
  return opponentModeSelect.value === "player" ? "Player 2" : "CPU";
}

function tournamentPrompt() {
  if (!state.tournament.active) return "Press Space to serve";
  return `${bracketRounds[state.tournament.round]} vs ${rightPlayerName()}. Space to serve`;
}

function serve() {
  if (state.over) resetGame();
  state.running = true;
  prepareBalls(true);
  const opponent = currentOpponentMode() === "player" ? "two-player" : "CPU";
  const balls = Number(ballModeSelect.value) === 2 ? "Two-ball" : "One-ball";
  updateHud(state.tournament.active ? `${bracketRounds[state.tournament.round]} started` : `${balls} ${opponent}. First to 7 wins`);
}

function stopBalls() {
  state.balls.forEach((ball) => {
    ball.vx = 0;
    ball.vy = 0;
  });
}

function scorePoint(scoredByPlayer, ball) {
  if (scoredByPlayer) {
    state.playerScore += 1;
  } else {
    state.cpuScore += 1;
  }

  if (state.playerScore >= winScore || state.cpuScore >= winScore) {
    state.running = false;
    state.over = true;
    stopBalls();
    finishMatch(state.playerScore > state.cpuScore);
    return;
  }

  if (Number(ballModeSelect.value) === 2) {
    resetBall(ball, scoredByPlayer ? -1 : 1, state.balls.indexOf(ball));
    updateHud(scoredByPlayer ? "Point Player 1" : `Point ${rightPlayerName()}`);
    return;
  }

  state.running = false;
  stopBalls();
  prepareBalls(false);
  updateHud(scoredByPlayer ? "Point Player 1. Space to serve" : `Point ${rightPlayerName()}. Space to serve`);
}

function finishMatch(playerOneWon) {
  recordLearningResult(playerOneWon);

  if (!state.tournament.active) {
    updateHud(playerOneWon ? "Player 1 wins. Space to replay" : `${rightPlayerName()} wins. Space to replay`);
    return;
  }

  const roundName = bracketRounds[state.tournament.round];
  state.tournament.results[state.tournament.round] = playerOneWon ? "won" : "lost";
  if (playerOneWon) {
    state.tournament.playerWins += 1;
  } else {
    state.tournament.rightWins += 1;
  }

  updateBracket();

  if (state.tournament.mode === "solo" && !playerOneWon) {
    state.tournament.active = false;
    updateHud(`Eliminated in the ${roundName}. Start Tournament to try again`);
    updateBracket();
    return;
  }

  if (state.tournament.round >= bracketRounds.length - 1) {
    state.tournament.active = false;
    if (state.tournament.mode === "solo") {
      updateHud("Tournament champion. Start Tournament to replay");
    } else {
      const champ = state.tournament.playerWins > state.tournament.rightWins ? "Player 1" : "Player 2";
      updateHud(`${champ} wins the bracket. Start Tournament to replay`);
    }
    updateBracket();
    return;
  }

  state.tournament.round += 1;
  state.playerScore = 0;
  state.cpuScore = 0;
  state.playerY = canvas.height / 2 - paddle.height / 2;
  state.cpuY = canvas.height / 2 - paddle.height / 2;
  prepareBalls(false);
  updateHud(`${roundName} complete. ${tournamentPrompt()}`);
  updateBracket();
}

function movePlayer(dt) {
  let dy = 0;
  const canUseArrows = currentOpponentMode() !== "player";
  if (keys.has("KeyW") || (canUseArrows && keys.has("ArrowUp"))) dy -= paddle.speed * dt;
  if (keys.has("KeyS") || (canUseArrows && keys.has("ArrowDown"))) dy += paddle.speed * dt;
  state.playerY = clamp(state.playerY + dy, 18, canvas.height - paddle.height - 18);
}

function movePlayerTwo(dt) {
  let dy = 0;
  if (keys.has("ArrowUp")) dy -= paddle.speed * dt;
  if (keys.has("ArrowDown")) dy += paddle.speed * dt;
  state.cpuY = clamp(state.cpuY + dy, 18, canvas.height - paddle.height - 18);
}

function moveCpu(dt) {
  const tracking = Number(difficultySelect.value);
  const nearest = state.balls.reduce((closest, ball) => {
    if (!closest) return ball;
    return Math.abs(ball.x - canvas.width) < Math.abs(closest.x - canvas.width) ? ball : closest;
  }, null);
  const targetY = nearest ? nearest.y : canvas.height / 2;
  const target = targetY - paddle.height / 2;
  const eased = state.cpuY + (target - state.cpuY) * tracking * 60 * dt;
  state.cpuY = clamp(eased, 18, canvas.height - paddle.height - 18);
}

function bounceFromPaddle(ball, isPlayer) {
  const x = isPlayer ? 32 : canvas.width - 32 - paddle.width;
  const y = isPlayer ? state.playerY : state.cpuY;
  const overlapsX = isPlayer
    ? ball.x - ball.r <= x + paddle.width && ball.x > x
    : ball.x + ball.r >= x && ball.x < x + paddle.width;
  const overlapsY = ball.y + ball.r >= y && ball.y - ball.r <= y + paddle.height;

  if (!overlapsX || !overlapsY) return;

  const hit = (ball.y - (y + paddle.height / 2)) / (paddle.height / 2);
  const direction = isPlayer ? 1 : -1;
  ball.speed = Math.min(ball.speed + 22, 720);
  ball.vx = direction * ball.speed;
  ball.vy = hit * 390;
  ball.x = isPlayer ? x + paddle.width + ball.r : x - ball.r;
}

function update(dt) {
  movePlayer(dt);
  if (currentOpponentMode() === "player") movePlayerTwo(dt);

  if (!state.running) return;

  if (currentOpponentMode() !== "player") moveCpu(dt);

  state.balls.forEach((ball) => {
    if (!state.running) return;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - ball.r <= 14) {
      ball.y = 14 + ball.r;
      ball.vy *= -1;
    }

    if (ball.y + ball.r >= canvas.height - 14) {
      ball.y = canvas.height - 14 - ball.r;
      ball.vy *= -1;
    }

    bounceFromPaddle(ball, true);
    bounceFromPaddle(ball, false);

    if (ball.x + ball.r < 0) scorePoint(false, ball);
    if (ball.x - ball.r > canvas.width) scorePoint(true, ball);
  });
}

function drawCourt() {
  ctx.fillStyle = "#090b0d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#25313a";
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28);

  ctx.setLineDash([14, 14]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 24);
  ctx.lineTo(canvas.width / 2, canvas.height - 24);
  ctx.strokeStyle = "#34424b";
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddle(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, paddle.width, paddle.height);
}

function draw() {
  drawCourt();
  drawPaddle(32, state.playerY, "#6ee7b7");
  drawPaddle(canvas.width - 32 - paddle.width, state.cpuY, "#f97373");

  state.balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
  });

  if (!state.running) {
    ctx.fillStyle = "rgba(244, 245, 242, 0.82)";
    ctx.font = "20px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    const controls = currentOpponentMode() === "player" ? "P1: W/S   P2: Arrow Keys" : "W/S or Arrow Keys";
    ctx.fillText(controls, canvas.width / 2, canvas.height / 2 + 54);
  }
}

function currentOpponentMode() {
  if (state.tournament.active && state.tournament.mode === "solo") return "cpu";
  if (state.tournament.active && state.tournament.mode === "versus") return "player";
  return opponentModeSelect.value;
}

function startTournament() {
  const mode = tournamentModeSelect.value;
  if (mode === "off") {
    state.tournament.active = false;
    resetGame();
    updateHud("Choose a bracket mode first");
    updateBracket();
    return;
  }

  state.tournament.active = true;
  state.tournament.mode = mode;
  state.tournament.round = 0;
  state.tournament.playerWins = 0;
  state.tournament.rightWins = 0;
  state.tournament.results = [];
  opponentModeSelect.value = mode === "solo" ? "cpu" : "player";
  resetGame();
  updateHud(tournamentPrompt());
}

function updateBracket() {
  const tournament = state.tournament;
  if (!tournament.active && tournament.mode === "off") {
    bracketTitleEl.textContent = "Tournament off";
    bracketRecordEl.textContent = "Start a bracket when you are ready.";
  } else {
    const title = tournament.mode === "solo" ? "One player bracket" : "Two player bracket";
    const hasResults = tournament.results.length > 0;
    bracketTitleEl.textContent = tournament.active ? title : hasResults ? `${title} complete` : `${title} ready`;
    bracketRecordEl.textContent = hasResults
      ? `Player 1 ${tournament.playerWins} - ${tournament.rightWins} ${tournament.mode === "solo" ? "CPU" : "Player 2"}`
      : "Press Start Tournament to begin.";
  }

  bracketRoundsEl.innerHTML = "";
  bracketRounds.forEach((round, index) => {
    const item = document.createElement("li");
    const opponent = state.tournament.mode === "solo" ? soloOpponents[index] : "Player 1 vs Player 2";
    item.textContent = `${round}: ${opponent}`;
    if (state.tournament.active && index === state.tournament.round) item.classList.add("active");
    if (state.tournament.results[index]) item.classList.add(state.tournament.results[index]);
    bracketRoundsEl.appendChild(item);
  });
}

function emptyLearningStats() {
  return difficultyLevels.reduce((stats, difficulty) => {
    stats[difficulty.value] = { wins: 0, losses: 0 };
    return stats;
  }, {});
}

function loadLearningStats() {
  try {
    const stored = JSON.parse(localStorage.getItem(learningStorageKey));
    return { ...emptyLearningStats(), ...(stored || {}) };
  } catch {
    return emptyLearningStats();
  }
}

function saveLearningStats() {
  try {
    localStorage.setItem(learningStorageKey, JSON.stringify(state.learning));
  } catch {
    // Stats are optional; the game should keep working if storage is blocked.
  }
}

function recordLearningResult(playerOneWon) {
  if (currentOpponentMode() === "player") return;

  const difficulty = difficultySelect.value;
  if (!state.learning[difficulty]) state.learning[difficulty] = { wins: 0, losses: 0 };
  if (playerOneWon) {
    state.learning[difficulty].wins += 1;
  } else {
    state.learning[difficulty].losses += 1;
  }
  saveLearningStats();
  updateLearningCurve();
}

function updateLearningCurve() {
  learningRowsEl.innerHTML = "";

  difficultyLevels.forEach((difficulty) => {
    const record = state.learning[difficulty.value] || { wins: 0, losses: 0 };
    const total = record.wins + record.losses;
    const winRate = total > 0 ? Math.round((record.wins / total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "learning-row";
    row.innerHTML = `
      <span class="learning-name">${difficulty.name}</span>
      <span class="learning-bar"><span class="learning-fill" style="width: ${winRate}%"></span></span>
      <span class="learning-record">${record.wins}W / ${record.losses}L - ${winRate}%</span>
    `;
    learningRowsEl.appendChild(row);
  });
}

function resetLearningStats() {
  state.learning = emptyLearningStats();
  saveLearningStats();
  updateLearningCurve();
}

function loop(time) {
  const dt = Math.min((time - state.lastTime) / 1000 || 0, 0.033);
  state.lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "Space"].includes(event.code)) event.preventDefault();
  keys.add(event.code);
  if (event.code === "Space") {
    if (!state.running) serve();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

startButton.addEventListener("click", serve);
resetButton.addEventListener("click", resetGame);
tournamentButton.addEventListener("click", startTournament);
resetLearningButton.addEventListener("click", resetLearningStats);
ballModeSelect.addEventListener("change", resetGame);
ballSpeedSelect.addEventListener("change", resetGame);
opponentModeSelect.addEventListener("change", resetGame);
tournamentModeSelect.addEventListener("change", () => {
  state.tournament.active = false;
  state.tournament.mode = tournamentModeSelect.value;
  state.tournament.round = 0;
  state.tournament.playerWins = 0;
  state.tournament.rightWins = 0;
  state.tournament.results = [];
  resetGame();
});

resetGame();
requestAnimationFrame(loop);
