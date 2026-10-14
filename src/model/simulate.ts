import { addCalendarDays } from '../domain/dates';
import type { CalendarDate } from '../domain/dates';
import { validateInput } from '../domain/inputs';
import type { InvalidInput, SimulationInput, SimulationWarning, ValidInput } from '../domain/inputs';
import { displayScores, sectionScoreAtWeek } from './math';
import type { CombinedScores } from './math';
import { MODEL_V01 } from './parameters';
import type { SensitivityCase } from './parameters';

export interface TrajectoryPoint extends CombinedScores {
  date: CalendarDate;
  weeks: number;
}

export interface ObservedBaseline extends CombinedScores {
  assessment: SimulationInput['baselineAssessment'];
  source: SimulationInput['baselineSource'];
  date: CalendarDate;
}

export interface NeedsSatBaseline {
  status: 'needs-sat-baseline';
  input: SimulationInput;
  observedBaseline: ObservedBaseline;
  simulationStartDate: CalendarDate;
  warnings: SimulationWarning[];
  message: string;
}

export interface Trajectory {
  points: TrajectoryPoint[];
  endpoint: TrajectoryPoint;
  displayedEndpoint: CombinedScores;
}

export interface SimulatedResult {
  status: 'simulated';
  input: SimulationInput;
  observedBaseline: ObservedBaseline;
  simulationStartDate: CalendarDate;
  model: typeof MODEL_V01;
  warnings: SimulationWarning[];
  assumptions: string[];
  trajectories: Record<SensitivityCase, Trajectory>;
  goal: {
    targetScore: number;
    centralGap: number;
    relation: 'below-target' | 'at-target' | 'above-target';
  };
}

export type SimulationResult = InvalidInput | NeedsSatBaseline | SimulatedResult;

function baseline(input: SimulationInput): ObservedBaseline {
  return {
    assessment: input.baselineAssessment,
    source: input.baselineSource,
    date: input.baselineDate,
    math: input.mathScore,
    readingWriting: input.readingWritingScore,
    total: input.mathScore + input.readingWritingScore,
  };
}

function trajectory(validated: ValidInput, sensitivity: SensitivityCase): Trajectory {
  const { input, simulationStartDate, daysUntilExam } = validated;
  const rates = MODEL_V01.learningRates[sensitivity];
  const mathAllocation = input.mathSharePercent / 100;

  const point = (elapsedDays: number): TrajectoryPoint => {
    const weeks = elapsedDays / 7;
    const common = { weeks, consistency: input.consistencyPercent / 100 };
    const math = sectionScoreAtWeek({
      ...common, baseline: input.mathScore,
      assignedWeeklyHours: input.weeklyStudyHours * mathAllocation,
      learningRate: rates.math, saturationHours: MODEL_V01.saturationHours.math,
    });
    const readingWriting = sectionScoreAtWeek({
      ...common, baseline: input.readingWritingScore,
      assignedWeeklyHours: input.weeklyStudyHours * (1 - mathAllocation),
      learningRate: rates.readingWriting, saturationHours: MODEL_V01.saturationHours.readingWriting,
    });
    return { date: addCalendarDays(simulationStartDate, elapsedDays), weeks, math, readingWriting, total: math + readingWriting };
  };

  const points: TrajectoryPoint[] = [];
  for (let days = 0; days < daysUntilExam; days += 7) points.push(point(days));
  const endpoint = point(daysUntilExam);
  points.push(endpoint);
  return { points, endpoint, displayedEndpoint: displayScores(endpoint) };
}

/** Unknown input crosses validation once; all math below is clock/network/UI independent. */
export function simulate(rawInput: unknown, currentDate: unknown): SimulationResult {
  const validated = validateInput(rawInput, currentDate);
  if (validated.status === 'invalid-input') return validated;
  const { input, simulationStartDate, warnings } = validated;
  const observedBaseline = baseline(input);
  if (input.mathScore < 200 || input.readingWritingScore < 200) {
    return {
      status: 'needs-sat-baseline', input, observedBaseline, simulationStartDate, warnings,
      message: 'Your PSAT observation is valid, but a section is below the SAT score floor of 200. Enter an official full-length SAT practice result to model an SAT trajectory. We have not changed or rescaled your observation.',
    };
  }

  const trajectories = {
    slower: trajectory(validated, 'slower'),
    central: trajectory(validated, 'central'),
    faster: trajectory(validated, 'faster'),
  };
  const centralGap = input.targetScore - trajectories.central.displayedEndpoint.total;
  return {
    status: 'simulated', input, observedBaseline, simulationStartDate,
    model: MODEL_V01, warnings, trajectories,
    assumptions: [
      'This educational model uses experimental coefficients; it is not a validated prediction or a guarantee.',
      'The observed score is used as a hypothetical starting point today; intervening growth has not been estimated.',
      `Study hours are allocated ${input.mathSharePercent}% to Math and ${100 - input.mathSharePercent}% to Reading & Writing.`,
      'Weekly hours include tests and review. History, methods, and test frequency receive no separate numerical bonuses.',
      'The illustrative assumption range only varies learning rates. Actual outcomes may fall outside it, including below the baseline.',
      'The model has no passive growth, forgetting, or test-day variability term.',
    ],
    goal: { targetScore: input.targetScore, centralGap, relation: centralGap > 0 ? 'below-target' : centralGap < 0 ? 'above-target' : 'at-target' },
  };
}
