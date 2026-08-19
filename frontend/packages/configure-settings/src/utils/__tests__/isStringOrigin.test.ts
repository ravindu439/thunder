// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import type {AllowedOrigin} from '../../models/responses';
import isStringOrigin from '../isStringOrigin';

describe('isStringOrigin', () => {
  it('returns true for a literal string origin', () => {
    expect(isStringOrigin('https://app.example.com')).toBe(true);
  });

  it('treats the "null" literal as a string origin', () => {
    expect(isStringOrigin('null')).toBe(true);
  });

  it('returns false for a regex entry', () => {
    const entry: AllowedOrigin = {regex: '^https://x$'};
    expect(isStringOrigin(entry)).toBe(false);
  });
});
