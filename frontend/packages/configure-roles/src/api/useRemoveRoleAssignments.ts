// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import RoleQueryKeys from '../constants/role-query-keys';
import type {RoleAssignment} from '../models/role';

export interface RemoveRoleAssignmentsVariables {
  roleId: string;
  assignments: RoleAssignment[];
}

/**
 * Custom React hook to remove user or group assignments from a role.
 *
 * @returns TanStack Query mutation object for removing role assignments
 */
export default function useRemoveRoleAssignments(): UseMutationResult<void, Error, RemoveRoleAssignmentsVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('roles');
  const {showToast} = useToast();

  return useMutation<void, Error, RemoveRoleAssignmentsVariables>({
    mutationFn: async ({roleId, assignments}: RemoveRoleAssignmentsVariables): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/roles/${roleId}/assignments/remove`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {assignments},
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_data, {roleId}) => {
      queryClient.invalidateQueries({queryKey: [RoleQueryKeys.ROLE_ASSIGNMENTS, roleId]}).catch(() => {
        /* noop */
      });
      showToast(t('assignments.remove.success'), 'success');
    },
  });
}
