import { describe, expect, it } from 'vitest';
import { compareScenario, increasedPractice } from '../../src/model/scenarios';
import { CURRENT_DATE, studentInput } from './fixtures';

describe('scenario comparisons', () => {
  it('doubles only hours and matches the independent increased-practice example', () => {
    const outcome = increasedPractice(studentInput(), CURRENT_DATE);
    expect(outcome.status).toBe('compared');
    if (outcome.status !== 'compared') return;
    expect(outcome.changes).toEqual([{ field: 'weeklyStudyHours', before: 3, after: 6 }]);
    expect(outcome.scenario.input.consistencyPercent).toBe(70);
    expect(outcome.scenario.observedBaseline).toEqual(outcome.current.observedBaseline);
    expect(outcome.scenario.input.targetDate).toBe(outcome.current.input.targetDate);
    expect(outcome.scenario.model).toEqual(outcome.current.model);
    expect(outcome.scenario.trajectories.central.displayedEndpoint.total).toBe(1280);
    expect(outcome.numericallyIdentical).toBe(false);
  });

  it('caps increased hours and disables the preset at the accepted maximum', () => {
    const capped = increasedPractice(studentInput({ weeklyStudyHours: 30 }), CURRENT_DATE);
    expect(capped.status).toBe('compared');
    if (capped.status === 'compared') expect(capped.scenario.input.weeklyStudyHours).toBe(40);
    expect(increasedPractice(studentInput({ weeklyStudyHours: 40 }), CURRENT_DATE).status).toBe('preset-unavailable');
  });

  it('discloses a descriptive-only change and keeps every curve identical', () => {
    const outcome = compareScenario(studentInput(), CURRENT_DATE, { studyMethods: ['tutoring-class'], prepHistory: 'consistent-preparation', practiceTestFrequency: 'weekly' });
    expect(outcome.status).toBe('compared');
    if (outcome.status !== 'compared') return;
    expect(outcome.descriptiveOnly).toBe(true);
    expect(outcome.numericallyIdentical).toBe(true);
    expect(outcome.changes.map((change) => change.field)).toEqual(['prepHistory', 'studyMethods', 'practiceTestFrequency']);
    expect(outcome.explanation).toContain('does not quantify');
    expect(outcome.scenario.trajectories).toEqual(outcome.current.trajectories);
  });

  it('supports custom consistency and allocation with only the chosen changes', () => {
    const consistent = compareScenario(studentInput(), CURRENT_DATE, { consistencyPercent: 90 });
    expect(consistent.status).toBe('compared');
    if (consistent.status === 'compared') expect(consistent.scenario.trajectories.central.displayedEndpoint.total).toBe(1260);
    const allocated = compareScenario(studentInput(), CURRENT_DATE, { mathSharePercent: 100 });
    expect(allocated.status).toBe('compared');
    if (allocated.status === 'compared') {
      expect(allocated.changes.map((change) => change.field)).toEqual(['mathSharePercent']);
      expect(allocated.scenario.trajectories.central.endpoint.readingWriting).toBe(600);
    }
  });

  it.each([{ baselineDate: '2026-09-01' }, { mathScore: 700 }, { targetDate: '2027-06-01' }, { targetScore: 1600 }, { learningRate: 1 }, [], null, undefined, new Date(), new Map()])('rejects edits outside the study-plan contract', (patch) => {
    expect(compareScenario(studentInput(), CURRENT_DATE, patch).status).toBe('invalid-input');
  });

  it('revalidates scenario values and propagates original input/eligibility errors', () => {
    expect(compareScenario(studentInput(), CURRENT_DATE, { weeklyStudyHours: 41 }).status).toBe('invalid-input');
    expect(compareScenario(studentInput({ mathScore: 605 }), CURRENT_DATE, {}).status).toBe('invalid-input');
    expect(increasedPractice(studentInput({ mathScore: 605 }), CURRENT_DATE).status).toBe('invalid-input');
    expect(compareScenario(studentInput({ baselineAssessment: 'psat-10', mathScore: 160 }), CURRENT_DATE, {}).status).toBe('needs-sat-baseline');
  });

  it('resets through an empty patch without mutating the source or interpreting method order as a change', () => {
    const raw = studentInput();
    const original = structuredClone(raw);
    compareScenario(raw, CURRENT_DATE, { weeklyStudyHours: 6 });
    const reset = compareScenario(raw, CURRENT_DATE, {});
    expect(raw).toEqual(original);
    expect(reset.status).toBe('compared');
    if (reset.status === 'compared') {
      expect(reset.changes).toEqual([]);
      expect(reset.current).toEqual(reset.scenario);
    }
    const reordered = compareScenario(raw, CURRENT_DATE, { studyMethods: ['mistake-review', 'targeted-practice'] });
    if (reordered.status !== 'compared') throw new Error('Expected comparison');
    expect(reordered.changes).toEqual([]);
  });

  it('reports unchanged curves at zero hours or the ceiling without promising gains', () => {
    const zero = increasedPractice(studentInput({ weeklyStudyHours: 0 }), CURRENT_DATE);
    if (zero.status !== 'compared') throw new Error('Expected comparison');
    expect(zero.numericallyIdentical).toBe(true);
    expect(zero.changes).toEqual([]);
    const ceiling = increasedPractice(studentInput({ mathScore: 800, readingWritingScore: 800 }), CURRENT_DATE);
    if (ceiling.status !== 'compared') throw new Error('Expected comparison');
    expect(ceiling.numericallyIdentical).toBe(true);
    expect(ceiling.descriptiveOnly).toBe(false);
  });
});
