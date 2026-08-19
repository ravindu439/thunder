// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {MenuItem, Select, Stack, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';

export interface SelectRowProps {
  label: string;
  value: string;
  options: {value: string; label: string}[];
  onChange: (v: string) => void;
}

/**
 * SelectRow - A labeled dropdown select control.
 * Used for enumerated configuration options.
 */
export default function SelectRow({label, value, options, onChange}: SelectRowProps): JSX.Element {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{py: 0.5}}>
      <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.75rem'}}>
        {label}
      </Typography>
      <Select
        value={value}
        onChange={(e) => onChange(String(e.target.value))}
        size="small"
        sx={{fontSize: '0.75rem', height: 28, minWidth: 90}}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={{fontSize: '0.75rem'}}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
