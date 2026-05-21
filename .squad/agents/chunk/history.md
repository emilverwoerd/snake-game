# Chunk — History

## Project Context

- **Project:** snake-game — Browser-based canvas snake game
- **Stack:** HTML, CSS, JavaScript, Canvas API
- **User:** Emil Verwoerd
- **Team:** Mikey (Lead), Data (Game Dev), Emil (Product Owner/Reviewer)

## Learnings

- **Self-contained test harness**: A minimal describe/it runner with assert helpers lets tests run with zero dependencies (`node tests/game.test.js`). Portable and fast.
- **Direction reversal edge case**: The 180° turn prevention must compare against `direction` (last committed), not `nextDirection`, to avoid rapid-key exploits where two presses within one tick effectively reverse.
- **Self-collision with tail**: The tail segment vacates on the same tick the head moves in — testing must verify this doesn't falsely trigger game over.
- **Food spawn constraint**: When the snake fills most of the grid, a naive random spawner can loop forever. Cap attempts and test the constraint explicitly with a nearly-full board.
- **Speed floor**: Progressive speed must have a minimum interval (tested 50ms) to prevent unplayable frame rates at high scores.
- **Test isolation pattern**: Creating fresh game state per test (`createGameState()`) prevents cross-test pollution and makes failures deterministic.
- **Canvas mock**: For logic-only tests, a stub context with no-op methods is sufficient — no need for jsdom or browser environment.
