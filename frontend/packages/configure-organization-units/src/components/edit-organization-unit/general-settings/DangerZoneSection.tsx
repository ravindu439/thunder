// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SettingsCard} from '@thunderid/components';
import {Typography, Button} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';

/**
 * Props for the {@link DangerZoneSection} component.
 */
interface DangerZoneSectionProps {
  /**
   * Callback function to open the delete confirmation dialog
   */
  onDeleteClick: () => void;
}

/**
 * Section component displaying the danger zone with destructive actions.
 *
 * Displays a delete button for permanently removing the organization unit.
 *
 * @param props - Component props
 * @returns Danger zone UI within a Paper
 */
export default function DangerZoneSection({onDeleteClick}: DangerZoneSectionProps): JSX.Element {
  const {t} = useTranslation();

  return (
    <SettingsCard
      title={t('organizationUnits:edit.general.sections.dangerZone.title')}
      description={t('organizationUnits:edit.general.sections.dangerZone.description')}
    >
      <Typography variant="h6" gutterBottom color="error">
        {t('organizationUnits:edit.general.sections.dangerZone.deleteOU.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
        {t('organizationUnits:edit.general.sections.dangerZone.deleteOU.description')}
      </Typography>
      <Button variant="contained" color="error" onClick={onDeleteClick}>
        {t('organizationUnits:edit.general.dangerZone.delete.button.label')}
      </Button>
    </SettingsCard>
  );
}
