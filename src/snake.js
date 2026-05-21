import state from './state.js';
import { TILE_COUNT, GRID_SIZE, SPEED_INTERVAL, BASE_SPEED, SPEED_INCREMENT, SUPER_GLOW_SPAWN_CHANCE } from './config.js';
import { spawnFood } from './food.js';
import { spawnSuperGlow, applyGiftEffect } from './powerups.js';
import { spawnParticleBurst } from './particles.js';

export function update(scoreEl, endGameCallback) {
    state.direction = { ...state.nextDirection };

    const head = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y
    };

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        endGameCallback();
        return;
    }

    // Self collision
    if (state.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        endGameCallback();
        return;
    }

    state.snake.unshift(head);

    // Food collision
    if (head.x === state.food.x && head.y === state.food.y) {
        state.score++;
        scoreEl.textContent = state.score;
        spawnParticleBurst(state.food.x, state.food.y, null);
        spawnFood();

        // Progressive speed
        if (state.score % SPEED_INTERVAL === 0) {
            state.gameSpeed = BASE_SPEED + Math.floor(state.score / SPEED_INTERVAL) * SPEED_INCREMENT;
        }

        // Chance to spawn super glow (30%)
        if (Math.random() < SUPER_GLOW_SPAWN_CHANCE) {
            spawnSuperGlow();
        }
    } else {
        state.snake.pop();
    }

    // Super Glow collision
    if (state.superGlow && head.x === state.superGlow.x && head.y === state.superGlow.y) {
        const grow = state.superGlow.grow;
        state.score += grow;
        scoreEl.textContent = state.score;
        spawnParticleBurst(state.superGlow.x, state.superGlow.y, 'rainbow');
        for (let i = 0; i < grow - 1; i++) {
            state.snake.push({ ...state.snake[state.snake.length - 1] });
        }
        state.superGlow = null;
    }

    // Gift Box collision
    if (state.giftBox && head.x === state.giftBox.x && head.y === state.giftBox.y) {
        const effect = applyGiftEffect();
        scoreEl.textContent = state.score;
        spawnParticleBurst(state.giftBox.x, state.giftBox.y, effect.color);
        state.giftBox = null;
    }

    // Trail particles from snake tail
    const tail = state.snake[state.snake.length - 1];
    state.trailParticles.push({
        x: tail.x * GRID_SIZE + GRID_SIZE / 2,
        y: tail.y * GRID_SIZE + GRID_SIZE / 2,
        alpha: 0.6,
        size: 4 + Math.random() * 3
    });
}
