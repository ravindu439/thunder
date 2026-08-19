// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import AgentTypeQueryKeys from '../constants/agentTypeQueryKeys';
import type {ApiAgentType} from '../models/agent-type';

/**
 * Custom React hook to fetch a single agent type by ID from the server.
 *
 * @param id - The unique identifier of the agent type to fetch
 * @returns TanStack Query result object containing agent type data, loading state, and error information
 */
export default function useGetAgentType(id?: string): UseQueryResult<ApiAgentType> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ApiAgentType>({
    queryKey: [AgentTypeQueryKeys.AGENT_TYPE, id],
    queryFn: async (): Promise<ApiAgentType> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ApiAgentType;
      } = await http.request({
        url: `${serverUrl}/agent-types/${id}?include=display`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
