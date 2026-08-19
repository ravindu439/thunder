// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Regular expression to match the i18n pattern `{{t(key)}}` (exact, full-string match).
 * Allows optional whitespace around `t(key)` to handle both `{{t(key)}}` and `{{ t(key) }}`.
 */
export const I18N_PATTERN = /^\{\{\s*t\([^)]+\)\s*\}\}$/;

/**
 * Regular expression to extract the key from an i18n pattern `{{t(key)}}`.
 * Allows optional whitespace around `t(key)`.
 */
export const I18N_KEY_PATTERN = /^\{\{\s*t\(([^)]+)\)\s*\}\}$/;

/**
 * Check if a value matches the i18n template pattern `{{t(key)}}`.
 *
 * @param value - The string to test.
 * @returns `true` if the trimmed value matches the pattern, `false` otherwise.
 *
 * @example
 * ```typescript
 * isI18nTemplatePattern('{{t(signin:heading)}}') // true
 * isI18nTemplatePattern('hello world')           // false
 * ```
 */
export default function isI18nTemplatePattern(value: string): boolean {
  return I18N_PATTERN.test(value.trim());
}
