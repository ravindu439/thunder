// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import OrganizationUnitQueryKeys from '../constants/organization-unit-query-keys';
import type {GroupListResponse} from '../models/group';
import type {OrganizationUnitListParams} from '../models/requests';

/**
 * Custom React hook to fetch groups belonging to a specific organization unit.
 *
 * This hook uses TanStack Query to manage the server state and provides automatic
 * caching, refetching, and background updates.
 *
 * @param organizationUnitId - The ID of the organization unit
 * @param params - Optional pagination parameters
 * @param params.limit - Maximum number of records to return (default: 30)
 * @param params.offset - Number of records to skip for pagination (default: 0)
 * @returns TanStack Query result object containing groups list data
 *
 * @example
 * ```tsx
 * function OUGroupsList({ ouId }: { ouId: string }) {
 *   const { data, isLoading, error } = useGetOrganizationUnitGroups(ouId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.groups.map((group) => (
 *         <li key={group.id}>{group.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export default function useGetOrganizationUnitGroups(
  organizationUnitId: string | undefined,
  params?: OrganizationUnitListParams,
): UseQueryResult<GroupListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit = 30, offset = 0} = params ?? {};

  return useQuery<GroupListResponse>({
    queryKey: [OrganizationUnitQueryKeys.ORGANIZATION_UNIT_GROUPS, organizationUnitId, {limit, offset}],
    queryFn: async (): Promise<GroupListResponse> => {
      const serverUrl: string = getServerUrl();
      const queryParams: URLSearchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      const response: {
        data: GroupListResponse;
      } = await http.request({
        url: `${serverUrl}/organization-units/${organizationUnitId}/groups?${queryParams.toString()}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(organizationUnitId),
  });
}
