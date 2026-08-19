// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import COMMON_LOCALES from './commonLocales';

/**
 * Map of ISO 3166-1 alpha-2 region code → BCP 47 locale codes for that region,
 * derived from {@link COMMON_LOCALES}.
 *
 * @example REGION_LOCALES['FR'] // ['fr-FR']
 * @example REGION_LOCALES['BE'] // ['fr-BE', 'nl-BE']
 */
const REGION_LOCALES: Record<string, string[]> = COMMON_LOCALES.reduce<Record<string, string[]>>((acc, code) => {
  const region = code.split('-')[1]?.toUpperCase();

  if (region) {
    (acc[region] ??= []).push(code);
  }

  return acc;
}, {});

export default REGION_LOCALES;
