// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for i18n feature cache management.
 *
 * @public
 * @remarks
 * These constants are used with TanStack Query to manage caching,
 * invalidation, and refetching of i18n translation data.
 */
const I18nQueryKeys = {
  /**
   * Base key for all i18n translation queries
   */
  TRANSLATIONS: 'i18n-translations',
  /**
   * Key for languages list query
   */
  LANGUAGES: 'i18n-languages',
} as const;

export default I18nQueryKeys;
