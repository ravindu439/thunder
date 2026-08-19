// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {ActionListResponse} from '../models/resource-server';

export async function fetchResourceActions(
  http: {request: (config: unknown) => Promise<{data: ActionListResponse}>},
  serverUrl: string,
  resourceServerId: string,
  resourceId: string,
): Promise<ActionListResponse> {
  const response = await http.request({
    url: `${serverUrl}/resource-servers/${resourceServerId}/resources/${resourceId}/actions?limit=100&offset=0`,
    method: 'GET',
  });

  return response.data;
}

export default function useGetResourceActions(
  resourceServerId: string,
  resourceId: string,
  enabled = true,
): UseQueryResult<ActionListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ActionListResponse>({
    queryKey: [ResourceServerQueryKeys.RESOURCE_ACTIONS, resourceServerId, resourceId],
    queryFn: async (): Promise<ActionListResponse> => {
      const serverUrl = getServerUrl();
      return fetchResourceActions(
        http as {request: (config: unknown) => Promise<{data: ActionListResponse}>},
        serverUrl,
        resourceServerId,
        resourceId,
      );
    },
    enabled: Boolean(resourceServerId) && Boolean(resourceId) && enabled,
  });
}
