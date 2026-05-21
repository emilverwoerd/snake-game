import state from './state.js';
import {
    SUPER_GLOW_LIFETIME, SUPER_GLOW_GROW_MIN, SUPER_GLOW_GROW_MAX,
    GIFT_BOX_SPAWN_CHANCE, GIFT_BOX_FIRST_CHECK, GIFT_BOX_CHECK_INTERVAL,
    GIFT_BOX_GUARANTEED_TIME, GIFT_BOX_LIFETIME,
    GIFT_GROW_AMOUNT, GIFT_SHRINK_AMOUNT, GIFT_MIN_SNAKE_LENGTH,
    GIFT_SPEED_DURATION, GIFT_SPEED_BOOST, GIFT_SLOW_REDUCTION,
    GRID_SIZE
} from './config.js';
import { findFreePosition } from './utils.js';

export function spawnSuperGlow() {
    if (state.superGlow) return;
    const pos = findFreePosition();
    if (!pos) return;
    state.superGlow = {
        x: pos.x,
        y: pos.y,
        spawnTime: performance.now(),
        grow: SUPER_GLOW_GROW_MIN + Math.floor(Math.random() * (SUPER_GLOW_GROW_MAX - SUPER_GLOW_GROW_MIN + 1))
    };
}

export function spawnGiftBox() {
    if (state.giftBox) return;
    const pos = findFreePosition();
    if (!pos) return;
    state.giftBox = {
        x: pos.x,
        y: pos.y,
        spawnTime: performance.now()
    };
    state.giftHasSpawnedOnce = true;
}

export function updatePowerUpTimers() {
    const now = performance.now();
    const elapsed = now - state.gameStartTime;

    // Despawn super glow after lifetime
    if (state.superGlow && now - state.superGlow.spawnTime >= SUPER_GLOW_LIFETIME) {
        state.superGlow = null;
    }

    // Despawn gift box after lifetime
    if (state.giftBox && now - state.giftBox.spawnTime >= GIFT_BOX_LIFETIME) {
        state.giftBox = null;
    }

    // Gift box spawn check — first at 5 seconds, then every 8 seconds
    const checkInterval = state.firstGiftCheckDone ? GIFT_BOX_CHECK_INTERVAL : GIFT_BOX_FIRST_CHECK;

    if (elapsed - state.lastGiftCheckTime >= checkInterval) {
        state.lastGiftCheckTime = elapsed;
        state.firstGiftCheckDone = true;
        if (Math.random() < GIFT_BOX_SPAWN_CHANCE) {
            spawnGiftBox();
        }
    }

    // Guaranteed first gift box at 15 seconds if none has appeared yet
    if (!state.giftHasSpawnedOnce && elapsed >= GIFT_BOX_GUARANTEED_TIME) {
        spawnGiftBox();
    }

    // Update active effects
    let speedMod = 0;
    const remaining = [];
    for (const effect of state.activeEffects) {
        if (now < effect.endTime) {
            remaining.push(effect);
            if (effect.type === 'speed') speedMod += GIFT_SPEED_BOOST;
            if (effect.type === 'slow') speedMod -= GIFT_SLOW_REDUCTION;
        }
    }
    state.activeEffects = remaining;
    state.speedModifier = speedMod;

    // Super glow sparkle particles
    if (state.superGlow) {
        if (Math.random() < 0.3) {
            const cx = state.superGlow.x * GRID_SIZE + GRID_SIZE / 2;
            const cy = state.superGlow.y * GRID_SIZE + GRID_SIZE / 2;
            state.superGlowSparkles.push({
                x: cx + (Math.random() - 0.5) * 20,
                y: cy + (Math.random() - 0.5) * 20,
                alpha: 1,
                size: 1 + Math.random() * 2,
                vy: -0.5 - Math.random()
            });
        }
    }

    // Update sparkles
    for (let i = state.superGlowSparkles.length - 1; i >= 0; i--) {
        const s = state.superGlowSparkles[i];
        s.y += s.vy;
        s.alpha -= 0.03;
        if (s.alpha <= 0) state.superGlowSparkles.splice(i, 1);
    }
}

export function applyGiftEffect() {
    const roll = Math.random();
    const now = performance.now();

    if (roll < 0.25) {
        // Grow
        for (let i = 0; i < GIFT_GROW_AMOUNT; i++) {
            state.snake.push({ ...state.snake[state.snake.length - 1] });
        }
        state.score += GIFT_GROW_AMOUNT;
        state.activeEffects.push({ type: 'grow', endTime: now + 2000, label: '🟢 GROW!', color: '#00ff88' });
        return { color: '#00ff88' };
    } else if (roll < 0.5) {
        // Shrink
        const removeCount = Math.min(GIFT_SHRINK_AMOUNT, state.snake.length - GIFT_MIN_SNAKE_LENGTH);
        for (let i = 0; i < removeCount; i++) {
            state.snake.pop();
        }
        state.activeEffects.push({ type: 'shrink', endTime: now + 2000, label: '🔴 SHRINK!', color: '#ff4444' });
        return { color: '#ff4444' };
    } else if (roll < 0.75) {
        // Speed up
        state.activeEffects.push({ type: 'speed', endTime: now + GIFT_SPEED_DURATION, label: '⚡ SPEED UP!', color: '#ffff00' });
        return { color: '#ffff00' };
    } else {
        // Slow down
        state.activeEffects.push({ type: 'slow', endTime: now + GIFT_SPEED_DURATION, label: '🐢 SLOW DOWN!', color: '#88ffff' });
        return { color: '#88ffff' };
    }
}
