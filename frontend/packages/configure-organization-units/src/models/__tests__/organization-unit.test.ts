// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {OrganizationUnit} from '../organization-unit';

describe('Organization Unit Models', () => {
  describe('OrganizationUnit', () => {
    it('should have required id, handle, and name properties', () => {
      const ou: OrganizationUnit = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        handle: 'engineering',
        name: 'Engineering Department',
      };

      expect(ou.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(ou.handle).toBe('engineering');
      expect(ou.name).toBe('Engineering Department');
    });

    it('should accept optional properties', () => {
      const ou: OrganizationUnit = {
        id: '1',
        handle: 'engineering',
        name: 'Engineering',
        description: 'Software engineering team',
        parent: 'root-ou-id',
        themeId: '96c62e6d-9297-4295-8195-d28dfe0c9ff7',
        layoutId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        logoUrl: 'https://example.com/logo.png',
      };

      expect(ou.description).toBe('Software engineering team');
      expect(ou.parent).toBe('root-ou-id');
      expect(ou.themeId).toBe('96c62e6d-9297-4295-8195-d28dfe0c9ff7');
      expect(ou.layoutId).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(ou.logoUrl).toBe('https://example.com/logo.png');
    });

    it('should accept null for nullable optional properties', () => {
      const ou: OrganizationUnit = {
        id: '1',
        handle: 'root',
        name: 'Root',
        description: null,
        parent: null,
        themeId: null,
        layoutId: null,
      };

      expect(ou.description).toBeNull();
      expect(ou.parent).toBeNull();
      expect(ou.themeId).toBeNull();
      expect(ou.layoutId).toBeNull();
    });

    it('should accept undefined for optional properties', () => {
      const ou: OrganizationUnit = {
        id: '1',
        handle: 'root',
        name: 'Root',
        description: undefined,
        parent: undefined,
      };

      expect(ou.description).toBeUndefined();
      expect(ou.parent).toBeUndefined();
    });
  });
});
