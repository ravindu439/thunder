// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Stack} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import ManageUsersSection from './ManageUsersSection';

/**
 * Props for the {@link EditUserSettings} component.
 */
interface EditUserSettingsProps {
  /**
   * The ID of the organization unit
   */
  organizationUnitId: string;
}

/**
 * Users tab content for the Organization Unit edit page.
 *
 * Displays sections for:
 * - Managing users belonging to the organization unit (DataGrid)
 *
 * @param props - Component props
 * @returns Users tab content
 */
export default function EditUserSettings({organizationUnitId}: EditUserSettingsProps): JSX.Element {
  return (
    <Stack spacing={3}>
      <ManageUsersSection organizationUnitId={organizationUnitId} />
    </Stack>
  );
}
