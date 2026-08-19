// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {GroupCreateFlowStep} from '../../../models/group-create-flow';
import GroupCreateProvider from '../GroupCreateProvider';
import useGroupCreate from '../useGroupCreate';

function TestConsumer() {
  const context = useGroupCreate();

  return (
    <div>
      <div data-testid="current-step">{context.currentStep}</div>
      <div data-testid="name">{context.name || 'empty'}</div>
      <div data-testid="description">{context.description || 'empty'}</div>
      <div data-testid="organization-unit-id">{context.ouId || 'empty'}</div>
      <div data-testid="error">{context.error ?? 'null'}</div>

      <button type="button" onClick={() => context.setCurrentStep(GroupCreateFlowStep.NAME)}>
        Set Name Step
      </button>
      <button type="button" onClick={() => context.setName('Test Group')}>
        Set Name
      </button>
      <button type="button" onClick={() => context.setDescription('A test description')}>
        Set Description
      </button>
      <button type="button" onClick={() => context.setOuId('ou-123')}>
        Set OU Id
      </button>
      <button type="button" onClick={() => context.setError('Test error')}>
        Set Error
      </button>
      <button type="button" onClick={() => context.reset()}>
        Reset
      </button>
    </div>
  );
}

describe('GroupCreateProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial state values', () => {
    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    expect(screen.getByTestId('current-step')).toHaveTextContent(GroupCreateFlowStep.ORGANIZATION_UNIT);
    expect(screen.getByTestId('name')).toHaveTextContent('empty');
    expect(screen.getByTestId('description')).toHaveTextContent('empty');
    expect(screen.getByTestId('organization-unit-id')).toHaveTextContent('empty');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('updates current step when setCurrentStep is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    await user.click(screen.getByText('Set Name Step'));

    expect(screen.getByTestId('current-step')).toHaveTextContent(GroupCreateFlowStep.NAME);
  });

  it('updates name when setName is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    await user.click(screen.getByText('Set Name'));

    expect(screen.getByTestId('name')).toHaveTextContent('Test Group');
  });

  it('updates description when setDescription is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    await user.click(screen.getByText('Set Description'));

    expect(screen.getByTestId('description')).toHaveTextContent('A test description');
  });

  it('updates ouId when setOuId is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    await user.click(screen.getByText('Set OU Id'));

    expect(screen.getByTestId('organization-unit-id')).toHaveTextContent('ou-123');
  });

  it('updates error when setError is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    await user.click(screen.getByText('Set Error'));

    expect(screen.getByTestId('error')).toHaveTextContent('Test error');
  });

  it('resets all state when reset is called', async () => {
    const user = userEvent.setup();

    render(
      <GroupCreateProvider>
        <TestConsumer />
      </GroupCreateProvider>,
    );

    // Set some values
    await user.click(screen.getByText('Set Name Step'));
    await user.click(screen.getByText('Set Name'));
    await user.click(screen.getByText('Set Description'));
    await user.click(screen.getByText('Set OU Id'));
    await user.click(screen.getByText('Set Error'));

    // Verify values are set
    expect(screen.getByTestId('current-step')).toHaveTextContent(GroupCreateFlowStep.NAME);
    expect(screen.getByTestId('name')).toHaveTextContent('Test Group');
    expect(screen.getByTestId('description')).toHaveTextContent('A test description');
    expect(screen.getByTestId('organization-unit-id')).toHaveTextContent('ou-123');
    expect(screen.getByTestId('error')).toHaveTextContent('Test error');

    // Reset
    await user.click(screen.getByText('Reset'));

    // Verify back to initial state
    expect(screen.getByTestId('current-step')).toHaveTextContent(GroupCreateFlowStep.ORGANIZATION_UNIT);
    expect(screen.getByTestId('name')).toHaveTextContent('empty');
    expect(screen.getByTestId('description')).toHaveTextContent('empty');
    expect(screen.getByTestId('organization-unit-id')).toHaveTextContent('empty');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('memoizes context value to prevent unnecessary re-renders', () => {
    const renderSpy = vi.fn();

    function TestRenderer() {
      renderSpy();
      return <TestConsumer />;
    }

    const {rerender} = render(
      <GroupCreateProvider>
        <TestRenderer />
      </GroupCreateProvider>,
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);

    rerender(
      <GroupCreateProvider>
        <TestRenderer />
      </GroupCreateProvider>,
    );

    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('throws error when useGroupCreate is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useGroupCreate must be used within a GroupCreateProvider');

    consoleSpy.mockRestore();
  });
});
