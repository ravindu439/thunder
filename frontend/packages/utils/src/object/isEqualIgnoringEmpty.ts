// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isEqual from './isEqual';
import isPlainObject from './isPlainObject';

// Recursively treats empty-string/empty-array/undefined/null as equivalent.
function normalize(value: unknown): unknown {
  if (value === undefined || value === null || value === '') return undefined;
  if (Array.isArray(value)) {
    const items = value.map(normalize).filter((item) => item !== undefined);
    return items.length === 0 ? undefined : items;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const normalized = normalize(val);
      if (normalized !== undefined) out[key] = normalized;
    }
    return Object.keys(out).length === 0 ? undefined : out;
  }
  return value;
}

/**
 * Deep-equality check for comparing an edited form value against its saved original.
 *
 * Behaves like lodash `isEqual`, except `undefined`, `null`, `''`, `[]`, and `{}` (or objects/arrays that normalize
 * down to empty) are all treated as the same "empty" value on both sides — recursively, at every level of nesting. A
 * field the user cleared back to blank compares equal to a field that was simply never set, even nested inside an
 * object or array (one side `''`/`[]`/`{}` or an absent key, the other `undefined`).
 *
 * @param a - The first value (e.g. the edited value).
 * @param b - The second value (e.g. the saved/original value).
 * @returns `true` if the two values are equal once normalized.
 */
export default function isEqualIgnoringEmpty(a: unknown, b: unknown): boolean {
  return isEqual(normalize(a), normalize(b));
}
