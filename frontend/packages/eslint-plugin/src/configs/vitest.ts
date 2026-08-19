// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import vitestPlugin from '@vitest/eslint-plugin';
import type {Linter} from 'eslint';

const vitestConfig: Linter.Config[] = [
  {
    ...vitestPlugin.configs.recommended,
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/test/**'],
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/expect-expect': ['error', {assertFunctionNames: ['expect', 'expectTypeOf']}],
    },
  },
];

export default vitestConfig;
