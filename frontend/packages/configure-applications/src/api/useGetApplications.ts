// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ApplicationQueryKeys from '../constants/application-query-keys';
import type {ApplicationListResponse} from '../models/responses';

/**
 * Parameters for the {@link useGetApplications} hook.
 *
 * @public
 */
export interface UseGetApplicationsParams {
  /**
   * Maximum number of records to return.
   */
  limit?: number;
  /**
   * Number of records to skip for pagination.
   */
  offset?: number;
}

/**
 * Custom React hook to fetch a paginated list of applications from the server.
 *
 * This hook uses TanStack Query to manage the server state and provides automatic
 * caching, refetching, and background updates. The query is keyed by the pagination
 * parameters to ensure proper cache management.
 *
 * @param params - Optional pagination parameters
 * @param params.limit - Maximum number of records to return (default: 30)
 * @param params.offset - Number of records to skip for pagination (default: 0)
 * @returns TanStack Query result object containing applications list data, loading state, and error information
 *
 * @example
 * ```tsx
 * function ApplicationsList() {
 *   const { data, isLoading, error } = useGetApplications({ limit: 10, offset: 0 });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.applications.map((app) => (
 *         <li key={app.id}>{app.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useGetApplications(params?: UseGetApplicationsParams): UseQueryResult<ApplicationListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit = 30, offset = 0} = params ?? {};

  return useQuery<ApplicationListResponse>({
    queryKey: [ApplicationQueryKeys.APPLICATIONS, {limit, offset}],
    queryFn: async (): Promise<ApplicationListResponse> => {
      const serverUrl: string = getServerUrl();
      const queryParams: URLSearchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response: {
        data: ApplicationListResponse;
      } = await http.request({
        url: `${serverUrl}/applications?${queryParams.toString()}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
