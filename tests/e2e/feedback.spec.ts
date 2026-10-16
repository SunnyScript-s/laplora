import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function mockCaptcha(page: import('@playwright/test').Page, token = 'test-captcha-token') {
  await page.addInitScript((captchaToken: string) => {
    (window as Window & { grecaptcha?: unknown }).grecaptcha = {
      ready: (callback: () => void) => callback(),
      execute: async () => captchaToken,
    };
  }, token);
}

test('anonymous feedback sends only explicit fields, keeps failed drafts, and preserves the study plan', async ({ page }) => {
  const payloads: unknown[] = [];
  await mockCaptcha(page);
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
  await expect(dialog.locator('input[type="email"]')).toHaveCount(0);
  await expect(dialog.getByLabel('Browser/device (optional)')).toHaveValue('');
  await expect(dialog.getByLabel('Usefulness rating (optional)')).toHaveValue('');
  await dialog.getByLabel('Your message').fill('The chart is difficult to read on my phone.');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('couldn’t confirm delivery');
  await expect(dialog.getByLabel('Your message')).toHaveValue('The chart is difficult to read on my phone.');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Your feedback was sent');
  expect(payloads).toEqual(Array(2).fill({ category: 'issue', message: 'The chart is difficult to read on my phone.', 'g-recaptcha-response': 'test-captcha-token' }));
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByLabel('Math section score', { exact: true })).toHaveValue('610');
});

test('feedback validates descriptions and sends optional details only when entered', async ({ page }) => {
  const payloads: unknown[] = [];
  await mockCaptcha(page);
  await page.route('https://formspree.io/f/mdeaydqy', async route => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Send Feedback', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Your message').fill('            ');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('at least 10 characters');
  expect(payloads).toEqual([]);
  await dialog.getByLabel('Feedback type').selectOption('confusing');
  await dialog.getByLabel('Your message').fill('  I could use a clearer chart legend.  ');
  await dialog.getByLabel('Usefulness rating (optional)').selectOption('4');
  await dialog.getByLabel('Browser/device (optional)').fill('  Safari on iPhone  ');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('sent');
  expect(payloads).toEqual([{ category: 'confusing', message: 'I could use a clearer chart legend.', rating: 4, device: 'Safari on iPhone', 'g-recaptcha-response': 'test-captcha-token' }]);
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Send Feedback', exact: true }).click();
  await expect(dialog.getByLabel('Browser/device (optional)')).toHaveValue('');
  await expect(dialog.getByLabel('Usefulness rating (optional)')).toHaveValue('');
  await dialog.getByLabel('Your message').fill('Another suggestion too soon after the last.');
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('wait 30 seconds');
  expect(payloads).toHaveLength(1);
});

test('spam trap blocks submission and an unacknowledged response never reports success', async ({ page }) => {
  let requests = 0;
  await mockCaptcha(page);
  await page.route('https://formspree.io/f/mdeaydqy', async route => {
    requests++;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Send Feedback', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Your message').fill('A valid description of an interface issue.');
  await dialog.locator('[name="_gotcha"]').fill('spam', { force: true });
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Unable to submit');
  expect(requests).toBe(0);
  await dialog.locator('[name="_gotcha"]').fill('', { force: true });
  await dialog.getByRole('button', { name: 'Send feedback', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('couldn’t confirm delivery');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  await expect(dialog.getByLabel('Your message')).toHaveValue('A valid description of an interface issue.');
  expect(requests).toBe(1);
});

test('feedback dialog supports keyboard dismissal, accessibility and narrow enlarged text', async ({ page }) => {
  await mockCaptcha(page);
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
