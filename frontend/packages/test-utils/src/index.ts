// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export {
  default as render,
  renderWithProviders,
  renderHook,
  getByTranslationKey,
  configureTestUtils,
  TEST_CN_PREFIX,
} from './test-utils';
export type {ThunderTestConfig} from './test-utils';

// Re-export everything from @testing-library/react for convenience
export * from '@testing-library/react';
export {default as userEvent} from '@testing-library/user-event';
