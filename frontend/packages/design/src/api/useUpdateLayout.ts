// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';
import type {UpdateLayoutRequest} from '../models/requests';
import type {LayoutResponse} from '../models/responses';

interface UpdateLayoutParams {
  layoutId: string;
  data: UpdateLayoutRequest;
}

/**
 * Custom hook to update an existing layout configuration in the server.
 *
 * @returns TanStack Query mutation object for updating layout configurations
 */
export default function useUpdateLayout(): UseMutationResult<LayoutResponse, Error, UpdateLayoutParams> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();

  return useMutation<LayoutResponse, Error, UpdateLayoutParams>({
    mutationFn: async ({layoutId, data}: UpdateLayoutParams): Promise<LayoutResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: LayoutResponse;
      } = await http.request({
        url: `${serverUrl}/design/layouts/${layoutId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (_, {layoutId}) => {
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.LAYOUT, layoutId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.LAYOUTS]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
