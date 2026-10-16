import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('anonymous feedback sends only explicit fields, keeps failed drafts, and preserves the study plan', async ({ page }) => {
  const payloads: unknown[] = [];
  await page.route('https://formspree.io/f/mdeaydqy', async route => {
    payloads.push(route.request().postDataJSON());
    expect(route.request().headers()['referer']).toBeUndefined();
    expect(route.request().headers()['cookie']).toBeUndefined();
    await route.fulfill({ status: payloads.length === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify({ ok: payloads.length > 1 }) });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start simulation', exact: true }).click();
  await page.getByLabel('Math section score', { exact: true }).fill('610');
  await page.getByRole('button', { name: 'Send Feedback', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Send feedback' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('input')).toHaveCount(0);
  await dialog.getByLabel('Your message').fill('The chart is difficult to read on my phone.');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('couldn’t confirm delivery');
  await expect(dialog.getByLabel('Your message')).toHaveValue('The chart is difficult to read on my phone.');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Your feedback was sent');
  expect(payloads).toEqual(Array(2).fill({ category: 'issue', message: 'The chart is difficult to read on my phone.' }));
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('610');
});

test('feedback dialog supports keyboard dismissal, accessibility and narrow enlarged text', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Send Feedback', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close feedback' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 320, height: 640 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await trigger.click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  await dialog.getByLabel('Your message').fill('An anonymous suggestion about the interface.');
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await trigger.click();
  await expect(dialog.getByLabel('Your message')).toHaveValue('An anonymous suggestion about the interface.');
});
