// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import UserTypeQueryKeys from '../constants/userTypeQueryKeys';
import type {ApiUserType, UpdateUserTypeRequest} from '../types/user-types';

/**
 * Variables for the {@link useUpdateUserType} mutation.
 */
export interface UpdateUserTypeVariables {
  /**
   * The unique identifier of the user type to update
   */
  userTypeId: string;
  /**
   * The updated user type data
   */
  data: UpdateUserTypeRequest;
}

/**
 * Custom React hook to update an existing user type in the server.
 *
 * @returns TanStack Query mutation object for updating user types
 */
export default function useUpdateUserType(): UseMutationResult<ApiUserType, Error, UpdateUserTypeVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('userTypes');
  const {showToast} = useToast();

  return useMutation<ApiUserType, Error, UpdateUserTypeVariables>({
    mutationFn: async ({userTypeId, data}: UpdateUserTypeVariables): Promise<ApiUserType> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ApiUserType;
      } = await http.request({
        url: `${serverUrl}/user-types/${userTypeId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({queryKey: [UserTypeQueryKeys.USER_TYPE, variables.userTypeId]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [UserTypeQueryKeys.USER_TYPES]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('update.success'), 'success');
    },
  });
}
