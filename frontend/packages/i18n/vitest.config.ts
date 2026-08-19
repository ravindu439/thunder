// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {playwright} from '@vitest/browser-playwright';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{browser: 'chromium'}],
      provider: playwright(),
    },
  },
});
