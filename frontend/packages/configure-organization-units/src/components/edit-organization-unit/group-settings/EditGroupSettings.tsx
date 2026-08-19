// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Stack} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import ManageGroupsSection from './ManageGroupsSection';

/**
 * Props for the {@link EditGroupSettings} component.
 */
interface EditGroupSettingsProps {
  /**
   * The ID of the organization unit
   */
  organizationUnitId: string;
}

/**
 * Groups tab content for the Organization Unit edit page.
 *
 * Displays sections for:
 * - Managing groups belonging to the organization unit (DataGrid)
 *
 * @param props - Component props
 * @returns Groups tab content
 */
export default function EditGroupSettings({organizationUnitId}: EditGroupSettingsProps): JSX.Element {
  return (
    <Stack spacing={3}>
      <ManageGroupsSection organizationUnitId={organizationUnitId} />
    </Stack>
  );
}
