# Snake Game — Test Suite

## Running Tests

The test file is self-contained with a minimal test harness. No dependencies required.

### Quick Run

```bash
node tests/game.test.js
```

### With a Test Runner (optional)

If you prefer a full test runner, the `describe`/`it` structure is compatible with:

- **Jest**: `npx jest tests/game.test.js`
- **Mocha**: `npx mocha tests/game.test.js`

> Note: The built-in harness runs out of the box with just Node.js — no install needed.

## What's Tested

| # | Category | Cases |
|---|----------|-------|
| 1 | Snake Movement | All 4 directions |
| 2 | Input Handling | Arrow keys + WASD (incl. uppercase) |
| 3 | Reversal Prevention | 180° turn blocked in all directions |
| 4 | Score Tracking | Increment on food, multi-pickup |
| 5 | Progressive Speed | Speed at 0/5/10/15/20 pts, minimum cap |
| 6 | Wall Collision | All 4 walls + edge parallel movement |
| 7 | Self-Collision | Body hit, length-1 safe, tail vacates |
| 8 | Food Spawning | Respawn, not on body, within bounds |
| 9 | Snake Growth | +1 per food, no growth without food |
| 10 | Game Restart | Score/snake/speed/direction all reset |
| — | Edge Cases | Rapid input, invalid keys, corner death |

## Test Design

Tests validate **game logic only** — no rendering assertions. The canvas context is mocked where needed. Game state is constructed fresh per test for isolation.

The test file includes reference implementations of the expected game logic. When the actual game code is written, these tests should be adapted to import from the game module instead.

## Exit Codes

- `0` — All tests passed
- `1` — One or more tests failed
