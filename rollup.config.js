import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';

export default {
    input: 'src/index.jsx', // your entry point
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
        resolve({ extensions: ['.js', '.jsx', '.png', '.gif', '.svg'] }),
        commonjs(),
        url({
            include: ['**/*.svg', '**/*.png', '**/*.gif', '**/*.jpg', '**/*.jpeg'],
            limit: 8192, // files smaller than 8kB will be inlined as base64 strings
            emitFiles: true, // copies files to dist folder
            fileName: '[name][hash][extname]', // output file naming pattern
            destDir: 'dist/assets' // where to copy files in dist
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            extensions: ['.js', '.jsx'],
        }),
        terser(),
    ],
    external: ['react', 'react-dom'], // externalize react deps for peer dependency
};
