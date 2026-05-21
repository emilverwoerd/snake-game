import { BASE_SPEED, TILE_COUNT } from './config.js';

// Centralized game state
const state = {
    snake: [],
    food: { x: 0, y: 0 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
    gameRunning: false,
    lastRenderTime: 0,
    gameSpeed: BASE_SPEED,
    effectiveSpeed: BASE_SPEED,
    speedModifier: 0,
    particles: [],
    trailParticles: [],
    gridOffset: 0,
    foodPulse: 0,
    gameOverFade: 0,

    // Power-up state
    superGlow: null,        // { x, y, spawnTime, grow }
    giftBox: null,          // { x, y, spawnTime }
    lastGiftCheckTime: 0,
    firstGiftCheckDone: false,
    giftHasSpawnedOnce: false,
    activeEffects: [],      // { type, endTime, label, color }
    superGlowSparkles: [],
    gameStartTime: 0
};

export function resetState() {
    state.snake = [
        { x: Math.floor(TILE_COUNT / 2), y: Math.floor(TILE_COUNT / 2) },
        { x: Math.floor(TILE_COUNT / 2) - 1, y: Math.floor(TILE_COUNT / 2) },
        { x: Math.floor(TILE_COUNT / 2) - 2, y: Math.floor(TILE_COUNT / 2) }
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    state.gameSpeed = BASE_SPEED;
    state.effectiveSpeed = BASE_SPEED;
    state.speedModifier = 0;
    state.particles = [];
    state.trailParticles = [];
    state.gameOverFade = 0;
    state.superGlow = null;
    state.giftBox = null;
    state.activeEffects = [];
    state.superGlowSparkles = [];
    state.lastGiftCheckTime = 0;
    state.firstGiftCheckDone = false;
    state.giftHasSpawnedOnce = false;
    state.gameStartTime = performance.now();
    state.lastRenderTime = 0;
}

export default state;
