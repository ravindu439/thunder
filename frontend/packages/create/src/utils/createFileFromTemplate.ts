// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {statSync, chmodSync, existsSync, mkdirSync, writeFileSync} from 'fs';
import {dirname} from 'path';
import {createLogger} from '@thunderid/logger';
import renderTemplateFile from './renderTemplateFile';
import type {TemplateContext} from '../models/templates';

const logger = createLogger();

/**
 * Renders a single Handlebars template file and writes the output to the specified target file.
 *
 * @param templatePath - Path to the Handlebars template file
 * @param targetPath - Path to write the rendered output file
 * @param context - Data context for template rendering
 *
 * @example
 * createFileFromTemplate('template.hbs', 'output.ts', { name: 'Feature' });
 *
 * @public
 */
export default function createFileFromTemplate(
  templatePath: string,
  outputPath: string,
  context: TemplateContext,
): void {
  const content = renderTemplateFile(templatePath, context);

  // Ensure the directory exists
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true});
  }

  writeFileSync(outputPath, content, 'utf8');
  try {
    const templateStats = statSync(templatePath);
    const mode = templateStats.mode & 0o777;
    chmodSync(outputPath, mode);
  } catch (err) {
    logger.warn(`Could not preserve file permissions for ${outputPath}: ${(err as Error).message}`);
  }
}
