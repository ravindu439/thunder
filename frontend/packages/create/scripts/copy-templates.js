#!/usr/bin/env node

// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @thunderid/copyright-header, no-undef */

import {cpSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLogger} from '@thunderid/logger';

const logger = createLogger();

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');

const srcTemplates = join(packageRoot, 'src', 'templates');
const distTemplates = join(packageRoot, 'dist', 'templates');

try {
  cpSync(srcTemplates, distTemplates, {recursive: true});
  logger.info('✓ Templates copied successfully');
} catch (error) {
  logger.error('✗ Failed to copy templates:', {error: error instanceof Error ? error.message : String(error)});
  process.exit(1);
}
