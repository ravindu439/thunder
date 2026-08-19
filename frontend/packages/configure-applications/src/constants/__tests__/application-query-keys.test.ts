// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import ApplicationQueryKeys from '../application-query-keys';

describe('ApplicationQueryKeys', () => {
  it('should export valid query keys object', () => {
    expect(ApplicationQueryKeys).toBeDefined();
    expect(typeof ApplicationQueryKeys).toBe('object');
  });

  it('should have applications key', () => {
    expect(ApplicationQueryKeys).toHaveProperty('APPLICATIONS');
  });

  it('should have application key', () => {
    expect(ApplicationQueryKeys).toHaveProperty('APPLICATION');
  });
});
