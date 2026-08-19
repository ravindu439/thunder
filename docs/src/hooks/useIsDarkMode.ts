// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useColorScheme} from '@wso2/oxygen-ui';

/**
 * Hook that resolves whether dark mode is active, correctly handling
 * the "system" mode where `mode` returns `'system'` instead of `'light'`/`'dark'`.
 * In that case, `systemMode` provides the OS-resolved value.
 */
export default function useIsDarkMode(): boolean {
  const {mode, systemMode} = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  return resolvedMode === 'dark';
}
