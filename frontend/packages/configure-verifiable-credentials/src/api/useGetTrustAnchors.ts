// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import VerifiablePresentationQueryKeys from '../constants/vp-query-keys';
import type {TrustAnchor} from '../models/vp';

/**
 * Fetches the trust anchors (issuer trust) registered with the server.
 */
export default function useGetTrustAnchors(): UseQueryResult<TrustAnchor[]> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<TrustAnchor[]>({
    queryKey: [VerifiablePresentationQueryKeys.TRUST_ANCHORS],
    queryFn: async (): Promise<TrustAnchor[]> => {
      const serverUrl: string = getServerUrl();
      const response: {data: TrustAnchor[]} = await http.request({
        url: `${serverUrl}/openid4vp/trust-anchors`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data ?? [];
    },
  });
}
