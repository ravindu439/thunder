// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';
import type {UpdateThemeRequest} from '../models/requests';
import type {ThemeResponse} from '../models/responses';

interface UpdateThemeParams {
  themeId: string;
  data: UpdateThemeRequest;
}

/**
 * Custom hook to update an existing theme configuration in the server.
 *
 * @returns TanStack Query mutation object for updating theme configurations
 */
export default function useUpdateTheme(): UseMutationResult<ThemeResponse, Error, UpdateThemeParams> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();

  return useMutation<ThemeResponse, Error, UpdateThemeParams>({
    mutationFn: async ({themeId, data}: UpdateThemeParams): Promise<ThemeResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ThemeResponse;
      } = await http.request({
        url: `${serverUrl}/design/themes/${themeId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (_, {themeId}) => {
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.THEME, themeId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [DesignQueryKeys.THEMES]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
