// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import originValueText from '../originValueText';

describe('originValueText', () => {
  it('returns a string origin unchanged', () => {
    expect(originValueText('https://app.example.com')).toBe('https://app.example.com');
  });

  it('returns the pattern of a regex entry', () => {
    expect(originValueText({regex: '^https://[a-z]+\\.acme\\.io$'})).toBe('^https://[a-z]+\\.acme\\.io$');
  });
});
