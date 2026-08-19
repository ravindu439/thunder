// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {BasicApplication} from '../application';
import type {ApplicationListResponse} from '../responses';

describe('Responses Models', () => {
  describe('ApplicationListResponse', () => {
    it('should have required properties', () => {
      const mockApplication: BasicApplication = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test App',
        clientId: 'test_client_id',
      };

      const response: ApplicationListResponse = {
        totalResults: 1,
        count: 1,
        applications: [mockApplication],
      };

      expect(response).toHaveProperty('totalResults');
      expect(response).toHaveProperty('count');
      expect(response).toHaveProperty('applications');
    });

    it('should accept valid totalResults and count', () => {
      const response: ApplicationListResponse = {
        totalResults: 25,
        count: 10,
        applications: [],
      };

      expect(response.totalResults).toBe(25);
      expect(response.count).toBe(10);
      expect(Array.isArray(response.applications)).toBe(true);
    });

    it('should accept array of BasicApplication', () => {
      const mockApplications: BasicApplication[] = [
        {
          id: '1',
          name: 'App 1',
          clientId: 'client_1',
        },
        {
          id: '2',
          name: 'App 2',
          description: 'Test description',
          clientId: 'client_2',
          logoUrl: 'https://example.com/logo.png',
        },
      ];

      const response: ApplicationListResponse = {
        totalResults: 2,
        count: 2,
        applications: mockApplications,
      };

      expect(response.applications).toHaveLength(2);
      expect(response.applications[0].name).toBe('App 1');
      expect(response.applications[1].description).toBe('Test description');
    });

    it('should handle empty applications array', () => {
      const response: ApplicationListResponse = {
        totalResults: 0,
        count: 0,
        applications: [],
      };

      expect(response.applications).toHaveLength(0);
      expect(response.totalResults).toBe(0);
      expect(response.count).toBe(0);
    });
  });
});
