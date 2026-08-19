// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import UserTypeQueryKeys from '../constants/userTypeQueryKeys';
import type {ApiUserType} from '../types/user-types';

/**
 * Custom React hook to fetch a single user type by ID from the server.
 *
 * @param id - The unique identifier of the user type to fetch
 * @returns TanStack Query result object containing user type data, loading state, and error information
 */
export default function useGetUserType(id?: string): UseQueryResult<ApiUserType> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<ApiUserType>({
    queryKey: [UserTypeQueryKeys.USER_TYPE, id],
    queryFn: async (): Promise<ApiUserType> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ApiUserType;
      } = await http.request({
        url: `${serverUrl}/user-types/${id}?include=display`,
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
