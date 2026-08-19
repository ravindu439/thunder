#!/usr/bin/env node

// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Cuts a new Docusaurus documentation version and snapshots the API spec for it.
 *
 * Usage:
 *   node scripts/cut-version.mjs <version>
 *
 * Example:
 *   node scripts/cut-version.mjs 1.1.0
 *
 * This script:
 *   1. Generates a versioned combined OpenAPI spec at static/api/<version>/combined.yaml
 *   2. Runs `docusaurus docs:version <version>` to snapshot the content/ and sidebars
 *
 * After running, commit all newly created files and update docusaurus.config.ts
 * to add the new version to the `versions` map if you need a custom label or path.
 */

import {execFileSync} from 'child_process';
import {existsSync, readdirSync, rmSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {createLogger} from '@thunderid/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = createLogger('cut-version');

const version = process.argv[2];

if (!version) {
  logger.error('Usage: node scripts/cut-version.mjs <version>');
  logger.error('Example: node scripts/cut-version.mjs 1.1.0');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+/.test(version)) {
  logger.error(`Invalid version format: "${version}". Expected semver (e.g. 1.1.0).`);
  process.exit(1);
}

const mergeScript = join(__dirname, 'merge-openapi-specs.mjs');

if (!existsSync(mergeScript)) {
  logger.error(`merge-openapi-specs.mjs not found at ${mergeScript}`);
  process.exit(1);
}

try {
  // Step 1: Generate the versioned combined API spec.
  logger.info(`📦 Generating combined API spec for version ${version}...`);
  execFileSync('node', [mergeScript, '--version-path', version], {stdio: 'inherit'});

  // Step 2: Cut the Docusaurus doc version (snapshots content/ and versioned_sidebars/).
  logger.info(`📸 Cutting Docusaurus doc version ${version}...`);
  execFileSync('pnpm', ['docusaurus', 'docs:version', version], {stdio: 'inherit'});

  // Step 3: docs:version copies the entire content/ tree, including the SDK sidebar.ts
  // files under content/sdks/*/. Those are never imported for versioned docs (the frozen
  // sidebar lives in versioned_sidebars/version-<v>-sidebars.json), so they're dead
  // clutter in the snapshot — drop them.
  const snapshotSdksDir = join(__dirname, '..', 'versioned_docs', `version-${version}`, 'sdks');
  if (existsSync(snapshotSdksDir)) {
    let removed = 0;
    for (const sdk of readdirSync(snapshotSdksDir)) {
      const sidebarFile = join(snapshotSdksDir, sdk, 'sidebar.ts');
      if (existsSync(sidebarFile)) {
        rmSync(sidebarFile);
        removed++;
      }
    }
    if (removed > 0) {
      logger.info(`🧹 Removed ${removed} copied SDK sidebar.ts file(s) from the snapshot.`);
    }
  }

  logger.info(`✅ Version ${version} cut successfully.`);
  logger.info(`   → API spec: static/api/${version}/combined.yaml`);
  logger.info(`   → Docs snapshot: versioned_docs/version-${version}/`);
  logger.info('');
  logger.info('Next steps:');
  logger.info(
    `  1. git add docs/static/api/${version}/ docs/versioned_docs/version-${version}/ docs/versioned_sidebars/ docs/versions.json`,
  );
  logger.info('  2. Update docs/docusaurus.config.ts → add the new version to the versions map if needed');
  logger.info('  3. git commit -m "chore: cut docs version ' + version + '"');
} catch (error) {
  logger.error('❌ Failed to cut version:', error.message);
  process.exit(1);
}
