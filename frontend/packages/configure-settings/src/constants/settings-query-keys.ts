// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for the settings feature cache management.
 */
const SettingsQueryKeys = {
  /** Base key for all server-config section queries */
  SERVER_CONFIG: 'server-config',
  /** Name segment for the CORS section */
  CORS: 'cors',
} as const;

export default SettingsQueryKeys;
