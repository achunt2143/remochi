import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import url from '@rollup/plugin-url';

const jsConfig = {
  input: 'src/index.jsx',
  output: [
    {
      file: 'dist/index.cjs.js',
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
    commonjs(),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
      limit: Infinity,    // inline all assets as base64 to avoid file copies
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
  ],
  external: [
    'react/jsx-runtime',
  ],
};

const dtsConfig = {
  input: 'remochi.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [dts()],
};

export default [jsConfig, dtsConfig];
