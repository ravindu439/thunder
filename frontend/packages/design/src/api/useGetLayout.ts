// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import DesignQueryKeys from '../constants/design-query-keys';
import type {LayoutResponse} from '../models/responses';

/**
 * Custom hook to fetch a single layout configuration by ID from the server.
 *
 * @param layoutId - The unique identifier of the layout configuration
 * @returns TanStack Query result object with layout data
 */
export default function useGetLayout(layoutId: string): UseQueryResult<LayoutResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<LayoutResponse>({
    queryKey: [DesignQueryKeys.LAYOUT, layoutId],
    queryFn: async (): Promise<LayoutResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: LayoutResponse;
      } = await http.request({
        url: `${serverUrl}/design/layouts/${layoutId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(layoutId),
  });
}
