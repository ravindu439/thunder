// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import ThemeBuilderContext, {type ThemeBuilderContextType} from './ThemeBuilderContext';

/**
 * React hook for accessing theme builder state throughout the application.
 *
 * This hook provides access to all the state needed for editing and previewing themes.
 * It must be used within a component tree wrapped by `ThemeBuilderProvider`,
 * otherwise it will throw an error.
 *
 * @returns The theme builder context containing state data and utility methods
 *
 * @throws {Error} Throws an error if used outside of ThemeBuilderProvider
 *
 * @example
 * Basic usage:
 * ```tsx
 * import useThemeBuilder from './useThemeBuilder';
 *
 * function ColorPicker() {
 *   const { draftTheme, updateDraftTheme, isDirty } = useThemeBuilder();
 *
 *   return (
 *     <div>
 *       <p>Unsaved changes: {isDirty}</p>
 *       <button onClick={() => updateDraftTheme(['colorSchemes', 'light', 'colors', 'primary', 'main'], '#ff0000')}>
 *         Set Red Primary
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useThemeBuilder(): ThemeBuilderContextType {
  const context = useContext(ThemeBuilderContext);

  if (context === undefined) {
    throw new Error('useThemeBuilder must be used within ThemeBuilderProvider');
  }

  return context;
}
