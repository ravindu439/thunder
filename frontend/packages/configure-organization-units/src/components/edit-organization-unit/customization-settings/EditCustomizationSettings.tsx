// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Stack} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import AppearanceSection from './AppearanceSection';
import type {OrganizationUnit} from '../../../models/organization-unit';

/**
 * Props for the {@link EditCustomizationSettings} component.
 */
interface EditCustomizationSettingsProps {
  /**
   * The organization unit being edited
   */
  organizationUnit: OrganizationUnit;
  /**
   * Partial organization unit object containing edited fields
   */
  editedOU: Partial<OrganizationUnit>;
  /**
   * Callback function to handle field value changes
   * @param field - The organization unit field being updated
   * @param value - The new value for the field
   */
  onFieldChange: (field: keyof OrganizationUnit, value: unknown) => void;
}

/**
 * Customization tab content for the Organization Unit edit page.
 *
 * Displays sections for:
 * - Appearance (theme selection)
 *
 * @param props - Component props
 * @returns Customization settings sections wrapped in a Stack
 */
export default function EditCustomizationSettings({
  organizationUnit,
  editedOU,
  onFieldChange,
}: EditCustomizationSettingsProps): JSX.Element {
  return (
    <Stack spacing={3}>
      <AppearanceSection organizationUnit={organizationUnit} editedOU={editedOU} onFieldChange={onFieldChange} />
    </Stack>
  );
}
