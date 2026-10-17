export const plannerDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type PlannerDay = typeof plannerDays[number];
export type PlannerMethod = 'targeted-practice' | 'full-length-tests' | 'mistake-review' | 'tutoring-class' | 'unsure';
export type PlannerFrequency = 'none' | 'every-four-weeks' | 'every-two-weeks' | 'weekly';
export type StudyPlannerRequest = {
  weeklyHours: number;
  availableDays: PlannerDay[];
  studyMethods: PlannerMethod[];
  practiceTestFrequency: PlannerFrequency;
  mathSharePercent: number;
};
export type StudyPlan = {
  plans: Array<{
    appliesToWeeks: number[];
    totalMinutes: number;
    mathMinutes: number;
    readingWritingMinutes: number;
    practiceTestMinutes: number;
    sessions: Array<{
      day: PlannerDay;
      durationMinutes: number;
      activities: Array<{
        kind: 'practice' | 'test';
        durationMinutes: number;
        focus: string;
        method: string;
        mathMinutes: number;
        readingWritingMinutes: number;
      }>;
    }>;
  }>;
  weeklyMinutes: number;
  notes: string[];
};

export function formatStudyDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} hr${rest ? ` ${rest} min` : ''}` : `${rest} min`;
}

export function coveredWeeks(weeks: number[]) {
  return `${weeks.length === 1 ? 'Week' : 'Weeks'} ${weeks.join(', ')}`;
}

export async function requestStudyPlan(input: StudyPlannerRequest): Promise<StudyPlan> {
  const response = await fetch('/api/study_plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(input),
  });
  const result = await response.json() as StudyPlan | { error?: string };
  if (!response.ok) throw new Error('error' in result && result.error ? result.error : 'We could not build your plan. Please try again.');
  return result as StudyPlan;
}
