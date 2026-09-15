// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import {SCIM_FIELD_CATALOG} from '../scim-field-catalog';

describe('SCIM_FIELD_CATALOG', () => {
  it('has a unique field for every entry', () => {
    const fields = SCIM_FIELD_CATALOG.map((entry) => entry.field);
    expect(new Set(fields).size).toBe(fields.length);
  });

  it('has a non-empty defaultLocalAttribute for every entry', () => {
    expect(SCIM_FIELD_CATALOG.every((entry) => entry.defaultLocalAttribute.trim() !== '')).toBe(true);
  });

  it('includes both core and enterprise groups', () => {
    const groups = new Set(SCIM_FIELD_CATALOG.map((entry) => entry.group));
    expect(groups.has('core')).toBe(true);
    expect(groups.has('enterprise')).toBe(true);
  });
});
