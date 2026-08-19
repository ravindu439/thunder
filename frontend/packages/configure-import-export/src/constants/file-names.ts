// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * File name template constants for import/export.
 * The {{productName}} placeholder is replaced at runtime via the utility functions.
 */
const ImportExportFileNames = {
  CONFIG: '{{productName}}-config.yml',
  ENV: '{{productName}}-environment.env',
} as const;

export default ImportExportFileNames;
