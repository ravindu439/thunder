// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import VerifiableCredentialQueryKeys from '../constants/vc-query-keys';
import type {VerifiableCredential} from '../models/vc';

/**
 * Fetches a single OpenID4VCI credential configuration by id.
 */
export default function useGetVerifiableCredential(id: string): UseQueryResult<VerifiableCredential> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<VerifiableCredential>({
    queryKey: [VerifiableCredentialQueryKeys.VC, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<VerifiableCredential> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VerifiableCredential} = await http.request({
        url: `${serverUrl}/openid4vci/credential-configurations/${id}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
