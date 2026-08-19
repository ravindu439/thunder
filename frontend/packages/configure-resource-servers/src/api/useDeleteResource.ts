// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';

export default function useDeleteResource(resourceServerId: string): UseMutationResult<void, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (resourceId: string): Promise<void> => {
      const serverUrl = getServerUrl();

      await http.request({
        url: `${serverUrl}/resource-servers/${resourceServerId}/resources/${resourceId}`,
        method: 'DELETE',
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId]});
    },
  });
}
