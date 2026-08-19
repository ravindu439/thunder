// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {DefaultResourceServerConfigResponse, DefaultResourceServerValue} from '../models/resource-server';

// Updates the writable layer of the default resource server server-config section.
export default function useSetDefaultResourceServer(): UseMutationResult<
  DefaultResourceServerConfigResponse,
  Error,
  DefaultResourceServerValue
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();

  return useMutation<DefaultResourceServerConfigResponse, Error, DefaultResourceServerValue>({
    mutationFn: async (data): Promise<DefaultResourceServerConfigResponse> => {
      const serverUrl = getServerUrl();

      const response: {data: DefaultResourceServerConfigResponse} = await http.request({
        url: `${serverUrl}/server-config/${ResourceServerQueryKeys.DEFAULT_RESOURCE_SERVER}`,
        method: 'PUT',
        data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (data) => {
      // PUT returns the recomputed layers, so keep the read model in sync without a refetch.
      queryClient.setQueryData(
        [ResourceServerQueryKeys.SERVER_CONFIG, ResourceServerQueryKeys.DEFAULT_RESOURCE_SERVER],
        data,
      );
    },
  });
}
