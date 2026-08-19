// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Translation creation step identifiers used in the translation creation flow
 * to track the current step and navigate between steps.
 *
 * @public
 */
export const TranslationCreateFlowStep = {
  COUNTRY: 'COUNTRY',
  LANGUAGE: 'LANGUAGE',
  LOCALE_CODE: 'LOCALE_CODE',
} as const;

/**
 * Translation creation step type
 *
 * @public
 */
export type TranslationCreateFlowStep = keyof typeof TranslationCreateFlowStep;
