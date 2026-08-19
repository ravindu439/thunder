// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {readFileSync, existsSync} from 'fs';
import renderTemplate from './renderTemplate';
import type {TemplateContext} from '../models/templates';

/**
 * Renders a Handlebars template file with the provided context and writes the output to the target file.
 *
 * @param templatePath - Path to the Handlebars template file
 * @param targetPath - Path to write the rendered output file
 * @param context - Data context for template rendering
 *
 * @example
 * renderTemplateFile('template.hbs', 'output.ts', { name: 'Feature' });
 *
 * @public
 */
export default function renderTemplateFile(templatePath: string, context: TemplateContext): string {
  if (!existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const templateContent = readFileSync(templatePath, 'utf8');
  return renderTemplate(templateContent, context);
}
