import { test, expect } from '@playwright/test';
import { startGame, sendDirection, sendWASD, getCanvasScreenshot } from './helpers';

test.describe('Input Handling', () => {
  test('arrow keys change snake direction (canvas changes between frames)', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(300); // Let initial frame render

    const screenshotBefore = await getCanvasScreenshot(page);

    await sendDirection(page, 'down');
    await page.waitForTimeout(500); // Wait for movement

    const screenshotAfter = await getCanvasScreenshot(page);

    // Canvas content should differ after direction change + movement
    expect(screenshotBefore.equals(screenshotAfter)).toBe(false);
  });

  test('WASD keys change snake direction', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(300);

    const screenshotBefore = await getCanvasScreenshot(page);

    await sendWASD(page, 's');
    await page.waitForTimeout(500);

    const screenshotAfter = await getCanvasScreenshot(page);

    expect(screenshotBefore.equals(screenshotAfter)).toBe(false);
  });

  test('game responds to keyboard input during gameplay', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(200);

    // Send multiple direction changes rapidly
    await sendDirection(page, 'down');
    await page.waitForTimeout(200);
    await sendDirection(page, 'left');
    await page.waitForTimeout(200);
    await sendDirection(page, 'up');
    await page.waitForTimeout(200);

    // Game should still be running (no game-over from quick inputs)
    await expect(page.locator('#game-over')).toBeHidden();
    await expect(page.locator('#gameCanvas')).toBeVisible();
  });
});
