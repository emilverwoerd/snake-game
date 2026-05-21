// All game constants and configuration
export const GRID_SIZE = 20;
export const CANVAS_SIZE = 600;
export const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
export const BASE_SPEED = 8;
export const SPEED_INCREMENT = 1;
export const SPEED_INTERVAL = 5;

// Super Glow power-up
export const SUPER_GLOW_SPAWN_CHANCE = 0.30;       // 30% on food collection (up from 15%)
export const SUPER_GLOW_LIFETIME = 12000;           // 12 seconds (up from 8)
export const SUPER_GLOW_GROW_MIN = 3;
export const SUPER_GLOW_GROW_MAX = 5;

// Gift Box power-up
export const GIFT_BOX_SPAWN_CHANCE = 0.40;          // 40% chance (up from 20%)
export const GIFT_BOX_FIRST_CHECK = 5000;           // First check at 5 seconds (down from 10)
export const GIFT_BOX_CHECK_INTERVAL = 8000;        // Then every 8 seconds (down from 10)
export const GIFT_BOX_GUARANTEED_TIME = 15000;      // Guaranteed spawn at 15s if none yet
export const GIFT_BOX_LIFETIME = 10000;             // 10 seconds (up from 6)
export const GIFT_GROW_AMOUNT = 3;
export const GIFT_SHRINK_AMOUNT = 2;
export const GIFT_MIN_SNAKE_LENGTH = 3;
export const GIFT_SPEED_DURATION = 5000;
export const GIFT_SPEED_BOOST = 4;
export const GIFT_SLOW_REDUCTION = 3;
