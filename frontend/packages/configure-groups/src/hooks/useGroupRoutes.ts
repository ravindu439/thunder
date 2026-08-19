// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useGroupRoutes` falls back to
 * `defaultGroupRoutePaths` below.
 *
 * @public
 */
export interface GroupRoutePaths {
  groups: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
}

/**
 * Default group paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultGroupRoutePaths: GroupRoutePaths = {
  groups: {
    list: () => '/groups',
    detail: (id) => `/groups/${id}`,
    create: () => '/groups/create',
  },
};

/**
 * Resolves the group route paths, preferring the host application's configuration (supplied via
 * `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode these destination paths; they should call this hook and build
 * the destination from the returned functions instead.
 *
 * @public
 */
export default function useGroupRoutes(): GroupRoutePaths {
  const routes = useRoutes<Partial<GroupRoutePaths>>();
  return {
    groups: routes.groups ?? defaultGroupRoutePaths.groups,
  };
}
