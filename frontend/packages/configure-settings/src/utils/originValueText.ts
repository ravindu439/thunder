// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import isStringOrigin from './isStringOrigin';
import type {AllowedOrigin} from '../models/responses';

/**
 * Returns the editable text for an allowed origin entry.
 *
 * @param entry - The allowed origin entry
 * @returns The literal string, or the pattern of a regex entry
 */
export default function originValueText(entry: AllowedOrigin): string {
  return isStringOrigin(entry) ? entry : entry.regex;
}
