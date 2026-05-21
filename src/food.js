import state from './state.js';
import { TILE_COUNT } from './config.js';

export function spawnFood() {
    let valid = false;
    let x, y;
    while (!valid) {
        x = Math.floor(Math.random() * TILE_COUNT);
        y = Math.floor(Math.random() * TILE_COUNT);
        valid = !state.snake.some(seg => seg.x === x && seg.y === y)
            && !(state.superGlow && state.superGlow.x === x && state.superGlow.y === y)
            && !(state.giftBox && state.giftBox.x === x && state.giftBox.y === y);
    }
    state.food.x = x;
    state.food.y = y;
}
