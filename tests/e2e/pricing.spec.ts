import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  await page.goto('/');
});

test('pricing distinguishes live free features from planned paid offers without a checkout', async ({ page }) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url());
  });
  await expect(page.getByText('Start from an existing score. No quiz. No account.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Explore Laplora Pro' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Laplora Pro' })).toBeFocused();
  await expect(page).toHaveTitle('Laplora Pro');
  const free = page.getByRole('article', { name: 'Laplora Free', exact: true });
  const pro = page.getByRole('article', { name: 'Laplora Pro', exact: true });
  const pass = page.getByRole('article', { name: '90-day SAT Prep Pass' });
  await expect(free).toContainText('$0');
  await expect(free).toContainText('Unlimited basic SAT score simulations, one at a time');
  await expect(free).toContainText('No account required');
  await expect(pro).toContainText('$4.99');
  await expect(pro).toContainText('/month · planned');
  await expect(pro).toContainText('Coming Soon');
  await expect(pro).toContainText('Pro features are in planning and are not available yet.');
  await expect(pass).toContainText('$9.99');
  await expect(pass).toContainText('one-time · 90 days');
  await expect(pass).toContainText('Coming Soon');
  await expect(pass).toContainText('potential alternative');
  await expect(pro.getByRole('button')).toHaveCount(0);
  await expect(pass.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('textbox')).toHaveCount(0);
  await page.getByRole('button', { name: 'Start free simulation' }).click();
  await expect(page.getByRole('heading', { name: 'Your starting point' })).toBeFocused();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('pricing and How It Works preserve the setup step and free comparison state', async ({ page }) => {
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await page.getByLabel('Target SAT score', { exact: true }).fill('1400');
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Laplora Pro', exact: true }).click();
  await page.getByRole('button', { name: 'How it works', exact: true }).click();
  await page.getByRole('button', { name: 'Laplora Pro', exact: true }).click();
  await page.getByRole('button', { name: 'Continue your simulation' }).click();
  await expect(page.getByRole('heading', { name: 'A goal to explore' })).toBeFocused();
  await expect(page.getByLabel('Target SAT score', { exact: true })).toHaveValue('1400');
  await expect(page.getByLabel('Target test date')).toHaveValue('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await page.getByLabel('Review of mistakes', { exact: true }).check();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await page.getByRole('button', { name: 'Run simulation' }).click();
  await page.getByRole('button', { name: /Increased Practice/ }).click();
  await expect(page.getByRole('status')).toContainText('1280');
  await page.getByRole('button', { name: 'Math', exact: true }).click();
  await page.getByRole('button', { name: 'Laplora Pro', exact: true }).click();
  await page.getByRole('button', { name: 'How it works', exact: true }).click();
  await page.getByRole('button', { name: 'About the beta' }).click();
  await page.getByRole('button', { name: 'Back to results' }).click();
  await expect(page.getByRole('heading', { name: 'Explore the paths ahead.' })).toBeFocused();
  await expect(page.getByRole('status')).toContainText('1280');
  await expect(page.getByRole('button', { name: 'Math', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('pricing is keyboard accessible and reflows at 320px with enlarged text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Explore Laplora Pro' }).focus();
  await page.keyboard.press('Enter');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1, name: 'Laplora Pro' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Start free simulation' })).toBeFocused();
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }))).toEqual([]);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const clipped = await page.evaluate(() => [...document.querySelectorAll('button,article,table')]
    .filter(element => element.getClientRects().length)
    .filter(element => { const rect = element.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1; })
    .map(element => element.textContent));
  expect(clipped).toEqual([]);
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  await page.getByRole('button', { name: 'Start free simulation' }).click();
  await expect(page.getByRole('heading', { name: 'Your starting point' })).toBeVisible();
});
