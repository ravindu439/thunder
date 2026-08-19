// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Query key constants for import-export feature cache management.
 */
const ImportExportQueryKeys = {
  /**
   * Base key for all export-related queries
   */
  EXPORT: 'export',
  /**
   * Base key for all import-related queries
   */
  IMPORT: 'import',
} as const;

export default ImportExportQueryKeys;
