// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {
  CreateOrganizationUnitRequest,
  UpdateOrganizationUnitRequest,
  OrganizationUnitListParams,
} from '../requests';

describe('Request Models', () => {
  describe('CreateOrganizationUnitRequest', () => {
    it('should accept required handle and name properties', () => {
      const request: CreateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering Department',
      };

      expect(request.handle).toBe('engineering');
      expect(request.name).toBe('Engineering Department');
    });

    it('should accept optional description and parent', () => {
      const request: CreateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering Department',
        description: 'Software engineering team',
        parent: 'root-ou-id',
      };

      expect(request.description).toBe('Software engineering team');
      expect(request.parent).toBe('root-ou-id');
    });

    it('should accept null for nullable optional fields', () => {
      const request: CreateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering',
        description: null,
        parent: null,
      };

      expect(request.description).toBeNull();
      expect(request.parent).toBeNull();
    });

    it('should accept undefined for optional fields', () => {
      const request: CreateOrganizationUnitRequest = {
        handle: 'root',
        name: 'Root',
        description: undefined,
        parent: undefined,
      };

      expect(request.description).toBeUndefined();
      expect(request.parent).toBeUndefined();
    });
  });

  describe('UpdateOrganizationUnitRequest', () => {
    it('should accept required handle and name properties', () => {
      const request: UpdateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering Department',
      };

      expect(request.handle).toBe('engineering');
      expect(request.name).toBe('Engineering Department');
    });

    it('should accept all updatable fields', () => {
      const request: UpdateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering Department (Updated)',
        description: 'Updated description',
        parent: 'root-ou-id',
        themeId: '96c62e6d-9297-4295-8195-d28dfe0c9ff7',
        logoUrl: 'https://example.com/new-logo.png',
      };

      expect(request.description).toBe('Updated description');
      expect(request.parent).toBe('root-ou-id');
      expect(request.themeId).toBe('96c62e6d-9297-4295-8195-d28dfe0c9ff7');
      expect(request.logoUrl).toBe('https://example.com/new-logo.png');
    });

    it('should accept null for nullable fields', () => {
      const request: UpdateOrganizationUnitRequest = {
        handle: 'engineering',
        name: 'Engineering',
        description: null,
        parent: null,
        themeId: null,
      };

      expect(request.description).toBeNull();
      expect(request.parent).toBeNull();
      expect(request.themeId).toBeNull();
    });
  });

  describe('OrganizationUnitListParams', () => {
    it('should accept empty params', () => {
      const params: OrganizationUnitListParams = {};

      expect(params.limit).toBeUndefined();
      expect(params.offset).toBeUndefined();
    });

    it('should accept limit and offset', () => {
      const params: OrganizationUnitListParams = {
        limit: 10,
        offset: 20,
      };

      expect(params.limit).toBe(10);
      expect(params.offset).toBe(20);
    });

    it('should accept only limit', () => {
      const params: OrganizationUnitListParams = {
        limit: 50,
      };

      expect(params.limit).toBe(50);
      expect(params.offset).toBeUndefined();
    });
  });
});
