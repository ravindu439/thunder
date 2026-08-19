// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {CssVarsTheme, Theme as OxygenUITheme} from '@wso2/oxygen-ui';

/**
 * Theme configuration containing color schemes, shape, and typography
 */
export type Theme = OxygenUITheme & CssVarsTheme;

/**
 * Supported color scheme options for theme preview and default scheme selection.
 */
export type ColorSchemeOption = 'light' | 'dark' | 'system';

/** Custom-font import descriptor stored on a theme under `typography.font`. */
export interface ThemeTypographyFont {
  /** Stylesheet URL that provides the custom font (e.g. a Google Fonts href). */
  importURL?: string;
}

/** Reads a theme's custom-font import URL, if any. `typography.font` isn't part of the MUI
 *  typography type, so it's accessed through a narrow cast. */
export function getFontImportURL(theme: Theme | null | undefined): string | undefined {
  const typography = theme?.typography as {font?: ThemeTypographyFont} | undefined;
  return typography?.font?.importURL;
}
