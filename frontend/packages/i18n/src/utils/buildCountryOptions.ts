// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import REGION_LOCALES from './regionLocales';
import toFlagEmoji from './toFlagEmoji';

/**
 * Represents a country option for selection in language/region pickers.
 *
 * @property regionCode - ISO 3166-1 alpha-2 region code, e.g. "FR".
 * @property name - English display name resolved via Intl.DisplayNames, e.g. "France".
 * @property flag - Flag emoji derived from the region code.
 *
 * @public
 */
export interface CountryOption {
  regionCode: string;
  name: string;
  flag: string;
}

/**
 * Builds a sorted list of {@link CountryOption} objects derived from {@link REGION_LOCALES},
 * with display names resolved via {@link Intl.DisplayNames} and flag emojis.
 *
 * @returns Sorted array of country options for use in pickers and forms.
 *
 * @example
 * ```ts
 * const options = buildCountryOptions();
 * // [{ regionCode: 'FR', name: 'France', flag: '🇫🇷' }, ...]
 * ```
 *
 * @public
 */
export default function buildCountryOptions(): CountryOption[] {
  const dn = new Intl.DisplayNames(['en'], {type: 'region'});

  return Object.keys(REGION_LOCALES)
    .map((regionCode) => ({
      regionCode,
      name: dn.of(regionCode) ?? regionCode,
      flag: toFlagEmoji(regionCode),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
