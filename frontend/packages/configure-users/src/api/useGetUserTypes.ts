// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import UserQueryKeys from '../constants/user-query-keys';
import type {SchemaListParams, UserTypeListResponse} from '../models/users';

/**
 * Custom hook to fetch a list of user types.
 *
 * @param params - Optional query parameters for pagination
 * @returns TanStack Query result object containing user type list data, loading state, and error information
 */
export default function useGetUserTypes(params?: SchemaListParams): UseQueryResult<UserTypeListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit, offset} = params ?? {};

  return useQuery<UserTypeListResponse>({
    queryKey: [UserQueryKeys.USER_TYPES, {limit, offset}],
    queryFn: async (): Promise<UserTypeListResponse> => {
      const serverUrl: string = getServerUrl();
      const searchParams: URLSearchParams = new URLSearchParams();

      if (limit !== undefined) {
        searchParams.append('limit', String(limit));
      }
      if (offset !== undefined) {
        searchParams.append('offset', String(offset));
      }

      const queryString: string = searchParams.toString();

      const response: {
        data: UserTypeListResponse;
      } = await http.request({
        url: `${serverUrl}/user-types${queryString ? `?${queryString}` : ''}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
