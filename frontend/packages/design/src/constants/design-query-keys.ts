// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for design feature cache management.
 */
const DesignQueryKeys = {
  /** Key for listing themes */
  THEMES: 'themes',

  /** Key for a specific theme by ID */
  THEME: 'theme',

  /** Key for listing layouts */
  LAYOUTS: 'layouts',

  /** Key for a specific layout by ID */
  LAYOUT: 'layout',

  /** Key for resolving design configuration by type and ID */
  DESIGN_RESOLVE: 'design-resolve',

  /** Key for theme usages (resources referencing a theme) */
  THEME_USAGES: 'theme-usages',
} as const;

export default DesignQueryKeys;
