// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';

/**
 * Custom hook to delete a theme configuration from the server.
 *
 * @returns TanStack Query mutation object for deleting theme configurations
 */
export default function useDeleteTheme(): UseMutationResult<void, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (themeId: string): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/design/themes/${themeId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_, themeId) => {
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.THEME, themeId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.THEMES]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
