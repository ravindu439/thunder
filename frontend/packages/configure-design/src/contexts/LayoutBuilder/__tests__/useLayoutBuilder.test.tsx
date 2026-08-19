// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderHook} from '@thunderid/test-utils';
import {describe, it, expect} from 'vitest';
import useLayoutBuilder from '../useLayoutBuilder';

describe('useLayoutBuilder', () => {
  it('throws an error when used outside of LayoutBuilderProvider', () => {
    expect(() => renderHook(() => useLayoutBuilder())).toThrowError(
      'useLayoutBuilder must be used within LayoutBuilderProvider',
    );
  });
});
