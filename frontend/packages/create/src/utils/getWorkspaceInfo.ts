// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {existsSync, readFileSync} from 'fs';
import {join, resolve, parse} from 'path';

/**
 * Detects project workspace structure and returns key paths and flags for CLI operations.
 *
 * @returns WorkspaceInfo object containing workspace status and key paths
 *
 * @example
 * const info = getWorkspaceInfo();
 * if (info.isThunderWorkspace) {
 *   // Use info.packagePath, info.appsPath, etc.
 * }
 *
 * @public
 */
export interface WorkspaceInfo {
  isThunderWorkspace: boolean;
  frontendPath: string | null;
  packagePath: string | null;
  appsPath: string | null;
  currentWorkingDirectory: string;
}

export default function getWorkspaceInfo(): WorkspaceInfo {
  const cwd = process.cwd();

  // Look for project workspace indicators by walking up the directory tree
  let currentDir = cwd;
  let thunderRoot: string | null = null;
  const fsRoot = parse(cwd).root;

  while (currentDir !== fsRoot && currentDir !== '.') {
    // Check for project root indicators - looking for a frontend directory with nx.json
    const frontendDir = join(currentDir, 'frontend');
    const frontendNxJson = join(frontendDir, 'nx.json');
    const frontendPackageJson = join(frontendDir, 'package.json');

    if (existsSync(frontendDir) && existsSync(frontendNxJson) && existsSync(frontendPackageJson)) {
      try {
        const parsed = JSON.parse(readFileSync(frontendPackageJson, 'utf8')) as unknown;
        const name =
          typeof parsed === 'object' && parsed !== null && 'name' in parsed
            ? (parsed as Record<string, unknown>)['name']
            : undefined;
        if (typeof name === 'string' && (name.includes('thunderid') || name.startsWith('@'))) {
          thunderRoot = currentDir;
          break;
        }
      } catch {
        // Continue searching
      }
    }

    // Also check if we're already in the frontend directory
    const packageJsonPath = join(currentDir, 'package.json');
    const nxJsonPath = join(currentDir, 'nx.json');

    if (existsSync(packageJsonPath) && existsSync(nxJsonPath)) {
      try {
        const parsed = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as unknown;
        const name =
          typeof parsed === 'object' && parsed !== null && 'name' in parsed
            ? (parsed as Record<string, unknown>)['name']
            : undefined;
        if (name === '@thunderid/frontend') {
          thunderRoot = resolve(currentDir, '..');
          break;
        }
      } catch {
        // Continue searching
      }
    }

    currentDir = resolve(currentDir, '..');
  }

  if (!thunderRoot) {
    return {
      isThunderWorkspace: false,
      frontendPath: null,
      packagePath: null,
      appsPath: null,
      currentWorkingDirectory: cwd,
    };
  }

  const frontendPath = join(thunderRoot, 'frontend');
  const packagePath = join(frontendPath, 'packages');
  const appsPath = join(frontendPath, 'apps');

  return {
    isThunderWorkspace: true,
    frontendPath,
    packagePath: existsSync(packagePath) ? packagePath : null,
    appsPath: existsSync(appsPath) ? appsPath : null,
    currentWorkingDirectory: cwd,
  };
}
