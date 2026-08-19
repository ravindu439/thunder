// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Regular expression to match the meta pattern `{{meta(key)}}` (exact, full-string match).
 */
export const META_PATTERN = /^\{\{meta\([^)]+\)\}\}$/;

/**
 * Regular expression to extract the key from a meta pattern `{{meta(key)}}`.
 */
export const META_KEY_PATTERN = /^\{\{meta\(([^)]+)\)\}\}$/;

/**
 * Check if a value matches the meta template pattern `{{meta(key)}}`.
 *
 * @param value - The string to test.
 * @returns `true` if the trimmed value matches the pattern, `false` otherwise.
 *
 * @example
 * ```typescript
 * isMetaTemplatePattern('{{meta(user:name)}}') // true
 * isMetaTemplatePattern('hello world')         // false
 * ```
 */
export default function isMetaTemplatePattern(value: string): boolean {
  return META_PATTERN.test(value.trim());
}
