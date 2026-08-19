// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import OrganizationUnitQueryKeys from '../constants/organization-unit-query-keys';
import type {OrganizationUnit} from '../models/organization-unit';
import type {CreateOrganizationUnitRequest} from '../models/requests';

/**
 * Custom hook to create a new organization unit.
 *
 * @returns TanStack Query mutation object for creating organization units
 *
 * @example
 * ```tsx
 * function CreateOUButton() {
 *   const createOU = useCreateOrganizationUnit();
 *
 *   const handleCreate = (data: CreateOrganizationUnitRequest) => {
 *     createOU.mutate(data, {
 *       onSuccess: (ou) => {
 *         console.log('Organization unit created:', ou);
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create organization unit:', error);
 *       }
 *     });
 *   };
 *
 *   return (
 *     <button onClick={() => handleCreate(data)} disabled={createOU.isPending}>
 *       {createOU.isPending ? 'Creating...' : 'Create'}
 *     </button>
 *   );
 * }
 * ```
 */
export default function useCreateOrganizationUnit(): UseMutationResult<
  OrganizationUnit,
  Error,
  CreateOrganizationUnitRequest
> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient: ReturnType<typeof useQueryClient> = useQueryClient();
  const {t} = useTranslation('organizationUnits');
  const {showToast} = useToast();

  return useMutation<OrganizationUnit, Error, CreateOrganizationUnitRequest>({
    mutationFn: async (data: CreateOrganizationUnitRequest): Promise<OrganizationUnit> => {
      const serverUrl: string = getServerUrl();
      const response: {
        data: OrganizationUnit;
      } = await http.request({
        url: `${serverUrl}/organization-units`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch organization units list after successful creation
      queryClient.invalidateQueries({queryKey: [OrganizationUnitQueryKeys.ORGANIZATION_UNITS]}).catch(() => {
        // Ignore invalidation errors
      });
      // Invalidate child OUs cache so tree view picks up the new child
      queryClient.invalidateQueries({queryKey: [OrganizationUnitQueryKeys.CHILD_ORGANIZATION_UNITS]}).catch(() => {
        // Ignore invalidation errors
      });
      showToast(t('create.success'), 'success');
    },
  });
}
