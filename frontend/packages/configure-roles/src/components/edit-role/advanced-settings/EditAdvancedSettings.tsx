// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SettingsCard} from '@thunderid/components';
import {Stack, Typography, Button} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';

interface EditAdvancedSettingsProps {
  onDeleteClick?: () => void;
}

/**
 * Advanced settings tab content for the Role edit page.
 * Displays the Danger Zone section.
 */
export default function EditAdvancedSettings({onDeleteClick = undefined}: EditAdvancedSettingsProps): JSX.Element {
  const {t} = useTranslation();

  return (
    <Stack spacing={3}>
      {onDeleteClick && (
        <SettingsCard
          title={t('roles:edit.general.sections.dangerZone.title')}
          description={t('roles:edit.general.sections.dangerZone.description')}
        >
          <Typography variant="h6" gutterBottom color="error">
            {t('roles:edit.general.sections.dangerZone.deleteRole')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
            {t('roles:edit.general.sections.dangerZone.deleteRoleDescription')}
          </Typography>
          <Button variant="contained" color="error" onClick={onDeleteClick}>
            {t('common:actions.delete')}
          </Button>
        </SettingsCard>
      )}
    </Stack>
  );
}
