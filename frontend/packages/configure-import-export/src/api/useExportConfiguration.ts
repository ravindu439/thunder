// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, type UseMutationResult} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import type {ExportRequest, JSONExportResponse} from '../models/export-configuration';

/**
 * Custom React hook to export Product resource configurations as JSON.
 *
 * This hook uses TanStack Query's useMutation to handle the export operation.
 * The export API returns a JSON response containing an array of files along with
 * export metadata and summary information.
 *
 * @returns TanStack Query mutation result object with mutate function, loading state, and error information
 *
 * @example
 * ```tsx
 * function ExportButton() {
 *   const { mutate, isPending, error } = useExportConfiguration();
 *
 *   const handleExport = () => {
 *     mutate(
 *       {
 *         applications: ["*"], // Export all applications
 *       },
 *       {
 *         onSuccess: (data) => {
 *           console.log(`Exported ${data.summary.totalFiles} files`);
 *           // Process exported files...
 *         },
 *         onError: (error) => {
 *           console.error('Export failed:', error);
 *         },
 *       }
 *     );
 *   };
 *
 *   return (
 *     <button onClick={handleExport} disabled={isPending}>
 *       {isPending ? 'Exporting...' : 'Export Configuration'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @public
 */
export default function useExportConfiguration(): UseMutationResult<JSONExportResponse, Error, ExportRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  return useMutation<JSONExportResponse, Error, ExportRequest>({
    mutationFn: async (request: ExportRequest): Promise<JSONExportResponse> => {
      const serverUrl: string = getServerUrl();

      const response: {
        data: JSONExportResponse;
      } = await http.request({
        url: `${serverUrl}/export`,
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
