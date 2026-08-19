// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';
import type {ThemeResponse} from '../models/responses';

/**
 * Custom hook to fetch a single theme configuration by ID from the server.
 *
 * @param themeId - The unique identifier of the theme configuration
 * @returns TanStack Query result object with theme data
 */
export default function useGetTheme(themeId: string): UseQueryResult<ThemeResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ThemeResponse>({
    queryKey: [DesignQueryKeys.THEME, themeId],
    queryFn: async (): Promise<ThemeResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ThemeResponse;
      } = await http.request({
        url: `${serverUrl}/design/themes/${themeId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(themeId),
  });
}
