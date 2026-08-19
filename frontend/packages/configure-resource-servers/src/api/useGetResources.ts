// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {ResourceListResponse} from '../models/resource-server';

export async function fetchResources(
  http: {request: (config: unknown) => Promise<{data: ResourceListResponse}>},
  serverUrl: string,
  resourceServerId: string,
  parentId?: string,
): Promise<ResourceListResponse> {
  const queryParams = new URLSearchParams({limit: '100', offset: '0'});
  if (parentId) queryParams.set('parentId', parentId);

  const response = await http.request({
    url: `${serverUrl}/resource-servers/${resourceServerId}/resources?${queryParams.toString()}`,
    method: 'GET',
  });

  return response.data;
}

export default function useGetResources(
  resourceServerId: string,
  parentId?: string,
  enabled = true,
): UseQueryResult<ResourceListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ResourceListResponse>({
    queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId, {parentId: parentId ?? null}],
    queryFn: async (): Promise<ResourceListResponse> => {
      const serverUrl = getServerUrl();
      return fetchResources(
        http as {request: (config: unknown) => Promise<{data: ResourceListResponse}>},
        serverUrl,
        resourceServerId,
        parentId,
      );
    },
    enabled: Boolean(resourceServerId) && enabled,
  });
}
