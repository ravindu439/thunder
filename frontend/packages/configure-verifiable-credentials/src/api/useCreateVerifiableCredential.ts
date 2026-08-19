// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import VerifiableCredentialQueryKeys from '../constants/vc-query-keys';
import type {CreateVerifiableCredentialRequest} from '../models/credential-requests';
import type {VerifiableCredential} from '../models/vc';

/**
 * Creates a new OpenID4VCI credential configuration.
 */
export default function useCreateVerifiableCredential(): UseMutationResult<
  VerifiableCredential,
  Error,
  CreateVerifiableCredentialRequest
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('verifiable-credentials');
  const {showToast} = useToast();

  return useMutation<VerifiableCredential, Error, CreateVerifiableCredentialRequest>({
    mutationFn: async (data: CreateVerifiableCredentialRequest): Promise<VerifiableCredential> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VerifiableCredential} = await http.request({
        url: `${serverUrl}/openid4vci/credential-configurations`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [VerifiableCredentialQueryKeys.VCS]}).catch(() => {
        /* noop */
      });
      showToast(t('create.success'), 'success');
    },
  });
}
