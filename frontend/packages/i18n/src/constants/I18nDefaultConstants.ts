// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * The BCP 47 locale code used as the fallback language across all applications.
 */
const I18nDefaultConstants = {
  /**
   * The default fallback language for i18n translations. This is used when a translation for the active locale is unavailable.
   */
  FALLBACK_LANGUAGE: 'en-US',
} as const;

export default I18nDefaultConstants;
