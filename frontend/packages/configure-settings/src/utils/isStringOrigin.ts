// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {AllowedOrigin} from '../models/responses';

/**
 * Type guard for a literal (string) allowed origin, distinguishing it from a `{regex}` entry.
 *
 * @param entry - The allowed origin to test
 * @returns Whether the entry is a literal string origin
 */
export default function isStringOrigin(entry: AllowedOrigin): entry is string {
  return typeof entry === 'string';
}
