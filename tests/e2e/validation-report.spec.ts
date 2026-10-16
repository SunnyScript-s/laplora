import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { importDataset } from '../../validation/dataset';
import { evaluate } from '../../validation/evaluate';
import { renderReports } from '../../validation/report';

test('private report renders offline, supports keyboard disclosure and fits narrow screens', async ({ page }) => {
  const imported = importDataset(readFileSync('validation/fixtures/synthetic.csv', 'utf8'), '2026-10-16');
  const report = renderReports({ dataKind: 'synthetic', asOf: '2026-10-16', inputSha256: 'browser-fixture', issues: [], evaluation: evaluate(imported.records) });
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  // Managed cloud browsers may block file URLs; render the exact self-contained HTML.
  await page.setContent(report.html);
  await expect(page.getByRole('heading', { name: 'Model validation dashboard', exact: true })).toBeVisible();
  await expect(page.locator('svg')).toHaveCount(6);
  const summary = page.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details')).not.toHaveAttribute('open');
  await page.keyboard.press('Enter');
  await expect(page.locator('details')).toHaveAttribute('open');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).setLegacyMode().withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  expect(requests).toEqual([]);
});
