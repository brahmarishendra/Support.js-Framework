import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const config = [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['react', 'react-dom', '@angular/core', '@angular/common']
  },

  // Utils only
  {
    input: 'src/utils/index.ts',
    output: [
      {
        file: 'dist/utils.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/utils.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ]
  },

  // React only
  {
    input: 'src/react/index.ts',
    output: [
      {
        file: 'dist/react.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/react.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['react', 'react-dom']
  },

  // Angular only
  {
    input: 'src/angular/index.ts',
    output: [
      {
        file: 'dist/angular.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/angular.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      })
    ],
    external: ['@angular/core', '@angular/common', '@angular/common/http']
  },

  // Minified version
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'SupportJS',
      sourcemap: true
    },
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      terser()
    ],
    external: ['react', 'react-dom', '@angular/core', '@angular/common']
  }
];

export default config;
