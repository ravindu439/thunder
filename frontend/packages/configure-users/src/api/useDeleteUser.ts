// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import UserQueryKeys from '../constants/user-query-keys';
import deleteUser, {type HttpLike} from '../utils/deleteUserViaFlow';

/**
 * Custom hook to delete a user by ID.
 *
 * Deletion runs either through the native endpoint or through the configured administration flow,
 * selected by the `userDeletionFlow.mode` server configuration. The flow path additionally revokes
 * the user's grants and terminates their sessions before the record is removed.
 *
 * @returns TanStack Query mutation object for deleting users
 */
export default function useDeleteUser(): UseMutationResult<void, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('users');
  const {showToast} = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string): Promise<void> => {
      await deleteUser(http as unknown as HttpLike, getServerUrl(), userId);
    },
    onSuccess: (_data, userId) => {
      queryClient.removeQueries({queryKey: [UserQueryKeys.USER, userId]});
      queryClient.invalidateQueries({queryKey: [UserQueryKeys.USERS]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('delete.success'), 'success');
    },
  });
}
