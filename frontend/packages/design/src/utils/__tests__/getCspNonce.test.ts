// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {afterEach, describe, expect, it} from 'vitest';
import getCspNonce from '../getCspNonce';

describe('getCspNonce', () => {
  afterEach(() => {
    document.querySelector('meta[property="csp-nonce"]')?.remove();
  });

  it('returns the meta tag content when present', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('content', 'abc123');
    document.head.appendChild(meta);

    expect(getCspNonce()).toBe('abc123');
  });

  it('returns undefined when the meta tag is absent', () => {
    expect(getCspNonce()).toBeUndefined();
  });

  it('returns undefined when the meta tag content is empty', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('content', '');
    document.head.appendChild(meta);

    expect(getCspNonce()).toBeUndefined();
  });

  it('returns undefined when the placeholder was never substituted (e.g. a dev server bypassing the Go backend)', () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('content', '__CSP_NONCE__');
    document.head.appendChild(meta);

    expect(getCspNonce()).toBeUndefined();
  });
});
