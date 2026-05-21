# Data — History

## Project Context

- **Project:** snake-game — Browser-based canvas snake game
- **Stack:** HTML, CSS, JavaScript, Canvas API
- **User:** Emil Verwoerd
- **Team:** Mikey (Lead), Chunk (Tester), Emil (Product Owner/Reviewer)

## Learnings

### 2026-05-21 — Initial Game Build

**Architecture Decisions:**
- IIFE pattern in `game.js` to avoid global namespace pollution
- Single `requestAnimationFrame` loop renders at ~60fps; game logic ticks at variable `gameSpeed` rate
- Grid-based movement (20px tiles, 30x30 grid on 600x600 canvas)
- Particle system uses simple array with splice cleanup (sufficient for <100 particles)
- Progressive speed: base 8fps + 1fps per 5 points scored
- Direction buffering (`nextDirection`) prevents 180-degree reversal bugs

**Visual Effects Stack:**
- Canvas `shadowBlur` for neon glow (snake, food)
- HSL gradient along snake body (cyan head → magenta tail)
- Radial gradient on food with sine-wave pulse animation
- Particle burst (20 particles) on food collection
- Trail particles emitted from snake tail each tick
- Animated grid background with subtle drift + radial vignette

**Key File Paths:**
- `index.html` — entry point, canvas element
- `style.css` — dark/neon theme, centered layout
- `game.js` — all game logic, rendering, input handling

**User Preferences:**
- Emil wants "cool graphics" / impressive visuals
- Dark/neon aesthetic preferred
- Arrow keys + WASD support required

### 2026-05-21 — Power-Up System

**Architecture Decisions:**
- Power-ups stored as nullable objects (`superGlow`, `giftBox`) — only one of each can exist at a time
- Timer-based spawning uses `performance.now()` deltas from `gameStartTime`, not `setInterval` — keeps everything in the game loop
- `effectiveSpeed` computed per frame from `gameSpeed + speedModifier`; effects stack additively
- `activeEffects` array holds timed effects with auto-expiry; speed modifier recalculated each frame
- `isOccupied()` helper prevents spawning on snake, food, or other power-ups
- `spawnParticleBurst()` extended with `colorTheme` param ('rainbow', hex color, or null for default)
- Gift box effect selection uses uniform 25% probability split for 4 outcomes
- Status effects rendered in a DOM overlay (`#status-effects`) rather than canvas — simpler text rendering

**Visual Design:**
- Super Glow: rainbow HSL cycling gradient, double-ring pulse, white sparkle particles rising upward
- Gift Box: rotated golden box with red ribbon cross, bow, "?" text, golden shadow glow
- Each gift effect triggers colored particle burst matching its theme color

**Spawning Rules Implemented:**
- Super Glow: 15% on food eaten, 8s lifetime, grows snake 3-5 segments
- Gift Box: 20% check every 10s, 6s lifetime, random effect (grow/shrink/speed/slow)
- Minimum snake length 3 enforced on shrink

### 2026-05-21 — Modular Refactor + Power-Up Spawn Fix

**Architecture Decisions (ES Modules):**
- Replaced monolithic `game.js` (730 lines) with 10 ES modules under `src/`
- `config.js` — Single source of truth for all tunables (spawn rates, timers, grid)
- `state.js` — Centralized mutable state object + `resetState()` factory; imported by all modules
- `input.js` — Pure side-effect module; sets up keydown listener writing to `state.nextDirection`
- `snake.js` — `update()` handles movement, collision detection, food/powerup collection
- `food.js` — Simple `spawnFood()` with occupied-cell avoidance
- `powerups.js` — Spawn logic, timer management, gift effect application
- `particles.js` — Burst spawn + per-frame update/cleanup for both particle arrays
- `renderer.js` — All Canvas2D drawing, owns the `ctx` reference via `initRenderer()`
- `utils.js` — `roundRect()`, `isOccupied()`, `findFreePosition()` helpers
- `main.js` — Entry point, game loop, DOM bindings, status display; clean orchestration layer

**Bug Fix — Power-Ups Not Appearing:**
- Root cause: Gift box had 10s interval + 20% chance + 6s lifetime = often despawned before next check
- Super glow at 15% was too rare; many food collections produced nothing visible
- Fix applied:
  - Gift box: first check at 5s (was 10s), then every 8s, 40% chance (was 20%), 10s lifetime (was 6s)
  - Super glow: 30% chance (was 15%), 12s lifetime (was 8s)
  - Added guaranteed gift box spawn at 15s if none has appeared yet (`giftHasSpawnedOnce` flag)

**Module Dependency Graph:**
- `main.js` imports: state, input, food, powerups, snake, renderer
- `snake.js` imports: state, config, food, powerups, particles
- `renderer.js` imports: state, config, utils, particles
- `powerups.js` imports: state, config, utils
- No circular dependencies — state is the shared hub
