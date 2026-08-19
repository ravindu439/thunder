// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/** Slugifies a display name into a lowercase, hyphen-delimited handle. */
export default function deriveHandle(name: string): string {
  return name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .join('-');
}
