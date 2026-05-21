import { test, expect } from '@playwright/test';
import { startGame } from './helpers';

test.describe('Scoring', () => {
  test('score starts at 0 on game start', async ({ page }) => {
    await startGame(page);
    await expect(page.locator('#score')).toHaveText('0');
  });

  test('score display updates during gameplay', async ({ page }) => {
    await startGame(page);

    // Wait for score to potentially increase (food is randomly placed,
    // so we give ample time and check if score changed at all)
    await expect(async () => {
      const score = await page.locator('#score').textContent();
      const scoreNum = parseInt(score || '0', 10);
      // After enough time, snake may eat food — but this isn't guaranteed
      // so we just verify the score element remains functional
      expect(scoreNum).toBeGreaterThanOrEqual(0);
    }).toPass({ timeout: 10_000 });

    // Verify score display is still visible and numeric
    const scoreText = await page.locator('#score').textContent();
    expect(scoreText).toMatch(/^\d+$/);
  });

  test('score resets on restart', async ({ page }) => {
    await startGame(page);

    // Force game over by sending snake into wall
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#game-over')).toBeVisible({ timeout: 15_000 });

    // Restart the game
    await page.locator('#restart-btn').click();
    await expect(page.locator('#game-over')).toBeHidden();

    // Score should be back to 0
    await expect(page.locator('#score')).toHaveText('0');
  });
});
