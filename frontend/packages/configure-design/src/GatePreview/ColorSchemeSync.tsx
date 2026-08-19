// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useColorScheme} from '@wso2/oxygen-ui';
import {useEffect} from 'react';

/** Syncs the nested ThemeProvider's mode with the preview's colorScheme prop. */
export default function ColorSchemeSync({mode}: {mode: 'light' | 'dark'}): null {
  const {setMode} = useColorScheme();
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);
  return null;
}
