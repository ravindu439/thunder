// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Linter} from 'eslint';
import playwright from 'eslint-plugin-playwright';

const playwrightConfig: Linter.Config[] = [
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/tests/**/*.ts', '**/*.spec.ts', '**/*.spec.js'],
  },
];

export default playwrightConfig;
