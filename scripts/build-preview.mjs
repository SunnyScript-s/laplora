import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const script = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const stylesheet = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!script || !stylesheet) throw new Error('Build the app first; expected one bundled script and stylesheet.');

function assetPath(url) {
  const path = resolve(dist, `.${url}`);
  if (!path.startsWith(`${dist}/`)) throw new Error('Preview asset escapes the build directory.');
  return path;
}

const cssPath = assetPath(stylesheet[1]);
let css = await readFile(cssPath, 'utf8');
for (const match of [...css.matchAll(/url\(([^)]+\.woff2)\)/g)]) {
  const url = match[1].replace(/^['"]|['"]$/g, '');
  const path = url.startsWith('/') ? assetPath(url) : resolve(dirname(cssPath), url);
  if (!path.startsWith(`${dist}/`)) throw new Error('Font asset escapes the build directory.');
  const font = await readFile(path);
  css = css.replace(match[0], `url(data:font/woff2;base64,${font.toString('base64')})`);
}
const js = (await readFile(assetPath(script[1]), 'utf8')).replace(/<\/script/gi, '<\\/script');
html = html.replace(script[0], () => `<script type="module">${js}</script>`);
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
const icon = await readFile(resolve(dist, 'laplora-icon.png'));
html = html.replace('/laplora-icon.png', `data:image/png;base64,${icon.toString('base64')}`);

// Font permissions travel with this standalone copy, including its embedded fonts.
const notices = {};
for (const name of await readdir(resolve(dist, 'font-licenses'))) {
  notices[name] = await readFile(resolve(dist, 'font-licenses', name), 'utf8');
}
const json = JSON.stringify(notices).replaceAll('<', '\\u003c');
html = html.replace('</head>', () => `<script type="application/json" id="laplora-font-notices">${json}</script></head>`);
await writeFile(resolve(root, 'docs/design/interactive-preview.html'), html);
console.log('Saved docs/design/interactive-preview.html with embedded app, styles, fonts, favicon, and font notices.');
