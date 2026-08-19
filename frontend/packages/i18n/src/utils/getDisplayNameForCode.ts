// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Resolve a human-readable English display name for a BCP 47 locale code using
 * {@link Intl.DisplayNames}. Returns `null` when the code is empty, invalid,
 * or when the resolved name equals the raw code (i.e. Intl has no data for it).
 *
 * Uses {@link Intl.getCanonicalLocales} internally to validate the tag before
 * attempting resolution.
 *
 * @example getDisplayNameForCode('fr-FR') // 'French (France)'
 * @example getDisplayNameForCode('xyz')   // null
 */
export default function getDisplayNameForCode(code: string): string | null {
  if (!code.trim()) return null;

  try {
    Intl.getCanonicalLocales(code);

    const dn = new Intl.DisplayNames(['en'], {type: 'language'});
    const name = dn.of(code);

    return name && name !== code ? name : null;
  } catch {
    return null;
  }
}
