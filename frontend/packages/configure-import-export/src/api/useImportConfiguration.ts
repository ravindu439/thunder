// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {ImportRequest, ImportResponse} from '../models/import-configuration';

/**
 * Custom React hook to import Product resource configurations.
 *
 * Supports both dry-run and actual import through the same endpoint.
 *
 * @public
 */
export default function useImportConfiguration(): UseMutationResult<ImportResponse, Error, ImportRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useMutation<ImportResponse, Error, ImportRequest>({
    mutationFn: async (request: ImportRequest): Promise<ImportResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: ImportResponse;
      } = await http.request({
        url: `${serverUrl}/import`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: request,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
  });
}
