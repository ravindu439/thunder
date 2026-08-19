// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import fetchChildOrganizationUnits from './fetchChildOrganizationUnits';
import OrganizationUnitQueryKeys from '../constants/organization-unit-query-keys';
import type {OrganizationUnitListParams} from '../models/requests';
import type {OrganizationUnitListResponse} from '../models/responses';

/**
 * Custom React hook to fetch child organization units of a specific organization unit.
 *
 * This hook uses TanStack Query to manage the server state and provides automatic
 * caching, refetching, and background updates.
 *
 * @param parentId - The ID of the parent organization unit
 * @param params - Optional pagination parameters
 * @param params.limit - Maximum number of records to return (default: 30)
 * @param params.offset - Number of records to skip for pagination (default: 0)
 * @returns TanStack Query result object containing child organization units list data
 *
 * @example
 * ```tsx
 * function ChildOUsList({ parentId }: { parentId: string }) {
 *   const { data, isLoading, error } = useGetChildOrganizationUnits(parentId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.organizationUnits.map((ou) => (
 *         <li key={ou.id}>{ou.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export default function useGetChildOrganizationUnits(
  parentId: string | undefined,
  params?: OrganizationUnitListParams,
): UseQueryResult<OrganizationUnitListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit = 30, offset = 0} = params ?? {};

  return useQuery<OrganizationUnitListResponse>({
    queryKey: [OrganizationUnitQueryKeys.CHILD_ORGANIZATION_UNITS, parentId, {limit, offset}],
    queryFn: async (): Promise<OrganizationUnitListResponse> =>
      fetchChildOrganizationUnits(http, getServerUrl(), parentId!, {limit, offset}),
    enabled: Boolean(parentId),
  });
}
