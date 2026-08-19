// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import type {OUNavigationState} from '../navigation';

describe('Navigation Models', () => {
  describe('OUNavigationState', () => {
    it('should have required fromOU property with id and name', () => {
      const state: OUNavigationState = {
        fromOU: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Engineering Department',
        },
      };

      expect(state.fromOU.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(state.fromOU.name).toBe('Engineering Department');
    });

    it('should represent navigation from parent to child OU', () => {
      const parentId = 'parent-ou-id';
      const parentName = 'Parent OU';

      const state: OUNavigationState = {
        fromOU: {id: parentId, name: parentName},
      };

      expect(state.fromOU).toEqual({id: parentId, name: parentName});
    });
  });
});
