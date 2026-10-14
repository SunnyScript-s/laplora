import { MODEL_V01 } from './parameters';

function requireRange(value: number, min: number, max: number, name: string): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${name} must be finite and between ${min} and ${max}.`);
  }
}

export interface SectionGrowth {
  baseline: number;
  assignedWeeklyHours: number;
  consistency: number;
  weeks: number;
  learningRate: number;
  saturationHours: number;
}

export function sectionScoreAtWeek(values: SectionGrowth): number {
  const { baseline, assignedWeeklyHours, consistency, weeks, learningRate, saturationHours } = values;
  requireRange(baseline, 200, 800, 'Baseline');
  requireRange(assignedWeeklyHours, 0, 40, 'Assigned weekly hours');
  requireRange(consistency, 0, 1, 'Consistency');
  requireRange(weeks, 0, 104, 'Weeks');
  requireRange(learningRate, 0, Number.MAX_VALUE, 'Learning rate');
  if (!Number.isFinite(saturationHours) || saturationHours <= 0) throw new RangeError('Saturation hours must be finite and positive.');

  // Preserve degenerate cases exactly, even for unusually large finite utility parameters.
  if (baseline === 800 || weeks === 0 || assignedWeeklyHours === 0 || consistency === 0 || learningRate === 0) return baseline;

  const effectiveHours = consistency * saturationHours * -Math.expm1(-assignedWeeklyHours / saturationHours);
  const usedRoomFraction = -Math.expm1(-learningRate * effectiveHours * weeks);
  return baseline + (MODEL_V01.sectionCeiling - baseline) * usedRoomFraction;
}

export interface SectionScores {
  math: number;
  readingWriting: number;
}

export interface CombinedScores extends SectionScores {
  total: number;
}

/** Derive a total after section rounding; never independently round a total. */
export function displayScores(scores: SectionScores): CombinedScores {
  requireRange(scores.math, 200, 800, 'Math score');
  requireRange(scores.readingWriting, 200, 800, 'Reading & Writing score');
  const math = Math.round(scores.math / 10) * 10;
  const readingWriting = Math.round(scores.readingWriting / 10) * 10;
  return { math, readingWriting, total: math + readingWriting };
}
