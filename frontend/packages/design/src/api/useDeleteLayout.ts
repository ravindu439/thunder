// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';

/**
 * Custom hook to delete a layout configuration from the server.
 *
 * @returns TanStack Query mutation object for deleting layout configurations
 */
export default function useDeleteLayout(): UseMutationResult<void, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (layoutId: string): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/design/layouts/${layoutId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_, layoutId) => {
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.LAYOUT, layoutId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.LAYOUTS]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
