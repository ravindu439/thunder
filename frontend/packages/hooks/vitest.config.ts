// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {playwright} from '@vitest/browser-playwright';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  define: {
    global: 'globalThis',
  },
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
    setupFiles: ['@thunderid/test-utils/setup'],
    browser: {
      enabled: true,
      headless: true,
      instances: [{browser: 'chromium'}],
      provider: playwright(),
    },
  },
});
