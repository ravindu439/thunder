// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {CredentialOfferResponse} from '../models/vc';

/**
 * Generates an issuer-initiated credential offer (and its openid-credential-offer://
 * deep link) for a credential configuration, identified by its handle.
 */
export default function useCreateCredentialOffer(): UseMutationResult<CredentialOfferResponse, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useMutation<CredentialOfferResponse, Error, string>({
    mutationFn: async (handle: string): Promise<CredentialOfferResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {data: CredentialOfferResponse} = await http.request({
        url: `${serverUrl}/openid4vci/offer?credential_configuration_id=${encodeURIComponent(handle)}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
