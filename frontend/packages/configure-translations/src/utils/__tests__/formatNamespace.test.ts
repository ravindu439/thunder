// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import formatNamespace from '@/utils/formatNamespace';

describe('formatNamespace', () => {
  describe('camelCase inputs', () => {
    it('formats a camelCase string by inserting spaces before capitals', () => {
      expect(formatNamespace('userProfileSettings')).toBe('User Profile Settings');
    });

    it('formats a single-word camelCase string by capitalizing the first letter', () => {
      expect(formatNamespace('users')).toBe('Users');
    });

    it('formats a two-word camelCase string correctly', () => {
      expect(formatNamespace('signIn')).toBe('Sign In');
    });

    it('formats a multi-word camelCase string correctly', () => {
      expect(formatNamespace('myApplicationSettings')).toBe('My Application Settings');
    });
  });

  describe('PascalCase inputs', () => {
    it('formats a PascalCase string correctly', () => {
      expect(formatNamespace('AdminPanel')).toBe('Admin Panel');
    });

    it('formats a single PascalCase word correctly', () => {
      expect(formatNamespace('Users')).toBe('Users');
    });

    it('formats multi-word PascalCase correctly', () => {
      expect(formatNamespace('UserProfileSettings')).toBe('User Profile Settings');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(formatNamespace('')).toBe('');
    });

    it('formats a lowercase single word by capitalizing it', () => {
      expect(formatNamespace('common')).toBe('Common');
    });

    it('handles consecutive capital letters correctly', () => {
      expect(formatNamespace('myAPIConfig')).toBe('My A P I Config');
    });

    it('returns a trimmed result when input has leading/trailing spaces', () => {
      const result = formatNamespace('  myNamespace  ');
      expect(result).not.toMatch(/^\s|\s$/);
    });
  });

  describe('real namespace examples', () => {
    it('formats "applications" correctly', () => {
      expect(formatNamespace('applications')).toBe('Applications');
    });

    it('formats "translations" correctly', () => {
      expect(formatNamespace('translations')).toBe('Translations');
    });

    it('formats "loginFlow" correctly', () => {
      expect(formatNamespace('loginFlow')).toBe('Login Flow');
    });

    it('formats "identityProviders" correctly', () => {
      expect(formatNamespace('identityProviders')).toBe('Identity Providers');
    });
  });
});
