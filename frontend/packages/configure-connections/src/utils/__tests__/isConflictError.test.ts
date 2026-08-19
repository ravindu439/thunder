// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isConflictError from '../isConflictError';

describe('isConflictError', () => {
  it('returns true for a 409 response', () => {
    expect(isConflictError({response: {status: 409}})).toBe(true);
  });

  it('returns false for other statuses', () => {
    expect(isConflictError({response: {status: 400}})).toBe(false);
    expect(isConflictError({response: {status: 500}})).toBe(false);
  });

  it('returns false for non-HTTP errors', () => {
    expect(isConflictError(new Error('boom'))).toBe(false);
    expect(isConflictError(null)).toBe(false);
    expect(isConflictError(undefined)).toBe(false);
  });
});
