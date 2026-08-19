// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import type {OrganizationUnitContextType} from './OrganizationUnitContext';
import OrganizationUnitContext from './OrganizationUnitContext';

export default function useOrganizationUnit(): OrganizationUnitContextType {
  const context = useContext(OrganizationUnitContext);
  if (!context) {
    throw new Error('useOrganizationUnit must be used within an OrganizationUnitProvider');
  }
  return context;
}
