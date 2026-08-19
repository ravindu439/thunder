// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import VerifiablePresentationQueryKeys from '../constants/vp-query-keys';
import type {VerifiablePresentation} from '../models/vp';

/**
 * Fetches a single OpenID4VP presentation definition by id.
 */
export default function useGetVerifiablePresentation(id: string): UseQueryResult<VerifiablePresentation> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<VerifiablePresentation>({
    queryKey: [VerifiablePresentationQueryKeys.VP, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<VerifiablePresentation> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VerifiablePresentation} = await http.request({
        url: `${serverUrl}/openid4vp/presentation-definitions/${id}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
