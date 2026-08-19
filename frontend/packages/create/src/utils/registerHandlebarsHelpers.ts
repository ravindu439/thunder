// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Handlebars from 'handlebars';
import type {HelperOptions} from 'handlebars';

/**
 * Registers custom Handlebars helpers for use in template rendering.
 *
 * @example
 * registerHandlebarsHelpers();
 * // Enables custom helpers for templates
 *
 * @public
 */
export default function registerHandlebarsHelpers(): void {
  // Helper to convert to PascalCase
  function pascalCaseHelper(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
  Handlebars.registerHelper('pascalCase', pascalCaseHelper);

  // Helper to convert to camelCase
  function camelCaseHelper(str: string): string {
    const pascalCase = pascalCaseHelper(str);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
  }
  Handlebars.registerHelper('camelCase', camelCaseHelper);

  // Helper to convert to kebab-case
  function kebabCaseHelper(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .toLowerCase();
  }
  Handlebars.registerHelper('kebabCase', kebabCaseHelper);

  // Helper to convert to CONSTANT_CASE
  function constantCaseHelper(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[_-\s]+/g, '_')
      .toUpperCase();
  }
  Handlebars.registerHelper('constantCase', constantCaseHelper);

  // Helper for conditional inclusion
  function ifEqHelper(this: unknown, a: unknown, b: unknown, options: HelperOptions) {
    return a === b ? options.fn(this) : options.inverse(this);
  }
  Handlebars.registerHelper('if_eq', ifEqHelper);

  // Helper for array inclusion
  function ifIncludesHelper(this: unknown, array: unknown, item: unknown, options: HelperOptions) {
    const arr = Array.isArray(array) ? array : [];
    const found = arr.some((el: unknown) => el === item);
    return found ? options.fn(this) : options.inverse(this);
  }
  Handlebars.registerHelper('if_includes', ifIncludesHelper);
}
