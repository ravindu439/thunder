// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {Group, GroupListResponse} from '../group';

describe('Group Models', () => {
  describe('Group', () => {
    it('should have required id, name, and ouId properties', () => {
      const group: Group = {
        id: '7a1b2c3d-4e5f-6789-abcd-ef0123456789',
        name: 'Developers',
        ouId: '550e8400-e29b-41d4-a716-446655440000',
      };

      expect(group.id).toBe('7a1b2c3d-4e5f-6789-abcd-ef0123456789');
      expect(group.name).toBe('Developers');
      expect(group.ouId).toBe('550e8400-e29b-41d4-a716-446655440000');
    });
  });

  describe('GroupListResponse', () => {
    it('should have required properties', () => {
      const response: GroupListResponse = {
        totalResults: 1,
        startIndex: 0,
        count: 1,
        groups: [{id: 'group-1', name: 'Developers', ouId: 'ou-id'}],
      };

      expect(response).toHaveProperty('totalResults');
      expect(response).toHaveProperty('startIndex');
      expect(response).toHaveProperty('count');
      expect(response).toHaveProperty('groups');
    });

    it('should accept valid pagination values', () => {
      const response: GroupListResponse = {
        totalResults: 15,
        startIndex: 0,
        count: 10,
        groups: [],
      };

      expect(response.totalResults).toBe(15);
      expect(response.startIndex).toBe(0);
      expect(response.count).toBe(10);
      expect(Array.isArray(response.groups)).toBe(true);
    });

    it('should accept array of Group', () => {
      const mockGroups: Group[] = [
        {id: '1', name: 'Developers', ouId: 'ou-1'},
        {id: '2', name: 'Designers', ouId: 'ou-1'},
        {id: '3', name: 'Managers', ouId: 'ou-1'},
      ];

      const response: GroupListResponse = {
        totalResults: 3,
        startIndex: 0,
        count: 3,
        groups: mockGroups,
      };

      expect(response.groups).toHaveLength(3);
      expect(response.groups[0].name).toBe('Developers');
      expect(response.groups[2].name).toBe('Managers');
    });

    it('should handle empty groups array', () => {
      const response: GroupListResponse = {
        totalResults: 0,
        startIndex: 0,
        count: 0,
        groups: [],
      };

      expect(response.groups).toHaveLength(0);
      expect(response.totalResults).toBe(0);
    });

    it('should accept optional pagination links', () => {
      const response: GroupListResponse = {
        totalResults: 20,
        startIndex: 0,
        count: 10,
        groups: [],
        links: [{rel: 'next', href: '/groups?offset=10&limit=10'}],
      };

      expect(response.links).toHaveLength(1);
      expect(response.links![0].rel).toBe('next');
    });
  });
});
