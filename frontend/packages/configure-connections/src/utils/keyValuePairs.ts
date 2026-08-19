// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/** One editable row of a key-value field (e.g. an HTTP header). */
export interface KeyValuePair {
  name: string;
  value: string;
}

/**
 * Parse the stored wire format ("Key: value, Other: value") into editable rows.
 *
 * Mirrors the backend parser, which splits on "," and then on the first ":". A segment with no
 * colon keeps its whole text as the name rather than being dropped, so a hand-written value that
 * the backend would reject stays visible and fixable in the form.
 */
export function parseKeyValuePairs(raw: string): KeyValuePair[] {
  return raw
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment !== '')
    .map((segment) => {
      const separator: number = segment.indexOf(':');
      if (separator === -1) {
        return {name: segment, value: ''};
      }
      return {name: segment.slice(0, separator).trim(), value: segment.slice(separator + 1).trim()};
    });
}

/**
 * Serialize rows back to the wire format. A row is only included when both parts are filled in, so
 * a half-typed row never reaches the API as a segment the backend would reject or as a header with
 * an empty value.
 */
export function serializeKeyValuePairs(pairs: KeyValuePair[]): string {
  return pairs
    .filter((pair) => pair.name.trim() !== '' && pair.value.trim() !== '')
    .map((pair) => `${pair.name.trim()}: ${pair.value.trim()}`)
    .join(', ');
}

/**
 * Strip characters the wire format cannot represent: commas separate pairs, so they are removed
 * from both parts, and the first colon separates name from value, so it is removed from names.
 */
export function sanitizeKeyValuePart(text: string, part: 'name' | 'value'): string {
  const withoutCommas: string = text.replace(/,/g, '');
  return part === 'name' ? withoutCommas.replace(/:/g, '') : withoutCommas;
}
