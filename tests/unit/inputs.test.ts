import { describe, expect, it } from 'vitest';
import { addCalendarDays, daysBetween, localCalendarDate, parseCalendarDate } from '../../src/domain/dates';
import { parseNumericInput, validateInput } from '../../src/domain/inputs';
import { CURRENT_DATE, studentInput } from './fixtures';

describe('assessment inputs', () => {
  it.each([
    ['sat', 200, 800], ['psat-nmsqt', 160, 760], ['psat-10', 160, 760],
  ])('accepts both %s score boundaries', (assessment, min, max) => {
    const result = validateInput(studentInput({ baselineAssessment: assessment, mathScore: min, readingWritingScore: max }), CURRENT_DATE);
    expect(result.status).toBe('valid-input');
    if (result.status !== 'valid-input') throw new Error('Expected validated data');
    expect(result.input.mathScore).toBe(min);
    expect(result.input.readingWritingScore).toBe(max);
    expect(result.input.mathSharePercent).toBe(50);
    expect(result.daysUntilExam).toBe(84);
    expect(result.baselineAgeDays).toBe(13);
  });

  it.each([
    ['mathScore', 190], ['mathScore', 810], ['readingWritingScore', 605],
    ['mathScore', NaN], ['mathScore', Infinity], ['mathScore', '600'],
    ['mathScore', undefined], ['mathScore', true], ['mathScore', []],
    ['targetScore', 390], ['targetScore', 1610], ['targetScore', 1405],
    ['weeklyStudyHours', -0.25], ['weeklyStudyHours', 40.25], ['weeklyStudyHours', 2.1],
    ['weeklyStudyHours', Infinity], ['consistencyPercent', -1], ['consistencyPercent', 101],
    ['consistencyPercent', 50.5], ['mathSharePercent', -1], ['mathSharePercent', 101],
    ['baselineAssessment', 'psat-8-9'], ['baselineSource', 'preview'], ['prepHistory', 'expert'],
    ['practiceTestFrequency', 'daily'], ['studyMethods', []], ['studyMethods', ['unknown']],
    ['studyMethods', ['unsure', 'mistake-review']], ['studyMethods', ['mistake-review', 'mistake-review']],
  ])('rejects invalid %s value %s with its field identified', (field, value) => {
    const result = validateInput(studentInput({ [field]: value }), CURRENT_DATE);
    expect(result.status).toBe('invalid-input');
    if (result.status === 'invalid-input') expect(result.errors.some((error) => error.field === field)).toBe(true);
  });

  it.each(['psat-nmsqt', 'psat-10'])('rejects scores above the %s ceiling', (assessment) => {
    const result = validateInput(studentInput({ baselineAssessment: assessment, readingWritingScore: 770 }), CURRENT_DATE);
    expect(result.status).toBe('invalid-input');
  });

  it.each([null, [], true, undefined, {}, studentInput({ unsupported: 1 })])('rejects missing/malformed objects and unsupported fields', (input) => {
    expect(validateInput(input, CURRENT_DATE).status).toBe('invalid-input');
  });

  it('accepts zero effort, a lower goal, practice scores, unsure, and allocation boundaries', () => {
    for (const allocation of [0, 100]) {
      const result = validateInput(studentInput({ weeklyStudyHours: 0, consistencyPercent: 0, targetScore: 400, baselineSource: 'official-practice', studyMethods: ['unsure'], mathSharePercent: allocation }), CURRENT_DATE);
      expect(result.status).toBe('valid-input');
    }
  });

  it('accepts the exact 40-hour and 104-week limits', () => {
    const result = validateInput(studentInput({ weeklyStudyHours: 40, targetDate: '2028-10-11' }), CURRENT_DATE);
    expect(result.status).toBe('valid-input');
    if (result.status === 'valid-input') expect(result.daysUntilExam).toBe(728);
  });
});

describe('calendar rules', () => {
  it.each(['2026-02-30', '2026-02-29', '2026-13-01', '2026-00-01', '2026-10-00', '2026-10-32', '2026-1-01', '0000-01-01', '2026-10-14T00:00:00Z', ''])('rejects invalid calendar value %s', (value) => {
    expect(parseCalendarDate(value)).toBeUndefined();
    expect(validateInput(studentInput({ baselineDate: value }), CURRENT_DATE).status).toBe('invalid-input');
  });

  it.each([
    ['2026-03-07', '2026-03-09', 2], ['2026-10-31', '2026-11-02', 2],
    ['2028-02-28', '2028-03-01', 2], ['0099-12-31', '0100-01-01', 1],
  ])('counts calendar days from %s to %s without timezone shifts', (start, end, expected) => {
    const first = parseCalendarDate(start);
    const last = parseCalendarDate(end);
    if (!first || !last) throw new Error('Invalid test fixture');
    expect(daysBetween(first, last)).toBe(expected);
    expect(addCalendarDays(first, expected)).toBe(last);
  });

  it.each(['2026-10-14', '2026-10-13', '2028-10-12'])('rejects same-day, past, or out-of-range target %s', (targetDate) => {
    expect(validateInput(studentInput({ targetDate }), CURRENT_DATE).status).toBe('invalid-input');
  });

  it('rejects a future baseline and an invalid injected current date', () => {
    expect(validateInput(studentInput({ baselineDate: '2026-10-15' }), CURRENT_DATE).status).toBe('invalid-input');
    expect(validateInput(studentInput(), '2026-02-30').status).toBe('invalid-input');
  });

  it('accepts tomorrow and a leap-day exam with exact elapsed days', () => {
    const tomorrow = validateInput(studentInput({ targetDate: '2026-10-15' }), CURRENT_DATE);
    const leap = validateInput(studentInput({ baselineDate: '2028-02-28', targetDate: '2028-02-29' }), '2028-02-28');
    for (const result of [tomorrow, leap]) {
      expect(result.status).toBe('valid-input');
      if (result.status === 'valid-input') expect(result.daysUntilExam).toBe(1);
    }
  });

  it('uses the supplied local calendar rather than the UTC date', () => {
    const original = process.env.TZ;
    try {
      process.env.TZ = 'America/Chicago';
      expect(localCalendarDate(new Date('2026-10-15T01:00:00Z'))).toBe('2026-10-14');
    } finally {
      if (original === undefined) delete process.env.TZ;
      else process.env.TZ = original;
    }
  });
});

describe('warnings and form parsing', () => {
  it.each([
    ['2026-07-16', undefined], ['2026-07-15', 'old-baseline'],
    ['2025-10-14', 'old-baseline'], ['2025-10-13', 'very-old-baseline'],
  ])('uses the disclosed baseline-age boundary for %s', (baselineDate, expectedCode) => {
    const result = validateInput(studentInput({ baselineDate }), CURRENT_DATE);
    expect(result.status).toBe('valid-input');
    if (result.status !== 'valid-input') return;
    const codes = result.warnings.filter((warning) => warning.code === 'old-baseline' || warning.code === 'very-old-baseline').map((warning) => warning.code);
    expect(codes).toEqual(expectedCode ? [expectedCode] : []);
  });

  it('adds context warnings without rejecting valid schedules', () => {
    const result = validateInput(studentInput({ baselineAssessment: 'psat-10', mathScore: 760, weeklyStudyHours: 21, targetDate: '2027-06-01', targetScore: 400, practiceTestFrequency: 'weekly' }), CURRENT_DATE);
    expect(result.status).toBe('valid-input');
    if (result.status === 'valid-input') expect(result.warnings.map((warning) => warning.code)).toEqual(expect.arrayContaining(['baseline-as-start', 'psat-shared-scale', 'psat-ceiling', 'intensive-study', 'long-horizon', 'goal-at-or-below-baseline', 'frequent-practice']));
  });

  it('warns about an implausible test budget without counting it as extra hours', () => {
    const result = validateInput(studentInput({ weeklyStudyHours: 1, practiceTestFrequency: 'weekly' }), CURRENT_DATE);
    expect(result.status).toBe('valid-input');
    if (result.status === 'valid-input') {
      expect(result.input.weeklyStudyHours).toBe(1);
      expect(result.warnings.some((warning) => warning.code === 'practice-budget')).toBe(true);
    }
  });

  it.each(['', ' ', '1e2', '0x10', 'NaN', 'Infinity', '+3', '1,000'])('does not coerce invalid numeric text %s', (value) => {
    expect(parseNumericInput(value)).toBeUndefined();
  });

  it.each([['0', 0], [' 600 ', 600], ['2.25', 2.25], ['.5', 0.5], ['-1', -1]])('parses decimal %s without bypassing domain validation', (value, expected) => {
    expect(parseNumericInput(value)).toBe(expected);
  });
});
