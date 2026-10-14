import { describe, expect, it } from 'vitest';
import { addCalendarDays, parseCalendarDate } from '../../src/domain/dates';
import { displayScores, sectionScoreAtWeek } from '../../src/model/math';
import { MODEL_V01, SENSITIVITY_CASES } from '../../src/model/parameters';
import { simulate } from '../../src/model/simulate';
import type { SimulatedResult } from '../../src/model/simulate';
import { CURRENT_DATE, studentInput } from './fixtures';

function result(overrides: Record<string, unknown> = {}): SimulatedResult {
  const outcome = simulate(studentInput(overrides), CURRENT_DATE);
  if (outcome.status !== 'simulated') throw new Error(`Expected a simulated fixture, got ${outcome.status}`);
  return outcome;
}

describe('model contract and reference cases', () => {
  it('matches the independently documented 12-week reference example', () => {
    const outcome = result();
    expect(outcome.model.version).toBe('0.1.0-experimental');
    expect(outcome.observedBaseline).toMatchObject({ math: 600, readingWriting: 600, total: 1200, date: '2026-10-01', assessment: 'sat' });
    expect(outcome.simulationStartDate).toBe(CURRENT_DATE);
    expect(outcome.trajectories.central.endpoint.math).toBeCloseTo(623.692011, 5);
    expect(outcome.trajectories.central.displayedEndpoint).toEqual({ math: 620, readingWriting: 620, total: 1240 });
    expect(outcome.trajectories.slower.displayedEndpoint.total).toBe(1220);
    expect(outcome.trajectories.faster.displayedEndpoint.total).toBe(1260);
    expect(outcome.goal).toEqual({ targetScore: 1400, centralGap: 160, relation: 'below-target' });
    expect(outcome.assumptions.join(' ')).toContain('not a validated prediction');
    expect(outcome.assumptions.join(' ')).toContain('Actual outcomes may fall outside');
  });

  it.each([
    [450, 525.541611, 1060], [600, 643.166635, 1280],
    [750, 760.791659, 1520], [800, 800, 1600],
  ])('matches the independent ceiling/reference example starting at %s', (baseline, expectedSection, expectedTotal) => {
    const outcome = result({ mathScore: baseline, readingWritingScore: baseline, weeklyStudyHours: 6, consistencyPercent: 80 });
    expect(outcome.trajectories.central.endpoint.math).toBeCloseTo(expectedSection, 5);
    expect(outcome.trajectories.central.displayedEndpoint.total).toBe(expectedTotal);
  });

  it('preserves the observed baseline at every sensitivity start', () => {
    const outcome = result({ mathScore: 700, readingWritingScore: 500 });
    for (const sensitivity of SENSITIVITY_CASES) {
      expect(outcome.trajectories[sensitivity].points[0]).toEqual({ date: CURRENT_DATE, weeks: 0, math: 700, readingWriting: 500, total: 1200 });
    }
  });

  it.each([{ weeklyStudyHours: 0 }, { consistencyPercent: 0 }])('keeps all curves flat when effective effort is zero', (override) => {
    const outcome = result(override);
    for (const sensitivity of SENSITIVITY_CASES) {
      expect(outcome.trajectories[sensitivity].points.every((point) => point.math === 600 && point.readingWriting === 600 && point.total === 1200)).toBe(true);
    }
    expect(outcome.warnings.some((warning) => warning.code === 'zero-effective-study')).toBe(true);
  });

  it('keeps an unallocated section flat while growing only the allocated section', () => {
    const allMath = result({ mathSharePercent: 100 });
    const allReading = result({ mathSharePercent: 0 });
    expect(allMath.trajectories.central.endpoint.readingWriting).toBe(600);
    expect(allMath.trajectories.central.endpoint.math).toBeGreaterThan(600);
    expect(allReading.trajectories.central.endpoint.math).toBe(600);
    expect(allReading.trajectories.central.endpoint.readingWriting).toBeGreaterThan(600);
    expect(allMath.trajectories.central.endpoint.total).toBe(allReading.trajectories.central.endpoint.total);
  });

  it('uses the goal only as a marker and preserves determinism/input values', () => {
    const raw = studentInput();
    const original = structuredClone(raw);
    const first = simulate(raw, CURRENT_DATE);
    expect(simulate(raw, CURRENT_DATE)).toEqual(first);
    expect(raw).toEqual(original);
    for (const targetScore of [400, 1240, 1600]) {
      const modified = result({ targetScore });
      expect(modified.trajectories).toEqual(result().trajectories);
      expect(modified.goal.relation).toBe(targetScore < 1240 ? 'above-target' : targetScore > 1240 ? 'below-target' : 'at-target');
    }
  });

  it('requires an SAT baseline for valid below-floor PSAT observations without rescaling', () => {
    for (const assessment of ['psat-nmsqt', 'psat-10']) {
      for (const mathScore of [160, 170, 180, 190]) {
        const outcome = simulate(studentInput({ baselineAssessment: assessment, mathScore, readingWritingScore: 760 }), CURRENT_DATE);
        expect(outcome.status).toBe('needs-sat-baseline');
        if (outcome.status === 'needs-sat-baseline') {
          expect(outcome.observedBaseline.math).toBe(mathScore);
          expect(outcome.observedBaseline.readingWriting).toBe(760);
          expect('trajectories' in outcome).toBe(false);
        }
      }
    }
    expect(simulate(studentInput({ baselineAssessment: 'psat-10', readingWritingScore: 160 }), CURRENT_DATE).status).toBe('needs-sat-baseline');
  });

  it('accepts PSAT sections at the SAT floor and preserves a PSAT ceiling observation', () => {
    const outcome = result({ baselineAssessment: 'psat-nmsqt', mathScore: 200, readingWritingScore: 760 });
    expect(outcome.trajectories.central.points[0]).toMatchObject({ math: 200, readingWriting: 760, total: 960 });
    expect(outcome.warnings.some((warning) => warning.code === 'psat-ceiling')).toBe(true);
  });

  it('returns validation errors, never trajectories, for malformed input', () => {
    const outcome = simulate(studentInput({ weeklyStudyHours: 168 }), CURRENT_DATE);
    expect(outcome.status).toBe('invalid-input');
    expect('trajectories' in outcome).toBe(false);
  });

  it('handles a fractional target horizon across a leap day', () => {
    const outcome = simulate(studentInput({ baselineDate: '2028-02-28', targetDate: '2028-03-07' }), '2028-02-28');
    expect(outcome.status).toBe('simulated');
    if (outcome.status !== 'simulated') return;
    expect(outcome.trajectories.central.points.map((point) => point.date)).toEqual(['2028-02-28', '2028-03-06', '2028-03-07']);
    expect(outcome.trajectories.central.endpoint.weeks).toBe(8 / 7);
  });
});

describe('exact timelines and presentation', () => {
  it.each([
    ['2026-10-15', 2, 1 / 7], ['2026-10-21', 2, 1],
    ['2026-10-22', 3, 8 / 7], ['2027-01-06', 13, 12], ['2028-10-11', 105, 104],
  ])('samples weekly plus exact endpoint %s', (targetDate, count, weeks) => {
    const outcome = result({ targetDate });
    for (const sensitivity of SENSITIVITY_CASES) {
      const curve = outcome.trajectories[sensitivity];
      expect(curve.points).toHaveLength(count);
      expect(curve.endpoint.date).toBe(targetDate);
      expect(curve.endpoint.weeks).toBe(weeks);
      expect(new Set(curve.points.map((point) => point.date)).size).toBe(count);
      expect(curve.points.at(-1)).toEqual(curve.endpoint);
    }
  });

  it('retains tiny raw growth even when the displayed score does not change', () => {
    const outcome = result({ targetDate: '2026-10-15', weeklyStudyHours: 6, consistencyPercent: 80 });
    expect(outcome.trajectories.central.endpoint.math).toBeCloseTo(600.578052, 5);
    expect(outcome.trajectories.central.displayedEndpoint.total).toBe(1200);
  });

  it('rounds sections first, including half-way ties and the ceiling', () => {
    expect(displayScores({ math: 604, readingWriting: 604 })).toEqual({ math: 600, readingWriting: 600, total: 1200 });
    expect(displayScores({ math: 605, readingWriting: 605 })).toEqual({ math: 610, readingWriting: 610, total: 1220 });
    expect(displayScores({ math: 799.99, readingWriting: 200.01 })).toEqual({ math: 800, readingWriting: 200, total: 1000 });
    expect(() => displayScores({ math: Infinity, readingWriting: 600 })).toThrow(RangeError);
    expect(() => displayScores({ math: 199, readingWriting: 600 })).toThrow(RangeError);
  });
});

describe('mathematical behavior and stress cases', () => {
  const growth = (assignedWeeklyHours: number, weeks = 12, baseline = 600) => sectionScoreAtWeek({ baseline, assignedWeeklyHours, weeks, consistency: 0.8, learningRate: 0.012, saturationHours: 4 });

  it('has diminishing marginal returns for equal hour increases', () => {
    const values = [0, 2, 4, 6, 8].map((hours) => growth(hours));
    const gains = values.slice(1).map((score, index) => score - (values[index] ?? 0));
    expect(gains.every((gain) => gain > 0)).toBe(true);
    expect(gains[0]).toBeGreaterThan(gains[1] ?? 0);
    expect(gains[1]).toBeGreaterThan(gains[2] ?? 0);
    expect(gains[2]).toBeGreaterThan(gains[3] ?? 0);
  });

  it('slows over time and produces smaller gains with less remaining room', () => {
    expect(growth(3, 12) - growth(3, 6)).toBeLessThan(growth(3, 6) - growth(3, 0));
    expect(growth(3, 12, 750) - 750).toBeLessThan(growth(3, 12, 600) - 600);
  });

  it('validates utility parameters and handles zero-time/ceiling extremes exactly', () => {
    const values = { baseline: 600, assignedWeeklyHours: 3, weeks: 12, consistency: 0.8, learningRate: 0.012, saturationHours: 4 };
    expect(sectionScoreAtWeek({ ...values, learningRate: 0 })).toBe(600);
    expect(sectionScoreAtWeek({ ...values, learningRate: Number.MAX_VALUE, weeks: 0 })).toBe(600);
    expect(sectionScoreAtWeek({ ...values, learningRate: Number.MAX_VALUE, baseline: 800 })).toBe(800);
    for (const patch of [{ baseline: 199 }, { consistency: NaN }, { weeks: Infinity }, { learningRate: -1 }, { saturationHours: 0 }]) {
      expect(() => sectionScoreAtWeek({ ...values, ...patch })).toThrow(RangeError);
    }
    expect(Object.isFrozen(MODEL_V01.learningRates.central)).toBe(true);
  });

  it('checks 2,160 profiles across score, effort, allocation, and horizon boundaries', () => {
    const start = parseCalendarDate(CURRENT_DATE);
    if (!start) throw new Error('Invalid fixture');
    const baselines = [[200, 200], [200, 800], [450, 450], [600, 600], [700, 700], [700, 500], [500, 700], [750, 750], [760, 200], [800, 800]];
    let profiles = 0;
    for (const [mathScore, readingWritingScore] of baselines) {
      for (const hours of [0, 0.25, 3, 6, 20, 40]) {
        for (const consistency of [0, 70, 100]) {
          for (const allocation of [0, 50, 100]) {
            for (const horizon of [1, 8, 84, 728]) {
              const outcome = result({ mathScore, readingWritingScore, weeklyStudyHours: hours, consistencyPercent: consistency, mathSharePercent: allocation, targetDate: addCalendarDays(start, horizon) });
              profiles++;
              const valid = SENSITIVITY_CASES.every((sensitivity) => {
                const points = outcome.trajectories[sensitivity].points;
                return points.every((point, index) => {
                  const previous = points[index - 1];
                  return Number.isFinite(point.total) && point.math >= (mathScore ?? 0) && point.math <= 800 && point.readingWriting >= (readingWritingScore ?? 0) && point.readingWriting <= 800 && point.total === point.math + point.readingWriting && point.total >= 400 && point.total <= 1600 && (!previous || point.math >= previous.math && point.readingWriting >= previous.readingWriting);
                });
              });
              expect(valid, JSON.stringify({ mathScore, readingWritingScore, hours, consistency, allocation, horizon })).toBe(true);
              const { slower, central, faster } = outcome.trajectories;
              expect(central.points.every((point, index) => {
                const low = slower.points[index];
                const high = faster.points[index];
                return low && high && low.math <= point.math && point.math <= high.math && low.readingWriting <= point.readingWriting && point.readingWriting <= high.readingWriting;
              })).toBe(true);
            }
          }
        }
      }
    }
    expect(profiles).toBe(2160);
  }, 30_000);
});
