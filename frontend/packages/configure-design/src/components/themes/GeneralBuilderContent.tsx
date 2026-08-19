// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {Theme} from '@thunderid/design';
import {MenuItem, Select, Stack, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import ConfigCard from '../common/ConfigCard';

export interface GeneralBuilderContentProps {
  draft: Theme;
  onUpdate: (updater: (d: Theme) => void) => void;
}

/**
 * GeneralBuilderContent - Theme builder section for internationalization settings.
 * Configures text direction (LTR/RTL).
 */
export default function GeneralBuilderContent({draft, onUpdate}: GeneralBuilderContentProps): JSX.Element {
  const {t} = useTranslation('design');
  return (
    <ConfigCard title={t('themes.forms.general_builder.internationalization.title', 'Internationalization')}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{py: 0.75}}>
        <Typography variant="body2" sx={{fontWeight: 500, fontSize: '0.875rem'}}>
          {t('themes.forms.general_builder.fields.text_direction.label', 'Text direction')}
        </Typography>
        <Select
          value={draft.direction ?? 'ltr'}
          onChange={(e) =>
            onUpdate((d) => {
              Object.assign(d, {direction: String(e.target.value)});
            })
          }
          size="small"
          sx={{fontSize: '0.8125rem', height: 36, minWidth: 90}}
        >
          <MenuItem value="ltr" sx={{fontSize: '0.8125rem'}}>
            {t('themes.forms.general_builder.fields.text_direction.options.ltr.label', 'LTR')}
          </MenuItem>
          <MenuItem value="rtl" sx={{fontSize: '0.8125rem'}}>
            {t('themes.forms.general_builder.fields.text_direction.options.rtl.label', 'RTL')}
          </MenuItem>
        </Select>
      </Stack>
    </ConfigCard>
  );
}
