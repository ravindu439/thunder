// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useTranslationRoutes` falls back
 * to `defaultTranslationRoutePaths` below.
 *
 * @public
 */
export interface TranslationRoutePaths {
  translations: {
    list: () => string;
    detail: (language: string) => string;
    create: () => string;
  };
}

/**
 * Default translation paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultTranslationRoutePaths: TranslationRoutePaths = {
  translations: {
    list: () => '/translations',
    detail: (language) => `/translations/${language}`,
    create: () => '/translations/create',
  },
};

/**
 * Resolves the translation route paths, preferring the host application's configuration
 * (supplied via `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode translation destination paths; they should call this
 * hook and build the destination from the returned functions instead.
 *
 * @public
 */
export default function useTranslationRoutes(): TranslationRoutePaths['translations'] {
  const routes = useRoutes<Partial<TranslationRoutePaths>>();
  return routes.translations ?? defaultTranslationRoutePaths.translations;
}
