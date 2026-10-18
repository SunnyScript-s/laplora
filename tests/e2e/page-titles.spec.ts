import { expect, test } from '@playwright/test';

test('direct pages and refreshes use the matching tab title', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  const pages = [
    { url: '/', title: "Laplora | See What's Possible", heading: /A clearer view of your/ },
    { url: '/?page=setup', title: 'Your preparation plan', heading: 'Your starting point' },
    { url: '/?page=how', title: 'How It Works', heading: 'How Laplora works' },
    { url: '/?page=pricing', title: 'Laplora Pro', heading: 'Laplora Pro' },
    { url: '/?page=beta', title: 'About the beta', heading: 'About the Laplora beta' },
  ];

  for (const current of pages) {
    await page.goto(current.url);
    await expect(page).toHaveTitle(current.title);
    await expect(page.getByRole('heading', { level: 1, name: current.heading })).toBeVisible();
    await page.reload();
    await expect(page).toHaveTitle(current.title);
    await expect(page.getByRole('heading', { level: 1, name: current.heading })).toBeVisible();
  }

  // Results are intentionally kept in memory; refreshing a results URL resumes at setup.
  await page.goto('/?page=results');
  await expect(page).toHaveTitle('Your preparation plan');
  await expect(page.getByRole('heading', { level: 1, name: 'Your starting point' })).toBeVisible();
  await expect(page).toHaveURL(/\?page=setup$/);
});

test('titles follow in-app navigation and browser back and forward', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Laplora | See What's Possible");

  await page.getByRole('button', { name: 'Start simulation' }).click();
  await expect(page).toHaveTitle('Your preparation plan');
  await page.getByRole('button', { name: 'How it works' }).click();
  await expect(page).toHaveTitle('How It Works');
  await page.getByRole('button', { name: 'Laplora Pro' }).click();
  await expect(page).toHaveTitle('Laplora Pro');
  await page.getByRole('button', { name: 'About the beta' }).click();
  await expect(page).toHaveTitle('About the beta');

  for (const title of ['Laplora Pro', 'How It Works', 'Your preparation plan', "Laplora | See What's Possible"]) {
    await page.goBack();
    await expect(page).toHaveTitle(title);
  }
  for (const title of ['Your preparation plan', 'How It Works', 'Laplora Pro', 'About the beta']) {
    await page.goForward();
    await expect(page).toHaveTitle(title);
  }
});

test('simulation results title returns to setup when result state is refreshed away', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-14T17:00:00Z'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Start simulation' }).click();
  await page.getByLabel('Date of baseline test').fill('2026-10-01');
  await page.getByLabel('Math section score', { exact: true }).fill('600');
  await page.getByLabel('Reading & Writing section score', { exact: true }).fill('600');
  await page.getByRole('button', { name: 'Next: your goal' }).click();
  await page.getByLabel('Target SAT score').fill('1400');
  await page.getByLabel('Target test date').fill('2027-01-06');
  await page.getByRole('button', { name: 'Next: study plan' }).click();
  await page.getByLabel('Review of mistakes', { exact: true }).check();
  await page.getByRole('button', { name: 'Review your plan' }).click();
  await page.getByRole('button', { name: 'Run simulation' }).click();

  await expect(page).toHaveTitle('Your modeled trajectories');
  await expect(page).toHaveURL(/\?page=results$/);
  await page.goBack();
  await expect(page).toHaveTitle('Your preparation plan');
  await page.goForward();
  await expect(page).toHaveTitle('Your modeled trajectories');
  await page.reload();
  await expect(page).toHaveTitle('Your preparation plan');
  await expect(page.getByRole('heading', { level: 1, name: 'Your starting point' })).toBeVisible();
});
