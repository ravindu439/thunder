// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {Resource, UpdateResourceRequest} from '../models/resource-server';

export default function useUpdateResource(
  resourceServerId: string,
): UseMutationResult<Resource, Error, {resourceId: string; data: UpdateResourceRequest}> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<Resource, Error, {resourceId: string; data: UpdateResourceRequest}>({
    mutationFn: async ({resourceId, data}): Promise<Resource> => {
      const serverUrl = getServerUrl();

      const response: {data: Resource} = await http.request({
        url: `${serverUrl}/resource-servers/${resourceServerId}/resources/${resourceId}`,
        method: 'PUT',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId]});
    },
  });
}
