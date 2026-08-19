// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {useContext, useMemo} from 'react';
import {describe, expect, it, vi} from 'vitest';
import TranslationCreateContext, {
  type TranslationCreateContextType,
} from '@/contexts/TranslationCreate/TranslationCreateContext';

// Test component to consume the context directly
function TestConsumer() {
  const context = useContext(TranslationCreateContext);

  if (!context) {
    return <div data-testid="context">undefined</div>;
  }

  return (
    <div>
      <div data-testid="context">defined</div>
      <div data-testid="context-type">{typeof context}</div>
      <div data-testid="current-step">{context.currentStep}</div>
      <div data-testid="locale-code">{context.localeCode}</div>
      <div data-testid="selected-country">{context.selectedCountry?.name ?? 'null'}</div>
    </div>
  );
}

// Test component with a mock context value
function TestWithMockValue() {
  const mockContextValue: TranslationCreateContextType = useMemo(
    () => ({
      currentStep: 'LANGUAGE',
      setCurrentStep: vi.fn(),
      selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
      setSelectedCountry: vi.fn(),
      selectedLocale: null,
      setSelectedLocale: vi.fn(),
      localeCodeOverride: '',
      setLocaleCodeOverride: vi.fn(),
      localeCode: 'fr-FR',
      isCreating: false,
      setIsCreating: vi.fn(),
      error: null,
      setError: vi.fn(),
      reset: vi.fn(),
    }),
    [],
  );

  return (
    <TranslationCreateContext.Provider value={mockContextValue}>
      <TestConsumer />
    </TranslationCreateContext.Provider>
  );
}

describe('TranslationCreateContext', () => {
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

    expect(screen.getByTestId('current-step')).toHaveTextContent('LANGUAGE');
    expect(screen.getByTestId('locale-code')).toHaveTextContent('fr-FR');
    expect(screen.getByTestId('selected-country')).toHaveTextContent('France');
  });

  it('has correct TypeScript interface definition', () => {
    const mockContext: TranslationCreateContextType = {
      currentStep: 'COUNTRY',
      setCurrentStep: () => null,
      selectedCountry: null,
      setSelectedCountry: () => null,
      selectedLocale: null,
      setSelectedLocale: () => null,
      localeCodeOverride: '',
      setLocaleCodeOverride: () => null,
      localeCode: '',
      isCreating: false,
      setIsCreating: () => null,
      error: null,
      setError: () => null,
      reset: () => null,
    };

    expect(mockContext).toBeDefined();
    expect(typeof mockContext.currentStep).toBe('string');
    expect(typeof mockContext.setCurrentStep).toBe('function');
    expect(mockContext.selectedCountry).toBeNull();
    expect(mockContext.selectedLocale).toBeNull();
    expect(typeof mockContext.localeCode).toBe('string');
    expect(typeof mockContext.reset).toBe('function');
  });

  it('allows null values for nullable properties', () => {
    const mockContext: TranslationCreateContextType = {
      currentStep: 'COUNTRY',
      setCurrentStep: () => null,
      selectedCountry: null,
      setSelectedCountry: () => null,
      selectedLocale: null,
      setSelectedLocale: () => null,
      localeCodeOverride: '',
      setLocaleCodeOverride: () => null,
      localeCode: '',
      isCreating: false,
      setIsCreating: () => null,
      error: null,
      setError: () => null,
      reset: () => null,
    };

    expect(mockContext.selectedCountry).toBeNull();
    expect(mockContext.selectedLocale).toBeNull();
    expect(mockContext.error).toBeNull();
  });

  it('creates context with expected default value (undefined)', () => {
    expect(TranslationCreateContext).toBeDefined();
    expect(typeof TranslationCreateContext).toBe('object');
  });
});
