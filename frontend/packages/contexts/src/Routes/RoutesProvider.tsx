// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX, PropsWithChildren} from 'react';
import RoutesContext, {type RoutePaths} from './RoutesContext';

/**
 * Props for the RoutesProvider component.
 *
 * @public
 */
export interface RoutesProviderProps<T extends RoutePaths = RoutePaths> extends PropsWithChildren {
  /**
   * The application's complete route configuration: a flat object keyed by feature domain,
   * where each value is the set of path-building functions for that domain.
   */
  paths: T;
}

/**
 * React context provider that lets the host application declare the URL structure used by
 * every feature package mounted beneath it.
 *
 * Feature packages never hardcode destination paths. Instead they read the slice of `paths`
 * they need through a package-level hook built on top of `useRoutes`, falling back to their
 * own defaults when a key is absent. This lets the same package be mounted under different
 * URL structures by different host applications.
 *
 * @example
 * Wiring it up once, near the application root:
 * ```tsx
 * import { RoutesProvider } from '@thunderid/contexts';
 * import { appRoutePaths } from './routes/appRoutePaths';
 *
 * function App() {
 *   return (
 *     <RoutesProvider paths={appRoutePaths}>
 *       <Routes />
 *     </RoutesProvider>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function RoutesProvider<T extends RoutePaths = RoutePaths>({
  paths,
  children,
}: RoutesProviderProps<T>): JSX.Element {
  return <RoutesContext.Provider value={paths}>{children}</RoutesContext.Provider>;
}
