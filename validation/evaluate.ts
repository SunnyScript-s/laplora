import { createHash } from 'node:crypto';
import { simulate } from '../src/model/simulate';
import { MODEL_V01 } from '../src/model/parameters';
import { daysBetween } from '../src/domain/dates';
import type { RecordData } from './dataset';
export const splitSeed = 'laplora-v01-validation-1';
export function partition(id: string): 'train' | 'evaluation' | 'test' {
  const bucket = createHash('sha256').update(`${splitSeed}:${id}`).digest().readUInt32BE(0) / 2 ** 32;
  return bucket < .6 ? 'train' : bucket < .8 ? 'evaluation' : 'test';
}
export function metrics(errors: number[]) {
  if (!errors.length) return null;
  if (errors.some(e => !Number.isFinite(e))) throw new Error('Nonfinite error.');
  const abs = errors.map(Math.abs).sort((a, b) => a - b), n = errors.length;
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / n;
  return { n, mae: mean(abs), bias: mean(errors), rmse: Math.sqrt(mean(errors.map(e => e * e))), medianAbsoluteError: (abs[Math.floor((n - 1) / 2)]! + abs[Math.floor(n / 2)]!) / 2, within50Percent: 100 * abs.filter(e => e <= 50).length / n, within100Percent: 100 * abs.filter(e => e <= 100).length / n };
}
const sections = ['math', 'readingWriting', 'total'] as const;
type Scores = Record<typeof sections[number], number>;
function scores(math: number, readingWriting: number): Scores { return { math, readingWriting, total: math + readingWriting }; }
export function evaluate(records: RecordData[], selected: 'evaluation' | 'test' = 'evaluation', unlockTest = false) {
  if (selected === 'test' && !unlockTest) throw new Error('Independent test outcomes are locked; pass --unlock-test only for a final predeclared evaluation.');
  const exclusions: { row: number; reason: string }[] = [], unique = new Map<string, RecordData>();
  for (const r of [...records].sort((a, b) => a.input.baselineDate.localeCompare(b.input.baselineDate) || a.input.targetDate.localeCompare(b.input.targetDate))) {
    if (r.exclusion) exclusions.push({ row: r.row, reason: r.exclusion });
    else if (unique.has(r.id)) exclusions.push({ row: r.row, reason: 'Only earliest eligible interval per participant is evaluated' });
    else unique.set(r.id, r);
  }
  const eligible = [...unique.values()], train = eligible.filter(r => partition(r.id) === 'train');
  const growth = train.length >= 30 ? scores(train.reduce((n, r) => n + r.actual.math - r.input.mathScore, 0) / train.length, train.reduce((n, r) => n + r.actual.readingWriting - r.input.readingWritingScore, 0) / train.length) : null;
  const clamp = (n: number) => Math.max(200, Math.min(800, n));
  const rows = eligible.filter(r => partition(r.id) === selected).map(r => {
    const simulation = simulate(r.input, r.input.baselineDate);
    if (simulation.status !== 'simulated') throw new Error('Eligible record rejected by production engine.');
    const baseline = scores(r.input.mathScore, r.input.readingWritingScore);
    const predictions = { laplora: simulation.trajectories.central.endpoint, noChange: baseline, averageGrowth: growth ? scores(clamp(baseline.math + growth.math), clamp(baseline.readingWriting + growth.readingWriting)) : null };
    const error = (prediction: Scores) => scores(prediction.math - r.actual.math, prediction.readingWriting - r.actual.readingWriting);
    return { id: r.id, row: r.row, actual: r.actual, predictions, errors: { laplora: error(predictions.laplora), noChange: error(baseline), averageGrowth: predictions.averageGrowth ? error(predictions.averageGrowth) : null }, coverage: Object.fromEntries(sections.map(s => [s, r.actual[s] >= simulation.trajectories.slower.endpoint[s] && r.actual[s] <= simulation.trajectories.faster.endpoint[s]])), groups: { startingScore: baseline.total < 1000 ? '<1000' : baseline.total < 1200 ? '1000–1190' : baseline.total < 1400 ? '1200–1390' : '1400+', duration: daysBetween(r.input.baselineDate, r.input.targetDate) <= 28 ? '≤4 weeks' : daysBetween(r.input.baselineDate, r.input.targetDate) <= 84 ? '4–12 weeks' : daysBetween(r.input.baselineDate, r.input.targetDate) <= 182 ? '12–26 weeks' : '>26 weeks', hours: r.input.weeklyStudyHours === 0 ? '0' : r.input.weeklyStudyHours < 4 ? '0–<4' : r.input.weeklyStudyHours < 8 ? '4–<8' : r.input.weeklyStudyHours < 16 ? '8–<16' : '16+', sectionCombination: baseline.math - baseline.readingWriting >= 100 ? 'Math ahead ≥100' : baseline.readingWriting - baseline.math >= 100 ? 'RW ahead ≥100' : 'Within 100' } };
  });
  function summarize(subset: typeof rows) {
    return Object.fromEntries(['laplora', 'noChange', 'averageGrowth'].map(method => [method, Object.fromEntries(sections.map(s => [s, metrics(subset.flatMap(r => { const e = r.errors[method as keyof typeof r.errors]; return e ? [e[s]] : []; }))]))]));
  }
  const groups = Object.fromEntries(['startingScore', 'duration', 'hours', 'sectionCombination'].map(dimension => {
    const values = [...new Set(rows.map(r => r.groups[dimension as keyof typeof r.groups]))];
    return [dimension, values.map(value => { const subset = rows.filter(r => r.groups[dimension as keyof typeof r.groups] === value); return { value, participants: subset.length, metrics: subset.length >= 10 ? summarize(subset) : null, limitation: subset.length < 10 ? 'Suppressed: fewer than 10 independent participants' : 'Descriptive only; no statistical significance claim' }; })];
  }));
  return { model: MODEL_V01, predictiveAccuracyStatus: 'unverified', splitSeed, selectedPartition: selected, partitionCounts: Object.fromEntries(['train', 'evaluation', 'test'].map(p => [p, eligible.filter(r => partition(r.id) === p).length])), validRecords: records.length, eligibleParticipants: eligible.length, exclusions, evaluatedParticipants: rows.length, averageGrowth: { trainingParticipants: train.length, minimum: 30, fittedSectionGains: growth, limitation: 'Unconditional mean gain; not adjusted for duration or study hours. Threshold is an engineering guard, not statistical power.' }, metrics: summarize(rows), maeImprovementOverBaselines: Object.fromEntries(['noChange', 'averageGrowth'].map(method => [method, Object.fromEntries(sections.map(s => { const baseline = metrics(rows.flatMap(r => { const e = r.errors[method as 'noChange' | 'averageGrowth']; return e ? [e[s]] : []; })), model = metrics(rows.map(r => r.errors.laplora[s])); return [s, baseline && model ? baseline.mae - model.mae : null]; }))])), coveragePercent: Object.fromEntries(sections.map(s => [s, rows.length ? 100 * rows.filter(r => r.coverage[s]).length / rows.length : null])), groups, rows, limitations: ['Predictive accuracy remains unverified; synthetic results are software checks only.', 'Slower-to-faster coverage is descriptive, not a confidence interval.', 'Evaluation is conditional on the observed follow-up date, not proof of prospective accuracy.', 'Do not tune on evaluation or test results. Small samples and heterogeneous assessments limit interpretation.'] };
}
