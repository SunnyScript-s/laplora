import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  await page.goto('/');
});

async function baseline(page: Page, math = '600', rw = '600') {
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill(math);
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill(rw);
  await page.getByRole('button', { name: 'Next: your goal' }).click();
}
async function goal(page: Page) {
  await page.getByLabel('Target SAT score', { exact: true }).fill('1400');
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
}
async function results(page: Page, hours = '3') {
  await baseline(page); await goal(page);
  await page.getByLabel('Weekly study hours').fill(hours);
  await page.getByLabel('Review of mistakes', { exact: true }).check();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await page.getByRole('button', { name: 'Run simulation' }).click();
  await expect(page.getByRole('heading', { name: 'Explore the paths ahead.' })).toBeVisible();
}

test('valid plan produces known results, keyboard chart exploration, and consistent data', async ({ page }) => {
  const errors: string[] = [];
  const outgoing: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => errors.push(request.url()));
  page.on('request', request => outgoing.push(request.url()));
  await results(page);
  await expect(page.getByText('Central modeled total', { exact: true }).locator('..')).toContainText('1240');
  await expect(page.getByText('Illustrative assumption range', { exact: true }).locator('..')).toContainText('1220–1260');
  const timeline = page.getByRole('slider', { name: 'Explore timeline' });
  await timeline.focus(); await page.keyboard.press('Home');
  await expect(timeline).toHaveAttribute('aria-valuetext', 'Oct 14, 2026, current 1200');
  await page.keyboard.press('End');
  await expect(timeline).toHaveAttribute('aria-valuetext', 'Jan 6, 2027, current 1240');
  await page.getByRole('button', { name: 'Math', exact: true }).click();
  await expect(timeline).toHaveAttribute('aria-valuetext', 'Jan 6, 2027, current 620');
  await page.getByRole('button', { name: 'RW', exact: true }).click();
  await expect(timeline).toHaveAttribute('aria-valuetext', 'Jan 6, 2027, current 620');
  await page.getByText('View date and section data', { exact: true }).click();
  const lastRow = page.getByRole('table').getByRole('row').last();
  await expect(lastRow).toContainText('Jan 6, 2027');
  await expect(lastRow.getByRole('cell').nth(0)).toHaveText('620');
  await expect(lastRow.getByRole('cell').nth(1)).toHaveText('620');
  await expect(lastRow.getByRole('cell').nth(2)).toHaveText('1240');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect(outgoing.every(url => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('comparisons identify changes, reject invalid plans, and reset without altering baseline', async ({ page }) => {
  await results(page);
  await page.getByRole('button', { name: /Increased Practice/ }).click();
  const status = page.getByRole('status');
  await expect(status).toContainText('1280');
  await expect(status).toContainText('3 hrs/week → 6 hrs/week');
  await page.getByLabel('Weekly hours', { exact: true }).fill('41');
  await page.getByRole('button', { name: 'Apply custom plan' }).click();
  await expect(page.getByRole('alert')).toBeFocused();
  await expect(page.getByRole('alert')).toContainText('Weekly study hours');
  await expect(page.getByLabel('Weekly hours', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(status).toContainText('1280');
  await page.getByLabel('Weekly hours', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Apply custom plan' }).click();
  await expect(status).toContainText('1200');
  await expect(status).toContainText('Custom Scenario');
  await page.getByRole('button', { name: 'Reset comparison' }).click();
  await expect(status).toBeEmpty();
  await expect(page.getByLabel('Weekly hours', { exact: true })).toHaveValue('3');
  await page.getByText('Allocation and context', { exact: true }).click();
  await page.getByLabel('Preparation experience', { exact: true }).selectOption('some-preparation');
  await page.getByRole('button', { name: 'Apply custom plan' }).click();
  await expect(status).toContainText('1240');
  await expect(status).toContainText('context only');
  await page.getByRole('button', { name: 'How it works', exact: true }).click();
  await page.getByRole('button', { name: 'Back to results' }).click();
  await expect(status).toContainText('context only');
});

test('invalid steps focus errors, preserve edits, and keep study context required', async ({ page }) => {
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await expect(page.getByLabel('Date of baseline test')).toBeFocused();
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('605');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toBeFocused();
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await expect(page.getByRole('heading', { name: 'A goal to explore' })).toBeFocused();
  await page.getByLabel('Target SAT score', { exact: true }).fill('1400');
  await page.getByLabel('Target test date').fill('2026-10-14');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await expect(page.getByLabel('Target test date')).toBeFocused();
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await expect(page.getByRole('alert')).toContainText('Choose at least one study method');
  await page.getByLabel('Not sure yet', { exact: true }).check();
  await page.getByText('Section allocation · 50% Math', { exact: true }).click();
  await page.getByLabel('Math share of study time', { exact: true }).fill('101');
  await page.getByText('Section allocation · 101% Math', { exact: true }).click();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await expect(page.getByLabel('Math share of study time', { exact: true })).toBeFocused();
  await page.getByLabel('Math share of study time', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await page.getByRole('button', { name: 'Edit baseline' }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await expect(page.getByLabel('Target SAT score', { exact: true })).toHaveValue('1400');
  await page.getByRole('button', { name: 'How it works', exact: true }).click();
  await page.getByRole('button', { name: 'Back to your plan' }).click();
  await expect(page.getByLabel('Target SAT score', { exact: true })).toBeVisible();
});

test('PSAT assessment changes preserve and revalidate scores; below-floor scores stop early', async ({ page }) => {
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('800');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByLabel('Assessment', { exact: true }).selectOption('psat-nmsqt');
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('800');
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Math section score', { exact: true }).fill('160');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await expect(page.getByRole('alert')).toContainText('below the SAT floor');
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('160');
  await expect(page.getByRole('heading', { name: 'Your starting point' })).toBeVisible();
});

test('zero hours stays flat and the 40-hour preset is unavailable', async ({ page }) => {
  await results(page, '0');
  await expect(page.getByText('Central modeled total', { exact: true }).locator('..')).toContainText('1200');
  await page.getByRole('button', { name: /Increased Practice/ }).click();
  await expect(page.getByRole('status')).toContainText('curves match');
  await page.getByRole('button', { name: 'Edit preparation' }).click();
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await page.getByLabel('Weekly study hours').fill('40');
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await page.getByRole('button', { name: 'Run simulation' }).click();
  await expect(page.getByRole('button', { name: /Increased Practice/ })).toBeDisabled();
});

test('reset asks before clearing; refresh clears in-memory values', async ({ page }) => {
  await baseline(page);
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Start over', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A goal to explore' })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Start over', exact: true }).click();
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toBeEmpty();
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.reload();
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toBeEmpty();
});

test('motion can be paused and reduced-motion keeps complete results with no animations', async ({ page }) => {
  await page.getByRole('button', { name: 'Pause motion' }).click();
  await expect(page.getByRole('button', { name: 'Resume motion' })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  await page.getByRole('button', { name: 'Resume motion' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await results(page);
  await expect(page.getByText('Central modeled total', { exact: true }).locator('..')).toContainText('1240');
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  await page.getByRole('slider', { name: 'Explore timeline' }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('slider', { name: 'Explore timeline' })).toHaveAttribute('aria-valuetext', 'Oct 14, 2026, current 1200');
});
