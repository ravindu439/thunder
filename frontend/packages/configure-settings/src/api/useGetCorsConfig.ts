// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import SettingsQueryKeys from '../constants/settings-query-keys';
import type {CorsConfigResponse} from '../models/responses';

/**
 * Fetches the CORS server-config section.
 *
 * @returns TanStack Query result containing the CORS config layers.
 *
 * @public
 */
export default function useGetCorsConfig(): UseQueryResult<CorsConfigResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<CorsConfigResponse>({
    queryKey: [SettingsQueryKeys.SERVER_CONFIG, SettingsQueryKeys.CORS],
    queryFn: async (): Promise<CorsConfigResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: CorsConfigResponse;
      } = await http.request({
        url: `${serverUrl}/server-config/cors`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
