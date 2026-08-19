// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Card, CardContent, Typography} from '@wso2/oxygen-ui';
import type {JSX, ReactNode} from 'react';

export interface SectionCardProps {
  label: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export default function SectionCard({label, description, icon, isSelected, onClick}: SectionCardProps): JSX.Element {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderColor: isSelected ? 'primary.main' : 'divider',
        '&:hover': {borderColor: isSelected ? 'primary.main' : 'divider'},
      }}
    >
      <CardContent sx={{display: 'flex', alignItems: 'center', gap: 1.5, '&:last-child': {pb: 1.5}}}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: isSelected ? 'primary.main' : 'action.selected',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: isSelected ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {icon}
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
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              color: isSelected ? 'primary.main' : 'text.secondary',
              opacity: isSelected ? 0.75 : 1,
              display: 'block',
              lineHeight: 1.3,
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
