// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Placeholder the server substitutes with the real nonce (see backend constants.CSPNoncePlaceholder).
 * A local dev server that serves index.html directly, without the Go backend, leaves it unsubstituted.
 */
const UNSUBSTITUTED_PLACEHOLDER = '__CSP_NONCE__';

/**
 * Reads the per-request Content-Security-Policy nonce from the page's <meta property="csp-nonce">
 * tag (set by the server; see backend internal/system/csp). Always reads from the top-level document,
 * even for callers injecting styles into an iframe: an about:blank iframe inherits its creator's CSP,
 * including this exact nonce value, not one of its own.
 *
 * @returns The nonce, or undefined when absent or unsubstituted (e.g. unit tests, or a dev server not
 * fronted by the Go backend), so nonce-dependent props can be safely omitted rather than passed as an
 * empty string or the literal placeholder text.
 */
export default function getCspNonce(): string | undefined {
  const content = document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content');
  return content && content !== UNSUBSTITUTED_PLACEHOLDER ? content : undefined;
}
