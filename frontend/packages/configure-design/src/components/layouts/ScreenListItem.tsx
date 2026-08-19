// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Card, CardContent, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';

export interface ScreenListItemProps {
  name: string;
  extendsBase?: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ScreenListItem({
  name,
  extendsBase = '',
  isSelected,
  onClick,
}: ScreenListItemProps): JSX.Element {
  const {t} = useTranslation('design');
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderColor: isSelected ? 'primary.main' : undefined,
        '&:hover': {borderColor: isSelected ? 'primary.main' : 'divider'},
      }}
    >
      <CardContent sx={{display: 'flex', alignItems: 'center', gap: 1, '&:last-child': {pb: 1.25}}}>
        {/* Screen icon bar */}
        <Box
          sx={{
            width: 28,
            height: 36,
            borderRadius: '4px',
            border: '1.5px solid',
            borderColor: isSelected ? 'primary.main' : 'divider',
            bgcolor: isSelected ? 'primary.main' : 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexShrink: 0,
            gap: '2px',
            p: '3px',
          }}
        >
          <Box
            sx={{height: 4, bgcolor: isSelected ? 'rgba(255,255,255,0.8)' : 'action.selected', borderRadius: '1px'}}
          />
          <Box sx={{flex: 1, bgcolor: isSelected ? 'rgba(255,255,255,0.25)' : 'grey.100', borderRadius: '1px'}} />
          <Box
            sx={{height: 3, bgcolor: isSelected ? 'rgba(255,255,255,0.5)' : 'action.selected', borderRadius: '1px'}}
          />
        </Box>

        <Box sx={{minWidth: 0}}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: '0.8125rem',
              color: isSelected ? 'primary.main' : 'text.primary',
              lineHeight: 1.3,
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.68rem',
              color: isSelected ? 'primary.main' : 'text.secondary',
              opacity: isSelected ? 0.75 : 1,
              display: 'block',
            }}
          >
            {extendsBase
              ? `extends ${extendsBase}`
              : t('layouts.builder.screen_list.base_screen.description', 'base screen')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
