// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useOrganizationUnitRoutes` falls
 * back to `defaultOrganizationUnitRoutePaths` below.
 *
 * @public
 */
export interface OrganizationUnitRoutePaths {
  organizationUnits: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
}

/**
 * Default organization unit paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultOrganizationUnitRoutePaths: OrganizationUnitRoutePaths = {
  organizationUnits: {
    list: () => '/organization-units',
    detail: (id) => `/organization-units/${id}`,
    create: () => '/organization-units/create',
  },
};

/**
 * Resolves the organization unit route paths, preferring the host application's configuration
 * (supplied via `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode organization unit destination paths; they should call this
 * hook and build the destination from the returned functions instead.
 *
 * @public
 */
export default function useOrganizationUnitRoutes(): OrganizationUnitRoutePaths['organizationUnits'] {
  const routes = useRoutes<Partial<OrganizationUnitRoutePaths>>();
  return routes.organizationUnits ?? defaultOrganizationUnitRoutePaths.organizationUnits;
}
