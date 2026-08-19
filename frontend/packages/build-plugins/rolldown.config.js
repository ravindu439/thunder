// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync} from 'fs';
import {join} from 'path';
import {defineConfig} from 'rolldown';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const commonOptions = {
  input: [join('src', 'vite', 'index.ts')],
  external,
  platform: 'node',
  target: 'es2020',
  sourcemap: true,
};

export default defineConfig([
  // ✅ ESM build
  {
    ...commonOptions,
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
  // ✅ CommonJS build
  {
    ...commonOptions,
    output: {
      dir: join('dist', 'cjs'),
      entryFileNames: '[name].cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  },
]);
