// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, FormLabel, Stack, Tooltip, Typography} from '@wso2/oxygen-ui';
import {type ChangeEvent, type JSX} from 'react';

const PRESET_COLORS = [
  {label: 'Indigo', value: '#4f46e5'},
  {label: 'Blue', value: '#2563eb'},
  {label: 'Cyan', value: '#0891b2'},
  {label: 'Teal', value: '#0d9488'},
  {label: 'Green', value: '#16a34a'},
  {label: 'Orange', value: '#ea580c'},
  {label: 'Red', value: '#dc2626'},
  {label: 'Pink', value: '#db2777'},
  {label: 'Purple', value: '#9333ea'},
  {label: 'Slate', value: '#475569'},
];

export interface ConfigureThemeColorProps {
  themeName: string;
  primaryColor: string;
  onPrimaryColorChange: (color: string) => void;
}

export default function ConfigureThemeColor({
  themeName,
  primaryColor,
  onPrimaryColorChange,
}: ConfigureThemeColorProps): JSX.Element {
  const isCustomColor = !PRESET_COLORS.some((c) => c.value === primaryColor);

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="column" spacing={1}>
        <Typography variant="h1">Pick a primary color</Typography>
        <Typography variant="body1" color="text.secondary">
          This sets the primary accent color for <strong>{themeName}</strong>. You can fine-tune everything in the theme
          builder after creating.
        </Typography>
      </Stack>

      <Stack direction="column" spacing={2}>
        <FormLabel>Primary color</FormLabel>
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1.5}}>
          {PRESET_COLORS.map((c) => (
            <Tooltip key={c.value} title={c.label}>
              <Box
                onClick={() => onPrimaryColorChange(c.value)}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  bgcolor: c.value,
                  cursor: 'pointer',
                  border: '3px solid',
                  borderColor: primaryColor === c.value ? 'text.primary' : 'transparent',
                  transition: 'border-color 0.15s, transform 0.1s',
                  '&:hover': {transform: 'scale(1.12)'},
                }}
              />
            </Tooltip>
          ))}

          {/* Custom color picker */}
          <Tooltip title="Custom color">
            <Box sx={{position: 'relative', width: 40, height: 40}}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  bgcolor: isCustomColor ? primaryColor : 'action.hover',
                  border: '3px solid',
                  borderColor: isCustomColor ? 'text.primary' : 'divider',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.15s',
                }}
              >
                {!isCustomColor && (
                  <Typography variant="caption" sx={{fontSize: '1rem', lineHeight: 1, pointerEvents: 'none'}}>
                    ＋
                  </Typography>
                )}
              </Box>
              <Box
                component="input"
                type="color"
                value={primaryColor}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onPrimaryColorChange(e.target.value)}
                sx={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%'}}
              />
            </Box>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
}
