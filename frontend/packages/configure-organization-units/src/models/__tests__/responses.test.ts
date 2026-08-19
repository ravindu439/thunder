// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {OrganizationUnit} from '../organization-unit';
import type {OrganizationUnitListResponse} from '../responses';

describe('Response Models', () => {
  describe('OrganizationUnitListResponse', () => {
    it('should have required properties', () => {
      const mockOU: OrganizationUnit = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        handle: 'engineering',
        name: 'Engineering Department',
      };

      const response: OrganizationUnitListResponse = {
        totalResults: 1,
        startIndex: 0,
        count: 1,
        organizationUnits: [mockOU],
      };

      expect(response).toHaveProperty('totalResults');
      expect(response).toHaveProperty('startIndex');
      expect(response).toHaveProperty('count');
      expect(response).toHaveProperty('organizationUnits');
    });

    it('should accept valid pagination values', () => {
      const response: OrganizationUnitListResponse = {
        totalResults: 50,
        startIndex: 10,
        count: 10,
        organizationUnits: [],
      };

      expect(response.totalResults).toBe(50);
      expect(response.startIndex).toBe(10);
      expect(response.count).toBe(10);
      expect(Array.isArray(response.organizationUnits)).toBe(true);
    });

    it('should accept array of OrganizationUnit', () => {
      const mockOUs: OrganizationUnit[] = [
        {id: '1', handle: 'engineering', name: 'Engineering'},
        {id: '2', handle: 'marketing', name: 'Marketing', description: 'Marketing team'},
      ];

      const response: OrganizationUnitListResponse = {
        totalResults: 2,
        startIndex: 0,
        count: 2,
        organizationUnits: mockOUs,
      };

      expect(response.organizationUnits).toHaveLength(2);
      expect(response.organizationUnits[0].handle).toBe('engineering');
      expect(response.organizationUnits[1].description).toBe('Marketing team');
    });

    it('should handle empty organization units array', () => {
      const response: OrganizationUnitListResponse = {
        totalResults: 0,
        startIndex: 0,
        count: 0,
        organizationUnits: [],
      };

      expect(response.organizationUnits).toHaveLength(0);
      expect(response.totalResults).toBe(0);
      expect(response.count).toBe(0);
    });

    it('should accept optional pagination links', () => {
      const response: OrganizationUnitListResponse = {
        totalResults: 50,
        startIndex: 0,
        count: 10,
        organizationUnits: [],
        links: [
          {rel: 'next', href: '/organization-units?offset=10&limit=10'},
          {rel: 'prev', href: '/organization-units?offset=0&limit=10'},
        ],
      };

      expect(response.links).toHaveLength(2);
      expect(response.links![0].rel).toBe('next');
      expect(response.links![1].rel).toBe('prev');
    });
  });
});
