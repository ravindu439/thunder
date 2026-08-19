// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {ApiError} from '../api-error';

describe('API Error Models', () => {
  describe('ApiError', () => {
    it('should have required code, message, and description properties', () => {
      const error: ApiError = {
        code: 'OU-60001',
        message: 'Organization unit not found',
        description: 'No organization unit exists with the given ID',
      };

      expect(error.code).toBe('OU-60001');
      expect(error.message).toBe('Organization unit not found');
      expect(error.description).toBe('No organization unit exists with the given ID');
    });

    it('should represent a validation error', () => {
      const error: ApiError = {
        code: 'OU-60002',
        message: 'Invalid request',
        description: 'The handle field is required and must be unique',
      };

      expect(error).toHaveProperty('code');
      expect(error).toHaveProperty('message');
      expect(error).toHaveProperty('description');
    });
  });
});
