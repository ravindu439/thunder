// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export function deriveHandle(name: string, delim?: string): string {
  const joinChar = delim === '-' ? '_' : '-';
  return name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join(joinChar);
}
