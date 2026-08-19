// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import OrganizationUnitQueryKeys from '../constants/organization-unit-query-keys';
import type {OrganizationUnit} from '../models/organization-unit';
import type {UpdateOrganizationUnitRequest} from '../models/requests';

/**
 * Variables for the update organization unit mutation
 */
interface UpdateOrganizationUnitVariables {
  id: string;
  data: UpdateOrganizationUnitRequest;
}

/**
 * Custom hook to update an existing organization unit.
 *
 * @returns TanStack Query mutation object for updating organization units
 *
 * @example
 * ```tsx
 * function UpdateOUButton({ id }: { id: string }) {
 *   const updateOU = useUpdateOrganizationUnit();
 *
 *   const handleUpdate = (data: UpdateOrganizationUnitRequest) => {
 *     updateOU.mutate({ id, data }, {
 *       onSuccess: (ou) => {
 *         console.log('Organization unit updated:', ou);
 *       },
 *       onError: (error) => {
 *         console.error('Failed to update organization unit:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button onClick={() => handleUpdate(data)} disabled={updateOU.isPending}>
 *       {updateOU.isPending ? 'Updating...' : 'Update'}
 *     </button>
 *   );
 * }
 * ```
 */
export default function useUpdateOrganizationUnit(): UseMutationResult<
  OrganizationUnit,
  Error,
  UpdateOrganizationUnitVariables
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('organizationUnits');
  const {showToast} = useToast();

  return useMutation<OrganizationUnit, Error, UpdateOrganizationUnitVariables>({
    mutationFn: async ({id, data}: UpdateOrganizationUnitVariables): Promise<OrganizationUnit> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: OrganizationUnit;
      } = await http.request({
        url: `${serverUrl}/organization-units/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate and refetch organization units list and the specific unit after successful update
      queryClient.invalidateQueries({queryKey: [OrganizationUnitQueryKeys.ORGANIZATION_UNITS]}).catch(() => {
        // Ignore invalidation errors
      });
      queryClient
        .invalidateQueries({queryKey: [OrganizationUnitQueryKeys.ORGANIZATION_UNIT, variables.id]})
        .catch(() => {
          // Ignore invalidation errors
        });
      showToast(t('update.success'), 'success');
    },
  });
}
