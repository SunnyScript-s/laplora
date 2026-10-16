import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { importDataset } from './dataset';
import { evaluate } from './evaluate';
async function main() {
  const args = process.argv.slice(2), options = new Map<string, string>();
  for (let i = 0; i < args.length; i++) {
    const key = args[i]!;
    if (key === '--unlock-test') { options.set(key, 'yes'); continue; }
    if (!['--input', '--out', '--as-of', '--data-kind', '--partition'].includes(key) || !args[i + 1] || options.has(key)) throw new Error('Invalid CLI arguments; see validation/README.md.');
    options.set(key, args[++i]!);
  }
  const input = options.get('--input'), output = options.get('--out'), asOf = options.get('--as-of'), kind = options.get('--data-kind'), selected = options.get('--partition') ?? 'evaluation';
  if (!input || !output || !asOf || !['synthetic', 'real'].includes(kind ?? '') || !['evaluation', 'test'].includes(selected)) throw new Error('Require --input, --out, --as-of and --data-kind synthetic|real.');
  if (resolve(input) === resolve(output)) throw new Error('Output must differ from input.');
  if ((await stat(input)).size > 5 * 1024 * 1024) throw new Error('CSV exceeds 5 MiB.');
  const csv = await readFile(input, 'utf8'), imported = importDataset(csv, asOf);
  const result = { dataKind: kind, asOf, inputSha256: createHash('sha256').update(csv).digest('hex'), issues: imported.issues, evaluation: imported.issues.length ? null : evaluate(imported.records, selected as 'evaluation' | 'test', options.has('--unlock-test')) };
  await mkdir(dirname(resolve(output)), { recursive: true, mode: 0o700 });
  await writeFile(output, JSON.stringify(result, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  console.log(`Local evaluation: ${imported.records.length} valid records; ${imported.issues.length} issues. Predictive accuracy remains unverified.`);
  if (imported.issues.length) process.exitCode = 1;
}
main().catch(() => { console.error('Validation failed. Check arguments, documented schema, paths/permissions, and whether the output already exists. No raw record values were logged.'); process.exitCode = 1; });
