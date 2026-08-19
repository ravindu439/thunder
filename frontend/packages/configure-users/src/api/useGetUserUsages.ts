// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import UserQueryKeys from '../constants/user-query-keys';
import type {UserUsagesResponse} from '../models/users';

/**
 * Custom hook to fetch resources that reference a user, such as agents that list the user
 * as their owner. Used to populate the pre-delete confirmation dialog.
 *
 * @param userId - The unique identifier of the user
 * @param enabled - Whether the query should run (default true)
 * @returns TanStack Query result with user usages data
 */
export default function useGetUserUsages(userId: string | null, enabled = true): UseQueryResult<UserUsagesResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<UserUsagesResponse>({
    queryKey: [UserQueryKeys.USER_USAGES, userId],
    queryFn: async (): Promise<UserUsagesResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {data: UserUsagesResponse} = await http.request({
        url: `${serverUrl}/users/${encodeURIComponent(userId!)}/usages`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(userId) && enabled,
  });
}
