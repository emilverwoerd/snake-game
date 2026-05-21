import state from './state.js';
import { GRID_SIZE, CANVAS_SIZE } from './config.js';
import { roundRect } from './utils.js';
import { updateParticles } from './particles.js';

let canvas, ctx;

export function initRenderer(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
}

export function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawTrailParticles();
    drawSnake();
    drawFood();
    drawSuperGlow();
    drawGiftBox();
    drawSuperGlowSparkles();
    drawParticles();

    state.foodPulse += 0.06;
    state.gridOffset += 0.15;
    updateParticles();
}

function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.04)';
    ctx.lineWidth = 0.5;

    const offset = state.gridOffset % GRID_SIZE;

    for (let x = offset; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = offset; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Subtle corner vignette
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    const len = state.snake.length;

    for (let i = 0; i < len; i++) {
        const seg = state.snake[i];
        const x = seg.x * GRID_SIZE;
        const y = seg.y * GRID_SIZE;
        const t = i / len;

        const hue = 180 - t * 120;
        const lightness = 55 - t * 15;
        const color = `hsl(${hue}, 100%, ${lightness}%)`;
        const glowColor = `hsla(${hue}, 100%, ${lightness}%, 0.6)`;

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = i === 0 ? 18 : 10;

        ctx.fillStyle = color;
        const padding = i === 0 ? 1 : 2;
        const radius = i === 0 ? 5 : 4;
        roundRect(ctx, x + padding, y + padding, GRID_SIZE - padding * 2, GRID_SIZE - padding * 2, radius);
        ctx.fill();

        if (i === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            roundRect(ctx, x + 5, y + 5, GRID_SIZE - 10, GRID_SIZE - 10, 3);
            ctx.fill();
            drawEyes(x, y);
        }
    }
    ctx.shadowBlur = 0;
}

function drawEyes(x, y) {
    const eyeSize = 3;
    let ex1, ey1, ex2, ey2;

    if (state.direction.x === 1) {
        ex1 = x + 14; ey1 = y + 6;
        ex2 = x + 14; ey2 = y + 13;
    } else if (state.direction.x === -1) {
        ex1 = x + 5; ey1 = y + 6;
        ex2 = x + 5; ey2 = y + 13;
    } else if (state.direction.y === -1) {
        ex1 = x + 6; ey1 = y + 5;
        ex2 = x + 13; ey2 = y + 5;
    } else {
        ex1 = x + 6; ey1 = y + 14;
        ex2 = x + 13; ey2 = y + 14;
    }

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ex1, ey1, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex2, ey2, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(ex1, ey1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex2, ey2, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawFood() {
    const x = state.food.x * GRID_SIZE + GRID_SIZE / 2;
    const y = state.food.y * GRID_SIZE + GRID_SIZE / 2;
    const pulse = Math.sin(state.foodPulse) * 3;
    const radius = 7 + pulse;

    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 20 + pulse * 2;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(0.3, '#ff4488');
    grad.addColorStop(1, '#ff0055');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255, 0, 85, ${0.3 + Math.sin(state.foodPulse * 1.5) * 0.2})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function drawSuperGlow() {
    if (!state.superGlow) return;

    const x = state.superGlow.x * GRID_SIZE + GRID_SIZE / 2;
    const y = state.superGlow.y * GRID_SIZE + GRID_SIZE / 2;
    const pulse = Math.sin(state.foodPulse * 2) * 4;
    const radius = 11 + pulse;

    const hue = (state.foodPulse * 60) % 360;

    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
    ctx.shadowBlur = 30 + pulse * 3;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, `hsl(${hue}, 100%, 75%)`);
    grad.addColorStop(0.7, `hsl(${(hue + 60) % 360}, 100%, 55%)`);
    grad.addColorStop(1, `hsl(${(hue + 120) % 360}, 100%, 45%)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 70%, ${0.5 + Math.sin(state.foodPulse * 3) * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius + 6 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `hsla(${(hue + 90) % 360}, 100%, 60%, ${0.3 + Math.sin(state.foodPulse * 2) * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius + 10 + pulse * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function drawSuperGlowSparkles() {
    for (const s of state.superGlowSparkles) {
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

function drawGiftBox() {
    if (!state.giftBox) return;

    const cx = state.giftBox.x * GRID_SIZE + GRID_SIZE / 2;
    const cy = state.giftBox.y * GRID_SIZE + GRID_SIZE / 2;
    const size = GRID_SIZE - 4;
    const half = size / 2;
    const rotation = state.foodPulse * 0.8;

    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 15 + Math.sin(state.foodPulse * 2) * 5;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.sin(rotation) * 0.15);

    const grad = ctx.createLinearGradient(-half, -half, half, half);
    grad.addColorStop(0, '#ffdd44');
    grad.addColorStop(0.5, '#ff8800');
    grad.addColorStop(1, '#cc5500');
    ctx.fillStyle = grad;
    roundRect(ctx, -half, -half, size, size, 3);
    ctx.fill();

    ctx.fillStyle = '#ff2266';
    ctx.fillRect(-2, -half, 4, size);
    ctx.fillRect(-half, -2, size, 4);

    ctx.fillStyle = '#ff2266';
    ctx.beginPath();
    ctx.arc(-4, -half + 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4, -half + 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 2);

    ctx.restore();
    ctx.shadowBlur = 0;
}

function drawParticles() {
    for (const p of state.particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

function drawTrailParticles() {
    for (const p of state.trailParticles) {
        ctx.globalAlpha = p.alpha * 0.4;
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
