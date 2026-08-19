// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import createFileFromTemplate from './createFileFromTemplate';
import type {TemplateContext} from '../models/templates';

/**
 * Recursively copies and renders all template files from a source directory to a target directory using the provided context.
 *
 * @param templateDir - Source directory containing template files
 * @param targetDir - Target directory to write rendered files
 * @param context - Data context for template rendering
 *
 * @example
 * createFilesFromTemplates('templates', 'output', { name: 'Feature' });
 *
 * @public
 */
export default function createFilesFromTemplates(
  templates: {
    templatePath: string;
    outputPath: string;
    context: TemplateContext;
  }[],
): void {
  templates.forEach((template) => {
    createFileFromTemplate(template.templatePath, template.outputPath, template.context);
  });
}
