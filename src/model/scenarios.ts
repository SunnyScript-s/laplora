import { INPUT_LIMITS, STUDY_PLAN_FIELDS } from '../domain/inputs';
import type { InvalidInput, StudyPlanField } from '../domain/inputs';
import { SENSITIVITY_CASES } from './parameters';
import { simulate } from './simulate';
import type { NeedsSatBaseline, SimulatedResult } from './simulate';

export interface ScenarioChange {
  field: StudyPlanField;
  before: SimulatedResult['input'][StudyPlanField];
  after: SimulatedResult['input'][StudyPlanField];
}

export interface ScenarioComparison {
  status: 'compared';
  current: SimulatedResult;
  scenario: SimulatedResult;
  changes: ScenarioChange[];
  numericallyIdentical: boolean;
  descriptiveOnly: boolean;
  explanation: string;
}

export type ComparisonResult = ScenarioComparison | InvalidInput | NeedsSatBaseline;
const NUMERICAL_FIELDS: readonly StudyPlanField[] = ['weeklyStudyHours', 'consistencyPercent', 'mathSharePercent'];

function equivalent(before: ScenarioChange['before'], after: ScenarioChange['after']): boolean {
  if (Array.isArray(before) && Array.isArray(after)) {
    return before.length === after.length && before.every((value) => after.includes(value));
  }
  return before === after;
}

/** Only a study plan can change; observed data, goals, dates, and coefficients stay fixed. */
export function compareScenario(rawInput: unknown, currentDate: unknown, patch: unknown): ComparisonResult {
  const current = simulate(rawInput, currentDate);
  if (current.status !== 'simulated') return current;
  if (typeof patch !== 'object' || patch === null || (Object.getPrototypeOf(patch) !== Object.prototype && Object.getPrototypeOf(patch) !== null) || Object.keys(patch).some((key) => !STUDY_PLAN_FIELDS.includes(key as StudyPlanField))) {
    return { status: 'invalid-input', errors: [{ field: 'form', message: 'A scenario may change only the supported study-plan fields.' }] };
  }
  const scenario = simulate({ ...current.input, ...patch }, currentDate);
  if (scenario.status !== 'simulated') return scenario;
  const changes: ScenarioChange[] = STUDY_PLAN_FIELDS.filter((field) => !equivalent(current.input[field], scenario.input[field])).map((field) => ({ field, before: current.input[field], after: scenario.input[field] }));
  const descriptiveOnly = changes.length > 0 && !changes.some((change) => NUMERICAL_FIELDS.includes(change.field));
  const numericallyIdentical = SENSITIVITY_CASES.every((sensitivity) => current.trajectories[sensitivity].points.every((point, index) => {
    const other = scenario.trajectories[sensitivity].points[index];
    return other?.date === point.date && other.math === point.math && other.readingWriting === point.readingWriting;
  }));
  return {
    status: 'compared', current, scenario, changes, descriptiveOnly, numericallyIdentical,
    explanation: descriptiveOnly
      ? 'These changes affect context only. V0.1 does not quantify differences in methods, preparation history, or test frequency; the numerical curves are unchanged.'
      : numericallyIdentical
        ? 'The modeled curves match under these inputs and assumptions.'
        : 'The comparison changes the listed study inputs under the same experimental model. It does not guarantee a score difference.',
  };
}

export type IncreasedPracticeResult = ComparisonResult | { status: 'preset-unavailable'; message: string };

export function increasedPractice(rawInput: unknown, currentDate: unknown): IncreasedPracticeResult {
  const current = simulate(rawInput, currentDate);
  if (current.status !== 'simulated') return current;
  if (current.input.weeklyStudyHours === INPUT_LIMITS.maxWeeklyHours) {
    return { status: 'preset-unavailable', message: 'This plan is already at the 40-hour input limit. Increased Practice cannot raise hours within the accepted range.' };
  }
  return compareScenario(current.input, currentDate, { weeklyStudyHours: Math.min(INPUT_LIMITS.maxWeeklyHours, current.input.weeklyStudyHours * 2) });
}
