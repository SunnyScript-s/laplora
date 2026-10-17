import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function openStudyPlan(page: Page) {
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
}

test('uses section allocation, sends only scheduling preferences, and shows one distinct schedule', async ({ page }) => {
  let sent: Record<string, unknown> | undefined;
  await page.route('**/api/study_plan', async route => {
    sent = route.request().postDataJSON();
    await route.fulfill({ json: {
      weeklyMinutes: 180,
      notes: ['This is a flexible study schedule, not a score prediction.'],
      plans: [{
        appliesToWeeks: [1, 2, 3, 4],
        totalMinutes: 180,
        mathMinutes: 63,
        readingWritingMinutes: 117,
        practiceTestMinutes: 0,
        sessions: [{ day: 'Monday', durationMinutes: 180, activities: [{ kind: 'practice', durationMinutes: 180, focus: 'Math and Reading & Writing practice', method: 'Review missed and uncertain questions', mathMinutes: 63, readingWritingMinutes: 117 }] }],
      }],
    } });
  });
  await openStudyPlan(page);
  const allocation = page.getByText('Section allocation', { exact: false }).first();
  const planner = page.getByRole('heading', { name: 'Build a study week' });
  expect(await allocation.evaluate((element, other) => Boolean(element.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING), await planner.elementHandle())).toBe(true);
  await allocation.click();
  await page.getByLabel('Math share of study time').fill('35');
  await page.getByRole('button', { name: 'Build my study week' }).click();
  await expect(page.getByRole('heading', { name: 'Your study schedule' })).toBeVisible();
  await expect(page.getByText('Weeks 1, 2, 3, 4 · 3 hr')).toBeVisible();
  await expect(page.getByText(/Math study: 1 hr 3 min.*Reading & Writing study: 1 hr 57 min/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your study schedule' }).locator('..').locator('details')).toHaveCount(1);
  expect(sent).toEqual({
    weeklyHours: 3,
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    studyMethods: ['mistake-review'],
    practiceTestFrequency: 'none',
    mathSharePercent: 35,
  });
  expect(sent).not.toHaveProperty('mathScore');
  expect(sent).not.toHaveProperty('readingWritingScore');
  expect(sent).not.toHaveProperty('targetScore');
  expect(sent).not.toHaveProperty('targetDate');
  await expect(page.getByText(/never receives SAT scores, goals, dates/)).toBeVisible();
});

test('explains how to estimate study consistency', async ({ page }) => {
  await openStudyPlan(page);
  await page.getByText('How do I choose my consistency?').click();
  await expect(page.getByText(/if you plan 6 hours each week and usually complete about 4½ hours/)).toBeVisible();
  await expect(page.getByText(/It is not a measure of motivation/)).toBeVisible();
});

test('shows a safe error when the Python planner cannot fit the schedule', async ({ page }) => {
  await page.route('**/api/study_plan', route => route.fulfill({ status: 422, json: { error: 'A full-length practice test needs about 2 hours 15 minutes.' } }));
  await openStudyPlan(page);
  await page.getByLabel('Weekly study hours').fill('1.5');
  await page.getByLabel('Practice-test frequency').selectOption('weekly');
  await page.getByRole('button', { name: 'Build my study week' }).click();
  await expect(page.getByRole('alert')).toContainText('A full-length practice test needs about 2 hours 15 minutes');
});
