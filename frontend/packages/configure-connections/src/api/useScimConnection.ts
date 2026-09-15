// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQuery, type UseQueryResult} from '@tanstack/react-query';
import {getScimConnection} from './mock/scimConnectionsStore';
import ScimConnectionQueryKeys from '../constants/scim-query-keys';
import type {ScimConnection} from '../models/scim-connection';

/** Fetch a single SCIM inbound connection by id from the mock store. */
export default function useScimConnection(id: string | undefined): UseQueryResult<ScimConnection> {
  return useQuery<ScimConnection>({
    queryKey: [ScimConnectionQueryKeys.DETAIL, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<ScimConnection> => {
      const found = id ? getScimConnection(id) : undefined;
      if (!found) {
        throw new Error(`SCIM connection ${String(id)} not found`);
      }
      return found;
    },
  });
}
