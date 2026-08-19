// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * i18n - Translation resources for applications
 *
 * This package provides translation resources organized by language and namespace.
 * Applications should use react-i18next directly for i18n functionality.
 *
 * @example Using translations with react-i18next
 * ```tsx
 * import i18n from 'i18next';
 * import { initReactI18next } from 'react-i18next';
 * import enUS from '@<namespace>/i18n/locales/en-US';
 *
 * i18n
 *   .use(initReactI18next)
 *   .init({
 *     resources: {
 *       'en-US': {
 *         common: enUS.common,
 *         console: enUS.console,
 *         gate: enUS.gate,
 *       },
 *     },
 *     lng: 'en-US',
 *     fallbackLng: 'en-US',
 *     defaultNS: 'common',
 *     interpolation: {
 *       escapeValue: false,
 *     },
 *   });
 * ```
 *
 * @example Using in components with react-i18next
 * ```tsx
 * import { useTranslation } from 'react-i18next';
 *
 * function MyComponent() {
 *   const { t } = useTranslation('common');
 *   return <h1>{t('actions.save')}</h1>;
 * }
 * ```
 */

// Export translation resources
export {default as enUS} from './locales/en-US';

// Export types and models
export type {
  TranslationResources,
  SupportedLanguage,
  LanguageConfig,
  ResourceValue,
  NamespaceResources,
} from './models';

export {LANGUAGE_CONFIGS, isSupportedLanguage} from './models';

// Export hooks
export {default as useGetTranslations} from './api/useGetTranslations';
export type {UseGetTranslationsOptions} from './api/useGetTranslations';

export {default as useGetLanguages} from './api/useGetLanguages';
export type {UseGetLanguagesOptions} from './api/useGetLanguages';

export {default as useUpdateTranslation} from './api/useUpdateTranslation';
export type {UseUpdateTranslationOptions} from './api/useUpdateTranslation';

export {default as useCreateTranslations} from './api/useCreateTranslations';

export {default as useDeleteTranslations} from './api/useDeleteTranslations';

export {default as useLanguage} from './api/useLanguage';
export type {UseLanguageReturn} from './api/useLanguage';

// Export constants
export {default as I18nQueryKeys} from './constants/i18n-query-keys';
export {default as NamespaceConstants} from './constants/NamespaceConstants';
export {default as I18nDefaultConstants} from './constants/I18nDefaultConstants';

// Export models
export * from './models/requests';
export * from './models/responses';

// Export utils
export {default as COMMON_LOCALES} from './utils/commonLocales';
export {default as REGION_LOCALES} from './utils/regionLocales';
export {default as toFlagEmoji} from './utils/toFlagEmoji';
export {default as buildCountryOptions} from './utils/buildCountryOptions';
export type {CountryOption} from './utils/buildCountryOptions';
export {default as buildLocaleOptions} from './utils/buildLocaleOptions';
export type {LocaleOption} from './utils/buildLocaleOptions';
export {default as getDisplayNameForCode} from './utils/getDisplayNameForCode';
