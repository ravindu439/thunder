// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useRoleRoutes` falls back to
 * `defaultRoleRoutePaths` below.
 *
 * @public
 */
export interface RoleRoutePaths {
  roles: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
}

/**
 * Default role paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultRoleRoutePaths: RoleRoutePaths = {
  roles: {
    list: () => '/roles',
    detail: (id) => `/roles/${id}`,
    create: () => '/roles/create',
  },
};

/**
 * Resolves the role route paths, preferring the host application's configuration (supplied via
 * `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode these destination paths; they should call this hook and build
 * the destination from the returned functions instead.
 *
 * @public
 */
export default function useRoleRoutes(): RoleRoutePaths {
  const routes = useRoutes<Partial<RoleRoutePaths>>();
  return {
    roles: routes.roles ?? defaultRoleRoutePaths.roles,
  };
}
