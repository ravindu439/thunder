// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import ConnectionQueryKeys from '../constants/query-keys';
import type {ConnectionResponse} from '../models/connection';
import {ConnectionTypes} from '../models/connection';
import type {TrustedIssuer, TrustedIssuerFormData} from '../models/trusted-issuer';
import mapConnectionToTrustedIssuer from '../utils/mapConnectionToTrustedIssuer';

/**
 * Update a trusted issuer (PUT /connections/oidc/{id}).
 *
 * Failures are not toasted here — the caller surfaces them inline next to the name field
 * (409 duplicate name) or next to the save action (any other failure).
 *
 * @example
 * ```tsx
 * const updateTrustedIssuer = useUpdateTrustedIssuer(id);
 * updateTrustedIssuer.mutate({name, issuer, jwksEndpoint, idJagEnabled: true});
 * ```
 *
 * @public
 */
export default function useUpdateTrustedIssuer(
  id: string,
): UseMutationResult<TrustedIssuer, Error, TrustedIssuerFormData> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation();
  const {showToast} = useToast();

  return useMutation<TrustedIssuer, Error, TrustedIssuerFormData>({
    mutationFn: async (data: TrustedIssuerFormData): Promise<TrustedIssuer> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: ConnectionResponse;
      } = await http.request({
        url: `${serverUrl}/connections/${ConnectionTypes.OIDC}/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return mapConnectionToTrustedIssuer(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ConnectionQueryKeys.CONNECTIONS]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [ConnectionQueryKeys.TRUSTED_ISSUER, id]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient
        .invalidateQueries({queryKey: [ConnectionQueryKeys.CONNECTION_INSTANCES, ConnectionTypes.OIDC]})
        .catch(() => {
          // Ignore invalidation errors
        });
      showToast(t('trustedIssuers:update.success', 'Trusted issuer updated successfully.'), 'success');
    },
  });
}
