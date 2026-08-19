// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useState, useCallback, type ReactNode} from 'react';
import AgentCreateContext from './AgentCreateContext';
import {AgentCreateFlowStep} from '../../models/agent-create-flow';

export default function AgentCreateProvider({children}: {children: ReactNode}) {
  const [currentStep, setCurrentStep] = useState<AgentCreateFlowStep>(AgentCreateFlowStep.ORGANIZATION_UNIT);
  const [selectedSchema, setSelectedSchema] = useState<{id: string; name: string; ouId: string} | null>(null);
  const [selectedOuId, setSelectedOuId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback((): void => {
    setCurrentStep(AgentCreateFlowStep.ORGANIZATION_UNIT);
    setSelectedSchema(null);
    setSelectedOuId(null);
    setAgentName('');
    setFormValues({});
    setSelectedOwnerId(null);
    setError(null);
  }, []);

  return (
    <AgentCreateContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        selectedSchema,
        setSelectedSchema,
        selectedOuId,
        setSelectedOuId,
        agentName,
        setAgentName,
        formValues,
        setFormValues,
        selectedOwnerId,
        setSelectedOwnerId,
        error,
        setError,
        reset,
      }}
    >
      {children}
    </AgentCreateContext.Provider>
  );
}
