// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Stack, Typography} from '@wso2/oxygen-ui';
import type {JSX, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';

export interface SectionHeaderProps {
  title: string;
  count: number;
  icon: ReactNode;
  action?: ReactNode;
  comingSoon?: boolean;
}

export default function SectionHeader({
  title,
  count,
  icon,
  action = undefined,
  comingSoon = undefined,
}: SectionHeaderProps): JSX.Element {
  const {t} = useTranslation('design');
  return (
    <Stack direction="row" alignItems="center" mb={2}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{flex: 1}}>
        {icon}
        <Typography variant="h6" sx={{fontWeight: 600, fontSize: '1rem'}}>
          {title}
        </Typography>
        <Box
          sx={{
            px: 0.75,
            py: 0.1,
            bgcolor: 'action.selected',
            borderRadius: 10,
            minWidth: 22,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{fontSize: '0.7rem', fontWeight: 600, color: 'text.secondary'}}>
            {count}
          </Typography>
        </Box>
        {comingSoon && (
          <Box
            sx={{
              px: 1,
              py: 0.15,
              bgcolor: 'warning.light',
              borderRadius: 10,
              border: '1px solid',
              borderColor: 'warning.main',
            }}
          >
            <Typography
              variant="caption"
              sx={{fontSize: '0.65rem', fontWeight: 700, color: 'warning.dark', letterSpacing: '0.04em'}}
            >
              {t('common.section_header.badges.coming_soon.label', 'COMING SOON')}
            </Typography>
          </Box>
        )}
      </Stack>
      {action}
    </Stack>
  );
}
