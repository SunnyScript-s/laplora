export const CURRENT_DATE = '2026-10-14';

export function studentInput(overrides: Record<string, unknown> = {}) {
  return {
    baselineSource: 'official',
    baselineAssessment: 'sat',
    baselineDate: '2026-10-01',
    mathScore: 600,
    readingWritingScore: 600,
    targetScore: 1400,
    targetDate: '2027-01-06',
    weeklyStudyHours: 3,
    consistencyPercent: 70,
    prepHistory: 'some-preparation',
    studyMethods: ['targeted-practice', 'mistake-review'],
    practiceTestFrequency: 'every-two-weeks',
    ...overrides,
  };
}
