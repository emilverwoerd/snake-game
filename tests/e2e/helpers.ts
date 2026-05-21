import { Page, expect } from '@playwright/test';

/**
 * Start the game by clicking the start button and waiting for the start screen to hide.
 */
export async function startGame(page: Page): Promise<void> {
  await page.goto('/');
  const startBtn = page.locator('#start-btn');
  await expect(startBtn).toBeVisible();
  await startBtn.click();
  await expect(page.locator('#start-screen')).toBeHidden();
}

/**
 * Send a directional key press.
 */
export async function sendDirection(page: Page, direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
  const keyMap = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
  };
  await page.keyboard.press(keyMap[direction]);
}

/**
 * Send a WASD key press.
 */
export async function sendWASD(page: Page, direction: 'w' | 'a' | 's' | 'd'): Promise<void> {
  await page.keyboard.press(direction);
}

/**
 * Wait for canvas to render non-blank content by checking pixel data.
 * Samples the canvas and verifies it's not entirely one color.
 */
export async function waitForCanvasRender(page: Page): Promise<void> {
  const canvas = page.locator('#gameCanvas');
  await expect(canvas).toBeVisible();

  // Wait until canvas has non-uniform pixels (i.e., something is drawn)
  await expect(async () => {
    const hasContent = await page.evaluate(() => {
      const c = document.querySelector('#gameCanvas') as HTMLCanvasElement;
      if (!c) return false;
      const ctx = c.getContext('2d');
      if (!ctx) return false;
      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imageData.data;
      // Check if all pixels are the same (blank canvas)
      const first = [data[0], data[1], data[2], data[3]];
      for (let i = 4; i < Math.min(data.length, 10000); i += 4) {
        if (data[i] !== first[0] || data[i + 1] !== first[1] ||
            data[i + 2] !== first[2] || data[i + 3] !== first[3]) {
          return true; // Canvas has varied content
        }
      }
      return false;
    });
    expect(hasContent).toBe(true);
  }).toPass({ timeout: 5_000 });
}

/**
 * Force the snake into a wall by sending repeated directional inputs.
 * Sends the snake in one direction long enough to guarantee a wall collision.
 */
export async function forceWallCollision(page: Page): Promise<void> {
  // Send the snake consistently in one direction to hit the wall
  await sendDirection(page, 'right');

  // Wait for game over screen to appear (snake should hit right wall)
  await expect(page.locator('#game-over')).toBeVisible({ timeout: 15_000 });
}

/**
 * Take a canvas screenshot and return its buffer for comparison.
 */
export async function getCanvasScreenshot(page: Page): Promise<Buffer> {
  const canvas = page.locator('#gameCanvas');
  return await canvas.screenshot();
}
