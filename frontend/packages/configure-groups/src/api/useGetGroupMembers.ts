// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import GroupQueryKeys from '../constants/group-query-keys';
import type {MemberListResponse} from '../models/group';
import type {GroupListParams} from '../models/requests';

/**
 * Custom React hook to fetch members of a specific group.
 *
 * @param groupId - The ID of the group
 * @param params - Optional pagination parameters
 * @returns TanStack Query result object containing group members data
 */
export default function useGetGroupMembers(
  groupId: string | undefined,
  params?: GroupListParams,
): UseQueryResult<MemberListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit = 30, offset = 0} = params ?? {};

  return useQuery<MemberListResponse>({
    queryKey: [GroupQueryKeys.GROUP_MEMBERS, groupId, {limit, offset}],
    queryFn: async (): Promise<MemberListResponse> => {
      const serverUrl: string = getServerUrl();
      const queryParams: URLSearchParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        include: 'display',
      });

      const response: {
        data: MemberListResponse;
      } = await http.request({
        url: `${serverUrl}/groups/${groupId}/members?${queryParams.toString()}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(groupId),
  });
}
