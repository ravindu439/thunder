// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {OrganizationUnitListResponse} from '../models/responses';

/**
 * Fetches a paginated list of child organization units for a given parent.
 *
 * This is a standalone API utility that can be used both by React Query hooks
 * and by imperative fetch calls (e.g. via queryClient.fetchQuery).
 *
 * @param http - The HTTP client from useThunderID
 * @param serverUrl - The base server URL
 * @param parentId - The ID of the parent organization unit
 * @param params - Pagination parameters
 * @param params.limit - Maximum number of records to return
 * @param params.offset - Number of records to skip
 * @returns The child organization unit list response
 */
export default async function fetchChildOrganizationUnits(
  http: {request: (...args: never[]) => Promise<{data: OrganizationUnitListResponse}>},
  serverUrl: string,
  parentId: string,
  params: {limit: number; offset: number},
): Promise<OrganizationUnitListResponse> {
  const queryParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  });

  const response: {data: OrganizationUnitListResponse} = await http.request({
    url: `${serverUrl}/organization-units/${encodeURIComponent(parentId)}/ous?${queryParams.toString()}`,
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  } as never);

  return response.data;
}
