// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isPlainObject from './isPlainObject';

/**
 * Drop-in replacement for lodash `isEqual`, scoped to the shapes this codebase compares for
 * deep-equality (primitives, `NaN`, arrays, and plain objects).
 *
 * Arrays are compared element-by-element in order. Plain objects are compared by own enumerable
 * keys regardless of key order. Does not special-case `Date`, `Map`, `Set`, `RegExp`, or class
 * instances; those compare equal only by reference.
 *
 * @param a - The first value.
 * @param b - The second value.
 * @returns `true` if `a` and `b` are deeply equal, `false` otherwise.
 */
export default function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') return Number.isNaN(a) && Number.isNaN(b);

  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, i) => isEqual(item, b[i]));
  }

  if (isPlainObject(a) || isPlainObject(b)) {
    if (!isPlainObject(a) || !isPlainObject(b)) return false;

    const aKeys = Object.keys(a);

    return (
      aKeys.length === Object.keys(b).length &&
      aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && isEqual(a[key], b[key]))
    );
  }

  return false;
}
