// Bundles the diff page into ./out.   node scripts/spinner-diff/build.mjs
import * as esbuild from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
await esbuild.build({
  entryPoints: { diff: join(here, 'diff.jsx') },
  bundle: true,
  outdir: out,
  format: 'esm',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});
writeFileSync(join(out, 'diff.html'), '<!doctype html><meta charset="utf-8"><title>spinner diff</title><body style="margin:0"><div id="root"></div><script type="module" src="./diff.js"></script>');
console.log(`built ${out}`);
