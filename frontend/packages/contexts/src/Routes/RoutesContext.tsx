// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Context, createContext} from 'react';

/**
 * Flat bag of route-building functions, keyed by feature domain (e.g. `organizationUnits`, `users`).
 *
 * The host application owns the concrete shape and URL strings. Feature packages only depend on
 * the slice of this map they need, expressed as their own local interface.
 *
 * @public
 */
export type RoutePaths = object;

/**
 * React context that carries the host application's route configuration.
 *
 * Defaults to an empty object rather than `undefined` so that feature packages can be rendered
 * standalone (e.g. in Storybook or unit tests) without a `RoutesProvider` ancestor, falling back
 * to their own default paths. Consume via `useRoutes` rather than this context directly.
 *
 * @public
 */
const RoutesContext: Context<RoutePaths> = createContext<RoutePaths>({});

export default RoutesContext;
