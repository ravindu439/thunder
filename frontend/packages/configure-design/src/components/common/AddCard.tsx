// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Typography} from '@wso2/oxygen-ui';
import {Plus} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';

export interface AddCardProps {
  label: string;
  onClick: () => void;
}

export default function AddCard({label, onClick}: AddCardProps): JSX.Element {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        borderRadius: 1,
        border: '1.5px dashed',
        borderColor: 'divider',
        overflow: 'hidden',
        aspectRatio: '4/3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        color: 'text.disabled',
        transition: 'all 0.18s ease',
        '&:hover': {
          borderColor: 'primary.main',
          color: 'primary.main',
          bgcolor: 'primary.50',
        },
      }}
    >
      <Plus size={20} />
      <Typography variant="caption" sx={{fontSize: '0.75rem', fontWeight: 500}}>
        {label}
      </Typography>
    </Box>
  );
}
