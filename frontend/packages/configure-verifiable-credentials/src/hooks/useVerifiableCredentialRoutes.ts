// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useRoutes} from '@thunderid/contexts';

/**
 * Route paths this package needs from the host application.
 *
 * The host supplies these via `@thunderid/contexts`'s `RoutesProvider`. When absent (e.g. this
 * package rendered standalone in Storybook or a unit test), `useVerifiableCredentialRoutes` falls
 * back to `defaultVerifiableCredentialRoutePaths` below.
 *
 * @public
 */
export interface VerifiableCredentialRoutePaths {
  verifiableCredentials: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
  verifiablePresentations: {
    list: () => string;
    detail: (id: string) => string;
    create: () => string;
  };
}

/**
 * Default verifiable-credential (and verifiable-presentation) paths, used when no host-supplied
 * override is present.
 *
 * @public
 */
export const defaultVerifiableCredentialRoutePaths: VerifiableCredentialRoutePaths = {
  verifiableCredentials: {
    list: () => '/verifiable-credentials',
    detail: (id) => `/verifiable-credentials/${id}`,
    create: () => '/verifiable-credentials/create',
  },
  verifiablePresentations: {
    list: () => '/verifiable-presentations',
    detail: (id) => `/verifiable-presentations/${id}`,
    create: () => '/verifiable-presentations/create',
  },
};

/**
 * Resolves the verifiable-credential (and verifiable-presentation) route paths, preferring the
 * host application's configuration (supplied via `RoutesProvider`) and falling back to this
 * package's own defaults.
 *
 * Components should never hardcode these destination paths; they should call this hook and build
 * the destination from the returned functions instead.
 *
 * @public
 */
export default function useVerifiableCredentialRoutes(): VerifiableCredentialRoutePaths {
  const routes = useRoutes<Partial<VerifiableCredentialRoutePaths>>();
  return {
    verifiableCredentials: routes.verifiableCredentials ?? defaultVerifiableCredentialRoutePaths.verifiableCredentials,
    verifiablePresentations:
      routes.verifiablePresentations ?? defaultVerifiableCredentialRoutePaths.verifiablePresentations,
  };
}
