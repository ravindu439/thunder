// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useTranslation} from 'react-i18next';
import type {SupportedLanguage, LanguageConfig} from '../models';
import {LANGUAGE_CONFIGS} from '../models';

/**
 * Return type for the useLanguage hook, providing language management utilities.
 *
 * @property currentLanguage - The currently selected language code.
 * @property availableLanguages - List of available language configurations.
 * @property setLanguage - Function to set the current language.
 *
 * @public
 */
export interface UseLanguageReturn {
  /**
   * The currently selected language code.
   */
  currentLanguage: SupportedLanguage;
  /**
   * List of available language configurations.
   */
  availableLanguages: LanguageConfig[];
  /**
   * Function to set the current language.
   */
  setLanguage: (language: SupportedLanguage) => Promise<void>;
}

/**
 * Hook to manage language switching in the application.
 *
 * Uses react-i18next internally for language management.
 *
 * @returns Language management utilities including the current language, available languages, and a setter function.
 *
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { currentLanguage, availableLanguages, setLanguage } = useLanguage();
 *
 *   return (
 *     <select
 *       value={currentLanguage}
 *       onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
 *     >
 *       {availableLanguages.map((lang) => (
 *         <option key={lang.code} value={lang.code}>
 *           {lang.nativeName}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useLanguage(): UseLanguageReturn {
  const {i18n} = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguage;
  const availableLanguages = Object.values(LANGUAGE_CONFIGS);

  const setLanguage = async (language: SupportedLanguage): Promise<void> => {
    await i18n.changeLanguage(language);
  };

  return {
    currentLanguage,
    availableLanguages,
    setLanguage,
  };
}
