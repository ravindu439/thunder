// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import GroupQueryKeys from '../constants/group-query-keys';
import type {Group} from '../models/group';

/**
 * Custom React hook to fetch a single group by ID.
 *
 * @param groupId - The ID of the group to fetch
 * @returns TanStack Query result object containing group data
 */
export default function useGetGroup(groupId: string): UseQueryResult<Group> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<Group>({
    queryKey: [GroupQueryKeys.GROUP, groupId],
    queryFn: async (): Promise<Group> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: Group;
      } = await http.request({
        url: `${serverUrl}/groups/${groupId}?include=display`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(groupId),
  });
}
