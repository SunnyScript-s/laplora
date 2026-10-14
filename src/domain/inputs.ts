import { z } from 'zod';
import { daysBetween, parseCalendarDate } from './dates';
import type { CalendarDate } from './dates';

export const INPUT_LIMITS = Object.freeze({
  maxWeeklyHours: 40,
  maxHorizonDays: 728,
  intensiveHours: 20,
  longHorizonDays: 182,
  oldBaselineDays: 90,
  veryOldBaselineDays: 365,
});

const dateSchema = z.string().transform((value, context) => {
  const date = parseCalendarDate(value);
  if (!date) {
    context.addIssue({ code: 'custom', message: 'Enter a real date in YYYY-MM-DD format.' });
    return z.NEVER;
  }
  return date;
});

const sectionScoreSchema = z.number().int().min(160).max(800).multipleOf(10);

const inputSchema = z.strictObject({
  baselineSource: z.enum(['official', 'official-practice']),
  baselineAssessment: z.enum(['sat', 'psat-nmsqt', 'psat-10']),
  baselineDate: dateSchema,
  mathScore: sectionScoreSchema,
  readingWritingScore: sectionScoreSchema,
  targetScore: z.number().int().min(400).max(1600).multipleOf(10),
  targetDate: dateSchema,
  weeklyStudyHours: z.number().min(0).max(INPUT_LIMITS.maxWeeklyHours).multipleOf(0.25),
  consistencyPercent: z.number().int().min(0).max(100),
  prepHistory: z.enum(['just-starting', 'some-preparation', 'consistent-preparation']),
  studyMethods: z.array(z.enum(['targeted-practice', 'full-length-tests', 'mistake-review', 'tutoring-class', 'unsure'])).min(1),
  practiceTestFrequency: z.enum(['none', 'every-four-weeks', 'every-two-weeks', 'weekly']),
  mathSharePercent: z.number().min(0).max(100).default(50),
}).superRefine((input, context) => {
  const min = input.baselineAssessment === 'sat' ? 200 : 160;
  const max = input.baselineAssessment === 'sat' ? 800 : 760;
  for (const field of ['mathScore', 'readingWritingScore'] as const) {
    if (input[field] < min || input[field] > max) {
      context.addIssue({ code: 'custom', path: [field], message: `This assessment requires a section score from ${min} to ${max}, in tens.` });
    }
  }
  if (new Set(input.studyMethods).size !== input.studyMethods.length) {
    context.addIssue({ code: 'custom', path: ['studyMethods'], message: 'Choose each study method only once.' });
  }
  if (input.studyMethods.includes('unsure') && input.studyMethods.length > 1) {
    context.addIssue({ code: 'custom', path: ['studyMethods'], message: 'Choose either Unsure or specific study methods.' });
  }
});

export type SimulationInput = z.infer<typeof inputSchema>;
export type StudyPlanField = 'weeklyStudyHours' | 'consistencyPercent' | 'prepHistory' | 'studyMethods' | 'practiceTestFrequency' | 'mathSharePercent';
export const STUDY_PLAN_FIELDS: readonly StudyPlanField[] = Object.freeze([
  'weeklyStudyHours', 'consistencyPercent', 'prepHistory', 'studyMethods', 'practiceTestFrequency', 'mathSharePercent',
]);

export interface InputError {
  field: keyof SimulationInput | 'form' | 'simulationStartDate';
  message: string;
}

export type WarningCode = 'baseline-as-start' | 'old-baseline' | 'very-old-baseline' | 'psat-shared-scale' | 'psat-ceiling' | 'intensive-study' | 'long-horizon' | 'practice-budget' | 'frequent-practice' | 'goal-at-or-below-baseline' | 'zero-effective-study';

export interface SimulationWarning {
  code: WarningCode;
  severity: 'info' | 'warning';
  message: string;
}

export interface ValidInput {
  status: 'valid-input';
  input: SimulationInput;
  simulationStartDate: CalendarDate;
  daysUntilExam: number;
  baselineAgeDays: number;
  warnings: SimulationWarning[];
}

export interface InvalidInput {
  status: 'invalid-input';
  errors: InputError[];
}

export type ValidationResult = ValidInput | InvalidInput;

/** Parse form text deliberately: blank text, exponents, and coercible objects are not zero. */
export function parseNumericInput(value: string): number | undefined {
  const text = value.trim();
  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) return undefined;
  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
}

export function validateInput(rawInput: unknown, currentDate: unknown): ValidationResult {
  const simulationStartDate = parseCalendarDate(currentDate);
  if (!simulationStartDate) {
    return { status: 'invalid-input', errors: [{ field: 'simulationStartDate', message: 'A valid current calendar date is required.' }] };
  }
  const parsed = inputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      status: 'invalid-input',
      errors: parsed.error.issues.map((issue) => ({
        field: (issue.path[0] ?? 'form') as InputError['field'],
        message: issue.message,
      })),
    };
  }

  const input = parsed.data;
  const baselineAgeDays = daysBetween(input.baselineDate, simulationStartDate);
  const daysUntilExam = daysBetween(simulationStartDate, input.targetDate);
  const errors: InputError[] = [];
  if (baselineAgeDays < 0) errors.push({ field: 'baselineDate', message: 'The baseline date cannot be in the future.' });
  if (daysUntilExam <= 0) errors.push({ field: 'targetDate', message: 'Choose a test date after today.' });
  if (daysUntilExam > INPUT_LIMITS.maxHorizonDays) errors.push({ field: 'targetDate', message: 'Choose a test date within 104 weeks.' });
  if (errors.length) return { status: 'invalid-input', errors };

  const warnings: SimulationWarning[] = [{
    code: 'baseline-as-start', severity: 'info',
    message: `We use your ${input.baselineDate} observation as a hypothetical starting score on ${simulationStartDate}. No improvement since that test has been estimated.`,
  }];
  const warn = (code: WarningCode, message: string, severity: SimulationWarning['severity'] = 'warning') => warnings.push({ code, message, severity });

  if (baselineAgeDays > INPUT_LIMITS.veryOldBaselineDays) {
    warn('very-old-baseline', 'This score is more than 365 days old and may not reflect your current performance. Consider a newer official full-length result.');
  } else if (baselineAgeDays > INPUT_LIMITS.oldBaselineDays) {
    warn('old-baseline', 'This score is more than 90 days old and may not reflect your current performance. We have not estimated improvement since that test.');
  }
  if (input.baselineAssessment !== 'sat') {
    warn('psat-shared-scale', 'This PSAT observation uses the shared score scale without rescaling. No same-day SAT result was observed.', 'info');
    if (input.mathScore === 760 || input.readingWritingScore === 760) {
      warn('psat-ceiling', 'A section is at the PSAT ceiling. This score may not reveal higher proficiency; no extra points have been added.');
    }
  }
  if (input.weeklyStudyHours > INPUT_LIMITS.intensiveHours) warn('intensive-study', 'This is an intensive hypothetical schedule. Check whether it is realistic; the model does not establish a recommended workload.');
  if (daysUntilExam > INPUT_LIMITS.longHorizonDays) warn('long-horizon', 'This long horizon extrapolates a fixed experimental rate. Its outcome is not calibrated and can overstate progress.');
  if (input.targetScore <= input.mathScore + input.readingWritingScore) warn('goal-at-or-below-baseline', 'Your target is at or below the observed baseline total. The target does not change modeled growth.', 'info');
  if (input.weeklyStudyHours === 0 || input.consistencyPercent === 0) warn('zero-effective-study', 'The practice-driven model stays flat with zero effective study. Actual test scores can still rise or fall.', 'info');

  const weeklyTestHours = { none: 0, 'every-four-weeks': 0.6, 'every-two-weeks': 1.2, weekly: 2.4 }[input.practiceTestFrequency];
  if (weeklyTestHours > 0 && weeklyTestHours >= input.weeklyStudyHours / 2) {
    warn('practice-budget', 'Using an approximate 2.4 hours per full test with a break, your test schedule appears to use at least half of the weekly budget. Leave time for review; actual durations may differ.');
  }
  if (input.practiceTestFrequency === 'weekly') warn('frequent-practice', 'College Board recommends spacing practice tests by at least two weeks when possible. Your test frequency receives no automatic score bonus.');

  return { status: 'valid-input', input, simulationStartDate, daysUntilExam, baselineAgeDays, warnings };
}
