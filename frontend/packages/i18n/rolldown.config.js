// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineConfig} from 'rolldown';
import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(currentDir, 'package.json'), 'utf8'));

const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const commonOptions = {
  input: {
    index: join('src', 'index.ts'),
    'locales/en-US': join('src', 'locales', 'en-US.ts'),
  },
  external,
  target: 'es2020',
  sourcemap: true,
};

export default defineConfig([
  // ✅ ESM build (for browsers/bundlers)
  {
    ...commonOptions,
    platform: 'browser',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
    },
  },
  // ✅ CommonJS build (for Node/SSR/testing)
  {
    ...commonOptions,
    platform: 'node',
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
  },
]);
