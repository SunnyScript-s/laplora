import { addCalendarDays } from '../domain/dates';
import type { CalendarDate } from '../domain/dates';
import { parseNumericInput, validateInput } from '../domain/inputs';
import type { InputError, SimulationInput } from '../domain/inputs';

export const numericFields = ['mathScore', 'readingWritingScore', 'targetScore', 'weeklyStudyHours', 'consistencyPercent', 'mathSharePercent'] as const;
type NumericField = typeof numericFields[number];
export type Draft = Omit<SimulationInput, NumericField | 'baselineDate' | 'targetDate'> & Record<NumericField | 'baselineDate' | 'targetDate', string>;
export const stepFields: readonly (readonly (keyof Draft)[])[] = [
  ['baselineSource', 'baselineAssessment', 'baselineDate', 'mathScore', 'readingWritingScore'],
  ['targetScore', 'targetDate'],
  ['weeklyStudyHours', 'consistencyPercent', 'prepHistory', 'studyMethods', 'practiceTestFrequency', 'mathSharePercent'],
];
export const labels: Record<keyof Draft, string> = {
  baselineSource: 'Score source', baselineAssessment: 'Assessment', baselineDate: 'Date of baseline test',
  mathScore: 'Math section score', readingWritingScore: 'Reading & Writing section score', targetScore: 'Target SAT score',
  targetDate: 'Target test date', weeklyStudyHours: 'Weekly study hours', consistencyPercent: 'Study consistency',
  prepHistory: 'Preparation experience', studyMethods: 'Study methods', practiceTestFrequency: 'Practice-test frequency', mathSharePercent: 'Math share of study time',
};
export const historyLabels = { 'just-starting': 'Just starting', 'some-preparation': 'Some preparation', 'consistent-preparation': 'Preparing consistently' };
export const methodLabels = { 'targeted-practice': 'Targeted questions / skill lessons', 'full-length-tests': 'Full-length practice tests', 'mistake-review': 'Review of mistakes', 'tutoring-class': 'Tutoring / class', unsure: 'Not sure yet' };
export const frequencyLabels = { none: 'None planned', 'every-four-weeks': 'Every four weeks', 'every-two-weeks': 'Every two weeks', weekly: 'Weekly' };
export const assessmentLabels = { sat: 'SAT', 'psat-nmsqt': 'PSAT/NMSQT', 'psat-10': 'PSAT 10' };

export function emptyDraft(): Draft {
  return { baselineSource: 'official', baselineAssessment: 'sat', baselineDate: '', mathScore: '', readingWritingScore: '', targetScore: '', targetDate: '', weeklyStudyHours: '3', consistencyPercent: '70', prepHistory: 'just-starting', studyMethods: [], practiceTestFrequency: 'none', mathSharePercent: '50' };
}
export function candidate(draft: Draft) {
  return { ...draft, ...Object.fromEntries(numericFields.map(field => [field, parseNumericInput(draft[field])])) };
}
export function stepErrors(draft: Draft, step: number, today: CalendarDate): InputError[] {
  // Placeholder values validate only unrelated steps; they never enter a submitted simulation.
  const values = { ...candidate(draft) };
  if (step === 0) Object.assign(values, { targetDate: addCalendarDays(today, 84), targetScore: 1400, weeklyStudyHours: 3, consistencyPercent: 70, mathSharePercent: 50, studyMethods: ['unsure'] });
  if (step === 1) Object.assign(values, { baselineDate: today, mathScore: 600, readingWritingScore: 600, weeklyStudyHours: 3, consistencyPercent: 70, mathSharePercent: 50, studyMethods: ['unsure'] });
  if (step === 2) Object.assign(values, { baselineDate: today, mathScore: 600, readingWritingScore: 600, targetDate: addCalendarDays(today, 84), targetScore: 1400 });
  const result = validateInput(values, today);
  if (result.status === 'valid-input') return [];
  return friendlyErrors(result.errors, draft).filter(error => stepFields[step]?.includes(error.field as keyof Draft));
}
export function friendlyErrors(errors: InputError[], draft: Draft): InputError[] {
  return errors.map(error => {
    if (numericFields.includes(error.field as NumericField) && parseNumericInput(draft[error.field as NumericField]) === undefined) {
      return { ...error, message: `Enter a number for ${labels[error.field as NumericField].toLowerCase()}.` };
    }
    if (error.field === 'studyMethods' && draft.studyMethods.length === 0) return { ...error, message: 'Choose at least one study method, or select Not sure yet.' };
    if (error.field === 'mathScore' || error.field === 'readingWritingScore') return { ...error, message: `Enter a ${draft.baselineAssessment === 'sat' ? '200–800' : '160–760'} section score in increments of 10.` };
    if (error.field === 'targetScore') return { ...error, message: 'Enter a target SAT total from 400 to 1600 in increments of 10.' };
    if (error.field === 'weeklyStudyHours') return { ...error, message: 'Enter weekly hours from 0 to 40 in quarter-hour increments.' };
    if (error.field === 'consistencyPercent') return { ...error, message: 'Enter a whole-number consistency percentage from 0 to 100.' };
    if (error.field === 'mathSharePercent') return { ...error, message: 'Enter a Math share from 0% to 100%.' };
    return error;
  });
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
