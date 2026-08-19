// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync} from 'fs';
import {join} from 'path';
import {defineConfig} from 'rolldown';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react/jsx-runtime',
  // Needed to avoid hook ordering issues.
  /^@mui\//,
  /^@thunderid\//,
  /^@wso2\//,
  /^@tanstack\//,
  /^@testing-library\//,
  'vitest',
  'i18next',
  'react-i18next',
  'react-router',
];

const commonOptions = {
  input: {
    index: join('src', 'index.ts'),
    setup: join('src', 'setup.ts'),
    'mocks/index': join('src', 'mocks', 'index.ts'),
  },
  external,
  target: 'es2020',
  sourcemap: true,
};

export default defineConfig([
  // ESM build (for browsers/bundlers)
  {
    ...commonOptions,
    platform: 'browser',
    output: {
      dir: 'dist',
      format: 'esm',
    },
  },
  // CommonJS build (for Node/SSR/testing)
  {
    ...commonOptions,
    platform: 'node',
    output: {
      dir: join('dist', 'cjs'),
      entryFileNames: '[name].cjs',
      format: 'cjs',
    },
  },
]);
