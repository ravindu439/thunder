// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isPlainObject from './isPlainObject';

function mergeValue(tgtVal: unknown, srcVal: unknown): unknown {
  if (Array.isArray(srcVal)) {
    const tgtArr = Array.isArray(tgtVal) ? tgtVal : [];

    return mergeArrays(tgtArr, srcVal);
  }

  if (isPlainObject(srcVal)) {
    const tgtObj = isPlainObject(tgtVal) ? tgtVal : {};

    mergeTwo(tgtObj, srcVal);
    return tgtObj;
  }

  return srcVal;
}

function mergeArrays(target: unknown[], source: unknown[]): unknown[] {
  source.forEach((srcVal, i) => {
    if (srcVal === undefined) return;

    Object.assign(target, {[i]: mergeValue(target[i], srcVal)});
  });

  return target;
}

function mergeTwo(target: Record<string, unknown>, source: Record<string, unknown>): void {
  Object.keys(source).forEach((key) => {
    const srcVal = source[key];

    if (srcVal === undefined) return;

    const tgtVal = target[key];

    Object.assign(target, {[key]: mergeValue(tgtVal, srcVal)});
  });
}

/**
 * Drop-in replacement for lodash `merge`.
 *
 * Recursively merges own enumerable properties of source objects into the
 * destination object. Source properties that resolve to `undefined` do not
 * overwrite existing destination values. Array and plain-object values are
 * merged recursively; all other values are assigned by reference.
 *
 * Mutates and returns the destination object.
 *
 * @param object - The destination object.
 * @param sources - One or more source objects.
 * @returns The mutated destination object.
 */
export default function merge<T extends object>(object: T, ...sources: object[]): T {
  sources.forEach((source) => {
    if (source == null) return;

    mergeTwo(object as Record<string, unknown>, source as Record<string, unknown>);
  });

  return object;
}
