// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ApplicationQueryKeys from '../constants/application-query-keys';
import type {Application} from '../models/application';

/**
 * Custom React hook to fetch a single application by ID from the server.
 *
 * This hook uses TanStack Query to manage the server state and provides automatic
 * caching, refetching, and background updates. The query is automatically disabled
 * when no applicationId is provided.
 *
 * @param applicationId - The unique identifier of the application to fetch
 * @returns TanStack Query result object containing application data, loading state, and error information
 *
 * @example
 * ```tsx
 * function ApplicationDetails({ id }: { id: string }) {
 *   const { data, isLoading, error } = useGetApplication(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!data) return <div>Not found</div>;
 *
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <p>{data.description}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useGetApplication(applicationId: string): UseQueryResult<Application> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<Application>({
    queryKey: [ApplicationQueryKeys.APPLICATION, applicationId],
    queryFn: async (): Promise<Application> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: Application;
      } = await http.request({
        url: `${serverUrl}/applications/${applicationId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(applicationId),
  });
}
