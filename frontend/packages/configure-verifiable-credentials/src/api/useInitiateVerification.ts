// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {InitiateVerificationResponse} from '../models/vp';

/**
 * Initiates an OpenID4VP verification transaction for a presentation definition
 * (identified by its handle) and returns the wallet deep link to scan.
 */
export default function useInitiateVerification(): UseMutationResult<InitiateVerificationResponse, Error, string> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useMutation<InitiateVerificationResponse, Error, string>({
    mutationFn: async (handle: string): Promise<InitiateVerificationResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {data: InitiateVerificationResponse} = await http.request({
        url: `${serverUrl}/openid4vp/initiate`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: {definition_id: handle, rp_id: 'console'},
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
