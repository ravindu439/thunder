// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ConnectionQueryKeys from '../constants/query-keys';
import type {ConnectionInstanceSummary, ConnectionType} from '../models/connection';

export interface UseConnectionInstancesOptions {
  enabled?: boolean;
}

/**
 * Fetch the configured instances for a connection type (GET /connections/{type}).
 */
export default function useConnectionInstances(
  type: ConnectionType,
  options?: UseConnectionInstancesOptions,
): UseQueryResult<ConnectionInstanceSummary[]> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ConnectionInstanceSummary[]>({
    queryKey: [ConnectionQueryKeys.CONNECTION_INSTANCES, type],
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<ConnectionInstanceSummary[]> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ConnectionInstanceSummary[];
      } = await http.request({
        url: `${serverUrl}/connections/${type}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
