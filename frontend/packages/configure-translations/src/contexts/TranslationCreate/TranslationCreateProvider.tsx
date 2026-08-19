// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {CountryOption, LocaleOption} from '@thunderid/i18n';
import type {PropsWithChildren} from 'react';
import {useState, useMemo, useCallback} from 'react';
import TranslationCreateContext, {
  type TranslationCreateContextType,
} from '@/contexts/TranslationCreate/TranslationCreateContext';
import {TranslationCreateFlowStep} from '@/models/translation-create-flow';

/**
 * Props for the {@link TranslationCreateProvider} component.
 *
 * @public
 */
export type TranslationCreateProviderProps = PropsWithChildren;

/**
 * Initial state values for translation creation.
 *
 * @internal
 */
const INITIAL_STATE: {
  currentStep: TranslationCreateFlowStep;
  selectedCountry: CountryOption | null;
  selectedLocale: LocaleOption | null;
  localeCodeOverride: string;
  isCreating: boolean;
  error: string | null;
} = {
  currentStep: TranslationCreateFlowStep.COUNTRY,
  selectedCountry: null,
  selectedLocale: null,
  localeCodeOverride: '',
  isCreating: false,
  error: null,
};

/**
 * React context provider component that provides translation creation state
 * to all child components.
 *
 * This component manages all the state needed across the multi-step wizard
 * for creating a new translation language. It provides state variables,
 * setter functions, and a `reset` utility method.
 *
 * @param props - The component props
 * @param props.children - React children to be wrapped with the translation create context
 *
 * @returns JSX element that provides translation creation context to children
 *
 * @example
 * ```tsx
 * import TranslationCreateProvider from './TranslationCreateProvider';
 * import TranslationCreatePage from './TranslationCreatePage';
 *
 * function App() {
 *   return (
 *     <TranslationCreateProvider>
 *       <TranslationCreatePage />
 *     </TranslationCreateProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function TranslationCreateProvider({children}: TranslationCreateProviderProps) {
  const [currentStep, setCurrentStep] = useState<TranslationCreateFlowStep>(INITIAL_STATE.currentStep);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(INITIAL_STATE.selectedCountry);
  const [selectedLocale, setSelectedLocale] = useState<LocaleOption | null>(INITIAL_STATE.selectedLocale);
  const [localeCodeOverride, setLocaleCodeOverride] = useState<string>(INITIAL_STATE.localeCodeOverride);
  const [isCreating, setIsCreating] = useState<boolean>(INITIAL_STATE.isCreating);
  const [error, setError] = useState<string | null>(INITIAL_STATE.error);

  const localeCode = (localeCodeOverride.trim() || (selectedLocale?.code ?? '')).trim();

  const reset = useCallback((): void => {
    setCurrentStep(INITIAL_STATE.currentStep);
    setSelectedCountry(INITIAL_STATE.selectedCountry);
    setSelectedLocale(INITIAL_STATE.selectedLocale);
    setLocaleCodeOverride(INITIAL_STATE.localeCodeOverride);
    setIsCreating(INITIAL_STATE.isCreating);
    setError(INITIAL_STATE.error);
  }, []);

  const contextValue: TranslationCreateContextType = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      selectedCountry,
      setSelectedCountry,
      selectedLocale,
      setSelectedLocale,
      localeCodeOverride,
      setLocaleCodeOverride,
      localeCode,
      isCreating,
      setIsCreating,
      error,
      setError,
      reset,
    }),
    [currentStep, selectedCountry, selectedLocale, localeCodeOverride, localeCode, isCreating, error, reset],
  );

  return <TranslationCreateContext.Provider value={contextValue}>{children}</TranslationCreateContext.Provider>;
}
