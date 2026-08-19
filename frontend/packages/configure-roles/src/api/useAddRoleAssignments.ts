// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import RoleQueryKeys from '../constants/role-query-keys';
import type {RoleAssignment} from '../models/role';

export interface AddRoleAssignmentsVariables {
  roleId: string;
  assignments: RoleAssignment[];
}

/**
 * Custom React hook to add user or group assignments to a role.
 *
 * @returns TanStack Query mutation object for adding role assignments
 */
export default function useAddRoleAssignments(): UseMutationResult<void, Error, AddRoleAssignmentsVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('roles');
  const {showToast} = useToast();

  return useMutation<void, Error, AddRoleAssignmentsVariables>({
    mutationFn: async ({roleId, assignments}: AddRoleAssignmentsVariables): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/roles/${roleId}/assignments/add`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {assignments},
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_data, {roleId}) => {
      queryClient.invalidateQueries({queryKey: [RoleQueryKeys.ROLE_ASSIGNMENTS, roleId]}).catch(() => {
        /* noop */
      });
      showToast(t('assignments.add.success'), 'success');
    },
  });
}
