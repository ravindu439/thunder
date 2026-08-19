// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {act, renderHook} from '@testing-library/react';
import {render, screen} from '@thunderid/test-utils';
import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import {RoleCreateFlowStep} from '../../../models/role-create-flow';
import RoleCreateProvider from '../RoleCreateProvider';
import useRoleCreate from '../useRoleCreate';

function renderUseRoleCreate() {
  return renderHook(() => useRoleCreate(), {
    wrapper: ({children}: {children: React.ReactNode}) => <RoleCreateProvider>{children}</RoleCreateProvider>,
  });
}

function TestConsumer() {
  const context = useRoleCreate();

  return <div data-testid="context-available">{typeof context}</div>;
}

function TestConsumerWithoutProvider() {
  const context = useRoleCreate();

  return <div data-testid="context">{JSON.stringify(context)}</div>;
}

function TestWrapper({children}: {children: React.ReactNode}) {
  return children;
}

describe('useRoleCreate', () => {
  it('returns context when used within RoleCreateProvider', () => {
    render(
      <TestWrapper>
        <RoleCreateProvider>
          <TestConsumer />
        </RoleCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('context-available')).toHaveTextContent('object');
  });

  it('throws error when used outside RoleCreateProvider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* noop */
    });

    expect(() => {
      render(<TestConsumerWithoutProvider />);
    }).toThrow('useRoleCreate must be used within a RoleCreateProvider');

    errorSpy.mockRestore();
  });

  it('provides all required context properties', () => {
    function TestContextProperties() {
      const context = useRoleCreate();

      const requiredProperties = [
        'currentStep',
        'setCurrentStep',
        'name',
        'setName',
        'ouId',
        'setOuId',
        'error',
        'setError',
        'permissions',
        'setPermissions',
        'reset',
      ];

      const missingProperties = requiredProperties.filter((prop) => !(prop in context));

      return (
        <div>
          <div data-testid="missing-properties">{JSON.stringify(missingProperties)}</div>
          <div data-testid="has-all-properties">{missingProperties.length === 0 ? 'true' : 'false'}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <RoleCreateProvider>
          <TestContextProperties />
        </RoleCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('has-all-properties')).toHaveTextContent('true');
    expect(screen.getByTestId('missing-properties')).toHaveTextContent('[]');
  });

  it('returns same context reference across multiple hook calls', () => {
    function TestMultipleHookCalls() {
      const context1 = useRoleCreate();
      const context2 = useRoleCreate();

      return (
        <div>
          <div data-testid="same-reference">{(context1 === context2).toString()}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <RoleCreateProvider>
          <TestMultipleHookCalls />
        </RoleCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('same-reference')).toHaveTextContent('true');
  });

  it('provides functions that are properly typed', () => {
    function TestFunctionTypes() {
      const {setCurrentStep, setName, setOuId, setError, setPermissions, reset} = useRoleCreate();

      return (
        <div>
          <div data-testid="setCurrentStep-type">{typeof setCurrentStep}</div>
          <div data-testid="setName-type">{typeof setName}</div>
          <div data-testid="setOuId-type">{typeof setOuId}</div>
          <div data-testid="setError-type">{typeof setError}</div>
          <div data-testid="setPermissions-type">{typeof setPermissions}</div>
          <div data-testid="reset-type">{typeof reset}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <RoleCreateProvider>
          <TestFunctionTypes />
        </RoleCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('setCurrentStep-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setName-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setOuId-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setError-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setPermissions-type')).toHaveTextContent('function');
    expect(screen.getByTestId('reset-type')).toHaveTextContent('function');
  });

  it('throws descriptive error message when used outside provider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* noop */
    });

    let thrownError: Error | null = null;

    try {
      render(<TestConsumerWithoutProvider />);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError?.message).toBe('useRoleCreate must be used within a RoleCreateProvider');

    errorSpy.mockRestore();
  });

  it('exposes permissions state, defaults to empty, and resets it', () => {
    const {result} = renderUseRoleCreate();
    expect(result.current.permissions).toEqual([]);

    act(() => {
      result.current.setPermissions([{resourceServerId: 'rs-1', permissions: ['bookings']}]);
    });
    expect(result.current.permissions).toEqual([{resourceServerId: 'rs-1', permissions: ['bookings']}]);

    act(() => {
      result.current.reset();
    });
    expect(result.current.permissions).toEqual([]);
  });

  it('clears a stale error when a form field changes', () => {
    const {result} = renderUseRoleCreate();

    act(() => {
      result.current.setName('Duplicate Role');
    });
    act(() => {
      result.current.setError('A role with this name already exists in this organization unit.');
    });
    expect(result.current.error).toBe('A role with this name already exists in this organization unit.');

    act(() => {
      result.current.setName('A Different Role');
    });

    expect(result.current.error).toBeNull();
  });

  it('does not clear the error when only the current step changes', () => {
    const {result} = renderUseRoleCreate();

    act(() => {
      result.current.setError('A role with this name already exists in this organization unit.');
    });

    act(() => {
      result.current.setCurrentStep(RoleCreateFlowStep.PERMISSIONS);
    });

    expect(result.current.error).toBe('A role with this name already exists in this organization unit.');
  });

  it('has exactly 11 properties in the context interface', () => {
    function TestContextProperties() {
      const context = useRoleCreate();

      return (
        <div>
          <div data-testid="property-count">{Object.keys(context).length}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <RoleCreateProvider>
          <TestContextProperties />
        </RoleCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('property-count')).toHaveTextContent('11');
  });
});
