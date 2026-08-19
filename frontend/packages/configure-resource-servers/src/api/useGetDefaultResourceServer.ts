// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {DefaultResourceServerConfigResponse} from '../models/resource-server';

// Fetches the default resource server server-config section.
export default function useGetDefaultResourceServer(): UseQueryResult<DefaultResourceServerConfigResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<DefaultResourceServerConfigResponse>({
    queryKey: [ResourceServerQueryKeys.SERVER_CONFIG, ResourceServerQueryKeys.DEFAULT_RESOURCE_SERVER],
    queryFn: async (): Promise<DefaultResourceServerConfigResponse> => {
      const serverUrl = getServerUrl();

      const response: {data: DefaultResourceServerConfigResponse} = await http.request({
        url: `${serverUrl}/server-config/${ResourceServerQueryKeys.DEFAULT_RESOURCE_SERVER}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
