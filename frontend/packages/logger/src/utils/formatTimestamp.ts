// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Format a date to ISO string safely.
 * @param date - The date to format
 * @returns ISO string representation
 */
export default function formatTimestamp(date: Date): string {
  return date.toISOString();
}
