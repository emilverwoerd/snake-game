# Neon Snake 🐍

A browser-based canvas snake game with neon glow visual effects, power-ups, and particle systems.

## How to Play

- Use **Arrow Keys** or **WASD** to control the snake
- Eat food to grow and score points
- Collect power-ups: **Super Glow** items and **Gift Boxes**
- Gift effects: grow, shrink, speed-up, slow-down
- Speed increases every 5 points — survive as long as you can!
- Avoid hitting walls or yourself

## Run Locally

```bash
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Run Tests

```bash
# Unit tests
npx jest

# E2E tests
npx playwright test
```

## Architecture

Modular ES module system under `src/`:

| Module | Purpose |
|--------|---------|
| `main.js` | Game loop and initialization |
| `snake.js` | Snake movement and collision |
| `food.js` | Food spawning logic |
| `powerups.js` | Power-up system (Super Glow, Gift Boxes) |
| `particles.js` | Particle effects engine |
| `renderer.js` | Canvas rendering with neon glow |
| `input.js` | Keyboard input handling |
| `state.js` | Game state management |
| `config.js` | Game configuration constants |
| `utils.js` | Shared utilities |
