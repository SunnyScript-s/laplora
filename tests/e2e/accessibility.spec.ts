import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function scan(page: Page, state: string) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map(violation => ({ id: violation.id, impact: violation.impact, elements: violation.nodes.map(node => node.target) })), state).toEqual([]);
}
test('core screens and error states pass automated accessibility checks', async ({ page }) => {
  // Nine complete scans can exceed the default 30s under WebKit on the shared cloud CPU.
  test.setTimeout(60_000);
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await scan(page, 'landing');
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await scan(page, 'baseline');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await scan(page, 'baseline errors');
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await scan(page, 'goal');
  await page.getByLabel('Target SAT score', { exact: true }).fill('1400');
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await scan(page, 'study plan');
  await page.getByLabel('Review of mistakes', { exact: true }).check();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await scan(page, 'review');
  await page.getByRole('button', { name: 'Run simulation' }).click();
  await page.getByRole('button', { name: /Increased Practice/ }).click();
  await page.getByText('View date and section data', { exact: true }).click();
  await scan(page, 'results with comparison and table');
  await page.getByLabel('Weekly hours', { exact: true }).fill('41');
  await page.getByRole('button', { name: 'Apply custom plan' }).click();
  await scan(page, 'comparison errors');
  await page.getByRole('button', { name: 'How it works', exact: true }).click();
  await scan(page, 'How It Works with inactive results hidden');
});

test('320px reflow and large text preserve usable controls throughout the flow', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.addStyleTag({ content: ':root { font-size: 200%; }' });
  async function fits(state: string) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), state).toBe(true);
    const clipped = await page.evaluate(() => [...document.querySelectorAll('button,input,select,summary')].filter(element => element.getClientRects().length > 0).filter(element => {
      const rect = element.getBoundingClientRect(); return rect.left < -1 || rect.right > innerWidth + 1;
    }).map(element => element.textContent || element.id));
    expect(clipped, state).toEqual([]);
  }
  await fits('landing');
  await page.getByRole('button', { name: 'Start simulation' }).click(); await fits('baseline');
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click(); await fits('goal');
  await page.getByLabel('Target SAT score', { exact: true }).fill('1400');
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click(); await fits('study');
  await page.getByLabel('Review of mistakes', { exact: true }).check();
  await page.getByRole('button', { name: 'Review your plan' }).click(); await fits('review');
  await page.getByRole('button', { name: 'Run simulation' }).click(); await fits('results');
  await page.getByRole('button', { name: 'How it works', exact: true }).click(); await fits('How It Works');
});
