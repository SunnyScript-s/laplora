import { parseCalendarDate, daysBetween } from '../src/domain/dates';
import { parseNumericInput, validateInput } from '../src/domain/inputs';
import type { SimulationInput } from '../src/domain/inputs';
import { parseCsv } from './csv';
export const columns = ['participant_id', 'baseline_assessment', 'baseline_date', 'baseline_math', 'baseline_rw', 'baseline_source', 'baseline_format', 'baseline_conditions', 'baseline_first_attempt', 'followup_assessment', 'followup_date', 'followup_math', 'followup_rw', 'followup_source', 'followup_format', 'followup_conditions', 'followup_first_attempt', 'plan_recorded_date', 'planned_weekly_hours', 'actual_weekly_hours', 'consistency_percent', 'math_allocation_percent', 'study_methods', 'practice_test_frequency', 'prep_history'] as const;
export interface RecordData { id: string; row: number; input: SimulationInput; actual: { math: number; readingWriting: number; total: number }; actualHours: number | null; exclusion: string | null }
export interface Issue { row: number; field: string; message: string }
export function importDataset(csv: string, asOf: string): { records: RecordData[]; issues: Issue[] } {
  const today = parseCalendarDate(asOf);
  if (!today) throw new Error('A valid as-of date is required.');
  const [header, ...rows] = parseCsv(csv);
  if (!header || header.length !== columns.length || new Set(header).size !== columns.length || columns.some(c => !header.includes(c))) throw new Error('CSV header must contain exactly the documented columns.');
  if (!rows.length) throw new Error('CSV has no records.');
  const records: RecordData[] = [], issues: Issue[] = [], seen = new Set<string>();
  rows.forEach((cells, index) => {
    const row = index + 2, before = issues.length;
    const issue = (field: string, message: string) => issues.push({ row, field, message });
    if (cells.length !== header.length) { issue('row', 'Column count mismatch.'); return; }
    const data = Object.fromEntries(header.map((key, i) => [key, cells[i]!.trim()]));
    const get = (key: string) => data[key]!;
    const num = (key: string) => parseNumericInput(get(key));
    if (!/^p_[a-f0-9]{16}$/.test(get('participant_id'))) issue('participant_id', 'Use p_ followed by 16 random lowercase hex digits; never a name or email.');
    for (const prefix of ['baseline', 'followup']) {
      const assessment = get(`${prefix}_assessment`);
      if (!['sat', 'psat-nmsqt', 'psat-10'].includes(assessment)) issue(`${prefix}_assessment`, 'Unsupported assessment.');
      for (const section of ['math', 'rw']) {
        const value = num(`${prefix}_${section}`);
        if (value === undefined || value % 10 !== 0 || value < (assessment === 'sat' ? 200 : 160) || value > (assessment === 'sat' ? 800 : 760)) issue(`${prefix}_${section}`, 'Invalid section score or increment.');
      }
      for (const [suffix, allowed] of Object.entries({ source: ['official', 'official-practice', 'unofficial'], format: ['digital', 'paper', 'unknown'], conditions: ['standard', 'accommodated', 'nonstandard', 'unknown'], first_attempt: ['yes', 'no', 'unknown'] })) {
        if (!allowed.includes(get(`${prefix}_${suffix}`))) issue(`${prefix}_${suffix}`, 'Unsupported assessment metadata.');
      }
    }
    const baseline = parseCalendarDate(get('baseline_date')), followup = parseCalendarDate(get('followup_date')), plan = parseCalendarDate(get('plan_recorded_date'));
    if (!baseline || !followup || !plan || (baseline && followup && daysBetween(baseline, followup) <= 0) || (followup && followup > today) || (plan && baseline && plan > baseline)) issue('dates', 'Require real dates, plan recorded by baseline, baseline before follow-up, and follow-up no later than as-of.');
    const actualHours = get('actual_weekly_hours') === '' ? null : num('actual_weekly_hours');
    if (actualHours === undefined || (actualHours !== null && (actualHours < 0 || actualHours > 40))) issue('actual_weekly_hours', 'Use blank or a number from 0 to 40.');
    // Validate the baseline plan through the production contract, even for excluded comparisons.
    const validated = validateInput({ baselineSource: get('baseline_source') === 'unofficial' ? 'official' : get('baseline_source'), baselineAssessment: get('baseline_assessment'), baselineDate: get('baseline_date'), mathScore: num('baseline_math'), readingWritingScore: num('baseline_rw'), targetDate: get('followup_date'), targetScore: 1600, weeklyStudyHours: num('planned_weekly_hours'), consistencyPercent: num('consistency_percent'), mathSharePercent: num('math_allocation_percent'), studyMethods: get('study_methods').split(';'), practiceTestFrequency: get('practice_test_frequency'), prepHistory: get('prep_history') }, get('baseline_date'));
    if (validated.status === 'invalid-input') validated.errors.forEach(e => issue(e.field, e.message));
    const key = `${get('participant_id')}/${get('baseline_date')}/${get('followup_date')}`;
    if (seen.has(key)) issue('row', 'Duplicate participant interval.');
    seen.add(key);
    if (issues.length !== before || validated.status !== 'valid-input') return;
    let exclusion: string | null = null;
    if (['baseline', 'followup'].some(p => get(`${p}_assessment`) !== 'sat')) exclusion = 'PSAT comparison requires a separately justified methodology';
    else if (['baseline', 'followup'].some(p => get(`${p}_format`) !== 'digital' || get(`${p}_source`) === 'unofficial' || get(`${p}_first_attempt`) !== 'yes' || !['standard', 'accommodated'].includes(get(`${p}_conditions`)))) exclusion = 'Unsupported format, source, conditions, or repeated/unknown attempt';
    else if (get('baseline_source') !== get('followup_source') || get('baseline_conditions') !== get('followup_conditions')) exclusion = 'Assessment source or conditions changed';
    const math = num('followup_math')!, readingWriting = num('followup_rw')!;
    records.push({ id: get('participant_id'), row, input: validated.input, actual: { math, readingWriting, total: math + readingWriting }, actualHours: actualHours!, exclusion });
  });
  return { records, issues };
}
