// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useUserTypeRoutes` falls back
 * to `defaultUserTypeRoutePaths` below.
 *
 * @public
 */
export interface UserTypeRoutePaths {
  userTypes: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
}

/**
 * Default user type paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultUserTypeRoutePaths: UserTypeRoutePaths = {
  userTypes: {
    list: () => '/user-types',
    detail: (id) => `/user-types/${id}`,
    create: () => '/user-types/create',
  },
};

/**
 * Resolves the user type route paths, preferring the host application's configuration
 * (supplied via `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode user type destination paths; they should call this
 * hook and build the destination from the returned functions instead.
 *
 * @public
 */
export default function useUserTypeRoutes(): UserTypeRoutePaths['userTypes'] {
  const routes = useRoutes<Partial<UserTypeRoutePaths>>();
  return routes.userTypes ?? defaultUserTypeRoutePaths.userTypes;
}
