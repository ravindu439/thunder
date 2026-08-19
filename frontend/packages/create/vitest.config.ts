// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: [['lcov', {projectRoot: '../../..'}], 'text-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        '**/__tests__/**',
        '**/test/**',
        '**/*.{test,spec}.{ts,tsx}',
        '**/test-setup.{ts,tsx}',
        '**/index.ts',
      ],
    },
    globals: true,
  },
});
