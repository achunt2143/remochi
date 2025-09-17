import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
const pkg = require('./package.json');

export default {
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
    peerDepsExternal(), // This handles peer deps automatically
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs(),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
      limit: 8192,
      emitFiles: true,
      fileName: '[name][hash][extname]',
      destDir: 'dist/assets'
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
    }),
    terser(),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies),
    'react/jsx-runtime'
  ],
};
