import { expect, test } from '@playwright/test';

test('landing loads local fonts, supports keyboard navigation, and fits the viewport', async ({ page }) => {
  const runtimeErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(request.url()));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Synthetic example');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].map(font => [font.family, font.status]).sort())).toEqual([['Manrope', 'loaded'], ['Outfit', 'loaded']]);

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Explore your preparation' })).toBeFocused();

  const fitsViewport = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(fitsViewport).toBe(true);
  expect(runtimeErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});
