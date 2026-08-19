// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {TokenConfig} from '../token';

describe('Token Models', () => {
  describe('TokenConfig', () => {
    it('should have required validityPeriod and userAttributes', () => {
      const tokenConfig: TokenConfig = {
        validityPeriod: 3600,
        userAttributes: ['email', 'username'],
      };

      expect(tokenConfig).toHaveProperty('validityPeriod');
      expect(tokenConfig).toHaveProperty('userAttributes');
      expect(tokenConfig.validityPeriod).toBe(3600);
      expect(tokenConfig.userAttributes).toEqual(['email', 'username']);
    });

    it('should accept validity period and user attributes', () => {
      const tokenConfig: TokenConfig = {
        validityPeriod: 7200,
        userAttributes: ['sub', 'email', 'name'],
      };

      expect(tokenConfig.validityPeriod).toBe(7200);
      expect(tokenConfig.userAttributes).toHaveLength(3);
    });

    it('should accept empty userAttributes array', () => {
      const tokenConfig: TokenConfig = {
        validityPeriod: 1800,
        userAttributes: [],
      };

      expect(tokenConfig.userAttributes).toEqual([]);
      expect(tokenConfig.userAttributes).toHaveLength(0);
    });

    it('should accept various validity periods', () => {
      const shortLived: TokenConfig = {
        validityPeriod: 300, // 5 minutes
        userAttributes: [],
      };

      const longLived: TokenConfig = {
        validityPeriod: 86400, // 24 hours
        userAttributes: [],
      };

      expect(shortLived.validityPeriod).toBe(300);
      expect(longLived.validityPeriod).toBe(86400);
    });

    it('should accept multiple user attributes', () => {
      const tokenConfig: TokenConfig = {
        validityPeriod: 3600,
        userAttributes: ['sub', 'email', 'email_verified', 'name', 'given_name', 'family_name', 'picture', 'roles'],
      };

      expect(tokenConfig.userAttributes).toHaveLength(8);
      expect(tokenConfig.userAttributes).toContain('email');
      expect(tokenConfig.userAttributes).toContain('roles');
    });
  });
});
