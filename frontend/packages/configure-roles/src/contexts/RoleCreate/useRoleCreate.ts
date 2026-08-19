// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import RoleCreateContext, {type RoleCreateContextType} from './RoleCreateContext';

/**
 * Hook to access the role creation context.
 *
 * @public
 */
export default function useRoleCreate(): RoleCreateContextType {
  const context = useContext(RoleCreateContext);
  if (!context) {
    throw new Error('useRoleCreate must be used within a RoleCreateProvider');
  }
  return context;
}
