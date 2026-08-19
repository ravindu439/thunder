// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import LayoutBuilderContext, {type LayoutBuilderContextType} from './LayoutBuilderContext';

/**
 * React hook for accessing layout builder state throughout the application.
 *
 * This hook provides access to all the state needed for editing and previewing layouts.
 * It must be used within a component tree wrapped by `LayoutBuilderProvider`,
 * otherwise it will throw an error.
 *
 * @returns The layout builder context containing state data and utility methods
 *
 * @throws {Error} Throws an error if used outside of LayoutBuilderProvider
 *
 * @example
 * Basic usage:
 * ```tsx
 * import useLayoutBuilder from './useLayoutBuilder';
 *
 * function ScreenSelector() {
 *   const { selectedScreen, setSelectedScreen, getAllScreens, isDirty } = useLayoutBuilder();
 *
 *   const screens = getAllScreens();
 *
 *   return (
 *     <div>
 *       <p>Unsaved changes: {isDirty}</p>
 *       <select value={selectedScreen ?? ''} onChange={(e) => setSelectedScreen(e.target.value)}>
 *         {Object.keys(screens).map((name) => (
 *           <option key={name} value={name}>{name}</option>
 *         ))}
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useLayoutBuilder(): LayoutBuilderContextType {
  const context = useContext(LayoutBuilderContext);

  if (context === undefined) {
    throw new Error('useLayoutBuilder must be used within LayoutBuilderProvider');
  }

  return context;
}
