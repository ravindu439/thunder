// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import getBreakingSchemaChanges from '../getBreakingSchemaChanges';

describe('getBreakingSchemaChanges', () => {
  it('flags removed, newly-required, and tightened attributes', () => {
    const base = {
      removed: {type: 'string'},
      role: {type: 'string'},
      status: {type: 'string', enum: ['ACTIVE', 'INACTIVE']},
      code: {type: 'string'},
      id: {type: 'string'},
    };
    const next = {
      role: {type: 'number'}, // type change
      status: {type: 'string', enum: ['ACTIVE']}, // enum narrowed
      code: {type: 'string', regex: '^[0-9]+$'}, // regex added
      id: {type: 'string', unique: true}, // unique added
      added: {type: 'string', required: true}, // new required
    };
    expect(getBreakingSchemaChanges(base, next)).toEqual(['added', 'code', 'id', 'removed', 'role', 'status']);
  });

  it('ignores additive and loosening changes', () => {
    const base = {
      role: {type: 'string', required: true},
      status: {type: 'string', enum: ['ACTIVE']},
    };
    const next = {
      role: {type: 'string', required: false}, // relaxed
      status: {type: 'string', enum: ['ACTIVE', 'INACTIVE']}, // widened
      optional: {type: 'string'}, // new optional
    };
    expect(getBreakingSchemaChanges(base, next)).toEqual([]);
  });
});
