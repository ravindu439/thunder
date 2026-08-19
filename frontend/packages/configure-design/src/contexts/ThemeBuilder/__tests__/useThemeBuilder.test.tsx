// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderHook} from '@thunderid/test-utils';
import {describe, it, expect} from 'vitest';
import useThemeBuilder from '../useThemeBuilder';

describe('useThemeBuilder', () => {
  it('throws an error when used outside of ThemeBuilderProvider', () => {
    expect(() => renderHook(() => useThemeBuilder())).toThrowError(
      'useThemeBuilder must be used within ThemeBuilderProvider',
    );
  });
});
