// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import thunderIdPlugin from './dist/index.js';

export default [
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**'],
  },
  ...thunderIdPlugin.configs.typescript,
  ...thunderIdPlugin.configs.vitest,
];
