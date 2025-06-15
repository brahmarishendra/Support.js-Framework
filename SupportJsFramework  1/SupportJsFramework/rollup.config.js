import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const createConfig = (input, output, external = []) => ({
  input,
  output,
  external,
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      typescript: require('typescript'),
      tsconfig: 'tsconfig.json',
      clean: true,
      useTsconfigDeclarationDir: true
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ]
});

export default [
  // Main bundle - ESM
  createConfig(
    'src/index.ts',
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true
    }
  ),
  // Main bundle - CJS
  createConfig(
    'src/index.ts',
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true
    }
  ),
  // Core utilities - ESM
  createConfig(
    'src/core/index.ts',
    {
      file: 'dist/esm/core/index.js',
      format: 'esm',
      sourcemap: true
    }
  ),
  // Core utilities - CJS
  createConfig(
    'src/core/index.ts',
    {
      file: 'dist/cjs/core/index.js',
      format: 'cjs',
      sourcemap: true
    }
  ),
  // React integration - ESM
  createConfig(
    'src/integrations/react/index.ts',
    {
      file: 'dist/esm/integrations/react/index.js',
      format: 'esm',
      sourcemap: true
    },
    ['react', 'react-dom']
  ),
  // React integration - CJS
  createConfig(
    'src/integrations/react/index.ts',
    {
      file: 'dist/cjs/integrations/react/index.js',
      format: 'cjs',
      sourcemap: true
    },
    ['react', 'react-dom']
  ),
  // Next.js integration - ESM
  createConfig(
    'src/integrations/nextjs/index.ts',
    {
      file: 'dist/esm/integrations/nextjs/index.js',
      format: 'esm',
      sourcemap: true
    },
    ['next', 'react', 'react-dom']
  ),
  // Next.js integration - CJS
  createConfig(
    'src/integrations/nextjs/index.ts',
    {
      file: 'dist/cjs/integrations/nextjs/index.js',
      format: 'cjs',
      sourcemap: true
    },
    ['next', 'react', 'react-dom']
  ),
  // Angular integration - ESM
  createConfig(
    'src/integrations/angular/index.ts',
    {
      file: 'dist/esm/integrations/angular/index.js',
      format: 'esm',
      sourcemap: true
    },
    ['@angular/core', '@angular/common', 'rxjs']
  ),
  // Angular integration - CJS
  createConfig(
    'src/integrations/angular/index.ts',
    {
      file: 'dist/cjs/integrations/angular/index.js',
      format: 'cjs',
      sourcemap: true
    },
    ['@angular/core', '@angular/common', 'rxjs']
  )
];
