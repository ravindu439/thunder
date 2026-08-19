// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {existsSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

/**
 * Returns the absolute path to the template directory used for scaffolding feature and package modules.
 *
 * @returns The absolute path to the template directory
 *
 * @example
 * const templateDir = getTemplateDir();
 * // Use templateDir to locate scaffolding templates
 *
 * @public
 */
export default function getTemplateDir(): string {
  // For the linked global package, find the package root by looking for package.json
  let currentDir = dirname(fileURLToPath(import.meta.url));

  // Go up directories until we find package.json. Use a platform-neutral termination
  // condition to avoid infinite loops on Windows where the root isn't '/'.

  while (true) {
    if (existsSync(join(currentDir, 'package.json'))) {
      break;
    }
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached filesystem root
      currentDir = '';
      break;
    }
    currentDir = parentDir;
  }

  // If we found package.json, templates should be in dist/templates or src/templates
  if (currentDir && existsSync(join(currentDir, 'package.json'))) {
    const distTemplates = join(currentDir, 'dist', 'templates');
    const srcTemplates = join(currentDir, 'src', 'templates');

    if (existsSync(distTemplates)) {
      return distTemplates;
    }
    if (existsSync(srcTemplates)) {
      return srcTemplates;
    }
  }

  // Fallback to current directory relative
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'templates');
}
