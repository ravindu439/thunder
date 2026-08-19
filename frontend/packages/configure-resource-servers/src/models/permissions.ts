// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const VALID_PERMISSION_DELIMITERS = ['.', '_', ':', '-', '/'] as const;

export type PermissionDelimiter = (typeof VALID_PERMISSION_DELIMITERS)[number];
