// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Handlebars from 'handlebars';
import type {TemplateContext} from '../models/templates';

/**
 * Renders a Handlebars template string with the provided context.
 *
 * @param template - The Handlebars template string
 * @param context - Data context for template rendering
 * @returns The rendered string
 *
 * @example
 * renderTemplate('Hello, {{name}}!', { name: 'World' });
 * // Returns 'Hello, World!'
 *
 * @public
 */
export default function renderTemplate(templateContent: string, context: TemplateContext): string {
  const template = Handlebars.compile(templateContent);
  return template(context);
}
