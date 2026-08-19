// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import RoleQueryKeys from '../constants/role-query-keys';
import type {UpdateRoleRequest} from '../models/requests';
import type {Role} from '../models/role';

export const ROLE_MUTATION_KEY = ['update-role'] as const;

export interface UpdateRoleVariables {
  roleId: string;
  data: UpdateRoleRequest;
}

/**
 * Custom React hook to update an existing role.
 *
 * @returns TanStack Query mutation object for updating roles
 */
export default function useUpdateRole(): UseMutationResult<Role, Error, UpdateRoleVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('roles');
  const {showToast} = useToast();

  return useMutation<Role, Error, UpdateRoleVariables>({
    mutationKey: ROLE_MUTATION_KEY,
    mutationFn: async ({roleId, data}: UpdateRoleVariables): Promise<Role> => {
      const serverUrl: string = getServerUrl();
      const response: {data: Role} = await http.request({
        url: `${serverUrl}/roles/${roleId}`,
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (data, {roleId}) => {
      queryClient.setQueryData<Role>([RoleQueryKeys.ROLE, roleId], (old) =>
        old ? {...old, name: data.name, description: data.description, permissions: data.permissions ?? []} : data,
      );
      queryClient.invalidateQueries({queryKey: [RoleQueryKeys.ROLE, roleId]}).catch(() => {
        /* noop */
      });
      queryClient.invalidateQueries({queryKey: [RoleQueryKeys.ROLES]}).catch(() => {
        /* noop */
      });
      showToast(t('update.success'), 'success');
    },
  });
}
