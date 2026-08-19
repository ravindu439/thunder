// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import VerifiablePresentationQueryKeys from '../constants/vp-query-keys';
import type {VPListResponse} from '../models/vp';

/**
 * Fetches all OpenID4VP presentation definitions.
 */
export default function useGetVerifiablePresentations(): UseQueryResult<VPListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<VPListResponse>({
    queryKey: [VerifiablePresentationQueryKeys.VPS],
    queryFn: async (): Promise<VPListResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VPListResponse} = await http.request({
        url: `${serverUrl}/openid4vp/presentation-definitions`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data ?? [];
    },
  });
}
