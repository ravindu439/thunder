// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Context} from 'react';
import {createContext} from 'react';
import type {GroupCreateFlowStep} from '../../models/group-create-flow';

/**
 * Group creation context state interface.
 *
 * @public
 */
export interface GroupCreateContextType {
  currentStep: GroupCreateFlowStep;
  setCurrentStep: (step: GroupCreateFlowStep) => void;

  name: string;
  setName: (name: string) => void;

  description: string;
  setDescription: (description: string) => void;

  ouId: string;
  setOuId: (ouId: string) => void;

  error: string | null;
  setError: (error: string | null) => void;

  reset: () => void;
}

const GroupCreateContext: Context<GroupCreateContextType | undefined> = createContext<
  GroupCreateContextType | undefined
>(undefined);

export default GroupCreateContext;
