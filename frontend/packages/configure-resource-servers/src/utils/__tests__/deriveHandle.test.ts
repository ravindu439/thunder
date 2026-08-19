// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {deriveHandle} from '../deriveHandle';

describe('deriveHandle', () => {
  it('joins words with hyphen by default', () => {
    expect(deriveHandle('Payments API')).toBe('payments-api');
  });

  it('joins words with underscore when delimiter is hyphen', () => {
    expect(deriveHandle('Payments API', '-')).toBe('payments_api');
  });

  it('strips special characters and joins remaining words', () => {
    expect(deriveHandle('My@Api#V2')).toBe('my-api-v2');
  });

  it('returns empty string when name is empty', () => {
    expect(deriveHandle('')).toBe('');
  });

  it('returns the word unchanged when name is already lowercase single word', () => {
    expect(deriveHandle('test')).toBe('test');
  });
});
