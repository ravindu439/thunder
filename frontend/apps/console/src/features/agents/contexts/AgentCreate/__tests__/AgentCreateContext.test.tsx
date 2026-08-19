// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {useContext, useMemo} from 'react';
import {describe, expect, it, vi} from 'vitest';
import {AgentCreateFlowStep} from '../../../models/agent-create-flow';
import AgentCreateContext, {type AgentCreateContextType} from '../AgentCreateContext';

function TestConsumer() {
  const context = useContext(AgentCreateContext);

  if (!context) {
    return <div data-testid="context">undefined</div>;
  }

  return (
    <div>
      <div data-testid="context">defined</div>
      <div data-testid="context-type">{typeof context}</div>
      <div data-testid="current-step">{context.currentStep}</div>
      <div data-testid="agent-name">{context.agentName}</div>
      <div data-testid="selected-schema">{context.selectedSchema?.id ?? 'null'}</div>
    </div>
  );
}

function TestWithMockValue() {
  const mockContextValue: AgentCreateContextType = useMemo(
    () => ({
      currentStep: AgentCreateFlowStep.NAME,
      setCurrentStep: vi.fn(),
      selectedSchema: {id: 'schema-1', name: 'default', ouId: 'ou-1'},
      setSelectedSchema: vi.fn(),
      selectedOuId: null,
      setSelectedOuId: vi.fn(),
      agentName: 'Test Agent',
      setAgentName: vi.fn(),
      formValues: {},
      setFormValues: vi.fn(),
      selectedOwnerId: null,
      setSelectedOwnerId: vi.fn(),
      error: null,
      setError: vi.fn(),
      reset: vi.fn(),
    }),
    [],
  );

  return (
    <AgentCreateContext.Provider value={mockContextValue}>
      <TestConsumer />
    </AgentCreateContext.Provider>
  );
}

describe('AgentCreateContext', () => {
  it('provides undefined value when used without provider', () => {
    render(<TestConsumer />);

    expect(screen.getByTestId('context')).toHaveTextContent('undefined');
  });

  it('provides context value when used with provider', () => {
    render(<TestWithMockValue />);

    expect(screen.getByTestId('context')).toHaveTextContent('defined');
    expect(screen.getByTestId('context-type')).toHaveTextContent('object');
  });

  it('provides correct context properties when used with provider', () => {
    render(<TestWithMockValue />);

    expect(screen.getByTestId('current-step')).toHaveTextContent(AgentCreateFlowStep.NAME);
    expect(screen.getByTestId('agent-name')).toHaveTextContent('Test Agent');
    expect(screen.getByTestId('selected-schema')).toHaveTextContent('schema-1');
  });

  it('has the expected TypeScript interface shape', () => {
    const mockContext: AgentCreateContextType = {
      currentStep: AgentCreateFlowStep.NAME,
      setCurrentStep: () => null,
      selectedSchema: null,
      setSelectedSchema: () => null,
      selectedOuId: null,
      setSelectedOuId: () => null,
      agentName: '',
      setAgentName: () => null,
      formValues: {},
      setFormValues: () => null,
      selectedOwnerId: null,
      setSelectedOwnerId: () => null,
      error: null,
      setError: () => null,
      reset: () => null,
    };

    expect(mockContext).toBeDefined();
    expect(typeof mockContext.currentStep).toBe('string');
    expect(typeof mockContext.setCurrentStep).toBe('function');
    expect(typeof mockContext.reset).toBe('function');
    expect(mockContext.selectedSchema).toBeNull();
    expect(mockContext.error).toBeNull();
  });

  it('exports a context with the expected default value', () => {
    expect(AgentCreateContext).toBeDefined();
    expect(typeof AgentCreateContext).toBe('object');
  });
});
