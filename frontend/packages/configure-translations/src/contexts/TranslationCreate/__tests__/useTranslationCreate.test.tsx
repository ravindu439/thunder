// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import React from 'react';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import TranslationCreateProvider from '@/contexts/TranslationCreate/TranslationCreateProvider';
import useTranslationCreate from '@/contexts/TranslationCreate/useTranslationCreate';

// Test component to consume the hook successfully
function TestConsumer() {
  const context = useTranslationCreate();

  return <div data-testid="context-available">{typeof context}</div>;
}

// Test component to trigger the error path
function TestConsumerWithoutProvider() {
  const context = useTranslationCreate();

  return <div data-testid="context">{JSON.stringify(context)}</div>;
}

function TestWrapper({children}: {children: React.ReactNode}) {
  return children;
}

describe('useTranslationCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns context when used within TranslationCreateProvider', () => {
    render(
      <TestWrapper>
        <TranslationCreateProvider>
          <TestConsumer />
        </TranslationCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('context-available')).toHaveTextContent('object');
  });

  it('throws error when used outside TranslationCreateProvider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

    expect(() => {
      render(<TestConsumerWithoutProvider />);
    }).toThrow('useTranslationCreate must be used within TranslationCreateProvider');

    errorSpy.mockRestore();
  });

  it('throws descriptive error message when used outside provider', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => null);

    let thrownError: Error | null = null;

    try {
      render(<TestConsumerWithoutProvider />);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError?.message).toBe('useTranslationCreate must be used within TranslationCreateProvider');

    errorSpy.mockRestore();
  });

  it('provides all required context properties', () => {
    function TestContextProperties() {
      const context = useTranslationCreate();

      const requiredProperties = [
        'currentStep',
        'setCurrentStep',
        'selectedCountry',
        'setSelectedCountry',
        'selectedLocale',
        'setSelectedLocale',
        'localeCodeOverride',
        'setLocaleCodeOverride',
        'localeCode',
        'isCreating',
        'setIsCreating',
        'error',
        'setError',
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
        <TranslationCreateProvider>
          <TestContextProperties />
        </TranslationCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('has-all-properties')).toHaveTextContent('true');
    expect(screen.getByTestId('missing-properties')).toHaveTextContent('[]');
  });

  it('returns same context reference across multiple hook calls', () => {
    function TestMultipleHookCalls() {
      const context1 = useTranslationCreate();
      const context2 = useTranslationCreate();

      return (
        <div>
          <div data-testid="same-reference">{(context1 === context2).toString()}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <TranslationCreateProvider>
          <TestMultipleHookCalls />
        </TranslationCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('same-reference')).toHaveTextContent('true');
  });

  it('provides functions that are properly typed', () => {
    function TestFunctionTypes() {
      const {
        setCurrentStep,
        setSelectedCountry,
        setSelectedLocale,
        setLocaleCodeOverride,
        setIsCreating,
        setError,
        reset,
      } = useTranslationCreate();

      return (
        <div>
          <div data-testid="setCurrentStep-type">{typeof setCurrentStep}</div>
          <div data-testid="setSelectedCountry-type">{typeof setSelectedCountry}</div>
          <div data-testid="setSelectedLocale-type">{typeof setSelectedLocale}</div>
          <div data-testid="setLocaleCodeOverride-type">{typeof setLocaleCodeOverride}</div>
          <div data-testid="setIsCreating-type">{typeof setIsCreating}</div>
          <div data-testid="setError-type">{typeof setError}</div>
          <div data-testid="reset-type">{typeof reset}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <TranslationCreateProvider>
          <TestFunctionTypes />
        </TranslationCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('setCurrentStep-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setSelectedCountry-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setSelectedLocale-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setLocaleCodeOverride-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setIsCreating-type')).toHaveTextContent('function');
    expect(screen.getByTestId('setError-type')).toHaveTextContent('function');
    expect(screen.getByTestId('reset-type')).toHaveTextContent('function');
  });

  it('has exactly 14 properties in the context interface', () => {
    function TestContextProperties() {
      const context = useTranslationCreate();

      return (
        <div>
          <div data-testid="property-count">{Object.keys(context).length}</div>
        </div>
      );
    }

    render(
      <TestWrapper>
        <TranslationCreateProvider>
          <TestContextProperties />
        </TranslationCreateProvider>
      </TestWrapper>,
    );

    expect(screen.getByTestId('property-count')).toHaveTextContent('14');
  });
});
