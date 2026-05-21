import { test, expect } from '@playwright/test';
import { startGame, getCanvasScreenshot } from './helpers';

test.describe('Power-ups (Visual Verification)', () => {
  test('canvas content changes over time (new items appear)', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(500);

    const earlyScreenshot = await getCanvasScreenshot(page);

    // Wait several seconds for power-ups or food to spawn/move
    await page.waitForTimeout(5_000);

    const laterScreenshot = await getCanvasScreenshot(page);

    // Canvas should have changed (snake moved, items may have spawned)
    expect(earlyScreenshot.equals(laterScreenshot)).toBe(false);
  });

  test('canvas is not blank or static during gameplay', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1_000);

    // Take multiple screenshots over short interval
    const screenshots: Buffer[] = [];
    for (let i = 0; i < 3; i++) {
      screenshots.push(await getCanvasScreenshot(page));
      await page.waitForTimeout(300);
    }

    // At least one pair of consecutive screenshots should differ (animation happening)
    let hasChange = false;
    for (let i = 1; i < screenshots.length; i++) {
      if (!screenshots[i - 1].equals(screenshots[i])) {
        hasChange = true;
        break;
      }
    }
    expect(hasChange).toBe(true);
  });
});
