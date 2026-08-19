// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import kebabCase from '../kebabCase';

describe('kebabCase', () => {
  it('converts space-separated words', () => {
    expect(kebabCase('Acrylic Orange')).toBe('acrylic-orange');
  });

  it('converts camelCase', () => {
    expect(kebabCase('fooBar')).toBe('foo-bar');
  });

  it('converts PascalCase', () => {
    expect(kebabCase('FooBar')).toBe('foo-bar');
  });

  it('converts ALL_CAPS_SNAKE_CASE', () => {
    expect(kebabCase('FOO_BAR')).toBe('foo-bar');
  });

  it('converts strings with existing hyphens', () => {
    expect(kebabCase('high-contrast')).toBe('high-contrast');
  });

  it('strips special characters', () => {
    expect(kebabCase('hello! world?')).toBe('hello-world');
  });

  it('handles leading and trailing whitespace', () => {
    expect(kebabCase('  hello world ')).toBe('hello-world');
  });

  it('collapses multiple separators', () => {
    expect(kebabCase('pale  indigo')).toBe('pale-indigo');
  });

  it('handles an empty string', () => {
    expect(kebabCase('')).toBe('');
  });

  it('handles a single word', () => {
    expect(kebabCase('Classic')).toBe('classic');
  });

  it('handles XMLParser-style acronym transitions', () => {
    expect(kebabCase('XMLParser')).toBe('xml-parser');
  });
});
