// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {OrganizationUnitTreeItem} from '../organization-unit-tree';

describe('Organization Unit Tree Models', () => {
  describe('OrganizationUnitTreeItem', () => {
    it('should have required id, label, and handle properties', () => {
      const item: OrganizationUnitTreeItem = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        label: 'Engineering',
        handle: 'engineering',
      };

      expect(item.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(item.label).toBe('Engineering');
      expect(item.handle).toBe('engineering');
    });

    it('should accept optional properties', () => {
      const item: OrganizationUnitTreeItem = {
        id: '1',
        label: 'Engineering',
        handle: 'engineering',
        description: 'Software engineering team',
        isPlaceholder: false,
        logoUrl: 'https://example.com/logo.png',
      };

      expect(item.description).toBe('Software engineering team');
      expect(item.isPlaceholder).toBe(false);
      expect(item.logoUrl).toBe('https://example.com/logo.png');
    });

    it('should accept nested children', () => {
      const item: OrganizationUnitTreeItem = {
        id: 'parent-id',
        label: 'Engineering',
        handle: 'engineering',
        children: [
          {id: 'child-1', label: 'Frontend', handle: 'frontend'},
          {id: 'child-2', label: 'Backend', handle: 'backend'},
        ],
      };

      expect(item.children).toHaveLength(2);
      expect(item.children![0].label).toBe('Frontend');
      expect(item.children![1].label).toBe('Backend');
    });

    it('should support deeply nested tree structure', () => {
      const item: OrganizationUnitTreeItem = {
        id: 'root',
        label: 'Root',
        handle: 'root',
        children: [
          {
            id: 'level-1',
            label: 'Level 1',
            handle: 'level-1',
            children: [{id: 'level-2', label: 'Level 2', handle: 'level-2'}],
          },
        ],
      };

      expect(item.children![0].children![0].label).toBe('Level 2');
    });

    it('should support placeholder items for lazy loading', () => {
      const placeholder: OrganizationUnitTreeItem = {
        id: 'placeholder-id',
        label: 'Loading...',
        handle: '',
        isPlaceholder: true,
      };

      expect(placeholder.isPlaceholder).toBe(true);
    });
  });
});
