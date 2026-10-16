import { build } from 'vite';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
await build({ configFile: false, root, logLevel: 'error', build: { ssr: root + 'validation/cli.ts', outDir: root + 'validation/.build', emptyOutDir: true, minify: false } });
const result = spawnSync(process.execPath, [root + 'validation/.build/cli.js', ...process.argv.slice(2)], { stdio: 'inherit' });
process.exit(result.status ?? 1);
