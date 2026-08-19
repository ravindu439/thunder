// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Returns `true` if the given URL is relative.
 *
 * A URL is considered relative if it is not absolute — i.e. it does not
 * start with a URL scheme (e.g. `http://`, `https://`) or `//`.
 *
 * @param url - The URL string to check.
 * @returns `true` if `url` is a relative URL, `false` otherwise.
 */
export default function isRelativeUrl(url: string): boolean {
  return !url.startsWith('//') && !/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);
}
