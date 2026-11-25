// Bundles the diff page and the in-context demo page into ./out.
//   node scripts/nubbin-diff/build.mjs
import * as esbuild from 'esbuild';
import * as sass from 'sass';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });

// Components import their .scss directly (rollup compiles it for the real
// build); inject the compiled CSS as a <style> tag here.
const scssPlugin = {
  name: 'scss',
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, (args) => {
      const { css } = sass.compile(args.path, { loadPaths: [dirname(args.path)] });
      return {
        contents: `const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s);`,
        loader: 'js',
      };
    });
  },
};

const fonts = ['.woff', '.woff2', '.ttf', '.otf'];
await esbuild.build({
  entryPoints: { diff: join(here, 'diff.jsx'), context: join(here, 'context.jsx') },
  bundle: true,
  outdir: out,
  format: 'esm',
  jsx: 'automatic',
  loader: { '.png': 'dataurl', '.gif': 'dataurl', '.js': 'jsx', ...Object.fromEntries(fonts.map((e) => [e, 'dataurl'])) },
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [scssPlugin],
  logLevel: 'warning',
});

for (const page of ['diff', 'context']) {
  writeFileSync(
    join(out, `${page}.html`),
    `<!doctype html><meta charset="utf-8"><title>${page}</title><body style="margin:0"><div id="root"></div><script type="module" src="./${page}.js"></script>`
  );
}
console.log(`built ${out}`);
