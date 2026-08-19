// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import UserTypeCreateContext, {type UserTypeCreateContextType} from './UserTypeCreateContext';

/**
 * Hook to access the user type creation context.
 *
 * @throws Error if used outside of UserTypeCreateProvider
 * @returns The user type creation context value
 *
 * @public
 */
export default function useUserTypeCreate(): UserTypeCreateContextType {
  const context = useContext(UserTypeCreateContext);

  if (!context) {
    throw new Error('useUserTypeCreate must be used within a UserTypeCreateProvider');
  }

  return context;
}
