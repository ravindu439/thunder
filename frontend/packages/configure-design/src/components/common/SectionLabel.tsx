// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';

export interface SectionLabelProps {
  children: string;
}

/**
 * SectionLabel - A styled section heading label.
 * Used to group related configuration options within a config section.
 */
export default function SectionLabel({children}: SectionLabelProps): JSX.Element {
  return (
    <Typography
      variant="caption"
      sx={{
        display: 'block',
        fontWeight: 600,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'text.secondary',
        mt: 1.25,
        mb: 0.5,
      }}
    >
      {children}
    </Typography>
  );
}
