import { test, expect } from '@playwright/test';
import { startGame, waitForCanvasRender } from './helpers';

test.describe('Game Launch and Start', () => {
  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('start screen is visible with correct title', async ({ page }) => {
    await page.goto('/');
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).toBeVisible();
    await expect(startScreen.locator('h1')).toHaveText('NEON SNAKE');
  });

  test('start button is clickable', async ({ page }) => {
    await page.goto('/');
    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toBeEnabled();
  });

  test('after clicking start, start screen disappears', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();
    await expect(page.locator('#start-screen')).toBeHidden();
  });

  test('canvas is visible and rendering after start', async ({ page }) => {
    await startGame(page);
    await waitForCanvasRender(page);
  });

  test('score display shows 0 after start', async ({ page }) => {
    await startGame(page);
    await expect(page.locator('#score')).toHaveText('0');
  });
});
