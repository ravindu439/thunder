// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0
/**
 * Formats a camelCase or PascalCase namespace string into a human-readable string.
 *
 * Inserts spaces before capital letters and capitalizes the first character.
 *
 * @param ns - The namespace string to format.
 * @returns The formatted, human-readable string.
 *
 * @example
 * ```ts
 * formatNamespace('userProfileSettings'); // "User Profile Settings"
 * formatNamespace('AdminPanel'); // "Admin Panel"
 * ```
 */
export default function formatNamespace(ns: string): string {
  return ns
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
