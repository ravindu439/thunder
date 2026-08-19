// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import GroupQueryKeys from '../constants/group-query-keys';
import type {Member} from '../models/group';

/**
 * Variables for the add group members mutation.
 */
export interface AddGroupMembersVariables {
  groupId: string;
  members: Member[];
}

/**
 * Custom React hook to add members to an existing group.
 *
 * @returns TanStack Query mutation object for adding group members
 */
export default function useAddGroupMembers(): UseMutationResult<void, Error, AddGroupMembersVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('groups');
  const {showToast} = useToast();

  return useMutation<void, Error, AddGroupMembersVariables>({
    mutationFn: async ({groupId, members}: AddGroupMembersVariables): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/groups/${groupId}/members/add`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {members},
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_data, {groupId}) => {
      queryClient.invalidateQueries({queryKey: [GroupQueryKeys.GROUP, groupId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [GroupQueryKeys.GROUPS]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [GroupQueryKeys.GROUP_MEMBERS, groupId]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('addMember.success'), 'success');
    },
  });
}
