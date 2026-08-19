// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {ResourceServer, UpdateResourceServerRequest} from '../models/resource-server';

export default function useUpdateResourceServer(): UseMutationResult<
  ResourceServer,
  Error,
  {id: string; data: UpdateResourceServerRequest}
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<ResourceServer, Error, {id: string; data: UpdateResourceServerRequest}>({
    mutationFn: async ({id, data}): Promise<ResourceServer> => {
      const serverUrl = getServerUrl();

      const response: {data: ResourceServer} = await http.request({
        url: `${serverUrl}/resource-servers/${id}`,
        method: 'PUT',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (_result, {id}) => {
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCE_SERVER, id]});
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCE_SERVERS]});
    },
  });
}
