// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import VerifiablePresentationQueryKeys from '../constants/vp-query-keys';

/**
 * Deletes an OpenID4VP presentation definition by id.
 */
export default function useDeleteVerifiablePresentation(): UseMutationResult<void, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('verifiable-presentations');
  const {showToast} = useToast();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      const serverUrl: string = getServerUrl();
      await http.request({
        url: `${serverUrl}/openid4vp/presentation-definitions/${id}`,
        method: 'DELETE',
      } as unknown as Parameters<typeof http.request>[0]);
    },
    onSuccess: (_result, id: string) => {
      queryClient.removeQueries({queryKey: [VerifiablePresentationQueryKeys.VP, id]});
      queryClient.invalidateQueries({queryKey: [VerifiablePresentationQueryKeys.VPS]}).catch(() => {
        /* noop */
      });
      showToast(t('delete.success'), 'success');
    },
  });
}
