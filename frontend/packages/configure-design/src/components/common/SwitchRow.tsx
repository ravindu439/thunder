// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Stack, Switch, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';

export interface SwitchRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

/**
 * SwitchRow - A labeled toggle switch control.
 * Used for boolean configuration options.
 */
export default function SwitchRow({label, value, onChange}: SwitchRowProps): JSX.Element {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{py: 0.5}}>
      <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.75rem'}}>
        {label}
      </Typography>
      <Switch checked={value} onChange={(e) => onChange((e.target as HTMLInputElement).checked)} size="small" />
    </Stack>
  );
}
