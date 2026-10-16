import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { build } from 'vite';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const directory = mkdtempSync(join(tmpdir(), 'laplora-cli-test-'));
const fixture = resolve('validation/fixtures/synthetic.csv');
const csv = readFileSync(fixture, 'utf8');
const entry = join(directory, 'build', 'cli.js');
beforeAll(async () => {
  await build({ configFile: false, logLevel: 'silent', build: { ssr: resolve('validation/cli.ts'), outDir: join(directory, 'build'), emptyOutDir: true, minify: false, rollupOptions: { external: [] } }, ssr: { noExternal: true } });
  writeFileSync(join(directory, 'package.json'), '{"type":"module"}');
}, 30000);
afterAll(() => rmSync(directory, { recursive: true, force: true }));
function run(name: string, extra: string[] = [], input = fixture) {
  const output = join(directory, `${name}.json`);
  const process = spawnSync(globalThis.process.execPath, [entry, '--input', input, '--as-of', '2026-10-16', '--data-kind', 'synthetic', '--out', output, ...extra], { encoding: 'utf8' });
  return { ...process, output };
}

describe('validation CLI boundary', () => {
  it('generates consistent private JSON, dashboard and Markdown without identifiers in reports', () => {
    const reports = join(directory, 'reports');
    const result = run('success', ['--report-dir', reports]);
    expect(result.status, result.stderr).toBe(0);
    const json = JSON.parse(readFileSync(result.output, 'utf8'));
    expect(json.evaluation.evaluatedParticipants).toBe(24);
    expect(json.issues).toEqual([]);
    for (const name of ['dashboard.html', 'report.md']) {
      const content = readFileSync(join(reports, name), 'utf8');
      expect(content).toContain('FICTIONAL DATA');
      expect(content).toContain(json.inputSha256);
      expect(content).not.toMatch(/p_[a-f0-9]{16}/);
      expect(statSync(join(reports, name)).mode & 0o777).toBe(0o600);
    }
    expect(statSync(reports).mode & 0o777).toBe(0o700);
  });
  it('blocks malformed CSV without printing record content', () => {
    const bad = join(directory, 'bad.csv');
    writeFileSync(bad, 'private_identifier,"unclosed');
    const result = run('malformed', [], bad);
    expect(result.status).toBe(1);
    expect(existsSync(result.output)).toBe(false);
    expect(result.stdout + result.stderr).not.toContain('private_identifier');
  });
  it('emits quality-only reports and nonzero exit for invalid scores', () => {
    const bad = join(directory, 'invalid.csv');
    writeFileSync(bad, csv.replace(',420,460,', ',425,460,'));
    const reports = join(directory, 'quality');
    const result = run('quality', ['--report-dir', reports], bad);
    expect(result.status).toBe(1);
    expect(JSON.parse(readFileSync(result.output, 'utf8')).evaluation).toBeNull();
    expect(readFileSync(join(reports, 'dashboard.html'), 'utf8')).not.toContain('<circle');
  });
  it('requires explicit test unlocking and only then selects test outcomes', () => {
    const locked = run('locked', ['--partition', 'test']);
    expect(locked.status).toBe(1);
    expect(existsSync(locked.output)).toBe(false);
    const opened = run('unlocked', ['--partition', 'test', '--unlock-test']);
    expect(opened.status).toBe(0);
    const result = JSON.parse(readFileSync(opened.output, 'utf8'));
    expect(result.evaluation.selectedPartition).toBe('test');
    expect(result.evaluation.evaluatedParticipants).toBe(20);
  });
  it('refuses overwriting an output file or existing report directory', () => {
    const path = join(directory, 'protected.json');
    writeFileSync(path, 'keep this');
    expect(run('protected').status).toBe(1);
    expect(readFileSync(path, 'utf8')).toBe('keep this');
    const result = run('existing-dir', ['--report-dir', directory]);
    expect(result.status).toBe(1);
    expect(existsSync(result.output)).toBe(false);
  });
});
