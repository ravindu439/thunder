// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';
import type {ThemeUsagesResponse} from '../models/responses';

/**
 * Custom hook to fetch resources that reference a theme.
 * Used to populate the pre-delete confirmation dialog.
 *
 * @param themeId - The unique identifier of the theme
 * @param enabled - Whether the query should run (default true)
 * @returns TanStack Query result with theme usages data
 */
export default function useGetThemeUsages(themeId: string | null, enabled = true): UseQueryResult<ThemeUsagesResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ThemeUsagesResponse>({
    queryKey: [DesignQueryKeys.THEME_USAGES, themeId],
    queryFn: async (): Promise<ThemeUsagesResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {data: ThemeUsagesResponse} = await http.request({
        url: `${serverUrl}/design/themes/${encodeURIComponent(themeId!)}/usages`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(themeId) && enabled,
  });
}
