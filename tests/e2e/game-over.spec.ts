import { test, expect } from '@playwright/test';
import { startGame, forceWallCollision } from './helpers';

test.describe('Game Over and Restart', () => {
  test('game over screen appears when snake hits wall', async ({ page }) => {
    await startGame(page);
    await forceWallCollision(page);
    await expect(page.locator('#game-over')).toBeVisible();
  });

  test('game over screen shows final score', async ({ page }) => {
    await startGame(page);
    await forceWallCollision(page);

    const finalScore = page.locator('#final-score');
    await expect(finalScore).toBeVisible();
    const scoreText = await finalScore.textContent();
    expect(scoreText).toMatch(/^\d+$/);
  });

  test('Play Again button is visible on game over', async ({ page }) => {
    await startGame(page);
    await forceWallCollision(page);

    const restartBtn = page.locator('#restart-btn');
    await expect(restartBtn).toBeVisible();
    await expect(restartBtn).toHaveText('PLAY AGAIN');
  });

  test('clicking Play Again resets the game', async ({ page }) => {
    await startGame(page);
    await forceWallCollision(page);

    // Click restart
    await page.locator('#restart-btn').click();

    // Game over screen should disappear
    await expect(page.locator('#game-over')).toBeHidden();

    // Score resets to 0
    await expect(page.locator('#score')).toHaveText('0');

    // Canvas should be visible (game running again)
    await expect(page.locator('#gameCanvas')).toBeVisible();

    // Start screen should not reappear
    await expect(page.locator('#start-screen')).toBeHidden();
  });
});
