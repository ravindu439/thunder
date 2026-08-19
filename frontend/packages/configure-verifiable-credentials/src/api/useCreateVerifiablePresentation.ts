// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import VerifiablePresentationQueryKeys from '../constants/vp-query-keys';
import type {CreateVerifiablePresentationRequest} from '../models/presentation-requests';
import type {VerifiablePresentation} from '../models/vp';

/**
 * Creates a new OpenID4VP presentation definition.
 */
export default function useCreateVerifiablePresentation(): UseMutationResult<
  VerifiablePresentation,
  Error,
  CreateVerifiablePresentationRequest
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('verifiable-presentations');
  const {showToast} = useToast();

  return useMutation<VerifiablePresentation, Error, CreateVerifiablePresentationRequest>({
    mutationFn: async (data: CreateVerifiablePresentationRequest): Promise<VerifiablePresentation> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VerifiablePresentation} = await http.request({
        url: `${serverUrl}/openid4vp/presentation-definitions`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [VerifiablePresentationQueryKeys.VPS]}).catch(() => {
        /* noop */
      });
      showToast(t('create.success'), 'success');
    },
  });
}
