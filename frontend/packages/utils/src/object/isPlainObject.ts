// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Drop-in replacement for lodash `isPlainObject`.
 *
 * Returns `true` for objects created by the `Object` constructor, an object literal, or with a
 * `null` prototype. Returns `false` for arrays, functions, class instances, `Date`, `Map`, `Set`,
 * and other built-ins.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a plain object, `false` otherwise.
 */
export default function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;

  const proto = Object.getPrototypeOf(value) as unknown;

  return proto === Object.prototype || proto === null;
}
