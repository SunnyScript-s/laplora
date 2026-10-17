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

test('sends only scheduling preferences and renders a temporary Python plan', async ({ page }) => {
  let sent: Record<string, unknown> | undefined;
  await page.route('**/api/study_plan', async route => {
    sent = route.request().postDataJSON();
    await route.fulfill({ json: {
      weeklyMinutes: 180,
      notes: ['This is a flexible study schedule, not a score prediction.'],
      weeks: Array.from({ length: 4 }, (_, index) => ({
        week: index + 1,
        totalMinutes: 180,
        sessions: [{ day: 'Monday', durationMinutes: 180, activities: [{ durationMinutes: 45, focus: 'Math practice', method: 'Review missed and uncertain questions' }] }],
      })),
    } });
  });
  await openStudyPlan(page);
  await page.getByRole('button', { name: 'Build my study week' }).click();
  await expect(page.getByRole('heading', { name: 'Your four-week schedule' })).toBeVisible();
  await expect(page.getByText('Week 1 · 3 hr')).toBeVisible();
  expect(sent).toEqual({
    weeklyHours: 3,
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    studyMethods: ['mistake-review'],
    practiceTestFrequency: 'none',
    mathSharePercent: 50,
  });
  expect(sent).not.toHaveProperty('mathScore');
  expect(sent).not.toHaveProperty('readingWritingScore');
  expect(sent).not.toHaveProperty('targetScore');
  expect(sent).not.toHaveProperty('targetDate');
  await expect(page.getByText(/never receives SAT scores, goals, dates/)).toBeVisible();
});

test('shows a safe error when the Python planner cannot fit the schedule', async ({ page }) => {
  await page.route('**/api/study_plan', route => route.fulfill({ status: 422, json: { error: 'A full-length practice test needs about 2 hours 15 minutes.' } }));
  await openStudyPlan(page);
  await page.getByLabel('Weekly study hours').fill('1.5');
  await page.getByLabel('Practice-test frequency').selectOption('weekly');
  await page.getByRole('button', { name: 'Build my study week' }).click();
  await expect(page.getByRole('alert')).toContainText('A full-length practice test needs about 2 hours 15 minutes');
});
