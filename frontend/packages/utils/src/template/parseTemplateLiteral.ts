// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Regular expression to detect a template literal wrapped in double braces.
 * Matches patterns like `{{ t(key) }}`, `{{meta(key)}}`, etc.
 */
export const TEMPLATE_LITERAL_REGEX = /\{\{\s*([^}]+)\s*\}\}/;

/**
 * Regular expression to parse a function-call expression inside template braces.
 * Matches `funcName(arg)` and captures the function name and argument.
 */
export const FUNCTION_CALL_REGEX = /^(\w+)\(([^)]+)\)$/;

/**
 * Template literal types supported by the resolver.
 */
export enum TemplateLiteralType {
  /** Translation template literal using t() function */
  TRANSLATION = 't',
  /** Meta template literal using meta() function — resolves against flow/page meta data */
  META = 'meta',
  /** Unknown or unsupported template literal format */
  UNKNOWN = 'unknown',
}

/**
 * Result of parsing a template literal.
 */
export interface TemplateLiteralResult {
  /** The type of template literal that was detected */
  type: TemplateLiteralType;
  /** The extracted key from the template literal (e.g., "signin:heading" from "{{ t(signin:heading) }}") */
  key?: string;
  /** Reserved for future use - the resolved value after processing */
  resolvedValue?: string;
  /** The original template literal content before parsing */
  originalValue: string;
}

/**
 * Map of handler functions keyed by TemplateLiteralType.
 * When provided to resolve(), the matching handler is called with the extracted key.
 *
 * Since TemplateLiteralType.TRANSLATION = 't', you can pass `{ t }` directly from useTranslation().
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 * resolve('{{ t(signin:heading) }}', { t }); // calls t('signin:heading')
 * ```
 */
export type TemplateLiteralHandlers = Partial<Record<TemplateLiteralType, (key: string) => string>>;

/**
 * Parse a template literal content string and extract its type and key.
 *
 * Supports function-call expressions like:
 * - `t(signin:heading)` -> type TRANSLATION, key "signin:heading"
 *
 * @param content - The content inside the template literal braces (without `{{ }}`).
 * @returns Parsed template literal information including type, key, and original value.
 *
 * @example
 * ```typescript
 * parseTemplateLiteral('t(signin:heading)')
 * // Returns: { type: TemplateLiteralType.TRANSLATION, key: 'signin:heading', originalValue: 't(signin:heading)' }
 * ```
 */
export default function parseTemplateLiteral(content: string): TemplateLiteralResult {
  const originalValue: string = content;
  const match: RegExpExecArray | null = FUNCTION_CALL_REGEX.exec(content);

  if (!match) {
    return {type: TemplateLiteralType.UNKNOWN, originalValue};
  }

  const [, functionName, key] = match;

  const cleanKey = key.trim().replace(/^['"]|['"]$/g, '');

  switch (functionName as TemplateLiteralType) {
    case TemplateLiteralType.TRANSLATION:
      return {type: TemplateLiteralType.TRANSLATION, key: cleanKey, originalValue};
    case TemplateLiteralType.META:
      return {type: TemplateLiteralType.META, key: cleanKey, originalValue};
    default:
      return {type: TemplateLiteralType.UNKNOWN, originalValue};
  }
}
