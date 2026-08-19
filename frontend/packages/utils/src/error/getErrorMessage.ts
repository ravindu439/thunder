// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ApiError} from '@thunderid/types';

/**
 * A minimal subset of the i18next TFunction interface used by {@link getErrorMessage}.
 */
type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Extracts a localized error message from an API error response.
 *
 * Attempts to resolve a specific i18n message for the error code returned by the API, first against the
 * caller's own namespace (e.g. `errors.APP-1020`), then against the shared `common` namespace (e.g.
 * `common:errors.SSE-4030`) for codes that are shared across services rather than owned by one feature. If
 * neither resolves, falls back to the provided generic key.
 *
 * @param error - The error thrown by the mutation
 * @param t - The i18next translation function scoped to the relevant namespace. Must forward an explicit `ns:`
 *   prefix unchanged (rather than re-prefixing it) so the `common:errors.<CODE>` lookup can resolve
 * @param fallbackKey - i18n key to use when no specific message is found (e.g. `'create.error'`)
 * @param fallbackDefaultValue - Default string for `fallbackKey`, per the i18n Fallback Values convention, so a
 *   missing locale key degrades to readable text instead of the raw key
 * @returns Localized error message string
 *
 * @example
 * ```typescript
 * setError(getErrorMessage(error, t, 'create.error', 'Failed to create application. Please try again.'));
 * ```
 *
 * @public
 */
export default function getErrorMessage(
  error: Error,
  t: TranslateFn,
  fallbackKey: string,
  fallbackDefaultValue?: string,
): string {
  const apiError = (error as {response?: {data?: ApiError}}).response?.data;

  if (apiError?.code) {
    // Feature namespace first, then the shared catalog for codes shared across services (e.g. SSE-4030).
    const specific =
      t(`errors.${apiError.code}`, {defaultValue: ''}) || t(`common:errors.${apiError.code}`, {defaultValue: ''});

    if (specific) {
      return specific;
    }
  }

  if (fallbackDefaultValue !== undefined) {
    return t(fallbackKey, {defaultValue: fallbackDefaultValue});
  }

  return t(fallbackKey);
}
