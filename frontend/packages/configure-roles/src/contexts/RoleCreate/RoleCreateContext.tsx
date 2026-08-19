// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Context} from 'react';
import {createContext} from 'react';
import type {ResourcePermissions} from '../../models/role';
import type {RoleCreateFlowStep} from '../../models/role-create-flow';

/**
 * Role creation context state interface.
 *
 * @public
 */
export interface RoleCreateContextType {
  currentStep: RoleCreateFlowStep;
  setCurrentStep: (step: RoleCreateFlowStep) => void;

  name: string;
  setName: (name: string) => void;

  ouId: string;
  setOuId: (ouId: string) => void;

  error: string | null;
  setError: (error: string | null) => void;

  permissions: ResourcePermissions[];
  setPermissions: (permissions: ResourcePermissions[]) => void;

  reset: () => void;
}

const RoleCreateContext: Context<RoleCreateContextType | undefined> = createContext<RoleCreateContextType | undefined>(
  undefined,
);

export default RoleCreateContext;
