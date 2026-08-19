// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useConnectionRoutes` falls back to
 * `defaultConnectionRoutePaths` below.
 *
 * Includes `trustedIssuers` alongside `connections`: a trusted-issuer instance is a connection
 * under the hood, but it opens a distinct detail page owned by the host application rather than
 * this package's own `ConnectionDetailPage`.
 *
 * @public
 */
export interface ConnectionRoutePaths {
  connections: {
    list: () => string;
    byType: (type: string) => string;
    detail: (type: string, id: string) => string;
    configure: (type: string) => string;
    create: () => string;
  };
  trustedIssuers: {
    detail: (id: string) => string;
  };
}

/**
 * Default connection (and trusted issuer) paths, used when no host-supplied override is present.
 *
 * @public
 */
export const defaultConnectionRoutePaths: ConnectionRoutePaths = {
  connections: {
    list: () => '/connections',
    byType: (type) => `/connections/${type}`,
    detail: (type, id) => `/connections/${type}/${id}`,
    configure: (type) => `/connections/${type}/configure`,
    create: () => '/connections/create',
  },
  trustedIssuers: {
    detail: (id) => `/trusted-issuers/${id}`,
  },
};

/**
 * Resolves the connection (and trusted issuer) route paths, preferring the host application's
 * configuration (supplied via `RoutesProvider`) and falling back to this package's own defaults.
 *
 * Components should never hardcode connection destination paths; they should call this hook and
 * build the destination from the returned functions instead.
 *
 * @public
 */
export default function useConnectionRoutes(): ConnectionRoutePaths {
  const routes = useRoutes<Partial<ConnectionRoutePaths>>();
  return {
    connections: routes.connections ?? defaultConnectionRoutePaths.connections,
    trustedIssuers: routes.trustedIssuers ?? defaultConnectionRoutePaths.trustedIssuers,
  };
}
