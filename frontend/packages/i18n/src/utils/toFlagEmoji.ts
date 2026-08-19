// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Convert a BCP 47 locale code or ISO 3166-1 alpha-2 region code to a flag
 * emoji using regional indicator symbol letters (Unicode range 0x1F1E6–0x1F1FF).
 *
 * When given a full locale code the region part is extracted first.
 * Language-only codes with no region part return 🌐.
 *
 * @example toFlagEmoji('de-CH') // '🇨🇭'
 * @example toFlagEmoji('en-US') // '🇺🇸'
 * @example toFlagEmoji('en')    // '🌐'
 */
export default function toFlagEmoji(localeOrRegionCode: string): string {
  const parts = localeOrRegionCode.split('-');
  const lastPart = parts.at(-1)!;
  const regionCode = /^[A-Z]{2}$/.test(lastPart) ? lastPart : null;

  if (!regionCode) {
    return '🌐';
  }

  return [...regionCode.toUpperCase()].map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)).join('');
}
