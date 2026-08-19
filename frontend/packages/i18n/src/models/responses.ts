// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Response from the languages API.
 */
export interface LanguagesResponse {
  /**
   * List of available language codes (e.g., ["en", "fr", "de"])
   */
  languages: string[];
}

/**
 * Response from the translations API.
 */
export interface TranslationsResponse {
  /**
   * The language code for the translations (e.g., "en").
   */
  language: string;
  /**
   * Total number of translation keys (optional).
   */
  totalResults?: number;
  /**
   * Translations object: { namespace: { key: value } }.
   */
  translations: Record<string, Record<string, string>>;
}

/**
 * Response from the translation API.
 */
export interface TranslationResponse {
  /**
   * The language code for the translation (e.g., "en").
   */
  language: string;
  /**
   * The namespace of the translation key.
   */
  namespace: string;
  /**
   * The translation key.
   */
  key: string;
  /**
   * The translation value.
   */
  value: string;
}
