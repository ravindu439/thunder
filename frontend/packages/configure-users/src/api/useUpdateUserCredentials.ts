// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';

export interface UpdateUserCredentialsVariables {
  userId: string;
  data: {
    credentials: Record<string, string>;
  };
}

export default function useUpdateUserCredentials(): UseMutationResult<void, Error, UpdateUserCredentialsVariables> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const {t} = useTranslation('users');
  const {showToast} = useToast();

  return useMutation<void, Error, UpdateUserCredentialsVariables>({
    mutationFn: async ({userId, data}: UpdateUserCredentialsVariables): Promise<void> => {
      const serverUrl: string = getServerUrl();

      await http.request({
        url: `${serverUrl}/users/${userId}/update-credentials`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: () => {
      showToast(t('updateCredentials.success'), 'success');
    },
  });
}
