// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import UserTypeQueryKeys from '../constants/userTypeQueryKeys';
import type {UserTypeListParams, UserTypeListResponse} from '../types/user-types';

/**
 * Custom React hook to fetch a paginated list of user types from the server.
 *
 * @param params - Optional pagination parameters
 * @param params.limit - Maximum number of records to return
 * @param params.offset - Number of records to skip for pagination
 * @returns TanStack Query result object containing user types list data, loading state, and error information
 */
export default function useGetUserTypes(params?: UserTypeListParams): UseQueryResult<UserTypeListResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {limit, offset} = params ?? {};

  return useQuery<UserTypeListResponse>({
    queryKey: [UserTypeQueryKeys.USER_TYPES, {limit, offset}],
    queryFn: async (): Promise<UserTypeListResponse> => {
      const serverUrl: string = getServerUrl();
      const queryParams: URLSearchParams = new URLSearchParams();

      if (limit !== undefined) {
        queryParams.append('limit', limit.toString());
      }
      if (offset !== undefined) {
        queryParams.append('offset', offset.toString());
      }
      queryParams.append('include', 'display');

      const queryString: string = queryParams.toString();
      const url = `${serverUrl}/user-types${queryString ? `?${queryString}` : ''}`;

      const response: {
        data: UserTypeListResponse;
      } = await http.request({
        url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
