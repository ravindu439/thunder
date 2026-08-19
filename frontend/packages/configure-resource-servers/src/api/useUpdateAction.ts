// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {Action, UpdateActionRequest} from '../models/resource-server';

export default function useUpdateAction(
  resourceServerId: string,
  resourceId?: string,
): UseMutationResult<Action, Error, {actionId: string; data: UpdateActionRequest}> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<Action, Error, {actionId: string; data: UpdateActionRequest}>({
    mutationFn: async ({actionId, data}): Promise<Action> => {
      const serverUrl = getServerUrl();
      const url = resourceId
        ? `${serverUrl}/resource-servers/${resourceServerId}/resources/${resourceId}/actions/${actionId}`
        : `${serverUrl}/resource-servers/${resourceServerId}/actions/${actionId}`;

      const response: {data: Action} = await http.request({
        url,
        method: 'PUT',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      if (resourceId) {
        void queryClient.invalidateQueries({
          queryKey: [ResourceServerQueryKeys.RESOURCE_ACTIONS, resourceServerId, resourceId],
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: [ResourceServerQueryKeys.SERVER_ACTIONS, resourceServerId],
        });
      }
    },
  });
}
