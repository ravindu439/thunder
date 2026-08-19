// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import merge from '../merge';

describe('merge', () => {
  it('should return the destination object', () => {
    const obj = {a: 1};
    expect(merge(obj, {b: 2})).toBe(obj);
  });

  it('should merge flat properties', () => {
    expect(merge({a: 1}, {b: 2})).toEqual({a: 1, b: 2});
  });

  it('should overwrite primitive values', () => {
    expect(merge({a: 1}, {a: 2})).toEqual({a: 2});
  });

  it('should not overwrite with undefined', () => {
    expect(merge({a: 1}, {a: undefined})).toEqual({a: 1});
  });

  it('should recursively merge plain objects', () => {
    expect(merge({a: {x: 1}}, {a: {y: 2}})).toEqual({a: {x: 1, y: 2}});
  });

  it('should deep merge nested objects', () => {
    expect(merge({a: {b: {c: 1}}}, {a: {b: {d: 2}}})).toEqual({a: {b: {c: 1, d: 2}}});
  });

  it('should merge arrays by index', () => {
    expect(merge({a: [1, 2]}, {a: [3]})).toEqual({a: [3, 2]});
  });

  it('should recursively merge objects inside arrays', () => {
    expect(merge({a: [{x: 1}]}, {a: [{y: 2}]})).toEqual({a: [{x: 1, y: 2}]});
  });

  it('should handle multiple sources', () => {
    expect(merge({a: 1}, {b: 2}, {c: 3})).toEqual({a: 1, b: 2, c: 3});
  });

  it('should apply sources left to right', () => {
    expect(merge({a: 1}, {a: 2}, {a: 3})).toEqual({a: 3});
  });

  it('should skip null and undefined sources', () => {
    expect(merge({a: 1}, null as unknown as object, undefined as unknown as object)).toEqual({a: 1});
  });

  it('should not merge class instances — assigns by reference', () => {
    class Foo {
      x = 1;
    }
    const foo = new Foo();
    const result = merge({a: 1}, {b: foo});
    expect((result as unknown as {b: Foo}).b).toBe(foo);
  });

  it('should treat source array as destination plain object when target is a plain object', () => {
    // lodash behaviour: source array overwrites non-array target at that key
    const result = merge({a: {0: 'zero'}}, {a: ['one']});
    expect((result as {a: unknown}).a).toEqual(expect.objectContaining({0: 'one'}));
  });
});
