// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useDesign, type Theme} from '@thunderid/design';
import {AcrylicOrangeTheme, ThemeProvider} from '@wso2/oxygen-ui';
import type {JSX, ReactNode} from 'react';
import ColorSchemeSync from './ColorSchemeSync';

/**
 * Wraps children in a ThemeProvider scoped to the preview iframe.
 *
 * Key: `colorSchemeNode` must point to the iframe's `<html>` element so MUI
 * sets `data-color-scheme` inside the iframe (not on the parent document).
 * Without this, the CSS-vars selectors like `[data-color-scheme="dark"]`
 * never match and the theme doesn't switch.
 */
export default function PreviewThemeProvider({
  colorScheme,
  colorSchemeNode = undefined,
  baseTheme = undefined,
  children,
}: {
  colorScheme: 'light' | 'dark';
  colorSchemeNode?: HTMLElement | null;
  /** Base theme the resolved design is merged over. Defaults to Acrylic Orange. */
  baseTheme?: Theme;
  children: ReactNode;
}): JSX.Element {
  const effectiveBaseTheme = baseTheme ?? (AcrylicOrangeTheme as Theme);
  const {theme} = useDesign(effectiveBaseTheme);

  // MUI's ThemeProvider supports CSS-vars-specific props (colorSchemeNode,
  // disableNestedContext, storageManager) at runtime, but the TypeScript types
  // only expose them when the module-augmentation `CssThemeVariables` is set to
  // `{ enabled: true }`.  We need these props to isolate the preview iframe's
  // color-scheme attribute and prevent localStorage conflicts.
  const cssVarsProps = {
    storageManager: null,
    disableNestedContext: true,
    ...(colorSchemeNode ? {colorSchemeNode} : {}),
  } as Record<string, unknown>;

  return (
    <ThemeProvider theme={theme ?? effectiveBaseTheme} defaultMode={colorScheme} {...cssVarsProps}>
      <ColorSchemeSync mode={colorScheme} />
      {children}
    </ThemeProvider>
  );
}
