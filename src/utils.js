import state from './state.js';
import { TILE_COUNT } from './config.js';

export function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

export function isOccupied(x, y) {
    if (state.snake.some(seg => seg.x === x && seg.y === y)) return true;
    if (state.food.x === x && state.food.y === y) return true;
    if (state.superGlow && state.superGlow.x === x && state.superGlow.y === y) return true;
    if (state.giftBox && state.giftBox.x === x && state.giftBox.y === y) return true;
    return false;
}

export function findFreePosition() {
    let x, y, attempts = 0;
    do {
        x = Math.floor(Math.random() * TILE_COUNT);
        y = Math.floor(Math.random() * TILE_COUNT);
        attempts++;
    } while (isOccupied(x, y) && attempts < 100);
    if (attempts >= 100) return null;
    return { x, y };
}
