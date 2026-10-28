import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
import { readdirSync, readFileSync } from 'node:fs';

// Ships the bundled Lato fallback faces as dist/fonts/*, next to the
// extracted CSS. MochiThemeWrapper.scss references them as
// url('./fonts/…'), which resolves both from that source file
// (src/ThemeWrapper/fonts) and from dist/index.*.css (dist/fonts).
const FONT_DIR = 'src/ThemeWrapper/fonts';
const copyFonts = () => ({
  name: 'copy-fonts',
  generateBundle() {
    for (const file of readdirSync(FONT_DIR)) {
      this.emitFile({
        type: 'asset',
        fileName: `fonts/${file}`,
        source: readFileSync(`${FONT_DIR}/${file}`),
      });
    }
  },
});

const jsConfig = {
  input: 'src/index.ts',
  output: [
    {
      // .cjs, not .js: package.json has "type": "module", so Node reads any
      // .js file in this package as ESM and require() of a .js CJS bundle fails.
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    postcss({
        extract: true,
        minimize: true,
        sourceMap: true,
        modules: false,
        use: ['sass']
      }),
    commonjs(),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
      limit: Infinity,
      emitFiles: false,
      fileName: '[name][extname]',
      destDir: 'dist/assets',
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }),
    terser(),
    copyFonts(),
  ],
  external: [
    'react/jsx-runtime',
  ],
};

const dtsConfig = {
  input: 'remochi.d.ts',
  // Same declarations twice: TypeScript reads .d.ts as ESM types here
  // ("type": "module"), so require() consumers get the .d.cts copy.
  output: [
    { file: 'dist/index.d.ts', format: 'es' },
    { file: 'dist/index.d.cts', format: 'es' },
  ],
  plugins: [dts()],
};

export default [jsConfig, dtsConfig];
