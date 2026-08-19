// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/** The product's bundled default font stack, used as the fallback wherever a configured font
 *  is applied so an unresolved font degrades to this instead of the browser's serif default. */
export const DEFAULT_FONT_STACK = "'Inter Variable', sans-serif";

/** Browser-safe fonts offered in the theme builder's web-safe font picker. */
export const BROWSER_SAFE_FONTS: string[] = [
  'Arial',
  'Arial Black',
  'Brush Script MT',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Helvetica',
  'Impact',
  'Inter Variable',
  'Lucida Console',
  'Lucida Sans Unicode',
  'Palatino Linotype',
  'system-ui',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];
