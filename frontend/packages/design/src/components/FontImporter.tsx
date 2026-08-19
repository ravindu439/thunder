// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useConfig} from '@thunderid/contexts';
import {useEffect} from 'react';
import useFontStylesheetLink from './useFontStylesheetLink';
import {DEFAULT_FONT_STACK} from '../constants/fonts';
import getCspNonce from '../utils/getCspNonce';

/** CSS variable set by the ThunderID SDK when design data includes a custom font. */
const THUNDERID_FONT_CSS_VAR = '--thunderid-typography-fontFamily';

/** MUI class selectors that set their own font-family via CSS-in-JS. */
const MUI_FONT_SELECTORS = [
  'body',
  '.MuiTypography-root',
  '.MuiInputBase-root',
  '.MuiInputBase-input',
  '.MuiButton-root',
  '.MuiFormLabel-root',
  '.MuiMenuItem-root',
  '.MuiSelect-select',
  '.MuiChip-label',
].join(', ');

export interface FontImporterProps {
  /** Explicit font family. When omitted, references the ThunderID CSS variable instead. */
  fontFamily?: string;
  /** Stylesheet URL for a custom font (theme's `typography.font.importURL`). Nothing is fetched
   *  unless this is set; the host must also be permitted by the Content-Security-Policy. */
  importURL?: string;
  /** Document to inject elements into (defaults to `window.document`). */
  targetDocument?: Document;
}

/** Applies a design theme's font: fetches the import stylesheet (if any) and overrides MUI's
 *  font-family to the resolved value, falling back to the product default. */
export default function FontImporter({
  fontFamily = undefined,
  importURL = undefined,
  targetDocument = undefined,
}: FontImporterProps): null {
  const {config} = useConfig();
  const idPrefix = config.brand.product_name.toLowerCase().replace(/\s+/g, '-');
  const fontOverrideId = `${idPrefix}-font-override`;

  useFontStylesheetLink(importURL, targetDocument);

  useEffect(() => {
    const doc = targetDocument ?? document;

    // Fallback lives inside var(...) so an unset variable still resolves, instead of invalidating
    // the whole declaration and dropping to the browser's serif default.
    const family = fontFamily
      ? `${fontFamily}, ${DEFAULT_FONT_STACK}`
      : `var(${THUNDERID_FONT_CSS_VAR}, ${DEFAULT_FONT_STACK})`;

    const style = doc.createElement('style');
    style.id = fontOverrideId;
    const nonce = getCspNonce();
    if (nonce) {
      style.setAttribute('nonce', nonce);
    }
    style.textContent = `${MUI_FONT_SELECTORS} { font-family: ${family} !important; }`;

    doc.getElementById(fontOverrideId)?.remove();
    doc.head.appendChild(style);

    return () => {
      doc.getElementById(fontOverrideId)?.remove();
    };
  }, [fontFamily, fontOverrideId, targetDocument]);

  return null;
}
