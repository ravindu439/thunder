// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isPlainObject from '../isPlainObject';

describe('isPlainObject', () => {
  it('should return true for an object literal', () => {
    expect(isPlainObject({a: 1})).toBe(true);
  });

  it('should return true for an empty object literal', () => {
    expect(isPlainObject({})).toBe(true);
  });

  it('should return true for an object created with Object.create(null)', () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('should return true for an object created with new Object()', () => {
    expect(isPlainObject(new Object())).toBe(true);
  });

  it('should return false for an array', () => {
    expect(isPlainObject([1, 2])).toBe(false);
  });

  it('should return false for null', () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isPlainObject(undefined)).toBe(false);
  });

  it('should return false for a string', () => {
    expect(isPlainObject('hello')).toBe(false);
  });

  it('should return false for a number', () => {
    expect(isPlainObject(42)).toBe(false);
  });

  it('should return false for a function', () => {
    expect(isPlainObject(() => null)).toBe(false);
  });

  it('should return false for a Date', () => {
    expect(isPlainObject(new Date())).toBe(false);
  });

  it('should return false for a class instance', () => {
    class Foo {}
    expect(isPlainObject(new Foo())).toBe(false);
  });
});
