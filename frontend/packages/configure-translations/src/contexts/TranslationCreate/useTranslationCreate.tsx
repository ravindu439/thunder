// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import TranslationCreateContext, {
  type TranslationCreateContextType,
} from '@/contexts/TranslationCreate/TranslationCreateContext';

/**
 * React hook for accessing translation creation state throughout the wizard.
 *
 * This hook provides access to all the state needed for the multi-step language
 * creation flow. It must be used within a component tree wrapped by
 * `TranslationCreateProvider`, otherwise it will throw an error.
 *
 * @returns The translation creation context containing state data and utility methods
 *
 * @throws {Error} Throws an error if used outside of TranslationCreateProvider
 *
 * @example
 * ```tsx
 * import useTranslationCreate from './useTranslationCreate';
 *
 * function MyComponent() {
 *   const { selectedCountry, currentStep, localeCode } = useTranslationCreate();
 *
 *   return (
 *     <div>
 *       <p>Current step: {currentStep}</p>
 *       <p>Locale: {localeCode}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useTranslationCreate(): TranslationCreateContextType {
  const context = useContext(TranslationCreateContext);

  if (context === undefined) {
    throw new Error('useTranslationCreate must be used within TranslationCreateProvider');
  }

  return context;
}
