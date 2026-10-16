import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('beta guidance preserves the active plan through other information pages', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start simulation', exact: true }).click();
  await page.getByLabel('Math section score', { exact: true }).fill('610');
  await page.getByRole('button', { name: 'About the beta' }).click();
  await expect(page.getByRole('heading', { name: 'About the Laplora beta' })).toBeFocused();
  await expect(page).toHaveTitle('Laplora — About the beta');
  await expect(page.getByRole('main')).toContainText('not scientifically validated predictions');
  await expect(page.getByRole('main')).toContainText('not a statistical confidence interval');
  await expect(page.getByRole('main')).toContainText('private Formspree inbox');
  await page.getByRole('button', { name: 'Laplora Pro', exact: true }).click();
  await page.getByRole('button', { name: 'About the beta' }).click();
  await page.getByRole('button', { name: 'Back to your plan' }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('610');
});

test('beta page supports keyboard navigation, reduced motion and enlarged mobile text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'About the beta' }).focus();
  await page.keyboard.press('Enter');
  await page.evaluate(() => document.fonts.ready);
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(scan.violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 640 });
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const badge = page.getByRole('button', { name: 'About the beta' });
  expect(await badge.evaluate(el => el.getBoundingClientRect().right <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
  await page.getByRole('button', { name: 'Back to home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SAT journey');
});
