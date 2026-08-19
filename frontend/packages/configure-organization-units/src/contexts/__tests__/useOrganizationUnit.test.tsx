// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderHook} from '@testing-library/react';
import type {ReactNode} from 'react';
import {describe, it, expect} from 'vitest';
import OrganizationUnitProvider from '../OrganizationUnitProvider';
import useOrganizationUnit from '../useOrganizationUnit';

describe('useOrganizationUnit', () => {
  it('should throw when used outside of OrganizationUnitProvider', () => {
    expect(() => {
      renderHook(() => useOrganizationUnit());
    }).toThrow('useOrganizationUnit must be used within an OrganizationUnitProvider');
  });

  it('should return context when used within OrganizationUnitProvider', () => {
    const {result} = renderHook(() => useOrganizationUnit(), {
      wrapper: ({children}: {children: ReactNode}) => <OrganizationUnitProvider>{children}</OrganizationUnitProvider>,
    });

    expect(result.current.treeItems).toEqual([]);
    expect(typeof result.current.resetTreeState).toBe('function');
  });
});
