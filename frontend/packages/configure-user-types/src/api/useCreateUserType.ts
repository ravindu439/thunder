// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import UserTypeQueryKeys from '../constants/userTypeQueryKeys';
import type {ApiUserType, CreateUserTypeRequest} from '../types/user-types';

/**
 * Custom React hook to create a new user type in the server.
 *
 * @returns TanStack Query mutation object for creating user types
 */
export default function useCreateUserType(): UseMutationResult<ApiUserType, Error, CreateUserTypeRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('userTypes');
  const {showToast} = useToast();

  return useMutation<ApiUserType, Error, CreateUserTypeRequest>({
    mutationFn: async (requestData: CreateUserTypeRequest): Promise<ApiUserType> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ApiUserType;
      } = await http.request({
        url: `${serverUrl}/user-types`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestData,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [UserTypeQueryKeys.USER_TYPES]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('create.success'), 'success');
    },
  });
}
