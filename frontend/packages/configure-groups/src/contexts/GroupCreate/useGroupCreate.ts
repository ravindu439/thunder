// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import GroupCreateContext, {type GroupCreateContextType} from './GroupCreateContext';

/**
 * Hook to access the group creation context.
 *
 * @public
 */
export default function useGroupCreate(): GroupCreateContextType {
  const context = useContext(GroupCreateContext);
  if (!context) {
    throw new Error('useGroupCreate must be used within a GroupCreateProvider');
  }
  return context;
}
