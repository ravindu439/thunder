// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {listScimConnections} from './mock/scimConnectionsStore';
import ScimConnectionQueryKeys from '../constants/scim-query-keys';
import type {ScimConnection} from '../models/scim-connection';

/**
 * List SCIM inbound connections. Reads the in-memory mock store — see
 * `api/mock/scimConnectionsStore.ts`. Shaped like a real TanStack Query list hook so swapping
 * in a real `GET /scim-connections` later only changes this function's body.
 */
export default function useScimConnections(): UseQueryResult<ScimConnection[]> {
  return useQuery<ScimConnection[]>({
    queryKey: [ScimConnectionQueryKeys.LIST],
    queryFn: async (): Promise<ScimConnection[]> => listScimConnections(),
  });
}
