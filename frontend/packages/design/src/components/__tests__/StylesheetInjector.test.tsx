// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import StylesheetInjector from '../StylesheetInjector';

vi.mock('@thunderid/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/contexts')>();
  return {
    ...actual,
    useConfig: () => ({config: {brand: {product_name: 'ThunderID'}}}),
  };
});

vi.mock('../../contexts/Design/useDesign', () => ({
  default: () => ({layout: undefined}),
}));

describe('StylesheetInjector', () => {
  afterEach(() => {
    document.querySelector('meta[property="csp-nonce"]')?.remove();
    document.getElementById('thunderid-stylesheet-inline-1')?.remove();
  });

  it("tags an injected inline stylesheet with the page's csp nonce", () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('content', 'abc123');
    document.head.appendChild(meta);

    render(<StylesheetInjector stylesheets={[{id: 'inline-1', type: 'inline', content: 'body { color: red; }'}]} />);

    const style = document.getElementById('thunderid-stylesheet-inline-1');
    expect(style?.getAttribute('nonce')).toBe('abc123');
  });

  it('injects the inline stylesheet without a nonce attribute when none is available', () => {
    render(<StylesheetInjector stylesheets={[{id: 'inline-1', type: 'inline', content: 'body { color: red; }'}]} />);

    const style = document.getElementById('thunderid-stylesheet-inline-1');
    expect(style?.hasAttribute('nonce')).toBe(false);
  });
});
