// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useColorScheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { DarkModeRounded, LightModeRounded, Monitor } from '@mui/icons-material';

type Mode = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const nextMode = (mode: Mode): Mode => {
    return mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
  };

  const currentMode: Mode = mode;

  const ColorModeIcon = () => {
    switch (currentMode) {
      case 'light':
        return <LightModeRounded />;
      case 'dark':
        return <DarkModeRounded />;
      default:
        return <Monitor />;
    }
  };

  return (
    <Button variant="outlined" onClick={() => setMode(nextMode(currentMode))}>
      <ColorModeIcon />
    </Button>
  );
};
