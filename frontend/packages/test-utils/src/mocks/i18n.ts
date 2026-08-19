// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type Mock, vi} from 'vitest';

/**
 * Mock implementation of useTranslation hook for testing
 */
export const mockUseTranslation = (): {t: (key: string) => string; i18n: {changeLanguage: Mock; language: string}} => ({
  t: (key: string) => key,
  i18n: {
    changeLanguage: vi.fn(),
    language: 'en',
  },
});

/**
 * Mock implementation of useLanguage hook for testing
 */
export const mockUseLanguage = (): {currentLanguage: string; setLanguage: Mock; availableLanguages: string[]} => ({
  currentLanguage: 'en',
  setLanguage: vi.fn(),
  availableLanguages: ['en', 'si'],
});

/**
 * Mock implementation of useDataGridLocaleText hook for testing
 */
export const mockUseDataGridLocaleText = () => ({
  noRowsLabel: 'No rows',
  noResultsOverlayLabel: 'No results found.',
  paginationRowsPerPage: 'Rows per page:',
});
