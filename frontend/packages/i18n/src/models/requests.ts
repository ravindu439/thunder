// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Variables for the bulk create translations mutation.
 */
export interface CreateTranslationsVariables {
  /**
   * The language code to create translations for (e.g., "fr-FR").
   */
  language: string;
  /**
   * Translations bundle: { namespace: { key: value } }.
   */
  translations: Record<string, Record<string, string>>;
}

/**
 * Variables for the update translation mutation.
 */
export interface UpdateTranslationVariables {
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
