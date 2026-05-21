import state, { resetState } from './state.js';
import { setupInput } from './input.js';
import { spawnFood } from './food.js';
import { updatePowerUpTimers } from './powerups.js';
import { update } from './snake.js';
import { initRenderer, render } from './renderer.js';

// DOM elements
const canvas = document.getElementById('gameCanvas');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const gameOverEl = document.getElementById('game-over');
const startScreenEl = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const statusEffectsEl = document.getElementById('status-effects');

// Initialize renderer and input
initRenderer(canvas);
setupInput();

// Button listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    startScreenEl.classList.add('hidden');
    gameOverEl.classList.add('hidden');
    resetState();
    spawnFood();
    statusEffectsEl.innerHTML = '';
    scoreEl.textContent = '0';
    state.gameRunning = true;
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!state.gameRunning) return;
    requestAnimationFrame(gameLoop);

    const elapsed = timestamp - state.lastRenderTime;
    state.effectiveSpeed = Math.max(2, state.gameSpeed + state.speedModifier);
    const interval = 1000 / state.effectiveSpeed;

    // Always render for smooth particles/effects
    render();
    updatePowerUpTimers();
    updateStatusDisplay();

    if (elapsed >= interval) {
        state.lastRenderTime = timestamp;
        update(scoreEl, endGame);
    }
}

function updateStatusDisplay() {
    const now = performance.now();
    let html = '';
    for (const effect of state.activeEffects) {
        const secsLeft = Math.ceil((effect.endTime - now) / 1000);
        html += `<div class="status-effect" style="color:${effect.color}">${effect.label} ${secsLeft}s</div>`;
    }
    statusEffectsEl.innerHTML = html;
}

function endGame() {
    state.gameRunning = false;
    state.gameOverFade = 0;
    finalScoreEl.textContent = state.score;
    gameOverEl.classList.remove('hidden');
}
