// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns `true` if the given URL is absolute.
 *
 * A URL is considered absolute if it:
 * - Starts with a URL scheme (e.g. `http://`, `https://`)
 * - Starts with `//` (protocol-relative URL, e.g. `//example.com/foo`)
 *
 * @param url - The URL string to check.
 * @returns `true` if `url` is an absolute URL, `false` otherwise.
 */
export default function isAbsoluteUrl(url: string): boolean {
  return url.startsWith('//') || /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);
}
