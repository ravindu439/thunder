// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {VALID_PERMISSION_DELIMITERS, type PermissionDelimiter} from '../models/permissions';

export function isValidPermissionDelimiter(value: string): value is PermissionDelimiter {
  return (VALID_PERMISSION_DELIMITERS as readonly string[]).includes(value);
}
