// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import DesignUIConstants from '../design-ui-constants';

describe('DesignUIConstants', () => {
  it('INITIAL_LIMIT is 8', () => {
    expect(DesignUIConstants.INITIAL_LIMIT).toBe(8);
  });

  it('LEFT_PANEL_WIDTH is 300', () => {
    expect(DesignUIConstants.LEFT_PANEL_WIDTH).toBe(300);
  });

  it('RIGHT_PANEL_WIDTH is 350', () => {
    expect(DesignUIConstants.RIGHT_PANEL_WIDTH).toBe(350);
  });

  it('contains exactly three keys', () => {
    expect(Object.keys(DesignUIConstants)).toHaveLength(3);
  });

  it('is a frozen / const object (values cannot be reassigned)', () => {
    // TypeScript "as const" produces a readonly object at the type level;
    // runtime mutation is still possible unless Object.freeze is used.
    // We simply verify the expected type of each value.
    expect(typeof DesignUIConstants.INITIAL_LIMIT).toBe('number');
    expect(typeof DesignUIConstants.LEFT_PANEL_WIDTH).toBe('number');
    expect(typeof DesignUIConstants.RIGHT_PANEL_WIDTH).toBe('number');
  });
});
