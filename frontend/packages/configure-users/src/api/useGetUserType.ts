// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import UserQueryKeys from '../constants/user-query-keys';
import type {ApiUserType} from '../models/users';

/**
 * Custom hook to fetch a single user type by ID.
 *
 * @param id - The ID of the user type to fetch
 * @returns TanStack Query result object containing user type data, loading state, and error information
 */
export default function useGetUserType(id?: string): UseQueryResult<ApiUserType> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ApiUserType>({
    queryKey: [UserQueryKeys.USER_TYPE, id],
    queryFn: async (): Promise<ApiUserType> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ApiUserType;
      } = await http.request({
        url: `${serverUrl}/user-types/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: Boolean(id),
  });
}
