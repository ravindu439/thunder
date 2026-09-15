// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {updateScimConnection} from './mock/scimConnectionsStore';
import ScimConnectionQueryKeys from '../constants/scim-query-keys';
import type {ScimAttributeMapping, ScimConnection} from '../models/scim-connection';

export interface ScimConnectionUpdateInput {
  name: string;
  description?: string;
  targetOuId: string;
  attributeMappings: ScimAttributeMapping[];
}

/**
 * Update a SCIM inbound connection's editable fields in the mock store. `coreUserType` and
 * `coreUserTypeId` are not updatable — see `updateScimConnection` in the mock store for why.
 */
export default function useUpdateScimConnection(
  id: string,
): UseMutationResult<ScimConnection, Error, ScimConnectionUpdateInput> {
  const queryClient = useQueryClient();
  return useMutation<ScimConnection, Error, ScimConnectionUpdateInput>({
    mutationFn: async (input: ScimConnectionUpdateInput): Promise<ScimConnection> => {
      const updated = updateScimConnection(id, input);
      if (!updated) {
        throw new Error(`SCIM connection ${id} not found`);
      }
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ScimConnectionQueryKeys.LIST]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient.invalidateQueries({queryKey: [ScimConnectionQueryKeys.DETAIL, id]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
