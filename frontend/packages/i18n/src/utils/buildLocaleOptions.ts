// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import COMMON_LOCALES from './commonLocales';
import REGION_LOCALES from './regionLocales';
import toFlagEmoji from './toFlagEmoji';

export interface LocaleOption {
  /** Full BCP 47 locale code, e.g. "fr-FR". */
  code: string;
  /** English display name resolved via Intl.DisplayNames, e.g. "French (France)". */
  displayName: string;
  /** Flag emoji for the locale's region. */
  flag: string;
}

/**
 * Build a sorted list of {@link LocaleOption}.
 *
 * When `regionCode` is provided the list is scoped to locales that belong to
 * that region (from {@link REGION_LOCALES}); otherwise all
 * {@link COMMON_LOCALES} are returned.
 *
 * @param regionCode - Optional ISO 3166-1 alpha-2 region code to filter by.
 */
export default function buildLocaleOptions(regionCode?: string): LocaleOption[] {
  const dn = new Intl.DisplayNames(['en'], {type: 'language'});
  const codes = regionCode ? (REGION_LOCALES[regionCode] ?? []) : COMMON_LOCALES;

  return codes
    .map((code) => ({
      code,
      displayName: dn.of(code) ?? code,
      flag: toFlagEmoji(code.split('-')[1]?.toUpperCase() ?? ''),
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}
