// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import ColorSchemeOptions from '../ColorSchemeOptions';

describe('ColorSchemeOptions', () => {
  it('contains exactly three options', () => {
    expect(ColorSchemeOptions).toHaveLength(3);
  });

  it('first option has id "light"', () => {
    expect(ColorSchemeOptions[0].id).toBe('light');
  });

  it('second option has id "dark"', () => {
    expect(ColorSchemeOptions[1].id).toBe('dark');
  });

  it('third option has id "system"', () => {
    expect(ColorSchemeOptions[2].id).toBe('system');
  });

  it('all options have a non-empty label', () => {
    ColorSchemeOptions.forEach((opt) => {
      expect(opt.label).toBeTruthy();
    });
  });

  it('all options have an icon', () => {
    ColorSchemeOptions.forEach((opt) => {
      expect(opt.icon).toBeDefined();
    });
  });

  it('option ids are unique', () => {
    const ids = ColorSchemeOptions.map((opt) => opt.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ColorSchemeOptions.length);
  });

  it('labels are non-empty strings', () => {
    ColorSchemeOptions.forEach((opt) => {
      expect(typeof opt.label).toBe('string');
      expect(opt.label.length).toBeGreaterThan(0);
    });
  });
});
