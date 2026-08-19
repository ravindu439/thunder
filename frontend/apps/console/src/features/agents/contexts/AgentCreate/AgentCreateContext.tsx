// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Context} from 'react';
import {createContext} from 'react';
import type {AgentCreateFlowStep} from '../../models/agent-create-flow';

export interface AgentCreateContextType {
  currentStep: AgentCreateFlowStep;
  setCurrentStep: (step: AgentCreateFlowStep) => void;

  selectedSchema: {id: string; name: string; ouId: string} | null;
  setSelectedSchema: (schema: {id: string; name: string; ouId: string} | null) => void;

  selectedOuId: string | null;
  setSelectedOuId: (ouId: string | null) => void;

  agentName: string;
  setAgentName: (name: string) => void;

  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;

  selectedOwnerId: string | null;
  setSelectedOwnerId: (id: string | null) => void;

  error: string | null;
  setError: (error: string | null) => void;

  reset: () => void;
}

const AgentCreateContext: Context<AgentCreateContextType | undefined> = createContext<
  AgentCreateContextType | undefined
>(undefined);

export default AgentCreateContext;
