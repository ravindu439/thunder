// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import VerifiableCredentialQueryKeys from '../constants/vc-query-keys';
import type {VCListResponse} from '../models/vc';

/**
 * Fetches all OpenID4VCI credential configurations.
 */
export default function useGetVerifiableCredentials(): UseQueryResult<VCListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<VCListResponse>({
    queryKey: [VerifiableCredentialQueryKeys.VCS],
    queryFn: async (): Promise<VCListResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VCListResponse} = await http.request({
        url: `${serverUrl}/openid4vci/credential-configurations`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data ?? [];
    },
  });
}
