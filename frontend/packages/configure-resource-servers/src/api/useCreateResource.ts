// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {CreateResourceRequest, Resource} from '../models/resource-server';

export default function useCreateResource(
  resourceServerId: string,
): UseMutationResult<Resource, Error, CreateResourceRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<Resource, Error, CreateResourceRequest>({
    mutationFn: async (data: CreateResourceRequest): Promise<Resource> => {
      const serverUrl = getServerUrl();

      const response: {data: Resource} = await http.request({
        url: `${serverUrl}/resource-servers/${resourceServerId}/resources`,
        method: 'POST',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId]});
    },
  });
}
