// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, cleanup} from '@testing-library/react';
import {describe, it, expect, afterEach, vi} from 'vitest';
import {DEFAULT_FONT_STACK} from '../../constants/fonts';
import FontImporter from '../FontImporter';

vi.mock('@thunderid/contexts', () => ({
  useConfig: () => ({config: {brand: {product_name: 'ThunderID'}}}),
}));

const OVERRIDE_ID = 'thunderid-font-override';
const IMPORT_ID = 'thunderid-font-import';

afterEach(() => {
  cleanup();
  document.querySelector('meta[property="csp-nonce"]')?.remove();
});

describe('FontImporter', () => {
  it('references the CSS variable with the default-stack fallback inside var() when no family is given', () => {
    render(<FontImporter />);
    const style = document.getElementById(OVERRIDE_ID);
    expect(style?.tagName).toBe('STYLE');
    // Fallback must be inside var(), otherwise an unset variable invalidates the whole declaration.
    expect(style?.textContent).toContain(`var(--thunderid-typography-fontFamily, ${DEFAULT_FONT_STACK})`);
  });

  it('applies an explicit font family with the default stack as its fallback', () => {
    render(<FontImporter fontFamily="Poppins" />);
    const style = document.getElementById(OVERRIDE_ID);
    expect(style?.textContent).toContain(`font-family: Poppins, ${DEFAULT_FONT_STACK} !important`);
  });

  it('injects a stylesheet link for a valid https import URL', () => {
    render(<FontImporter importURL="https://fonts.googleapis.com/css2?family=Poppins" />);
    const link = document.getElementById(IMPORT_ID) as HTMLLinkElement | null;
    expect(link?.tagName).toBe('LINK');
    expect(link?.rel).toBe('stylesheet');
    expect(link?.href).toBe('https://fonts.googleapis.com/css2?family=Poppins');
  });

  it('does not inject a link when no import URL is configured', () => {
    render(<FontImporter fontFamily="Arial" />);
    expect(document.getElementById(IMPORT_ID)).toBeNull();
  });

  it('does not inject a link for an invalid import URL', () => {
    render(<FontImporter importURL="not a url" />);
    expect(document.getElementById(IMPORT_ID)).toBeNull();
  });

  it('removes injected nodes on unmount', () => {
    const {unmount} = render(<FontImporter importURL="https://fonts.googleapis.com/css2?family=Poppins" />);
    expect(document.getElementById(OVERRIDE_ID)).not.toBeNull();
    expect(document.getElementById(IMPORT_ID)).not.toBeNull();
    unmount();
    expect(document.getElementById(OVERRIDE_ID)).toBeNull();
    expect(document.getElementById(IMPORT_ID)).toBeNull();
  });

  it("tags its injected <style> element with the page's csp nonce", () => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'csp-nonce');
    meta.setAttribute('content', 'abc123');
    document.head.appendChild(meta);

    render(<FontImporter fontFamily="Poppins" />);

    const style = document.getElementById(OVERRIDE_ID);
    expect(style?.getAttribute('nonce')).toBe('abc123');
  });

  it('renders the <style> element without a nonce attribute when none is available', () => {
    render(<FontImporter fontFamily="Poppins" />);

    const style = document.getElementById(OVERRIDE_ID);
    expect(style?.hasAttribute('nonce')).toBe(false);
  });
});
