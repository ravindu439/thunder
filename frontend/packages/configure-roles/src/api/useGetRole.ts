// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import RoleQueryKeys from '../constants/role-query-keys';
import type {Role} from '../models/role';

/**
 * Custom React hook to fetch a single role by ID.
 *
 * @param roleId - The role ID to fetch
 * @returns TanStack Query result object containing role data
 */
export default function useGetRole(roleId: string): UseQueryResult<Role> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<Role>({
    queryKey: [RoleQueryKeys.ROLE, roleId],
    queryFn: async (): Promise<Role> => {
      const serverUrl: string = getServerUrl();

      const response: {data: Role} = await http.request({
        url: `${serverUrl}/roles/${roleId}?include=display`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    enabled: !!roleId,
  });
}
