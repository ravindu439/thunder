// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {CreateResourceServerRequest, ResourceServer} from '../models/resource-server';

export default function useCreateResourceServer(): UseMutationResult<
  ResourceServer,
  Error,
  CreateResourceServerRequest
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<ResourceServer, Error, CreateResourceServerRequest>({
    mutationFn: async (data: CreateResourceServerRequest): Promise<ResourceServer> => {
      const serverUrl = getServerUrl();

      const response: {data: ResourceServer} = await http.request({
        url: `${serverUrl}/resource-servers`,
        method: 'POST',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCE_SERVERS]});
    },
  });
}
