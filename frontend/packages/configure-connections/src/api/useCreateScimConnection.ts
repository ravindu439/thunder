// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {createScimConnection} from './mock/scimConnectionsStore';
import ScimConnectionQueryKeys from '../constants/scim-query-keys';
import type {ScimConnection, ScimConnectionInput} from '../models/scim-connection';

/**
 * Create a SCIM inbound connection in the mock store. The generated `baseUrl` uses the real
 * configured server URL (the same one every other API hook in this package targets) with the
 * backend's actual SCIM 2.0 mount path (`backend/internal/scim`'s `/scim/v2`), so the demo
 * displays a base URL that would work if the create endpoint were real.
 */
export default function useCreateScimConnection(): UseMutationResult<ScimConnection, Error, ScimConnectionInput> {
  const queryClient = useQueryClient();
  const {getServerUrl} = useConfig();
  return useMutation<ScimConnection, Error, ScimConnectionInput>({
    mutationFn: async (input: ScimConnectionInput): Promise<ScimConnection> =>
      createScimConnection(input, `${getServerUrl()}/scim/v2`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [ScimConnectionQueryKeys.LIST]}).catch(() => {
        // Ignore invalidation errors
      });
    },
  });
}
