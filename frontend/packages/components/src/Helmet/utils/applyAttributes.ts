// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Known camelCase React prop names that map to different HTML attribute names.
 */
const ATTR_MAP: Record<string, string> = {
  charSet: 'charset',
  crossOrigin: 'crossorigin',
  httpEquiv: 'http-equiv',
  noModule: 'nomodule',
  referrerPolicy: 'referrerpolicy',
};

/**
 * Applies a React props object as HTML attributes on a DOM element,
 * translating camelCase prop names to their HTML attribute equivalents.
 */
export default function applyAttributes(el: Element, props: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;

    if (value === undefined || value === null) continue;

    const attrName = ATTR_MAP[key] ?? key;

    if (typeof value === 'boolean') {
      if (value) el.setAttribute(attrName, '');
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
      el.setAttribute(attrName, String(value));
    }
  }
}
