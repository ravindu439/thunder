// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ImportExportFileNames from '../constants/file-names';

/**
 * Returns the default environment variables file name for the given product name.
 * e.g. "Awesome Product" → "awesome-product-environment.env"
 */
export default function getEnvFileName(productName: string): string {
  return ImportExportFileNames.ENV.replace('{{productName}}', productName.toLowerCase().replace(/\s+/g, '-'));
}
