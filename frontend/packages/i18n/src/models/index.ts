// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * TypeScript type definitions for i18n
 */

import type enUS from '../locales/en-US';

/**
 * Translation resources type derived from English translations
 */
export type TranslationResources = {
  [K in keyof typeof enUS]: (typeof enUS)[K] extends Record<string, unknown>
    ? {[P in keyof (typeof enUS)[K]]: unknown}
    : unknown;
};

/**
 * Supported languages in applications
 */
export type SupportedLanguage = 'en-US';

/**
 * Language configuration
 */
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Available translations by language
 */
export interface Translations {
  'en-US': typeof enUS;
}

/**
 * Language metadata
 */
export const LANGUAGE_CONFIGS: Record<SupportedLanguage, LanguageConfig> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US)',
    direction: 'ltr',
  },
};

/**
 * Type guard to check if a string is a supported language
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return lang in LANGUAGE_CONFIGS;
}

/**
 * Recursive type for translation resource values
 */
export type ResourceValue = string | ((...args: unknown[]) => string) | {[key: string]: ResourceValue};

/**
 * Type for namespace resources mapping
 */
export type NamespaceResources = Record<string, ResourceValue>;
