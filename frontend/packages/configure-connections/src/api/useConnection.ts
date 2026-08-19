// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ConnectionQueryKeys from '../constants/query-keys';
import type {ConnectionResponse, ConnectionType} from '../models/connection';

/**
 * Fetch a single connection instance with its (masked-secret) details
 * (GET /connections/{type}/{id}). Disabled until an id is provided.
 */
export default function useConnection(
  type: ConnectionType,
  id: string | undefined,
): UseQueryResult<ConnectionResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ConnectionResponse>({
    queryKey: [ConnectionQueryKeys.CONNECTION, type, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<ConnectionResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ConnectionResponse;
      } = await http.request({
        url: `${serverUrl}/connections/${type}/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
