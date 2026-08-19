// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import DesignQueryKeys from '../constants/design-query-keys';
import type {DesignResolveResponse} from '../models/responses';

type DesignResolveType = 'APP' | 'OU';

interface DesignResolveParams {
  type: DesignResolveType;
  id: string;
}

/**
 * Custom hook to resolve design configuration by type and ID from the server.
 * Uses the /design/resolve endpoint to fetch the merged theme and layout
 * based on application or organizational unit.
 *
 * @param params - Object containing type ('APP' or 'OU') and id of the entity
 * @param options - Optional React Query configuration options
 * @returns TanStack Query result object with resolved design data
 */
export default function useGetDesignResolve(
  params: DesignResolveParams,
  options?: {enabled?: boolean},
): UseQueryResult<DesignResolveResponse> {
  const {getServerUrl} = useConfig();

  const isEnabled = options?.enabled ?? Boolean(params?.type && params?.id && params.id.trim().length > 0);

  return useQuery<DesignResolveResponse>({
    queryKey: [DesignQueryKeys.DESIGN_RESOLVE, params.type, params.id],
    queryFn: async (): Promise<DesignResolveResponse> => {
      const serverUrl: string = getServerUrl();
      const queryParams = new URLSearchParams({
        type: params.type,
        id: params.id,
      });

      const requestUrl = `${serverUrl}/design/resolve?${queryParams.toString()}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<DesignResolveResponse>;
    },
    enabled: isEnabled,
    retry: false,
  });
}
