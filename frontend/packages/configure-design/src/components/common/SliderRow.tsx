// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Slider, Stack, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';

export interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}

/**
 * SliderRow - A labeled slider control with value display.
 * Used for numeric configuration options like padding, spacing, etc.
 */
export default function SliderRow({label, value, min, max, unit = 'px', onChange}: SliderRowProps): JSX.Element {
  return (
    <Box sx={{mb: 0.5}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.75rem'}}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{fontFamily: 'monospace', fontSize: '0.7rem', color: 'text.primary'}}>
          {value}
          {unit}
        </Typography>
      </Stack>
      <Slider size="small" min={min} max={max} step={1} value={value} onChange={(_, v) => onChange(v)} sx={{py: 0.5}} />
    </Box>
  );
}
