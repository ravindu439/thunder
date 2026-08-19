// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {ResourceServer} from '../models/resource-server';

export default function useGetResourceServer(id: string): UseQueryResult<ResourceServer> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ResourceServer>({
    queryKey: [ResourceServerQueryKeys.RESOURCE_SERVER, id],
    queryFn: async (): Promise<ResourceServer> => {
      const serverUrl = getServerUrl();

      const response: {data: ResourceServer} = await http.request({
        url: `${serverUrl}/resource-servers/${id}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
