// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {CountryOption, LocaleOption} from '@thunderid/i18n';
import type {Context} from 'react';
import {createContext} from 'react';
import type {TranslationCreateFlowStep} from '@/models/translation-create-flow';

/**
 * Translation creation context state interface.
 *
 * Provides centralized state management for the translation creation flow.
 * This interface defines all the state needed across the multi-step language
 * creation wizard.
 *
 * @public
 */
export interface TranslationCreateContextType {
  /**
   * The current step in the translation creation flow.
   */
  currentStep: TranslationCreateFlowStep;

  /**
   * Sets the current step in the translation creation flow.
   */
  setCurrentStep: (step: TranslationCreateFlowStep) => void;

  /**
   * The country selected in the first wizard step.
   * @remark Needed for step 01: Select Country.
   */
  selectedCountry: CountryOption | null;

  /**
   * Sets the selected country.
   * @remark Needed for step 01: Select Country.
   */
  setSelectedCountry: (country: CountryOption | null) => void;

  /**
   * The locale option selected in the second wizard step.
   * @remark Needed for step 02: Select Language.
   */
  selectedLocale: LocaleOption | null;

  /**
   * Sets the selected locale option.
   * @remark Needed for step 02: Select Language.
   */
  setSelectedLocale: (locale: LocaleOption | null) => void;

  /**
   * User-entered override for the BCP 47 locale code.
   * @remark Needed for step 03: Review Locale Code.
   */
  localeCodeOverride: string;

  /**
   * Sets the locale code override.
   * @remark Needed for step 03: Review Locale Code.
   */
  setLocaleCodeOverride: (code: string) => void;

  /**
   * The effective BCP 47 locale code (derived from override or selected locale).
   */
  localeCode: string;

  /**
   * Whether language creation is currently in progress.
   */
  isCreating: boolean;

  /**
   * Sets the creating state.
   */
  setIsCreating: (value: boolean) => void;

  /**
   * Current error message, if any.
   */
  error: string | null;

  /**
   * Sets an error message.
   */
  setError: (error: string | null) => void;

  /**
   * Resets all state to initial values.
   */
  reset: () => void;
}

/**
 * React context for accessing translation creation state throughout the wizard.
 *
 * This context provides access to all the state needed for the multi-step
 * language creation flow. It should be used within a `TranslationCreateProvider`
 * component.
 *
 * @example
 * ```tsx
 * import TranslationCreateContext from './TranslationCreateContext';
 * import { useContext } from 'react';
 *
 * const MyComponent = () => {
 *   const context = useContext(TranslationCreateContext);
 *   if (!context) {
 *     throw new Error('Component must be used within TranslationCreateProvider');
 *   }
 *
 *   const { selectedCountry, currentStep } = context;
 *   return <div>Current step: {currentStep}</div>;
 * };
 * ```
 *
 * @public
 */
const TranslationCreateContext: Context<TranslationCreateContextType | undefined> = createContext<
  TranslationCreateContextType | undefined
>(undefined);

export default TranslationCreateContext;
