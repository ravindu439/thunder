// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ConnectionQueryKeys from '../constants/query-keys';
import {ConnectionInstanceCategories, type ConnectionInstance, type ConnectionListResponse} from '../models/connection';

/**
 * Custom hook to fetch SMS providers from the server.
 *
 * Backed by GET /connections?category=sms-provider (server default page size — up to
 * 30 instances; larger deployments would need pagination support added here).
 *
 * @returns TanStack Query result object with SMS providers data
 *
 * @example
 * ```tsx
 * function ProvidersList() {
 *   const { data, isLoading, error } = useSMSProviders();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.map((provider) => (
 *         <li key={provider.id}>{provider.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export default function useSMSProviders(): UseQueryResult<ConnectionInstance[]> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ConnectionInstance[]>({
    queryKey: [ConnectionQueryKeys.CONNECTIONS, ConnectionQueryKeys.SMS_PROVIDERS],
    queryFn: async (): Promise<ConnectionInstance[]> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ConnectionListResponse;
      } = await http.request({
        url: `${serverUrl}/connections?category=${ConnectionInstanceCategories.SMS_PROVIDER}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data.connections;
    },
  });
}
