// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ImportExportFileNames from '../constants/file-names';

/**
 * Returns the default configuration file name for the given product name.
 * e.g. "Awesome Product" → "awesome-product-config.yml"
 */
export default function getConfigFileName(productName: string): string {
  return ImportExportFileNames.CONFIG.replace('{{productName}}', productName.toLowerCase().replace(/\s+/g, '-'));
}
