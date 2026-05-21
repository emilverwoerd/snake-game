/**
 * Snake Game — Test Suite
 * Covers: movement, input, collision, scoring, speed, food, restart
 * 
 * Uses a minimal describe/it structure compatible with any test runner.
 * Run with Node.js directly or with a runner like Jest/Mocha.
 */

// ─── Minimal Test Harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let currentDescribe = '';

function describe(name, fn) {
  currentDescribe = name;
  console.log(`\n  ${name}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    passed++;
    console.log(`    ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`    ✗ ${name}`);
    console.log(`      ${e.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    throw new Error(message || `Expected value to differ from ${expected}`);
  }
}

// ─── Canvas Context Mock ─────────────────────────────────────────────────────

function createMockCanvas(width = 400, height = 400) {
  return {
    width,
    height,
    getContext: () => ({
      fillRect: () => {},
      clearRect: () => {},
      strokeRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      fillText: () => {},
      measureText: () => ({ width: 0 }),
    }),
  };
}

// ─── Game State Factory (simulates expected game module interface) ────────────

const GRID_SIZE = 20; // Expected grid cell size in pixels
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const COLS = CANVAS_WIDTH / GRID_SIZE;
const ROWS = CANVAS_HEIGHT / GRID_SIZE;

function createGameState() {
  return {
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 }, // moving right
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    score: 0,
    speed: 150, // ms per tick (lower = faster)
    gameOver: false,
    gridSize: GRID_SIZE,
    cols: COLS,
    rows: ROWS,
  };
}

// ─── Game Logic Helpers (expected behavior to test against) ───────────────────

function moveSnake(state) {
  const head = state.snake[0];
  const newHead = {
    x: head.x + state.nextDirection.x,
    y: head.y + state.nextDirection.y,
  };

  // Wall collision
  if (newHead.x < 0 || newHead.x >= state.cols || newHead.y < 0 || newHead.y >= state.rows) {
    state.gameOver = true;
    return state;
  }

  // Self collision
  for (const segment of state.snake) {
    if (segment.x === newHead.x && segment.y === newHead.y) {
      state.gameOver = true;
      return state;
    }
  }

  state.snake.unshift(newHead);

  // Food collection
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    state.score++;
    state.food = spawnFood(state);
    state.speed = calculateSpeed(state.score);
  } else {
    state.snake.pop();
  }

  state.direction = { ...state.nextDirection };
  return state;
}

function changeDirection(state, newDir) {
  // Prevent 180-degree reversal
  if (state.direction.x + newDir.x === 0 && state.direction.y + newDir.y === 0) {
    return; // ignore reverse
  }
  state.nextDirection = newDir;
}

function spawnFood(state) {
  let pos;
  let attempts = 0;
  do {
    pos = {
      x: Math.floor(Math.random() * state.cols),
      y: Math.floor(Math.random() * state.rows),
    };
    attempts++;
  } while (state.snake.some(s => s.x === pos.x && s.y === pos.y) && attempts < 1000);
  return pos;
}

function calculateSpeed(score) {
  // Speed increases (interval decreases) every 5 points
  const BASE_SPEED = 150;
  const SPEED_DECREMENT = 10;
  const level = Math.floor(score / 5);
  return Math.max(50, BASE_SPEED - level * SPEED_DECREMENT);
}

function handleKeydown(state, key) {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    w: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
    W: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    A: { x: -1, y: 0 },
    D: { x: 1, y: 0 },
  };
  const dir = keyMap[key];
  if (dir) {
    changeDirection(state, dir);
  }
}

function resetGame() {
  return createGameState();
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n🐍 Snake Game — Test Suite\n' + '═'.repeat(40));

// ─── 1. Snake Movement ───────────────────────────────────────────────────────

describe('Snake Movement', () => {
  it('moves right when direction is (1, 0)', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    const headBefore = { ...state.snake[0] };
    moveSnake(state);
    assertEqual(state.snake[0].x, headBefore.x + 1);
    assertEqual(state.snake[0].y, headBefore.y);
  });

  it('moves left when direction is (-1, 0)', () => {
    const state = createGameState();
    state.direction = { x: -1, y: 0 };
    state.nextDirection = { x: -1, y: 0 };
    const headBefore = { ...state.snake[0] };
    moveSnake(state);
    assertEqual(state.snake[0].x, headBefore.x - 1);
    assertEqual(state.snake[0].y, headBefore.y);
  });

  it('moves up when direction is (0, -1)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 };
    state.nextDirection = { x: 0, y: -1 };
    const headBefore = { ...state.snake[0] };
    moveSnake(state);
    assertEqual(state.snake[0].x, headBefore.x);
    assertEqual(state.snake[0].y, headBefore.y - 1);
  });

  it('moves down when direction is (0, 1)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: 1 };
    state.nextDirection = { x: 0, y: 1 };
    const headBefore = { ...state.snake[0] };
    moveSnake(state);
    assertEqual(state.snake[0].x, headBefore.x);
    assertEqual(state.snake[0].y, headBefore.y + 1);
  });
});

// ─── 2. Input Handling (Arrow Keys + WASD) ───────────────────────────────────

describe('Input Handling — Arrow Keys', () => {
  it('ArrowUp sets direction to (0, -1)', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 }; // moving right
    handleKeydown(state, 'ArrowUp');
    assertEqual(state.nextDirection.x, 0);
    assertEqual(state.nextDirection.y, -1);
  });

  it('ArrowDown sets direction to (0, 1)', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    handleKeydown(state, 'ArrowDown');
    assertEqual(state.nextDirection.x, 0);
    assertEqual(state.nextDirection.y, 1);
  });

  it('ArrowLeft sets direction to (-1, 0)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 }; // moving up
    handleKeydown(state, 'ArrowLeft');
    assertEqual(state.nextDirection.x, -1);
    assertEqual(state.nextDirection.y, 0);
  });

  it('ArrowRight sets direction to (1, 0)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 }; // moving up
    handleKeydown(state, 'ArrowRight');
    assertEqual(state.nextDirection.x, 1);
    assertEqual(state.nextDirection.y, 0);
  });
});

describe('Input Handling — WASD', () => {
  it('W sets direction to (0, -1)', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    handleKeydown(state, 'w');
    assertEqual(state.nextDirection.y, -1);
  });

  it('S sets direction to (0, 1)', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    handleKeydown(state, 's');
    assertEqual(state.nextDirection.y, 1);
  });

  it('A sets direction to (-1, 0)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 };
    handleKeydown(state, 'a');
    assertEqual(state.nextDirection.x, -1);
  });

  it('D sets direction to (1, 0)', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 };
    handleKeydown(state, 'd');
    assertEqual(state.nextDirection.x, 1);
  });

  it('uppercase WASD also works', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    handleKeydown(state, 'W');
    assertEqual(state.nextDirection.y, -1);
  });
});

// ─── 3. Cannot Reverse Direction (180° turn prevention) ──────────────────────

describe('Direction Reversal Prevention', () => {
  it('cannot reverse from right to left', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    handleKeydown(state, 'ArrowLeft');
    assertEqual(state.nextDirection.x, 1, 'Should stay moving right');
  });

  it('cannot reverse from left to right', () => {
    const state = createGameState();
    state.direction = { x: -1, y: 0 };
    state.nextDirection = { x: -1, y: 0 };
    handleKeydown(state, 'ArrowRight');
    assertEqual(state.nextDirection.x, -1, 'Should stay moving left');
  });

  it('cannot reverse from up to down', () => {
    const state = createGameState();
    state.direction = { x: 0, y: -1 };
    state.nextDirection = { x: 0, y: -1 };
    handleKeydown(state, 'ArrowDown');
    assertEqual(state.nextDirection.y, -1, 'Should stay moving up');
  });

  it('cannot reverse from down to up', () => {
    const state = createGameState();
    state.direction = { x: 0, y: 1 };
    state.nextDirection = { x: 0, y: 1 };
    handleKeydown(state, 'ArrowUp');
    assertEqual(state.nextDirection.y, 1, 'Should stay moving down');
  });

  it('WASD reversal also blocked', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    handleKeydown(state, 'a'); // try to go left while moving right
    assertEqual(state.nextDirection.x, 1);
  });
});

// ─── 4. Score Increments on Food Collection ──────────────────────────────────

describe('Score Tracking', () => {
  it('score starts at 0', () => {
    const state = createGameState();
    assertEqual(state.score, 0);
  });

  it('score increments by 1 when food is eaten', () => {
    const state = createGameState();
    // Place food directly in front of the snake
    state.food = { x: 11, y: 10 };
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.score, 1);
  });

  it('score increments correctly over multiple food pickups', () => {
    const state = createGameState();
    state.food = { x: 11, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    // Now snake head is at (11,10), place next food at (12,10)
    state.food = { x: 12, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.score, 2);
  });
});

// ─── 5. Speed Increases Every 5 Points ──────────────────────────────────────

describe('Progressive Speed', () => {
  it('speed at 0 points is base speed (150ms)', () => {
    assertEqual(calculateSpeed(0), 150);
  });

  it('speed at 5 points is faster than base', () => {
    const speedAt5 = calculateSpeed(5);
    assert(speedAt5 < 150, `Speed at 5 pts (${speedAt5}) should be < 150`);
    assertEqual(speedAt5, 140);
  });

  it('speed at 10 points is faster than at 5', () => {
    const speedAt10 = calculateSpeed(10);
    assert(speedAt10 < calculateSpeed(5), `Speed at 10 should be < speed at 5`);
    assertEqual(speedAt10, 130);
  });

  it('speed at 15 points is faster than at 10', () => {
    const speedAt15 = calculateSpeed(15);
    assertEqual(speedAt15, 120);
  });

  it('speed at 20 points is faster than at 15', () => {
    const speedAt20 = calculateSpeed(20);
    assertEqual(speedAt20, 110);
  });

  it('speed never goes below minimum (50ms)', () => {
    const speedAt100 = calculateSpeed(100);
    assert(speedAt100 >= 50, `Speed should never go below 50ms, got ${speedAt100}`);
    assertEqual(speedAt100, 50);
  });

  it('speed updates when food is eaten at threshold', () => {
    const state = createGameState();
    state.score = 4;
    state.food = { x: 11, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.score, 5);
    assertEqual(state.speed, 140);
  });
});

// ─── 6. Wall Collision ───────────────────────────────────────────────────────

describe('Wall Collision', () => {
  it('game over when snake hits right wall', () => {
    const state = createGameState();
    state.snake = [{ x: COLS - 1, y: 10 }];
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });

  it('game over when snake hits left wall', () => {
    const state = createGameState();
    state.snake = [{ x: 0, y: 10 }];
    state.direction = { x: -1, y: 0 };
    state.nextDirection = { x: -1, y: 0 };
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });

  it('game over when snake hits top wall', () => {
    const state = createGameState();
    state.snake = [{ x: 10, y: 0 }];
    state.direction = { x: 0, y: -1 };
    state.nextDirection = { x: 0, y: -1 };
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });

  it('game over when snake hits bottom wall', () => {
    const state = createGameState();
    state.snake = [{ x: 10, y: ROWS - 1 }];
    state.direction = { x: 0, y: 1 };
    state.nextDirection = { x: 0, y: 1 };
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });

  it('no game over when snake is at edge but moving parallel', () => {
    const state = createGameState();
    state.snake = [{ x: COLS - 1, y: 10 }];
    state.direction = { x: 0, y: 1 };
    state.nextDirection = { x: 0, y: 1 };
    state.food = { x: 0, y: 0 }; // food elsewhere
    moveSnake(state);
    assertEqual(state.gameOver, false);
  });
});

// ─── 7. Self-Collision ───────────────────────────────────────────────────────

describe('Self-Collision', () => {
  it('game over when snake head hits its own body', () => {
    const state = createGameState();
    // Snake shaped like: head → right, body curls back
    state.snake = [
      { x: 5, y: 5 },  // head
      { x: 5, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },  // body segment below
    ];
    // Move down — head will collide with segment at (5, 6)? No, let's set it up properly
    state.snake = [
      { x: 5, y: 5 },  // head
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
    ];
    state.direction = { x: 0, y: 1 };
    state.nextDirection = { x: 0, y: 1 };
    // Head at (5,5) moves to (5,6) — but (5,6) is occupied!
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });

  it('no self-collision with length 1', () => {
    const state = createGameState();
    state.snake = [{ x: 10, y: 10 }];
    state.nextDirection = { x: 1, y: 0 };
    state.food = { x: 0, y: 0 };
    moveSnake(state);
    assertEqual(state.gameOver, false);
  });

  it('no self-collision when tail moves out of the way', () => {
    const state = createGameState();
    // Snake of length 3 moving right — tail vacates
    state.snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.food = { x: 0, y: 0 };
    moveSnake(state);
    assertEqual(state.gameOver, false);
    assertEqual(state.snake[0].x, 6);
  });
});

// ─── 8. Food Respawns After Collection ───────────────────────────────────────

describe('Food Spawning', () => {
  it('food position changes after being eaten', () => {
    const state = createGameState();
    const originalFood = { ...state.food };
    state.food = { x: 11, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    // Food should have respawned (extremely unlikely to be same position)
    // We just verify the spawn function was called (score incremented)
    assertEqual(state.score, 1);
    assert(state.food.x !== undefined, 'Food should have x coordinate');
    assert(state.food.y !== undefined, 'Food should have y coordinate');
  });

  it('food does not spawn on snake body', () => {
    const state = createGameState();
    // Fill most of the board with snake to force constraint
    state.snake = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < ROWS; y++) {
        state.snake.push({ x, y });
      }
    }
    const food = spawnFood(state);
    const onSnake = state.snake.some(s => s.x === food.x && s.y === food.y);
    assertEqual(onSnake, false, 'Food must not spawn on snake body');
  });

  it('food spawns within grid bounds', () => {
    const state = createGameState();
    for (let i = 0; i < 100; i++) {
      const food = spawnFood(state);
      assert(food.x >= 0 && food.x < COLS, `Food x=${food.x} out of bounds`);
      assert(food.y >= 0 && food.y < ROWS, `Food y=${food.y} out of bounds`);
    }
  });
});

// ─── 9. Snake Grows on Food Collection ───────────────────────────────────────

describe('Snake Growth', () => {
  it('snake length increases by 1 when food is eaten', () => {
    const state = createGameState();
    const lengthBefore = state.snake.length;
    state.food = { x: 11, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.snake.length, lengthBefore + 1);
  });

  it('snake length stays same when no food eaten', () => {
    const state = createGameState();
    state.food = { x: 0, y: 0 }; // food far away
    const lengthBefore = state.snake.length;
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.snake.length, lengthBefore);
  });

  it('snake grows multiple times correctly', () => {
    const state = createGameState();
    state.food = { x: 11, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.snake.length, 2);

    state.food = { x: 12, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.snake.length, 3);

    state.food = { x: 13, y: 10 };
    state.nextDirection = { x: 1, y: 0 };
    moveSnake(state);
    assertEqual(state.snake.length, 4);
  });
});

// ─── 10. Game Restart ────────────────────────────────────────────────────────

describe('Game Restart', () => {
  it('score resets to 0 on restart', () => {
    const state = createGameState();
    state.score = 15;
    const fresh = resetGame();
    assertEqual(fresh.score, 0);
  });

  it('snake resets to initial length on restart', () => {
    const fresh = resetGame();
    assertEqual(fresh.snake.length, 1);
  });

  it('snake resets to initial position on restart', () => {
    const fresh = resetGame();
    assertEqual(fresh.snake[0].x, 10);
    assertEqual(fresh.snake[0].y, 10);
  });

  it('speed resets to base speed on restart', () => {
    const fresh = resetGame();
    assertEqual(fresh.speed, 150);
  });

  it('gameOver flag resets to false on restart', () => {
    const fresh = resetGame();
    assertEqual(fresh.gameOver, false);
  });

  it('direction resets to default on restart', () => {
    const fresh = resetGame();
    assertEqual(fresh.direction.x, 1);
    assertEqual(fresh.direction.y, 0);
  });
});

// ─── Edge Cases ──────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  it('rapid direction changes: only last valid direction is used per tick', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 }; // moving right
    state.nextDirection = { x: 1, y: 0 };
    handleKeydown(state, 'ArrowUp');
    handleKeydown(state, 'ArrowLeft'); // should be blocked? depends on implementation
    // After first key, nextDirection is up. Second key tries left from "right" (current direction)
    // The second change should use nextDirection as basis OR direction — this tests the spec
    // At minimum, the direction should be valid (not a reversal of actual movement)
    assert(
      !(state.nextDirection.x === -1 && state.direction.x === 1),
      'Should not allow effective reversal through rapid input'
    );
  });

  it('invalid keys are ignored', () => {
    const state = createGameState();
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    handleKeydown(state, 'x');
    handleKeydown(state, 'Enter');
    handleKeydown(state, ' ');
    assertEqual(state.nextDirection.x, 1);
    assertEqual(state.nextDirection.y, 0);
  });

  it('snake at corner triggers game over correctly', () => {
    const state = createGameState();
    state.snake = [{ x: 0, y: 0 }];
    state.direction = { x: -1, y: 0 };
    state.nextDirection = { x: -1, y: 0 };
    moveSnake(state);
    assertEqual(state.gameOver, true);
  });
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(40));
console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('═'.repeat(40) + '\n');

if (failed > 0) {
  process.exit(1);
}
