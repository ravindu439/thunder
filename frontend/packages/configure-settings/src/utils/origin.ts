// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Parses a CORS origin and rejects values with userinfo, paths, query strings, fragments, or
 * wildcards. IPv6 hosts are accepted.
 */
function parseOrigin(raw: string): URL | null {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed.includes('*')) {
    return null;
  }
  // Validate the raw shape before new URL() can normalize a disguised path into a bare origin
  // (e.g. `https://host/foo/..` → `/`) or accept a scheme-relative form like `http:host/..`.
  const schemeEnd = trimmed.indexOf(':');
  if (schemeEnd === -1 || trimmed.slice(schemeEnd + 1, schemeEnd + 3) !== '//') {
    return null;
  }
  const authority = trimmed.slice(schemeEnd + 3);
  const boundary = authority.search(/[/\\?#]/);
  if (boundary !== -1 && authority.slice(boundary) !== '/') {
    return null;
  }
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null;
  }
  if (url.username !== '' || url.password !== '') {
    return null;
  }
  return url;
}

/**
 * Canonicalizes an origin: trims and, for a valid origin, lowercases it and strips a trailing slash.
 * Unlike `URL.origin`, an explicit default port is preserved, so `https://example.com` and
 * `https://example.com:443` stay distinct.
 */
export function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === 'null') {
    return trimmed;
  }
  if (parseOrigin(trimmed) === null) {
    return trimmed;
  }
  return trimmed.replace(/\/+$/, '').toLowerCase();
}

/**
 * Reports whether a value is a literal origin, including the `"null"` origin.
 */
export function isValidOrigin(value: string): boolean {
  const trimmed = value.trim();
  return trimmed === 'null' || parseOrigin(trimmed) !== null;
}

/**
 * Reports whether a value compiles as a JavaScript regular expression. The backend remains the
 * authoritative regex validator because it uses RE2 semantics.
 */
export function isValidRegex(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '') {
    return false;
  }
  try {
    return Boolean(new RegExp(trimmed));
  } catch {
    return false;
  }
}
