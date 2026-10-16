import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { importDataset } from '../../validation/dataset';
import { evaluate } from '../../validation/evaluate';
import { histogram, renderReports, reportTables } from '../../validation/report';
import type { ReportInput } from '../../validation/report';
const dataset = importDataset(readFileSync('validation/fixtures/synthetic.csv', 'utf8'), '2026-10-16');
const input: ReportInput = { dataKind: 'synthetic', asOf: '2026-10-16', inputSha256: 'fixture-hash', issues: [], evaluation: evaluate(dataset.records) };
describe('private validation reports', () => {
  it('computes independently checkable observed gains and reuses evaluation metrics', () => {
    const tables = reportTables(input);
    const improvement = tables.find(t => t.title === 'Mean score improvement')!;
    expect(improvement.rows.map(r => r[1])).toEqual(['20.00', '10.00', '30.00']);
    const errors = tables.find(t => t.title === 'Prediction errors')!;
    expect(errors.rows[2]![3]).toBe(input.evaluation!.metrics.laplora!.total!.mae.toFixed(2));
    expect(tables.find(t => t.title === 'Dataset and sample sizes')!.rows).toContainEqual(['Evaluated participants', '24']);
  });
  it('uses explicit histogram boundaries and conserves participant counts', () => {
    const bins = histogram([-101, -100, -50, 0, 50, 100]);
    expect(bins.map(b => b.count)).toEqual([1, 1, 1, 1, 1, 1]);
    expect(histogram(input.evaluation!.rows.map(r => r.errors.laplora.total)).reduce((sum, b) => sum + b.count, 0)).toBe(24);
  });
  it('renders both formats with provenance and caveats, without participant IDs or external resources', () => {
    const { html, markdown } = renderReports(input);
    for (const text of [html, markdown]) {
      expect(text).toContain('FICTIONAL DATA');
      expect(text).toContain('fixture-hash');
      expect(text).toContain('not a statistical confidence interval');
      expect(text).toContain('0.1.0-experimental');
      for (const r of dataset.records) expect(text).not.toContain(r.id);
    }
    expect(html).not.toMatch(/<script|https?:\/\/|\ssrc=/);
    expect(html).toContain("default-src 'none'");
    expect(markdown).toContain('Baseline comparison');
  });
  it('shows blocked quality issues safely without inventing scores', () => {
    const result = renderReports({ ...input, evaluation: null, issues: [{ row: 2, field: '<script>', message: '<img src=x onerror=alert(1)> | bad' }] });
    expect(result.html).not.toContain('<script>');
    expect(result.html).toContain('&lt;script&gt;');
    expect(result.markdown).not.toContain('<img');
    expect(result.html).toContain('evaluation blocked');
    expect(result.html).not.toContain('Prediction errors');
  });
  it('preserves empty samples and insufficient training as unavailable, with no fake points', () => {
    const empty = renderReports({ ...input, evaluation: evaluate([]) });
    expect(empty.html).toContain('scatterplot unavailable');
    expect(empty.html).toContain('distribution unavailable');
    expect(empty.html).not.toContain('<circle');
    expect(empty.markdown).toContain('Unavailable');
  });
  it('suppresses small groups while retaining their sample counts', () => {
    const one = dataset.records.find(r => input.evaluation!.rows.some(x => x.id === r.id))!;
    const rendered = renderReports({ ...input, evaluation: evaluate([one]) });
    expect(rendered.html).toContain('chart suppressed');
    expect(rendered.markdown).toContain('Suppressed: fewer than 10');
  });
});
