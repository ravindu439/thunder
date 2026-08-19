// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import GroupQueryKeys from '../constants/group-query-keys';
import type {Group} from '../models/group';
import type {CreateGroupRequest} from '../models/requests';

/**
 * Custom React hook to create a new group.
 *
 * @returns TanStack Query mutation object for creating groups
 */
export default function useCreateGroup(): UseMutationResult<Group, Error, CreateGroupRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('groups');
  const {showToast} = useToast();

  return useMutation<Group, Error, CreateGroupRequest>({
    mutationFn: async (groupData: CreateGroupRequest): Promise<Group> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: Group;
      } = await http.request({
        url: `${serverUrl}/groups`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: groupData,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [GroupQueryKeys.GROUPS]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('create.success'), 'success');
    },
  });
}
