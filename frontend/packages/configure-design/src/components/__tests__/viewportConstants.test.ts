// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {VIEWPORT_WIDTHS, VIEWPORT_HEIGHTS} from '../viewportConstants';

describe('VIEWPORT_WIDTHS', () => {
  it('returns "85%" for desktop', () => {
    expect(VIEWPORT_WIDTHS.desktop).toBe('85%');
  });

  it('returns "60%" for tablet', () => {
    expect(VIEWPORT_WIDTHS.tablet).toBe('60%');
  });

  it('returns "40%" for mobile', () => {
    expect(VIEWPORT_WIDTHS.mobile).toBe('40%');
  });

  it('has entries for all three viewports', () => {
    expect(Object.keys(VIEWPORT_WIDTHS)).toEqual(expect.arrayContaining(['desktop', 'tablet', 'mobile']));
  });
});

describe('VIEWPORT_HEIGHTS', () => {
  it('returns "85%" for desktop', () => {
    expect(VIEWPORT_HEIGHTS.desktop).toBe('85%');
  });

  it('returns "90%" for tablet', () => {
    expect(VIEWPORT_HEIGHTS.tablet).toBe('90%');
  });

  it('returns "80%" for mobile', () => {
    expect(VIEWPORT_HEIGHTS.mobile).toBe('80%');
  });

  it('has entries for all three viewports', () => {
    expect(Object.keys(VIEWPORT_HEIGHTS)).toEqual(expect.arrayContaining(['desktop', 'tablet', 'mobile']));
  });
});
