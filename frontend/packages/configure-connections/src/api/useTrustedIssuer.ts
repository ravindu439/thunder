// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ConnectionQueryKeys from '../constants/query-keys';
import type {ConnectionResponse} from '../models/connection';
import {ConnectionTypes} from '../models/connection';
import type {TrustedIssuer} from '../models/trusted-issuer';
import mapConnectionToTrustedIssuer from '../utils/mapConnectionToTrustedIssuer';

/**
 * Fetch a single trusted issuer (GET /connections/oidc/{id}). Disabled until an id is provided.
 *
 * @example
 * ```tsx
 * const {data: trustedIssuer, isLoading} = useTrustedIssuer(id);
 * ```
 *
 * @public
 */
export default function useTrustedIssuer(id: string | undefined): UseQueryResult<TrustedIssuer> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<TrustedIssuer>({
    queryKey: [ConnectionQueryKeys.TRUSTED_ISSUER, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<TrustedIssuer> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ConnectionResponse;
      } = await http.request({
        url: `${serverUrl}/connections/${ConnectionTypes.OIDC}/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return mapConnectionToTrustedIssuer(response.data);
    },
  });
}
