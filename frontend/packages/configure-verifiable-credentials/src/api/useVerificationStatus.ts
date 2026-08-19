// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {VerificationStatusResponse} from '../models/vp';

const TERMINAL_STATUSES: ReadonlySet<string> = new Set(['COMPLETED', 'FAILED', 'EXPIRED']);

/**
 * Polls the status of an OpenID4VP verification transaction until it reaches a
 * terminal state. Disabled when txnId is null.
 */
export default function useVerificationStatus(txnId: string | null): UseQueryResult<VerificationStatusResponse> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useQuery<VerificationStatusResponse>({
    queryKey: ['openid4vp-status', txnId],
    enabled: txnId !== null,
    refetchInterval: (query): number | false =>
      query.state.data && TERMINAL_STATUSES.has(query.state.data.status) ? false : 2000,
    queryFn: async (): Promise<VerificationStatusResponse> => {
      const serverUrl: string = getServerUrl();
      const response: {data: VerificationStatusResponse} = await http.request({
        url: `${serverUrl}/openid4vp/status/${encodeURIComponent(txnId ?? '')}`,
        method: 'GET',
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
