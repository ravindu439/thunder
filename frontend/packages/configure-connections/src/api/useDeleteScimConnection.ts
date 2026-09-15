// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {deleteScimConnection} from './mock/scimConnectionsStore';
import ScimConnectionQueryKeys from '../constants/scim-query-keys';

/** Delete a SCIM inbound connection from the mock store. */
export default function useDeleteScimConnection(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id: string): Promise<void> => {
      deleteScimConnection(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ScimConnectionQueryKeys.LIST]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
