// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import OrganizationUnitQueryKeys from '../constants/organization-unit-query-keys';
import type {OrganizationUnit} from '../models/organization-unit';

/**
 * Custom React hook to fetch a single organization unit by its ID from the server.
 *
 * This hook uses TanStack Query to manage the server state and provides automatic
 * caching, refetching, and background updates.
 *
 * @param id - The unique identifier of the organization unit to fetch
 * @param enabled - Whether the query should be enabled (default: true when id is provided)
 * @returns TanStack Query result object containing organization unit data, loading state, and error information
 *
 * @example
 * ```tsx
 * function OrganizationUnitDetails({ id }: { id: string }) {
 *   const { data, isLoading, error } = useGetOrganizationUnit(id);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{data?.name}</div>;
 * }
 * ```
 */
export default function useGetOrganizationUnit(
  id: string | undefined,
  enabled = true,
): UseQueryResult<OrganizationUnit> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<OrganizationUnit>({
    queryKey: [OrganizationUnitQueryKeys.ORGANIZATION_UNIT, id],
    queryFn: async (): Promise<OrganizationUnit> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: OrganizationUnit;
      } = await http.request({
        url: `${serverUrl}/organization-units/${encodeURIComponent(id!)}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: enabled && Boolean(id),
  });
}
