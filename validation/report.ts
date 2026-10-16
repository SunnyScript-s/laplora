import type { Issue } from './dataset';
import type { evaluate } from './evaluate';

export interface ReportInput {
  dataKind: string;
  asOf: string;
  inputSha256: string;
  issues: Issue[];
  evaluation: ReturnType<typeof evaluate> | null;
}
const sections = ['math', 'readingWriting', 'total'] as const;
const labels = { math: 'Math', readingWriting: 'Reading & Writing', total: 'Total' };
const methods = ['laplora', 'noChange', 'averageGrowth'] as const;
const methodLabels = { laplora: 'Laplora', noChange: 'No change', averageGrowth: 'Average growth' };
const number = (n: number | null | undefined) => n == null ? 'Unavailable' : n.toFixed(2);
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const md = (s: string) => s.replace(/[\r\n|]/g, ' ').replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);
type Table = { title: string; headers: string[]; rows: string[][] };

/** Aggregate tables are shared by both formats so displayed evidence cannot drift. */
export function reportTables(input: ReportInput): Table[] {
  const e = input.evaluation;
  if (!e) return [{ title: 'Data quality — evaluation blocked', headers: ['CSV row', 'Field', 'Issue'], rows: input.issues.map(i => [String(i.row), i.field, i.message]) }];
  const mean = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  const tables: Table[] = [
    { title: 'Dataset and sample sizes', headers: ['Measure', 'Count'], rows: [
      ['Valid records', String(e.validRecords)], ['Eligible independent participants', String(e.eligibleParticipants)],
      ['Excluded intervals', String(e.exclusions.length)], ['Evaluated participants', String(e.evaluatedParticipants)],
      ...Object.entries(e.partitionCounts).map(([key, value]) => [`${key} partition`, String(value)]),
      ['Data-quality issues', String(input.issues.length)],
    ] },
    { title: 'Mean score improvement', headers: ['Section', 'Observed gain (points)', 'Modeled gain (points)', 'Participants'], rows: sections.map(s => [labels[s], number(mean(e.rows.map(r => r.actual[s] - r.predictions.noChange[s]))), number(mean(e.rows.map(r => r.predictions.laplora[s] - r.predictions.noChange[s]))), String(e.evaluatedParticipants)]) },
    { title: 'Prediction errors', headers: ['Method', 'Section', 'n', 'MAE', 'Bias', 'RMSE', 'Median absolute error', 'Within 50 (%)', 'Within 100 (%)'], rows: methods.flatMap(method => sections.map(s => {
      const m = e.metrics[method]?.[s];
      return [methodLabels[method], labels[s], String(m?.n ?? 0), number(m?.mae), number(m?.bias), number(m?.rmse), number(m?.medianAbsoluteError), number(m?.within50Percent), number(m?.within100Percent)];
    })) },
    { title: 'Baseline comparison', headers: ['Baseline', 'Section', 'MAE improvement (points)'], rows: ['noChange', 'averageGrowth'].flatMap(method => sections.map(s => [methodLabels[method as 'noChange' | 'averageGrowth'], labels[s], number(e.maeImprovementOverBaselines[method]?.[s])])) },
    { title: 'Observed assumption-range coverage', headers: ['Section', 'Coverage (%)', 'Participants'], rows: sections.map(s => [labels[s], number(e.coveragePercent[s]), String(e.evaluatedParticipants)]) },
  ];
  for (const [dimension, groups] of Object.entries(e.groups)) {
    const title = { startingScore: 'Errors by starting score', duration: 'Errors by preparation duration', hours: 'Errors by planned weekly hours', sectionCombination: 'Errors by Math/RW combination' }[dimension] ?? dimension;
    tables.push({ title, headers: ['Group', 'Participants', 'Total MAE', 'Total bias', 'Total RMSE', 'Interpretation'], rows: groups.map(g => [g.value, String(g.participants), number(g.metrics?.laplora?.total?.mae), number(g.metrics?.laplora?.total?.bias), number(g.metrics?.laplora?.total?.rmse), g.limitation]) });
  }
  const reasons = new Map<string, number>();
  e.exclusions.forEach(x => reasons.set(x.reason, (reasons.get(x.reason) ?? 0) + 1));
  tables.push({ title: 'Exclusion reasons', headers: ['Reason', 'Intervals'], rows: reasons.size ? [...reasons].map(([reason, count]) => [reason, String(count)]) : [['None', '0']] });
  return tables;
}

function narrative(input: ReportInput) {
  const e = input.evaluation;
  return [
    input.dataKind === 'synthetic' ? 'FICTIONAL DATA — software demonstration only. These outcomes do not validate predictive accuracy.' : 'PRIVATE REAL DATA — descriptive evaluation only. Predictive accuracy remains unverified.',
    'Predictive accuracy remains unverified. Keep this report local; the dashboard contains individual score coordinates even though participant identifiers are omitted.',
    `As-of date: ${input.asOf}. Dataset SHA-256: ${input.inputSha256}. Data kind: ${input.dataKind}.`,
    e ? `Model: ${e.model.version}. Selected partition: ${e.selectedPartition}. Split seed: ${e.splitSeed}.` : 'Evaluation blocked by data-quality errors. Correct the input and rerun; no accuracy metrics were calculated.',
    'Methodology: digital SAT-to-SAT first attempts with matching official source and comparable conditions. PSAT comparisons are excluded without conversion. One earliest eligible interval per participant. Production coefficients are unchanged; predictions use raw endpoints and baseline-recorded plans at the observed follow-up horizon. Actual study hours are not predictors.',
    'Partitions: fixed participant-hashed approximately 60% training / 20% evaluation / 20% independent test. Only the selected partition contributes to reported metrics and charts. Do not tune on evaluation or test results.',
    e ? `Average-growth baseline: ${e.averageGrowth.trainingParticipants} training participants; minimum ${e.averageGrowth.minimum}. ${e.averageGrowth.limitation}` : 'Average-growth baseline unavailable while data quality is unresolved.',
    'Interpretation: errors are prediction minus observation; positive bias is overprediction. Positive MAE improvement means Laplora had lower error than that baseline on this sample; negative means worse. Neither establishes predictive usefulness or statistical significance.',
    'Slower-to-faster coverage is not a statistical confidence interval or a probability. Groups below 10 participants are suppressed; this threshold does not establish adequate statistical power. Unavailable values are not zero. Small overall samples, selection bias, measurement noise, and heterogeneous assessment conditions limit conclusions.',
    'Next steps: resolve quality issues, review exclusions and consent/retention arrangements, collect representative independent data, and predeclare comparisons before opening test outcomes. Seek approval before research-roadmap work or coefficient calibration. Do not infer scientific validation from synthetic results.',
  ];
}
function tableHtml(t: Table) {
  return `<section><h2>${escape(t.title)}</h2><div class="table-scroll" tabindex="0" role="region" aria-label="${escape(t.title)}"><table><thead><tr>${t.headers.map(h => `<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(row => `<tr>${row.map(c => `<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}

/** Points have no participant IDs; raw coordinates still require private handling. */
function scatter(input: ReportInput) {
  const rows = input.evaluation?.rows ?? [];
  if (!rows.length) return '<p>No evaluated participants; scatterplot unavailable.</p>';
  const x = (score: number) => 65 + (score - 400) / 1200 * 470;
  const y = (score: number) => 350 - (score - 400) / 1200 * 280;
  return `<svg viewBox="0 0 600 410" role="img" aria-label="Total score scatterplot: observed horizontal, predicted vertical; dashed line indicates perfect agreement"><title>Predicted versus observed total SAT score</title><rect x="65" y="70" width="470" height="280" fill="#f5f7fa"/>${[400, 800, 1200, 1600].map(n => `<line x1="65" y1="${y(n)}" x2="535" y2="${y(n)}" stroke="#d6dce5"/><text x="55" y="${y(n) + 4}" text-anchor="end">${n}</text><text x="${x(n)}" y="373" text-anchor="middle">${n}</text>`).join('')}<path d="M65 350 L535 70" stroke="#536174" stroke-dasharray="6 5" fill="none"/>${rows.map(r => `<circle cx="${x(r.actual.total)}" cy="${y(r.predictions.laplora.total)}" r="4" fill="#b3460a" opacity=".65"><title>Observed ${number(r.actual.total)}, predicted ${number(r.predictions.laplora.total)}</title></circle>`).join('')}<text x="300" y="403" text-anchor="middle">Observed total score (points)</text><text x="18" y="210" transform="rotate(-90 18 210)" text-anchor="middle">Predicted total score (points)</text></svg><p>${rows.length} participants; overlapping points may hide counts. Dashed line: perfect agreement. Accessible exact coordinates are in the private JSON output.</p>`;
}
export function histogram(errors: number[]) {
  const bounds = [-Infinity, -100, -50, 0, 50, 100, Infinity];
  const names = ['Below −100', '−100 to <−50', '−50 to <0', '0 to <50', '50 to <100', '100 and above'];
  return names.map((label, i) => ({ label, count: errors.filter(e => e >= bounds[i]! && e < bounds[i + 1]!).length }));
}
function distribution(input: ReportInput) {
  if (!input.evaluation?.rows.length) return '<p>No evaluated participants; distribution unavailable.</p>';
  const bins = histogram(input.evaluation?.rows.map(r => r.errors.laplora.total) ?? []);
  const max = Math.max(1, ...bins.map(b => b.count));
  return `<svg viewBox="0 0 600 270" role="img" aria-label="Total prediction error distribution in points"><title>Total prediction error distribution</title>${bins.map((b, i) => `<text x="155" y="${30 + i * 37}" text-anchor="end">${b.label}</text><rect x="170" y="${15 + i * 37}" width="${b.count / max * 350}" height="22" fill="#b3460a"/><text x="${180 + b.count / max * 350}" y="${30 + i * 37}">${b.count}</text>`).join('')}<text x="300" y="260" text-anchor="middle">Participant count (labels show exact counts)</text></svg>`;
}
function groupCharts(input: ReportInput) {
  if (!input.evaluation) return '';
  return Object.entries(input.evaluation.groups).map(([dimension, groups]) => {
    const available = groups.filter(g => g.metrics?.laplora?.total);
    const max = Math.max(1, ...available.map(g => g.metrics!.laplora!.total!.mae));
    const heading = { startingScore: 'Starting score', duration: 'Preparation duration', hours: 'Planned weekly hours', sectionCombination: 'Math/RW combination' }[dimension] ?? dimension;
    return `<section><h2>Total MAE by ${escape(heading.toLowerCase())}</h2>${available.length ? `<svg viewBox="0 0 600 ${available.length * 44 + 50}" role="img" aria-label="${escape(heading)} group mean absolute errors in points">${available.map((g, i) => `<text x="175" y="${28 + i * 44}" text-anchor="end">${escape(g.value)} (n=${g.participants})</text><rect x="190" y="${12 + i * 44}" width="${g.metrics!.laplora!.total!.mae / max * 300}" height="24" fill="#b3460a"/><text x="${200 + g.metrics!.laplora!.total!.mae / max * 300}" y="${28 + i * 44}">${number(g.metrics!.laplora!.total!.mae)}</text>`).join('')}<text x="300" y="${available.length * 44 + 35}" text-anchor="middle">Mean absolute error (points); lower is better</text></svg>` : '<p>No groups have at least 10 participants; chart suppressed.</p>'}<p>${groups.length - available.length} groups suppressed. Exact counts and limitations appear in the group tables.</p></section>`;
  }).join('');
}
export function renderReports(input: ReportInput) {
  const notes = narrative(input), tables = reportTables(input);
  const bins: Table = { title: 'Total error distribution (points)', headers: ['Prediction minus observation', 'Participants'], rows: histogram(input.evaluation?.rows.map(r => r.errors.laplora.total) ?? []).map(b => [b.label, String(b.count)]) };
  const markdown = ['# Laplora model validation report', ...notes, ...[...tables, ...(input.evaluation ? [bins] : [])].map(t => `## ${t.title}\n\n| ${t.headers.join(' | ')} |\n| ${t.headers.map(() => '---').join(' | ')} |\n${t.rows.map(row => `| ${row.map(md).join(' | ')} |`).join('\n')}`)].join('\n\n') + '\n';
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Laplora — private validation dashboard</title><style>body{margin:0;background:#f3f5f8;color:#182331;font:16px/1.55 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:28px}header,section{background:white;border:1px solid #d5dce5;border-radius:12px;padding:24px;margin-bottom:20px}h1{font-size:2rem}h2{font-size:1.3rem}h1,h2,summary{overflow-wrap:anywhere}p{overflow-wrap:anywhere}.notice{border-left:5px solid #b3460a;padding-left:16px;font-weight:650}.table-scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}th,td{padding:12px;text-align:left;border-bottom:1px solid #d5dce5;vertical-align:top}th{background:#f5f7fa}svg{width:100%;max-width:720px;height:auto;font:13px system-ui,sans-serif}summary{cursor:pointer;font-weight:650}:focus-visible{outline:3px solid #0759ab;outline-offset:3px}@media(max-width:600px){main{padding:12px}header,section{padding:16px}h1{font-size:1.6rem}}@media print{body{background:white}main{max-width:none;padding:0}section{break-inside:avoid}.table-scroll{overflow:visible}}</style></head><body><main><header><p>LOCAL ONLY · LAPLORA RESEARCH TOOLS</p><h1>Model validation dashboard</h1><p class="notice">${escape(notes[0]!)}</p><p>${escape(notes[1]!)}</p><details open><summary>Dataset, methodology and limitations</summary>${notes.slice(2).map(n => `<p>${escape(n)}</p>`).join('')}</details></header>${tables.slice(0, 2).map(tableHtml).join('')}${input.evaluation ? `<section><h2>Predicted versus observed total scores</h2>${scatter(input)}</section><section><h2>Total prediction error distribution</h2>${distribution(input)}${tableHtml(bins)}</section>` : ''}${groupCharts(input)}${tables.slice(2).map(tableHtml).join('')}</main></body></html>`;
  return { html, markdown };
}
