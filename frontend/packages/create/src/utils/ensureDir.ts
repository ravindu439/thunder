// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {mkdirSync, existsSync} from 'fs';

/**
 * Ensures that the specified directory exists. If it does not exist, it will be created recursively.
 *
 * @param dirPath - The path of the directory to ensure exists
 *
 * @example
 * ensureDir('/path/to/dir');
 * // Creates the directory if it does not exist
 *
 * @public
 */
export default function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true});
  }
}
