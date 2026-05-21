import state from './state.js';
import { GRID_SIZE } from './config.js';

export function spawnParticleBurst(gridX, gridY, colorTheme) {
    const cx = gridX * GRID_SIZE + GRID_SIZE / 2;
    const cy = gridY * GRID_SIZE + GRID_SIZE / 2;
    const count = colorTheme === 'rainbow' ? 35 : 20;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        let color;
        if (colorTheme === 'rainbow') {
            color = `hsl(${(i / count) * 360}, 100%, 65%)`;
        } else if (colorTheme) {
            color = colorTheme;
        } else {
            color = `hsl(${Math.random() * 60 + 160}, 100%, 60%)`;
        }
        state.particles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            size: 3 + Math.random() * 4,
            color: color
        });
    }
}

export function updateParticles() {
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        p.size *= 0.96;
        if (p.alpha <= 0) state.particles.splice(i, 1);
    }

    for (let i = state.trailParticles.length - 1; i >= 0; i--) {
        const p = state.trailParticles[i];
        p.alpha -= 0.04;
        p.size *= 0.92;
        if (p.alpha <= 0) state.trailParticles.splice(i, 1);
    }
}
