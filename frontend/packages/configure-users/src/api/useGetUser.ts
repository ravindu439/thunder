// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {User} from '@thunderid/types';
import UserQueryKeys from '../constants/user-query-keys';

/**
 * Custom hook to fetch a single user by ID.
 *
 * @param userId - The ID of the user to fetch
 * @returns TanStack Query result object containing user data, loading state, and error information
 */
export default function useGetUser(userId: string | undefined): UseQueryResult<User> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<User>({
    queryKey: [UserQueryKeys.USER, userId],
    queryFn: async (): Promise<User> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: User;
      } = await http.request({
        url: `${serverUrl}/users/${userId}?include=display`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(userId),
  });
}
