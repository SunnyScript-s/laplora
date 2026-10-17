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
  weeks: Array<{
    week: number;
    totalMinutes: number;
    sessions: Array<{
      day: PlannerDay;
      durationMinutes: number;
      activities: Array<{ durationMinutes: number; focus: string; method: string }>;
    }>;
  }>;
  weeklyMinutes: number;
  notes: string[];
};

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
